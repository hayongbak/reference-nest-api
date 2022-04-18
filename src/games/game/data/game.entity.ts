import { Entity, Column, PrimaryGeneratedColumn, Generated, PrimaryColumn } from 'typeorm';

@Entity({name: 'games'})
export class Game {

    @Generated('increment')
    @PrimaryColumn({type: 'bigint'})
    game_id: string;

    @Column()
    game_name: string;

    @Column()
    game_picture_url: string;

    @Column()
    bot_api_endpoint: string;

    @Column()
    bot_type: string;

    @Column('simple-json')
    game_modes: Array<GameTypeAndMode>;
}

export class GameTypeAndMode{
    type: string;
    gameModes: string[];
    nrOfPlayers: number;
}