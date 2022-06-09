import 'dotenv/config';
import { botToken } from './config/config';
import client from './client/client';
import connectDb from './db';

const main = async () => {
	try {
		await connectDb();
		await client.init();
		await client.login(botToken);
	} catch (error) {
		console.error(error);
	}
};

main();
