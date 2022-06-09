import { GuildMember, Message } from 'discord.js';
import EmbedMessage from '../classes/EmbedMessage';
import { BClient } from '../client/client';
import { ownerIds } from '../config/config';

const isAdmin = (client: BClient, member: GuildMember, guildId: string) => {
	const managerRole = client.serverSettings.get(guildId)?.managerRole ?? '';
	return (
		ownerIds.includes(member.id) || member.permissions.has(['ADMINISTRATOR']) || member.roles.cache.has(managerRole)
	);
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

export { isAdmin, sendUsage, replaceAllOccurrence };
