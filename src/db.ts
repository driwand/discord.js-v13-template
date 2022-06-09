import { createConnection } from 'typeorm';
import { Setting } from './entities/Setting';
import { path } from 'app-root-path';

const dbDirectory = `${path}/data`;

const connectDb = async () => {
	try {
		await createConnection({
			type: 'sqlite',
			database: `${dbDirectory}/db.sqlite`,
			entities: [Setting],
			logging: true,
			synchronize: true
		});
		console.log('Database connected');
	} catch (error) {
		console.error(error);
	}
};

export default connectDb;
