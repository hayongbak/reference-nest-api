import { Entity, Column, OneToOne, ManyToOne, JoinColumn, PrimaryColumn, Index } from 'typeorm';
import { App } from './app.entity';
import { User } from 'src/users/shared/user.entity';

@Entity({ name: 'users_apps' })
export class UserApp {

    @PrimaryColumn()
    user_id: number;

    @ManyToOne(type => User)
    @JoinColumn({ name: 'user_id', referencedColumnName: 'user_id' })
    public user: User;

    @PrimaryColumn('bigint')
    app_id: number;

    @ManyToOne(type => App)
    @JoinColumn({ name: 'app_id', referencedColumnName: 'app_id' })
    public app: App;

    @Column()
    user_app_account_name: string;
    @Column()
    user_app_account_id: string;
    @Column()
    user_app_account_logo: string;
    @Column()
    access_token: string;
    @Column()
    refresh_token: string;
    @Column()
    created: Date;

    game_name: string;

}