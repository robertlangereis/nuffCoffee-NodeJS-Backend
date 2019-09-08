import { JsonController, Post, Param, Get, Body, Authorized } from 'routing-controllers'
import User from './entity';
import coffeetypes from './entity';
import { io } from '../index'

@JsonController()
export default class UserController {

  @Post('/users')
  async signup(
  @Body() data: Promise<User>
  ) {
    const {password, email, ...rest} = data
    const userSetup = new User();
    userSetup.email = email;
    userSetup.password = password;
    const defaultCoffeeType = await coffeetypes.findByIds([1,2,3,4,5,6]);
    const [cappuccino, latte, blackCoffee, espresso, americano, latteMacchiato] = defaultCoffeeType
    userSetup.coffeetypes = [cappuccino, latte, blackCoffee, espresso, americano, latteMacchiato]
    await userSetup.setPassword(password)
    console.log('userSetup', userSetup);
    const user = await userSetup.save()
    console.log('user', user);
    // const entity = User.create(rest)
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
