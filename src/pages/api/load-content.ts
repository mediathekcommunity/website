import type { APIRoute } from 'astro';
import { readFile } from 'fs/promises';
import { join } from 'path';

export const GET: APIRoute = async ({ url }) => {
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
    // Get the file ID from URL parameters
    const fileId = url.searchParams.get('id');
    
    if (!fileId) {
      return new Response(JSON.stringify({ error: 'Missing file ID parameter' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Define the content folder path
    const contentPath = join(process.cwd(), 'src', 'content', 'details', `${fileId}.json`);
    
    // Read the JSON file
    const fileContent = await readFile(contentPath, 'utf-8');
    const jsonData = JSON.parse(fileContent);
    
    return new Response(JSON.stringify({ 
      success: true,
      data: jsonData
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error loading file:', error);
    
    if (error instanceof Error && error.message.includes('ENOENT')) {
      return new Response(JSON.stringify({ 
        error: 'File not found'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({ 
      error: 'Failed to load content file',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
