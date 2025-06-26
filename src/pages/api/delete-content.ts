import type { APIRoute } from 'astro';
import fs from 'fs';
import path from 'path';

export const DELETE: APIRoute = async ({ request }) => {
  try {
    // SECURITY: Only allow in development environment
    if (import.meta.env.PROD) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Delete operation not allowed in production' 
        }),
        { 
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'File ID is required' 
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Validate file ID to prevent path traversal
    const sanitizedId = id.replace(/[^a-zA-Z0-9\-_]/g, '');
    if (sanitizedId !== id) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid file ID format' 
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const contentDir = path.join(process.cwd(), 'src', 'content', 'details');
    const filePath = path.join(contentDir, `${id}.json`);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'File not found' 
        }),
        { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Delete the file
    fs.unlinkSync(filePath);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `File ${id}.json deleted successfully` 
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error deleting content file:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Failed to delete file' 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
