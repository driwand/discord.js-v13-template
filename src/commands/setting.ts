import { ParsedMessage } from 'discord-command-parser';
import { Message } from 'discord.js';
import { getRepository } from 'typeorm';
import EmbedMessage from '../classes/EmbedMessage';
import { BClient } from '../client/client';
import { Setting } from '../entities/Setting';
import { Command } from '../interfaces/command';
import { serverSettings } from '../interfaces/serverSettings';
import { sendUsage } from '../utils/utils';

export const command: Command = {
	name: 'setting',
	description: 'Bot settings',
	aliases: ['settings', 'set'],

	async execute(client, msg, args) {
		if (!args?.success) return;
		if (!args.arguments.length) return sendInfo(client, msg);

		const subCmd = args.reader.getString();
		if (!subCmd) return;

		if (!subCommands[subCmd]) return invalidSubCommand(client, msg);
		subCommands[subCmd](client, msg, args as ParsedMessage<Message>);
	}
};

const intiSettings = async (client: BClient, msg: Message) => {
	try {
		if (!msg.guildId) return;
		const exists = await getRepository(Setting).findOne(msg.guildId);
		if (exists) return msg.channel.send('You have already initialized the settings.');
		await getRepository(Setting).save({ serverId: msg.guildId });
		const serverSet: serverSettings = {
			prefix: client.defaultPrefix
		};
		client.serverSettings.set(msg.guildId, serverSet);
		msg.channel.send(`Initial settings has been set. Check \`${client.defaultPrefix}settings\`.`);
	} catch (error) {
		console.error(error);
	}
};

const setPrefix = async (client: BClient, msg: Message, args: ParsedMessage<Message> | null) => {
	if (!args?.success || !msg.guildId) return;
	const prefix = args.reader.getString();
	if (!prefix) return sendUsage(client, msg, '{prefix}setting prefix your_prefix');
	try {
		const repo = getRepository(Setting);
		await repo.save({ serverId: msg.guildId, prefix: prefix });
		const serverSet = client.serverSettings.get(msg.guildId);
		if (serverSet) {
			serverSet.prefix = prefix;
			client.serverSettings.set(msg.guildId, serverSet);
		} else {
			const newServerSet: serverSettings = { prefix: prefix };
			client.serverSettings.set(msg.guildId, newServerSet);
		}
		msg.channel.send(`Prefix has been changed to \`${prefix}\`.`);
	} catch (error) {
		console.error(error);
	}
};

const setManager = async (client: BClient, msg: Message, args: ParsedMessage<Message> | null) => {
	if (!args?.success || !msg.guildId) return;
	try {
		let option = args.reader.getRoleID();
		if (!option) {
			args.reader.seek(-1);
			option = args.reader.getString();
			if (option !== 'none') return sendUsage(client, msg, '{prefix}setting manager @role/none');
			option = null;
		}
		await getRepository(Setting).save({ serverId: msg.guildId, managerRoleId: option });
		const serverSet = client.serverSettings.get(msg.guildId);
		if (serverSet) {
			serverSet.managerRole = option;
			client.serverSettings.set(msg.guildId, serverSet);
		} else {
			const newServerSet: serverSettings = { managerRole: option };
			client.serverSettings.set(msg.guildId, newServerSet);
		}
		await msg.channel.send(`Manager has been set to ${option ? `<@&${option}>` : 'none'}.`);
	} catch (error) {
		console.error(error);
	}
};

const sendInfo = async (client: BClient, msg: Message) => {
	try {
		if (!msg.guildId) return;

		const guildId = msg.guildId;
		const botName = client.user?.username ?? 'Bot';
		const botAvatar = client.user?.avatarURL() ?? '';
		const prefix = client.serverSettings.get(guildId)?.prefix ?? client.defaultPrefix;
		const managerRole = client.serverSettings.get(guildId)?.managerRole ?? null;

		const exists = await Setting.findOne(guildId);
		if (!exists)
			return msg.channel.send(`Setup my initial settings for the first time using \`${prefix}set init\`.`);

		const embed = new EmbedMessage();
		embed.setTitle('Settings');
		embed.setAuthor({ name: botName, iconURL: botAvatar });
		embed.addField('Prefix:', prefix);
		embed.addField('Manager Role', managerRole ? `<@&${managerRole}>` : 'None');

		await msg.channel.send({ embeds: [embed] });
	} catch (error) {
		console.error(error);
	}
};

const invalidSubCommand = (client: BClient, msg: Message) => {
	const guildId = msg.guildId ?? '';
	const prefix = client.serverSettings.get(guildId)?.prefix ?? client.defaultPrefix;
	const channel = msg.channel as any;
	const embed = new EmbedMessage();
	const commands = Object.keys(subCommands).map((e) => `\`${e}\``);
	embed.setTitle('Invalid Setting');
	embed.setDescription(
		'Only the following settings are accepted:\n' +
			`${commands.join(', ')}\n\n` +
			`**Example:** ${prefix}setting manager @role\n`
	);
	channel.send({ embeds: [embed] });
};

const subCommands: Record<string, (client: BClient, msg: Message, args: ParsedMessage<Message> | null) => void> = {
	init: intiSettings,
	prefix: setPrefix,
	manager: setManager
};
