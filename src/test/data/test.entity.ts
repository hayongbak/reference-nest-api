
import { Entity, Column, PrimaryGeneratedColumn, Generated, PrimaryColumn } from 'typeorm';

@Entity()
export class Test {

    @Generated('increment')
    @PrimaryColumn({type: 'bigint'})
    id: string;

    @Column({ length: 50 })
    token: string;
}