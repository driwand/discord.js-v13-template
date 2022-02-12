import { Event } from '../interfaces/event';
import { Message } from 'discord.js';
import { defaultPrefix } from '../config/config.json';
import { parse } from 'discord-command-parser';

export const event: Event = {
	name: 'messageCreate',
	execute: async (client, msg: Message) => {
		if (msg.author.bot || !msg.content.startsWith(defaultPrefix)) return;

		const parsed = parse(msg, defaultPrefix, { ignorePrefixCase: true });
		if (!parsed.success) return;

		const commandName = parsed.command.toLowerCase();
		if (!client.commands.has(commandName)) return;

		const cmd = client.commands.get(commandName);
		if (!cmd) return;

		try {
			cmd?.execute(client, msg, parsed);
		} catch (error) {
			msg.reply('there was an error trying to execute that command.');
			console.error(error);
		}
	},
};
