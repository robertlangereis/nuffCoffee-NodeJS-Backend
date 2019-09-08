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
// import { text } from 'body-parser';

@Entity()
export class CoffeeType extends BaseEntity {
  @PrimaryGeneratedColumn()
  coffeeTypeId?: number;

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
  @ManyToOne(_ => User, user => user.coffeetypes)
  user: User;
}


@Entity()
export class Coffee extends BaseEntity {
  @PrimaryGeneratedColumn()
  coffeeId?: number;

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

