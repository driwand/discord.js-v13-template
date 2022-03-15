import { Message } from 'discord.js';
import { ParsedMessage } from 'discord-command-parser';
import Client from '../client/client';

export interface Command {
	name: string;
	description: string;
	usage?: string;
	aliases?: string[];
	category?: string;

	execute: (client: typeof Client, message: Message, args: ParsedMessage<Message> | null) => Promise<any>;
}
