import { JsonController, Post, Param, Get, Body, Authorized } from 'routing-controllers'
import User from './entity';
import { io } from '../index'

@JsonController()
export default class UserController {

  @Post('/users')
  async signup(
    @Body() data: User
  ) {

    const {password, ...rest} = data
    console.log('password', password);
    console.log('rest', rest);
    const entity = User.create(rest)
    console.log('entity', entity);
    await entity.setPassword(password)
    const user = await entity.save()
    console.log('user', user);

    io.emit('action', {
      type: 'ADD_USER',
      payload: entity
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
