import { z } from 'zod';

export const channelSchema = z.object({
	id: z.string(),
	name: z.string().nonempty('Channel name cannot be empty'),
	title: z.string().optional(),
	poster: z.string().optional(),
	icon: z.string().optional(),
	country: z
		.string()
		.length(2, 'Country code must be 2 characters')
		.refine(
			/** @param {string} val */
			(val) =>
				['AT', 'BE', 'FR', 'DE', 'IE', 'IT', 'LU', 'NL', 'PT', 'ES', 'CH', 'GB', 'SE'].includes(
					val
				),
			{ message: 'Invalid Western European country code' }
		)
});
