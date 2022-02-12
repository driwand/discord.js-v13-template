import { Command } from '../interfaces/command';

export const command: Command = {
	name: 'ping',
	description: 'bot ping',
	aliases: ['p'],

	async execute(client, msg) {
		msg.reply('pong');
	},
};
