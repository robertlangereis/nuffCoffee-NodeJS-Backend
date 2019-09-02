import { BaseEntity, PrimaryGeneratedColumn, Column, Entity, Index, OneToMany, ManyToOne, OneToOne} from 'typeorm'
import { MinLength, IsString, MaxLength} from 'class-validator';
import User from '../users/entity'
// import { text } from 'body-parser';

@Entity()
export class Coffee extends BaseEntity {

  @PrimaryGeneratedColumn()
  coffeeId?: number
  
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: true})
  timeAdded: string;
  
  @IsString()
  @Column({nullable: true})
  bean: string
 
  @IsString()
  @MaxLength(280)
  @MinLength(3)
  @Column({nullable: true})
  comments: string

  // this is a relation, read more about them here:
  // http://typeorm.io/#/many-to-one-one-to-many-relations
  
  @ManyToOne(_ => User, user => user.coffee)
  user: User

  @OneToOne(_ => CoffeeType, coffeetype => coffeetype.coffee, {cascadeUpdate: true})
  coffeetype: CoffeeType[]
}

@Entity()
export class CoffeeType extends BaseEntity {

  @PrimaryGeneratedColumn()
  coffeeTypeId?: number
  
  @IsString()
  @Column()
  coffeeName: string
  
  @IsString()
  @Column({nullable: true})  
  shopname: string

  @Column({type: "int", nullable: true})  
  waterml: number

  // this is a relation, read more about them here:
  // http://typeorm.io/#/many-to-one-one-to-many-relations

  @OneToOne(_ => Coffee, coffee => coffee.coffeetype, {eager: true})
  coffee: Coffee
}