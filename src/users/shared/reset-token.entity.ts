
import { Entity, Column, PrimaryColumn, Generated } from 'typeorm';

@Entity({ name: 'reset_tokens' })
export class ResetToken {
    @Generated('increment')
    @PrimaryColumn('bigint')
    token_id: string;
    @Column('bigint')
    user_id: string;
    @Column()
    token: string;
    @Column()
    user_email: string;
    @Column() // TypeORM automatically saves and fetches dates in UTC time!
    created: Date;
}