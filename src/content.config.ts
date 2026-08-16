import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const ragCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/rag' }),
  schema: z.object({
    title: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }).passthrough(),
});

export const collections = {
  rag: ragCollection,
};
