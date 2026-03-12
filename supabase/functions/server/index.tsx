import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-44157e71/health", (c) => {
  return c.json({ status: "ok" });
});

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// Initialize storage bucket on startup
const BUCKET_NAME = 'make-44157e71-slides';
(async () => {
  const { data: buckets } = await supabase.storage.listBuckets();
  const bucketExists = buckets?.some(bucket => bucket.name === BUCKET_NAME);
  if (!bucketExists) {
    await supabase.storage.createBucket(BUCKET_NAME, { public: false });
    console.log('Created storage bucket:', BUCKET_NAME);
  }
})();

// Save project endpoint
app.post("/make-server-44157e71/projects/save", async (c) => {
  try {
    const { portfolioId, projects, siteTitle, siteDescription } = await c.req.json();
    
    if (!portfolioId) {
      return c.json({ error: 'portfolioId is required' }, 400);
    }

    // Save metadata to KV store
    await kv.set(`portfolio:${portfolioId}:meta`, {
      siteTitle,
      siteDescription,
      updatedAt: new Date().toISOString(),
    });

    // Save each project and upload slides to storage
    const savedProjects = [];
    for (const project of projects) {
      const slideUrls = [];
      
      // Upload each slide to Supabase Storage
      for (let i = 0; i < project.slides.length; i++) {
        const slide = project.slides[i];
        
        // If it's a data URL, upload it
        if (slide.startsWith('data:')) {
          const base64Data = slide.split(',')[1];
          const buffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
          const fileName = `${portfolioId}/project-${project.id}/slide-${i}.jpg`;
          
          const { error } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(fileName, buffer, {
              contentType: 'image/jpeg',
              upsert: true,
            });
          
          if (error) {
            console.error('Error uploading slide:', error);
            continue;
          }
          
          slideUrls.push(fileName);
        } else {
          // Keep external URLs as-is
          slideUrls.push(slide);
        }
      }
      
      savedProjects.push({
        id: project.id,
        title: project.title,
        description: project.description,
        slides: slideUrls,
      });
    }

    // Save projects to KV store
    await kv.set(`portfolio:${portfolioId}:projects`, savedProjects);

    return c.json({ success: true, portfolioId });
  } catch (error) {
    console.error('Error saving projects:', error);
    return c.json({ error: 'Failed to save projects: ' + error.message }, 500);
  }
});

// Load project endpoint
app.get("/make-server-44157e71/projects/load/:portfolioId", async (c) => {
  try {
    const portfolioId = c.req.param('portfolioId');
    
    // Load metadata from KV store
    const meta = await kv.get(`portfolio:${portfolioId}:meta`);
    const projects = await kv.get(`portfolio:${portfolioId}:projects`);

    if (!projects) {
      return c.json({ error: 'Portfolio not found' }, 404);
    }

    // Generate signed URLs for stored slides
    const projectsWithUrls = [];
    for (const project of projects) {
      const slideUrls = [];
      
      for (const slide of project.slides) {
        // If it's a storage path, generate signed URL
        if (slide.includes('/')) {
          const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .createSignedUrl(slide, 3600); // 1 hour expiry
          
          if (!error && data) {
            slideUrls.push(data.signedUrl);
          } else {
            console.error('Error creating signed URL:', error);
          }
        } else {
          // External URL
          slideUrls.push(slide);
        }
      }
      
      projectsWithUrls.push({
        ...project,
        slides: slideUrls,
      });
    }

    return c.json({
      success: true,
      siteTitle: meta?.siteTitle || 'My Figma Slides',
      siteDescription: meta?.siteDescription || 'A showcase of my design work',
      projects: projectsWithUrls,
    });
  } catch (error) {
    console.error('Error loading projects:', error);
    return c.json({ error: 'Failed to load projects: ' + error.message }, 500);
  }
});

Deno.serve(app.fetch);