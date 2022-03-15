import { PrimaryColumn, Entity, Column, BaseEntity } from 'typeorm';
import { defaultPrefix } from '../config/config.json';

@Entity()
export class Setting extends BaseEntity {
	@PrimaryColumn()
	serverId: string;

	@Column({ default: defaultPrefix })
	prefix: string;

	@Column({ nullable: true })
	managerRoleId: string;
}
