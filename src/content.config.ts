import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const garden = defineCollection({
  loader: glob({
    pattern: '**/{synthesized_notes/zettelkasten,synthesized_notes/cornell}/*.md',
    base: './4-2026-2027-1'
  }),
  schema: z.object({
    title: z.string().optional(),
    tags: z.array(z.string()).default([]),
    publish: z.boolean().default(true),
  })
});

export const collections = { garden };
