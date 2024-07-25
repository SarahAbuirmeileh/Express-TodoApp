import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Task extends BaseEntity{
    @PrimaryGeneratedColumn("increment")
    id:number

    @Column({length:255, nullable:false})
    title:string

    @Column({nullable:false})
    isDone :boolean
}