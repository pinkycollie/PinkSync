/**
 * Environment variable compatibility layer
 * Works with both Node.js (process.env) and Deno (Deno.env)
 * This ensures the codebase is ready for future Deno migration
 */

export const env = {
  get(key: string): string | undefined {
    // Check if running in Deno
    if (typeof Deno !== 'undefined' && Deno.env) {
      return Deno.env.get(key);
    }
    // Fallback to Node.js process.env
    return process.env[key];
  }
};
