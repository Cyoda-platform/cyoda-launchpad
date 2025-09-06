import {
  CookieConsentState,
  CookieCategory,
  CookiePreference,
  ConsentError,
  ConsentErrorType,
} from '@/types/cookie-consent';

/**
 * Validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validate a cookie preference object
 */
export function validateCookiePreference(preference: unknown): preference is CookiePreference {
  if (!preference || typeof preference !== 'object') {
    return false;
  }

  const pref = preference as Record<string, unknown>;

  if (typeof pref.granted !== 'boolean') {
    return false;
  }

  if (!(pref.updatedAt instanceof Date) && typeof pref.updatedAt !== 'string') {
    return false;
  }

  // If it's a string, try to parse it as a date
  if (typeof pref.updatedAt === 'string') {
    try {
      new Date(pref.updatedAt);
    } catch {
      return false;
    }
  }

  return true;
}

/**
 * Validate cookie consent preferences object
 */
export function validateCookiePreferences(preferences: unknown): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
  };

  if (!preferences || typeof preferences !== 'object') {
    result.isValid = false;
    result.errors.push('Preferences must be an object');
    return result;
  }

  const prefs = preferences as Record<string, unknown>;

  // Check that all required categories are present
  const requiredCategories = Object.values(CookieCategory);
  const missingCategories = requiredCategories.filter(
    category => !(category in prefs)
  );

  if (missingCategories.length > 0) {
    result.isValid = false;
    result.errors.push(`Missing required categories: ${missingCategories.join(', ')}`);
  }

  // Check that all present categories are valid
  Object.entries(prefs).forEach(([category, preference]) => {
    if (!Object.values(CookieCategory).includes(category as CookieCategory)) {
      result.warnings.push(`Unknown category: ${category}`);
      return;
    }

    if (!validateCookiePreference(preference)) {
      result.isValid = false;
      result.errors.push(`Invalid preference for category ${category}`);
    }
  });

  // Essential cookies must always be granted
  const essentialPref = prefs[CookieCategory.ESSENTIAL] as Record<string, unknown> | undefined;
  if (essentialPref && typeof essentialPref.granted === 'boolean' && !essentialPref.granted) {
    result.warnings.push('Essential cookies should always be granted');
  }

  return result;
}

/**
 * Validate complete cookie consent state
 */
export function validateConsentState(state: unknown): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
  };

  if (!state || typeof state !== 'object') {
    result.isValid = false;
    result.errors.push('State must be an object');
    return result;
  }

  const stateObj = state as Record<string, unknown>;

  // Validate required properties
  const requiredProps = ['preferences', 'hasConsented', 'version', 'showBanner'];
  const missingProps = requiredProps.filter(prop => !(prop in stateObj));

  if (missingProps.length > 0) {
    result.isValid = false;
    result.errors.push(`Missing required properties: ${missingProps.join(', ')}`);
  }

  // Validate property types
  if (typeof stateObj.hasConsented !== 'boolean') {
    result.isValid = false;
    result.errors.push('hasConsented must be a boolean');
  }

  if (typeof stateObj.showBanner !== 'boolean') {
    result.isValid = false;
    result.errors.push('showBanner must be a boolean');
  }

  if (typeof stateObj.version !== 'string') {
    result.isValid = false;
    result.errors.push('version must be a string');
  }

  // Validate consentDate if present
  if (stateObj.consentDate !== null && stateObj.consentDate !== undefined) {
    if (!(stateObj.consentDate instanceof Date) && typeof stateObj.consentDate !== 'string') {
      result.isValid = false;
      result.errors.push('consentDate must be a Date object, string, or null');
    } else if (typeof stateObj.consentDate === 'string') {
      try {
        new Date(stateObj.consentDate);
      } catch {
        result.isValid = false;
        result.errors.push('consentDate string is not a valid date');
      }
    }
  }

  // Validate preferences
  if (stateObj.preferences) {
    const preferencesValidation = validateCookiePreferences(stateObj.preferences);
    result.errors.push(...preferencesValidation.errors);
    result.warnings.push(...preferencesValidation.warnings);
    if (!preferencesValidation.isValid) {
      result.isValid = false;
    }
  } else {
    result.isValid = false;
    result.errors.push('preferences is required');
  }

  // Logical validations
  if (stateObj.hasConsented && !stateObj.consentDate) {
    result.warnings.push('hasConsented is true but consentDate is not set');
  }

  if (!stateObj.hasConsented && stateObj.consentDate) {
    result.warnings.push('hasConsented is false but consentDate is set');
  }

  return result;
}

/**
 * Validate serialized consent data from localStorage
 */
export function validateSerializedData(data: unknown): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
  };

  if (!data || typeof data !== 'object') {
    result.isValid = false;
    result.errors.push('Data must be an object');
    return result;
  }

  const dataObj = data as Record<string, unknown>;

  // Check required properties
  const requiredProps = ['preferences', 'hasConsented', 'version', 'showBanner', 'expiresAt'];
  const missingProps = requiredProps.filter(prop => !(prop in dataObj));

  if (missingProps.length > 0) {
    result.isValid = false;
    result.errors.push(`Missing required properties: ${missingProps.join(', ')}`);
  }

  // Validate types
  if (typeof dataObj.hasConsented !== 'boolean') {
    result.isValid = false;
    result.errors.push('hasConsented must be a boolean');
  }

  if (typeof dataObj.showBanner !== 'boolean') {
    result.isValid = false;
    result.errors.push('showBanner must be a boolean');
  }

  if (typeof dataObj.version !== 'string') {
    result.isValid = false;
    result.errors.push('version must be a string');
  }

  // Validate dates
  ['consentDate', 'expiresAt'].forEach(dateField => {
    const fieldValue = dataObj[dateField];
    if (fieldValue !== null && fieldValue !== undefined) {
      if (typeof fieldValue !== 'string') {
        result.isValid = false;
        result.errors.push(`${dateField} must be a string or null`);
      } else {
        try {
          const date = new Date(fieldValue);
          if (isNaN(date.getTime())) {
            result.isValid = false;
            result.errors.push(`${dateField} is not a valid date string`);
          }
        } catch {
          result.isValid = false;
          result.errors.push(`${dateField} is not a valid date string`);
        }
      }
    }
  });

  // Validate preferences structure
  if (dataObj.preferences && typeof dataObj.preferences === 'object') {
    const prefsObj = dataObj.preferences as Record<string, unknown>;
    Object.entries(prefsObj).forEach(([category, preference]: [string, unknown]) => {
      if (!Object.values(CookieCategory).includes(category as CookieCategory)) {
        result.warnings.push(`Unknown category in serialized data: ${category}`);
        return;
      }

      if (!preference || typeof preference !== 'object') {
        result.isValid = false;
        result.errors.push(`Invalid preference object for category ${category}`);
        return;
      }

      const prefObj = preference as Record<string, unknown>;

      if (typeof prefObj.granted !== 'boolean') {
        result.isValid = false;
        result.errors.push(`Invalid granted value for category ${category}`);
      }

      if (typeof prefObj.updatedAt !== 'string') {
        result.isValid = false;
        result.errors.push(`Invalid updatedAt value for category ${category}`);
      } else {
        try {
          new Date(prefObj.updatedAt);
        } catch {
          result.isValid = false;
          result.errors.push(`Invalid updatedAt date for category ${category}`);
        }
      }
    });
  } else {
    result.isValid = false;
    result.errors.push('preferences must be an object');
  }

  return result;
}

/**
 * Sanitize and fix consent state where possible
 */
export function sanitizeConsentState(state: unknown): CookieConsentState {
  // Start with a default state
  const defaultState: CookieConsentState = {
    preferences: {
      [CookieCategory.ESSENTIAL]: { granted: true, updatedAt: new Date() },
      [CookieCategory.ANALYTICS]: { granted: false, updatedAt: new Date() },
      [CookieCategory.MARKETING]: { granted: false, updatedAt: new Date() },
      [CookieCategory.PERSONALIZATION]: { granted: false, updatedAt: new Date() },
    },
    hasConsented: false,
    consentDate: null,
    version: '1.0.0',
    showBanner: true,
  };

  if (!state || typeof state !== 'object') {
    return defaultState;
  }

  const stateObj = state as Record<string, unknown>;
  const sanitized = { ...defaultState };

  // Sanitize boolean fields
  if (typeof stateObj.hasConsented === 'boolean') {
    sanitized.hasConsented = stateObj.hasConsented;
  }

  if (typeof stateObj.showBanner === 'boolean') {
    sanitized.showBanner = stateObj.showBanner;
  }

  // Sanitize version
  if (typeof stateObj.version === 'string') {
    sanitized.version = stateObj.version;
  }

  // Sanitize consentDate
  if (stateObj.consentDate) {
    try {
      const date = stateObj.consentDate instanceof Date
        ? stateObj.consentDate
        : new Date(stateObj.consentDate as string);

      if (!isNaN(date.getTime())) {
        sanitized.consentDate = date;
      }
    } catch {
      // Keep default null
    }
  }

  // Sanitize preferences
  if (stateObj.preferences && typeof stateObj.preferences === 'object') {
    const prefsObj = stateObj.preferences as Record<string, unknown>;
    Object.values(CookieCategory).forEach(category => {
      const preference = prefsObj[category];

      if (preference && typeof preference === 'object') {
        const prefObj = preference as Record<string, unknown>;
        const granted = typeof prefObj.granted === 'boolean'
          ? prefObj.granted
          : sanitized.preferences[category].granted;

        let updatedAt = sanitized.preferences[category].updatedAt;
        if (prefObj.updatedAt) {
          try {
            const date = prefObj.updatedAt instanceof Date
              ? prefObj.updatedAt
              : new Date(prefObj.updatedAt as string);

            if (!isNaN(date.getTime())) {
              updatedAt = date;
            }
          } catch {
            // Keep default
          }
        }

        sanitized.preferences[category] = { granted, updatedAt };
      }
    });
  }

  // Ensure essential cookies are always granted
  sanitized.preferences[CookieCategory.ESSENTIAL].granted = true;

  return sanitized;
}

/**
 * Create a validation error with detailed information
 */
export function createValidationError(
  validation: ValidationResult,
  context: string
): ConsentError {
  const message = `Validation failed in ${context}: ${validation.errors.join(', ')}`;
  return new ConsentError(ConsentErrorType.VALIDATION_ERROR, message);
}

/**
 * Safe wrapper for operations that might throw consent errors
 */
export function safeConsentOperation<T>(
  operation: () => T,
  fallback: T,
  context: string
): T {
  try {
    return operation();
  } catch (error) {
    console.error(`Error in ${context}:`, error);
    
    if (error instanceof ConsentError) {
      // Re-throw consent errors
      throw error;
    }
    
    // For other errors, log and return fallback
    console.warn(`Using fallback value for ${context} due to error:`, error);
    return fallback;
  }
}
