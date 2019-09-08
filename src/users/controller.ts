import { JsonController, Post, Param, Get, Body, Authorized } from 'routing-controllers'
import User from './entity';
import CoffeeType from '../coffeetypes/entities';
import { io } from '../index'

@JsonController()
export default class UserController {

  @Post('/users')
  async signup(
  @Body() data: User
  ) {
    const {password, email, ...rest} = data
    const entity = await User.create(rest)
    entity.email = email;
    entity.password = password;
    const defaultCoffeeType = await CoffeeType.findByIds([1,2,3,4,5,6]);
    const [cappuccino, latte, blackCoffee, espresso, americano, latteMacchiato] = defaultCoffeeType
    entity.coffeetypes = [cappuccino, latte, blackCoffee, espresso, americano, latteMacchiato]
    await entity.setPassword(password)
    console.log('entity', entity);
    const user = await entity.save()
    console.log('user', user);
    // console.log('entity', entity);

    io.emit('action', {
      type: 'ADD_USER',
      payload: user
    })

    return user
  }

  @Authorized()
  @Get('/users/:id([0-9]+)')
  getUser(
    @Param('id') id: number
  ) {
    return User.findOneById(id)
  }

  @Authorized()
  @Get('/users')
  allUsers() {
    return User.find()
  }
}
