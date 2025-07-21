import { type Handle } from '@sveltejs/kit';
import { handle as authHandle } from "./auth";

export const handle: Handle = async ({ event, resolve }) => {
  // First, let auth handle authentication
  const response = await authHandle({ event, resolve });
  
  // Then add cache headers for better performance
  if (event.request.method === 'GET') {
    const url = new URL(event.request.url);
    
    // Static assets - long cache (1 year)
    if (url.pathname.startsWith('/_app/') || 
        url.pathname.startsWith('/favicon') ||
        url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|webp|avif)$/)) {
      response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
      response.headers.set('Vary', 'Accept-Encoding');
    }
    // API routes - short cache with revalidation
    else if (url.pathname.startsWith('/api/')) {
      response.headers.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
      response.headers.set('Vary', 'Accept-Encoding');
    }
    // Admin pages - no cache (sensitive)
    else if (url.pathname.startsWith('/admin/')) {
      response.headers.set('Cache-Control', 'private, no-cache, no-store, must-revalidate');
      response.headers.set('Pragma', 'no-cache');
      response.headers.set('Expires', '0');
    }
    // Media/video content - longer cache
    else if (url.pathname.startsWith('/player/') || url.pathname.startsWith('/details/')) {
      response.headers.set('Cache-Control', 'public, max-age=1800, stale-while-revalidate=7200');
      response.headers.set('Vary', 'Accept-Encoding');
    }
    // Regular pages - moderate cache with revalidation
    else {
      response.headers.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=3600');
      response.headers.set('Vary', 'Accept-Encoding');
    }
  }
  
  // Add security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  return response;
};
