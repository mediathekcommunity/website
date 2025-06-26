import type { APIRoute } from 'astro';
import { readdir, stat } from 'fs/promises';
import { join } from 'path';

export const GET: APIRoute = async () => {
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
    // Define the content folder path
    const contentPath = join(process.cwd(), 'src', 'content', 'details');
    
    // Read all files in the directory
    const files = await readdir(contentPath);
    
    // Filter only JSON files and get their stats
    const jsonFiles = files.filter(file => file.endsWith('.json'));
    
    const fileList = await Promise.all(
      jsonFiles.map(async (filename) => {
        const filePath = join(contentPath, filename);
        const stats = await stat(filePath);
        
        return {
          filename,
          id: filename.replace('.json', ''),
          lastModified: stats.mtime.toISOString(),
          size: stats.size
        };
      })
    );
    
    // Sort by last modified date (newest first)
    fileList.sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime());
    
    return new Response(JSON.stringify({ 
      success: true,
      files: fileList
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error listing files:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to list content files',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
