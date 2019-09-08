import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable 
} from "typeorm";
import { Exclude } from "class-transformer";
import { MinLength, IsString, IsEmail } from "class-validator";
import * as bcrypt from "bcrypt";
import Coffee from "../coffee/entities";
import CoffeeType from "../coffeetypes/entities";

@Entity()
export default class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @IsEmail()
  @Column("text")
  email: string;

  @IsString()
  @MinLength(3)
  @Column("text")
  @Exclude({ toPlainOnly: true })
  password: string;

  async setPassword(rawPassword: string) {
    const hash = await bcrypt.hash(rawPassword, 10);
    this.password = hash;
  }

  checkPassword(rawPassword: string): Promise<boolean> {
    return bcrypt.compare(rawPassword, this.password);
  }

  // this is a relation, read more about them here:
  // http://typeorm.io/#/many-to-one-one-to-many-relations
  @OneToMany(_ => Coffee, coffee => coffee.user, { eager: true })
  coffees: Coffee[];

  @ManyToMany(_ => CoffeeType, coffeetypes => coffeetypes.user, { eager: true })
  @JoinTable()
  coffeetypes: CoffeeType[];
}
