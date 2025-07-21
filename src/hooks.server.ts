import { type Handle } from '@sveltejs/kit';
import { handle as authHandle } from "./auth";

export const handle: Handle = async ({ event, resolve }) => {
  // First, let auth handle authentication
  const response = await authHandle({ event, resolve });
  
  // Then add cache headers for better performance
  if (event.request.method === 'GET') {
    const url = new URL(event.request.url);
    
    // Static assets - long cache
    if (url.pathname.startsWith('/_app/') || 
        url.pathname.startsWith('/favicon') ||
        url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/)) {
      response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    }
    // API routes - short cache with revalidation
    else if (url.pathname.startsWith('/api/')) {
      response.headers.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    }
    // Admin pages - no cache (sensitive)
    else if (url.pathname.startsWith('/admin/')) {
      response.headers.set('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    }
    // Regular pages - moderate cache with revalidation
    else {
      response.headers.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=3600');
    }
  }
  
  return response;
};
