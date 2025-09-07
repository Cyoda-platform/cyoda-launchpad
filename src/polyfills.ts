// Polyfills for Node.js modules in browser environment
import { Buffer } from 'buffer';

// Make Buffer available globally
(globalThis as typeof globalThis & { Buffer: typeof Buffer }).Buffer = Buffer;

// Export for explicit imports if needed
export { Buffer };
