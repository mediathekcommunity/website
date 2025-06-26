import type { APIRoute } from 'astro';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export const POST: APIRoute = async ({ request }) => {
  // Only allow in development mode
  if (import.meta.env.PROD) {
    return new Response(JSON.stringify({ 
      error: 'This endpoint is only available in development mode' 
    }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const { id, data } = await request.json();
    
    if (!id || !data) {
      return new Response(JSON.stringify({ error: 'Missing id or data' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Define the content folder path
    const contentPath = join(process.cwd(), 'src', 'content', 'details', `${id}.json`);
    
    // Write the JSON file
    await writeFile(contentPath, JSON.stringify(data, null, 2), 'utf-8');
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: `File saved as ${id}.json in content/details/` 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error saving file:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to save file',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
