import {
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  Entity,
  OneToMany,
  ManyToOne,
  ManyToMany
} from "typeorm";
import { MinLength, IsString, MaxLength } from "class-validator";
import User from "../users/entity";
import Coffee from "../coffee/entity";
// import { text } from 'body-parser';

@Entity()
export default class CoffeeType extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @IsString()
  @Column()
  coffeeName: string;

  @IsString()
  @Column({ nullable: true })
  shopname: string;

  @Column({ type: "int", nullable: true })
  kcal: number;

  @Column({ type: "int", nullable: true })
  caffeineMg: number;

  // this is a relation, read more about them here:
  // http://typeorm.io/#/many-to-one-one-to-many-relations

  @OneToMany(_ => Coffee, coffee => coffee.coffeetype)
  coffee: Coffee[];
  @ManyToMany(_ => User, user => user.coffeetypes)
  users: User[];
}