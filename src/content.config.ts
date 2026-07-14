import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const days = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/days' }),
  schema: z.object({
    day: z.number().int().positive(),
    title: z.string(),
    scriptureRef: z.string(),
    scriptureText: z.string(),
    scriptureVersion: z.string(),
    month: z.number().int().min(1).max(12),
    afterword: z.string(),
  }),
});

export const collections = { days };
