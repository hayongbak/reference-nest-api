
import { Entity, Column, OneToOne, ManyToOne, JoinColumn, PrimaryColumn, Index } from 'typeorm';
import { Game } from 'src/games/game/data/game.entity';
import { User } from './user.entity';

@Entity({ name: 'users_games' })
export class UserGame {

    @PrimaryColumn('bigint')
    user_id: string;

    @ManyToOne(type => User)
    @JoinColumn({ name: 'user_id', referencedColumnName: 'user_id' })
    public user: User;

    @PrimaryColumn('bigint')
    game_id: string;

    @ManyToOne(type => Game)
    @JoinColumn({ name: 'game_id', referencedColumnName: 'game_id' })
    public game: Game;

    @Column()
    user_game_accountname: string;
    @Column()
    user_game_accountid: string;
    @Column()
    created: Date;

    game_name: string;

}