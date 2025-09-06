/**
 * Cookie consent categories supported by the application
 */
export enum CookieCategory {
  ESSENTIAL = 'essential',
  ANALYTICS = 'analytics',
  MARKETING = 'marketing',
  PERSONALIZATION = 'personalization',
}

/**
 * Individual cookie consent preference for a specific category
 */
export interface CookiePreference {
  /** Whether the user has consented to this category */
  granted: boolean;
  /** Timestamp when this preference was last updated */
  updatedAt: Date;
}

/**
 * Complete cookie consent preferences for all categories
 */
export interface CookieConsentPreferences {
  [CookieCategory.ESSENTIAL]: CookiePreference;
  [CookieCategory.ANALYTICS]: CookiePreference;
  [CookieCategory.MARKETING]: CookiePreference;
  [CookieCategory.PERSONALIZATION]: CookiePreference;
}

/**
 * Cookie consent state including preferences and metadata
 */
export interface CookieConsentState {
  /** User's consent preferences for each category */
  preferences: CookieConsentPreferences;
  /** Whether the user has made an initial consent decision */
  hasConsented: boolean;
  /** Timestamp when consent was first given */
  consentDate: Date | null;
  /** Version of the consent system (for migration purposes) */
  version: string;
  /** Whether the consent banner should be shown */
  showBanner: boolean;
}

/**
 * Event types that can be triggered by consent changes
 */
export enum ConsentEventType {
  CONSENT_GIVEN = 'consent_given',
  CONSENT_UPDATED = 'consent_updated',
  CONSENT_WITHDRAWN = 'consent_withdrawn',
  BANNER_SHOWN = 'banner_shown',
  BANNER_DISMISSED = 'banner_dismissed',
}

/**
 * Data passed with consent events
 */
export interface ConsentEventData {
  /** Type of event that occurred */
  type: ConsentEventType;
  /** Category that was affected (if applicable) */
  category?: CookieCategory;
  /** Previous consent state (for updates) */
  previousState?: boolean;
  /** New consent state */
  newState?: boolean;
  /** Timestamp when the event occurred */
  timestamp: Date;
  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Callback function type for consent event handlers
 */
export type ConsentEventCallback = (data: ConsentEventData) => void;

/**
 * Configuration for consent event callbacks
 */
export interface ConsentCallbacks {
  /** Called when any consent preference changes */
  onConsentChange?: ConsentEventCallback;
  /** Called when analytics consent is granted */
  onAnalyticsEnabled?: ConsentEventCallback;
  /** Called when analytics consent is withdrawn */
  onAnalyticsDisabled?: ConsentEventCallback;
  /** Called when marketing consent is granted */
  onMarketingEnabled?: ConsentEventCallback;
  /** Called when marketing consent is withdrawn */
  onMarketingDisabled?: ConsentEventCallback;
  /** Called when personalization consent is granted */
  onPersonalizationEnabled?: ConsentEventCallback;
  /** Called when personalization consent is withdrawn */
  onPersonalizationDisabled?: ConsentEventCallback;
  /** Called when the consent banner is shown */
  onBannerShown?: ConsentEventCallback;
  /** Called when the consent banner is dismissed */
  onBannerDismissed?: ConsentEventCallback;
}

/**
 * Options for updating consent preferences
 */
export interface UpdateConsentOptions {
  /** Whether to trigger callbacks for this update */
  triggerCallbacks?: boolean;
  /** Whether to persist the changes to localStorage */
  persist?: boolean;
  /** Additional metadata to include with the event */
  metadata?: Record<string, unknown>;
}

/**
 * Serialized format for localStorage storage
 */
export interface SerializedConsentData {
  preferences: Record<string, { granted: boolean; updatedAt: string }>;
  hasConsented: boolean;
  consentDate: string | null;
  version: string;
  showBanner: boolean;
  expiresAt: string;
}

/**
 * Configuration options for the cookie consent system
 */
export interface CookieConsentConfig {
  /** How long consent preferences should be stored (in days) */
  expirationDays?: number;
  /** Version of the consent system */
  version?: string;
  /** Whether to show the banner by default */
  showBannerByDefault?: boolean;
  /** Default consent preferences */
  defaultPreferences?: Partial<Record<CookieCategory, boolean>>;
  /** Event callbacks */
  callbacks?: ConsentCallbacks;
}

/**
 * Context value provided by CookieConsentProvider
 */
export interface CookieConsentContextValue {
  /** Current consent state */
  state: CookieConsentState;
  /** Update consent for a specific category */
  updateConsent: (category: CookieCategory, granted: boolean, options?: UpdateConsentOptions) => void;
  /** Update multiple consent preferences at once */
  updateMultipleConsent: (preferences: Partial<Record<CookieCategory, boolean>>, options?: UpdateConsentOptions) => void;
  /** Accept all non-essential cookies */
  acceptAll: (options?: UpdateConsentOptions) => void;
  /** Reject all non-essential cookies */
  rejectAll: (options?: UpdateConsentOptions) => void;
  /** Reset consent state (show banner again) */
  resetConsent: () => void;
  /** Hide the consent banner */
  hideBanner: () => void;
  /** Check if a specific category is consented */
  hasConsent: (category: CookieCategory) => boolean;
  /** Get consent preference for a specific category */
  getPreference: (category: CookieCategory) => CookiePreference;
  /** Check if consent data is expired */
  isExpired: () => boolean;
  /** Export consent record for access/portability */
  getConsentRecord: () => SerializedConsentData;
  /** Erase consent record (GDPR erasure) */
  deleteConsentRecord: () => void;
}

/**
 * Props for CookieConsentProvider component
 */
export interface CookieConsentProviderProps {
  children: React.ReactNode;
  config?: CookieConsentConfig;
}

/**
 * Error types that can occur in the consent system
 */
export enum ConsentErrorType {
  STORAGE_ERROR = 'storage_error',
  VALIDATION_ERROR = 'validation_error',
  MIGRATION_ERROR = 'migration_error',
  CALLBACK_ERROR = 'callback_error',
}

/**
 * Error class for consent-related errors
 */
export class ConsentError extends Error {
  constructor(
    public type: ConsentErrorType,
    message: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'ConsentError';
  }
}
