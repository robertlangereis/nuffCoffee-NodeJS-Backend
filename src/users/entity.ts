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
import Coffee from "../coffee/entity";
import CoffeeType from "../coffeetypes/entity";

@Entity()
export default class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @IsEmail()
  @Column("text")
  email!: string;

  @IsString()
  @MinLength(3)
  @Column("text")
  @Exclude({ toPlainOnly: true })
  password!: string;

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
  coffees!: Coffee[];

  @ManyToMany(_ => CoffeeType, coffeetype => coffeetype.users, { eager: true })
  @JoinTable({
    name: "user_coffeetypes",
    joinColumn: {
      name: "userId",
      referencedColumnName: "id"
  },
  inverseJoinColumn: {
      name: "coffetypeId",
      referencedColumnName: "id"
  }
  })
  coffeetypes!: CoffeeType[];
}
