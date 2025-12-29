/**
 * Template: Login Route for Deno Fresh
 * 
 * Copy this to: routes/api/auth/login.ts
 */

import { Handlers } from "$fresh/server.ts";
import { loginHandler } from "../../../deno-deafauth/routes.ts";

export const handler: Handlers = {
  POST: loginHandler,
};
