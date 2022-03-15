import { Message } from 'discord.js';
import EmbedMessage from '../classes/EmbedMessage';
import { BClient } from '../client/client';
import { ownersId } from '../config/config.json';

const isAdmin = (client: BClient, msg: Message): boolean => {
	if (!msg.guildId || !msg.member) return false;
	const serverSettings = client.serverSettings.get(msg.guildId);
	if (serverSettings && serverSettings.managerRole) return msg.member?.roles.cache.has(serverSettings.managerRole);
	return ownersId.includes(msg.author.id) || msg.member?.permissions.has(['ADMINISTRATOR']);
};

const sendUsage = async (client: BClient, msg: Message, usage: string) => {
	if (!msg.guildId) return;
	const prefix = client.serverSettings.get(msg.guildId)?.prefix ?? client.defaultPrefix;
	const resUsage = usage.includes('{prefix}') ? replaceAllOccurrence(usage, '{prefix}', prefix) : usage;
	const embed = new EmbedMessage();
	embed.setTitle('Right usage:');
	embed.setDescription(resUsage);
	msg.reply({ embeds: [embed] });
};

const replaceAllOccurrence = (str: string, search: string, replace: string): string => {
	return str.split(search).join(replace);
};

export { isAdmin, sendUsage };
