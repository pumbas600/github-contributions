import { z } from 'zod';

export const OptionsModel = z.object({
    // You can't pass a hash in a query parameter
    color: z
        .string()
        .regex(/^[0-9A-F]{6}$/gi, 'The colour must be in hexadecimal without the #, e.g: 5bcdec')
        .optional(),
    width: z.coerce.number().positive().optional(),
    height: z.coerce.number().positive().optional(),
});

export type Options = Required<z.infer<typeof OptionsModel>>;
