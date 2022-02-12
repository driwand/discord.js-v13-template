import { Event } from '../interfaces/event'

export const event: Event = {
	name: 'ready',
	execute: async (client) => {
		console.log(`I am ready! ${client.user?.tag}`)
	},
}
