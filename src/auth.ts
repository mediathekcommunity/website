import { SvelteKitAuth } from "@auth/sveltekit"
import Auth0 from "@auth/sveltekit/providers/auth0"
import { AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET, AUTH0_ISSUER_BASE_URL } from '$env/static/private';

 console.log("Auth0 clientId", AUTH0_CLIENT_ID)
export const { handle, signIn, signOut } = SvelteKitAuth({
  providers: [
    Auth0({
      clientId: AUTH0_CLIENT_ID,
      clientSecret: AUTH0_CLIENT_SECRET,
      issuer: AUTH0_ISSUER_BASE_URL
    })
  ],
})