import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { error: "Enter a name." })
    .max(80, { error: "Use 80 characters or fewer." }),
  email: z.string().trim().pipe(z.email({ error: "Enter a valid email address." })),
  phone: z
    .string()
    .trim()
    .regex(/^(\+?\d{7,15})?$/, {
      error: "Use 7 to 15 digits, with an optional + at the start.",
    }),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const savedContactSchema = contactSchema.extend({
  id: z.number().int(),
  createdAt: z.iso.datetime({ offset: true }),
});

export type Contact = z.infer<typeof savedContactSchema>;

export const contactListSchema = z.array(savedContactSchema);