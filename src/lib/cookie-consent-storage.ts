import {
  CookieConsentState,
  CookieConsentPreferences,
  CookieCategory,
  SerializedConsentData,
  ConsentError,
  ConsentErrorType,
} from '@/types/cookie-consent';
import {
  validateSerializedData,
  sanitizeConsentState,
  safeConsentOperation,
} from './cookie-consent-validation';

/**
 * Key used to store consent data in localStorage
 */
const STORAGE_KEY = 'cyoda-cookie-consent';

/**
 * Current version of the consent storage format
 */
const CURRENT_VERSION = '1.0.0';

/**
 * Default expiration time in days
 */
const DEFAULT_EXPIRATION_DAYS = 365;

/**
 * Create default consent preferences with essential cookies enabled
 */
export function createDefaultPreferences(): CookieConsentPreferences {
  const now = new Date();
  
  return {
    [CookieCategory.ESSENTIAL]: {
      granted: true, // Essential cookies are always granted
      updatedAt: now,
    },
    [CookieCategory.ANALYTICS]: {
      granted: false,
      updatedAt: now,
    },
    [CookieCategory.MARKETING]: {
      granted: false,
      updatedAt: now,
    },
    [CookieCategory.PERSONALIZATION]: {
      granted: false,
      updatedAt: now,
    },
  };
}

/**
 * Create default consent state
 */
export function createDefaultConsentState(): CookieConsentState {
  return {
    preferences: createDefaultPreferences(),
    hasConsented: false,
    consentDate: null,
    version: CURRENT_VERSION,
    showBanner: true,
  };
}

/**
 * Calculate expiration date based on days from now
 */
function calculateExpirationDate(days: number = DEFAULT_EXPIRATION_DAYS): Date {
  const expiration = new Date();
  expiration.setDate(expiration.getDate() + days);
  return expiration;
}

/**
 * Serialize consent state for localStorage storage
 */
function serializeConsentData(
  state: CookieConsentState,
  expirationDays: number = DEFAULT_EXPIRATION_DAYS
): SerializedConsentData {
  const expiresAt = calculateExpirationDate(expirationDays);
  
  const serializedPreferences: Record<string, { granted: boolean; updatedAt: string }> = {};
  
  Object.entries(state.preferences).forEach(([category, preference]) => {
    serializedPreferences[category] = {
      granted: preference.granted,
      updatedAt: preference.updatedAt.toISOString(),
    };
  });

  return {
    preferences: serializedPreferences,
    hasConsented: state.hasConsented,
    consentDate: state.consentDate?.toISOString() || null,
    version: state.version,
    showBanner: state.showBanner,
    expiresAt: expiresAt.toISOString(),
  };
}

/**
 * Deserialize consent data from localStorage
 */
function deserializeConsentData(data: SerializedConsentData): CookieConsentState {
  const preferences: CookieConsentPreferences = {} as CookieConsentPreferences;
  
  Object.entries(data.preferences).forEach(([category, preference]) => {
    if (Object.values(CookieCategory).includes(category as CookieCategory)) {
      preferences[category as CookieCategory] = {
        granted: preference.granted,
        updatedAt: new Date(preference.updatedAt),
      };
    }
  });

  // Ensure all categories are present
  const defaultPrefs = createDefaultPreferences();
  Object.keys(defaultPrefs).forEach((category) => {
    if (!preferences[category as CookieCategory]) {
      preferences[category as CookieCategory] = defaultPrefs[category as CookieCategory];
    }
  });

  return {
    preferences,
    hasConsented: data.hasConsented,
    consentDate: data.consentDate ? new Date(data.consentDate) : null,
    version: data.version,
    showBanner: data.showBanner,
  };
}

/**
 * Validate serialized consent data structure (using validation module)
 */
function isValidSerializedData(data: unknown): data is SerializedConsentData {
  const validation = validateSerializedData(data);
  if (!validation.isValid) {
    console.warn('Invalid serialized consent data:', validation.errors);
  }
  return validation.isValid;
}

/**
 * Check if stored consent data has expired
 */
function isDataExpired(data: SerializedConsentData): boolean {
  try {
    const expirationDate = new Date(data.expiresAt);
    return new Date() > expirationDate;
  } catch {
    return true; // If we can't parse the date, consider it expired
  }
}

/**
 * Migrate old consent data formats to current version
 */
function migrateConsentData(data: unknown): SerializedConsentData | null {
  return safeConsentOperation(() => {
    // If data is already in current format, return as-is
    if (isValidSerializedData(data)) {
      return data;
    }

    // Handle migration from potential older formats
    // For now, we'll sanitize and convert to current format
    const sanitized = sanitizeConsentState(data);

    return serializeConsentData(sanitized, DEFAULT_EXPIRATION_DAYS);
  }, null, 'migrateConsentData');
}

/**
 * Save consent state to localStorage
 */
export function saveConsentState(
  state: CookieConsentState,
  expirationDays: number = DEFAULT_EXPIRATION_DAYS
): void {
  try {
    const serializedData = serializeConsentData(state, expirationDays);
    const jsonString = JSON.stringify(serializedData);
    localStorage.setItem(STORAGE_KEY, jsonString);
  } catch (error) {
    throw new ConsentError(
      ConsentErrorType.STORAGE_ERROR,
      'Failed to save consent state to localStorage',
      error instanceof Error ? error : new Error(String(error))
    );
  }
}

/**
 * Load consent state from localStorage
 */
export function loadConsentState(): CookieConsentState | null {
  return safeConsentOperation(() => {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return null;
    }

    const parsed = JSON.parse(stored);

    // Validate and migrate if necessary
    const validData = isValidSerializedData(parsed) ? parsed : migrateConsentData(parsed);

    if (!validData) {
      // Invalid data, clear storage and return null
      clearConsentState();
      return null;
    }

    // Check if data has expired
    if (isDataExpired(validData)) {
      clearConsentState();
      return null;
    }

    return deserializeConsentData(validData);
  }, null, 'loadConsentState');
}

/**
 * Clear consent state from localStorage
 */
export function clearConsentState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    throw new ConsentError(
      ConsentErrorType.STORAGE_ERROR,
      'Failed to clear consent state from localStorage',
      error instanceof Error ? error : new Error(String(error))
    );
  }
}

/**
 * Check if consent data exists in localStorage
 */
export function hasStoredConsent(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== null;
  } catch {
    return false;
  }
}

/**
 * Get the expiration date of stored consent data
 */
export function getConsentExpiration(): Date | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored);
    if (!validateSerializedData(parsed)) return null;

    return new Date(parsed.expiresAt);
  } catch {
    return null;
  }
}

/**
 * Check if stored consent data is expired
 */
export function isConsentExpired(): boolean {
  return safeConsentOperation(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return true;

    const parsed = JSON.parse(stored);
    if (!isValidSerializedData(parsed)) return true;

    return isDataExpired(parsed);
  }, true, 'isConsentExpired');
}
