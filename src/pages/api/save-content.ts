import type { APIRoute } from 'astro';
import { writeFile, readFile, access } from 'fs/promises';
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
    
    // Check if file already exists to determine if this is a create or update
    let isUpdate = false;
    let existingCreatedDate = null;
    
    try {
      await access(contentPath);
      isUpdate = true;
      
      // If updating, read existing file to get the created timestamp
      const existingContent = await readFile(contentPath, 'utf-8');
      const existingData = JSON.parse(existingContent);
      existingCreatedDate = existingData.created;
    } catch {
      // File doesn't exist, this is a new creation
      isUpdate = false;
    }
    
    // Add timestamps to the data
    const now = new Date().toISOString();
    const dataWithTimestamps = {
      ...data,
      created: isUpdate && existingCreatedDate ? existingCreatedDate : now,
      lastupdated: now
    };
    
    // Write the JSON file
    await writeFile(contentPath, JSON.stringify(dataWithTimestamps, null, 2), 'utf-8');
    
    const action = isUpdate ? 'updated' : 'created';
    return new Response(JSON.stringify({ 
      success: true, 
      message: `File ${action} as ${id}.json in content/details/`,
      isUpdate: isUpdate
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
