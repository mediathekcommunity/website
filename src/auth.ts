import { SvelteKitAuth } from "@auth/sveltekit"
import Auth0 from "@auth/sveltekit/providers/auth0"
  import * as rawEnv from '$env/dynamic/private';

console.log("Auth0 clientId", rawEnv)
export const { handle, signIn, signOut } = SvelteKitAuth({
  providers: [
    Auth0({
      clientId: rawEnv.AUTH0_CLIENT_ID,
      clientSecret: rawEnv.AUTH0_CLIENT_SECRET,
      issuer: rawEnv.AUTH0_ISSUER_BASE_URL
    })
  ],
})