import client from './client/client';
import { botToken } from './config/config.json';

client.init();

client.login(botToken);
