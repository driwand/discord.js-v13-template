import { getRepository } from 'typeorm';
import { BClient } from '../client/client';
import { Setting } from '../entities/Setting';
import { Event } from '../interfaces/event';
import { serverSettings } from '../interfaces/serverSettings';

export const event: Event = {
	name: 'ready',
	execute: async (client) => {
		console.log(`I am ready! ${client.user?.tag}`);
		loadSettings(client);
	}
};

const loadSettings = async (client: BClient) => {
	try {
		const allSet = await getRepository(Setting).find();
		if (!allSet) return;
		for (const set of allSet) {
			const serverSet: serverSettings = {
				prefix: set.prefix,
				managerRole: set.managerRoleId
			};
			client.serverSettings.set(set.serverId, serverSet);
		}
	} catch (error) {
		console.error(error);
	}
};
