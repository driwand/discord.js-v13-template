import { MessageEmbed } from 'discord.js';
import { embedColor } from '../config/config';

class EmbedMessage extends MessageEmbed {
	constructor() {
		super();
		this.setColor(embedColor);
	}
}

export default EmbedMessage;
