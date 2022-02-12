import Client from '../client/client';
import { ClientEvents } from 'discord.js';

export interface Event {
	name: keyof ClientEvents;
	execute: (client: typeof Client, ...args: any[]) => void;
}
