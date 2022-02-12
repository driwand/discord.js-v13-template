import { Client, Collection, ClientOptions } from 'discord.js';
import { Command } from '../interfaces/command';
import { Event } from '../interfaces/event';
import fs from 'fs';
import path from 'path';

let filesExtension = '.js';
if (process.env.NODE_ENV !== 'production') filesExtension = '.ts';

class BotClient extends Client {
	public commands: Collection<string, Command> = new Collection();
	public events: Collection<string, Event> = new Collection();

	constructor(options: ClientOptions) {
		super(options);
	}

	// prettier-ignore
	public async init(): Promise<void> {
		// load commands
		const commandsPath = path.join(__dirname, '..', 'commands');
		const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(filesExtension));

		for (const file of commandFiles) {
			const { command } = await import(`${commandsPath}/${file}`);
			if (!command) continue;

			if (process.env.NODE_ENV !== 'production') console.log(`Loading: ${file} as ${command.name}`);

			this.commands.set(command.name, command);
			if (!command?.aliases) continue;

			command.aliases.forEach((alias: string) => {
				this.commands.set(alias, command);
				if (process.env.NODE_ENV !== 'production') console.log(`Loading: ${file} as ${alias}`);
			});
		}

		// load events
		const eventsPath = path.join(__dirname, '..', 'events');
		const eventsFiles = fs
			.readdirSync(eventsPath)
			.filter((file) => file.endsWith(filesExtension));
		for (const file of eventsFiles) {
			const { event } = await import(`${eventsPath}/${file}`);
			if (!event) continue;
			this.events.set(event.name, event);
			this.on(event.name, event.execute.bind(null, this));
		}
	}
}

export default new BotClient({
	intents: [
		'GUILDS',
		'DIRECT_MESSAGES',
		'GUILD_MESSAGES',
		'GUILD_MESSAGE_REACTIONS',
		'DIRECT_MESSAGES',
		'DIRECT_MESSAGE_REACTIONS',
	],
});
