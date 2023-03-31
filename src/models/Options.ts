import { z } from 'zod';

export const OptionsModel = z.object({
    color: z
        .string()
        .regex(/^#[0-9A-F]{6}$/i, 'The colour must be in hexadecimal, e.g: #5bcdec')
        .optional(),
    width: z.number().positive().optional(),
    height: z.number().positive().optional(),
});

export type Options = Required<z.infer<typeof OptionsModel>>;
