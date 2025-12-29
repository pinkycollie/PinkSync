/**
 * Template: Preferences Route for Deno Fresh
 * 
 * Copy this to: routes/api/auth/preferences.ts
 */

import { Handlers } from "$fresh/server.ts";
import { preferencesHandler } from "../../../deno-deafauth/routes.ts";

export const handler: Handlers = {
  GET: preferencesHandler,
};
