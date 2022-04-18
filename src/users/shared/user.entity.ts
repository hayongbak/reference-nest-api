
import { Entity, Column, PrimaryGeneratedColumn, Generated, PrimaryColumn } from 'typeorm';

@Entity({name: 'users'})
export class User {

    @Generated('increment')
    @PrimaryColumn({type: 'bigint'})
    user_id: string;

    @Column()
    user_name: string;

    @Column()
    user_email: string;

    @Column({name: 'password_hash'})
    password: string;

    @Column()
    user_avatar_url: string;

    @Column() // TypeORM automatically saves and fetches dates in UTC time!
    created: Date;
}