import type { LayoutServerLoad } from "./$types"
 import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async (event) => {
  const session = await event.locals.auth()
   if (!session?.user) {
    redirect(303, `/login`)
  }
  return {
    session,
  }
}