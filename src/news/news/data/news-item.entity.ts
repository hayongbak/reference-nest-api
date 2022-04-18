import { PrimaryGeneratedColumn, Column, Entity, Generated, PrimaryColumn } from "typeorm";

@Entity('news_items')
export class NewsItem{

    @Generated('increment')
    @PrimaryColumn({type: 'bigint'})
    item_id: string;

    @Column()
    title: string;

    @Column()
    header_picture_url: string;

    @Column()
    content: string;

    @Column({type: 'bigint'})
    user_id: string;

    user_name: string;

    @Column()
    created: Date;
}