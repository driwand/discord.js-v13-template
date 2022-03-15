import client from './client/client';
import { botToken } from './config/config.json';
import connectDb from './db';

const main = async () => {
	await client.init();
	await client.login(botToken);
	await connectDb();
};

main();
