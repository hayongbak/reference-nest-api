import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'apps' })
export class App {

    @PrimaryGeneratedColumn('increment')
    app_id: number;

    @Column()
    app_name: string;

    @Column()
    app_picture_url: string;

}
