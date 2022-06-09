import { Event } from '../interfaces/event';
import { Message } from 'discord.js';
import { parse } from 'discord-command-parser';
import { isAdmin } from '../utils/utils';

export const event: Event = {
	name: 'messageCreate',
	execute: async (client, msg: Message) => {
		if (msg.author.bot || !msg.guild) return;

		const prefix = client.serverSettings.get(msg.guild.id)?.prefix ?? client.defaultPrefix;
		const parsed = parse(msg, prefix, { ignorePrefixCase: true });
		if (!parsed.success) return;

		const commandName = parsed.command.toLowerCase();
		const cmd = client.commands.get(commandName);
		if (!cmd) return;

		if (cmd.category === 'admin' && msg.member) {
			if (!isAdmin(client, msg.member, msg.guild.id)) return;
		}

		try {
			await cmd?.execute(client, msg, parsed);
		} catch (error) {
			msg.reply('there was an error trying to execute that command.');
			console.error(error);
		}
	}
};
