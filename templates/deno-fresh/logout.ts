/**
 * Template: Logout Route for Deno Fresh
 * 
 * Copy this to: routes/api/auth/logout.ts
 */

import { Handlers } from "$fresh/server.ts";
import { logoutHandler } from "../../../deno-deafauth/routes.ts";

export const handler: Handlers = {
  POST: logoutHandler,
};
