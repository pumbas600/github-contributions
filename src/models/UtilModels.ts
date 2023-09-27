import { z } from 'zod';

// You can't pass a hash in a query parameter
export const ColourModel = z
    .string()
    .regex(/^[0-9A-F]{6}$/gi, 'The colour must be in the hexadecimal format without the #, e.g: 5bcdec')
    .transform((colour) => `#${colour}`);
