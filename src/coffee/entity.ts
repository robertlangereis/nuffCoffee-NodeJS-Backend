import {
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  Entity,
  ManyToOne,
  ManyToMany
} from "typeorm";
import { MinLength, IsString, MaxLength } from "class-validator";
import User from "../users/entity";
import CoffeeType from "../coffeetypes/entity";
// import { text } from 'body-parser';

@Entity()
export default class Coffee extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    nullable: true
  })
  timeAdded: string;

  @IsString()
  @Column({ nullable: true })
  bean: string;

  @IsString()
  @MaxLength(280)
  @MinLength(3)
  @Column({ nullable: true })
  comments: string;

  // this is a relation, read more about them here:
  // http://typeorm.io/#/many-to-one-one-to-many-relations

  
  @Column({ type: "int", nullable: true })
  doubleShot: number;
  
  @ManyToOne(_ => User, user => user.coffees)
  user: User;

  @ManyToMany(_ => CoffeeType, coffeetype => coffeetype.coffee, { eager: true })
  coffeetype: CoffeeType;
}

