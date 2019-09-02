import { 
  JsonController, Authorized, CurrentUser, Post, Param, BadRequestError, HttpCode, NotFoundError, ForbiddenError, Get, Put, Body, Patch} from 'routing-controllers'
import User from '../users/entity'
import { Coffee, CoffeeType } from './entities'
// import {io} from '../index'

type CoffeeList = Coffee[]

@JsonController()
export default class CoffeeController {
  
  // GET ALL COFFEES
  @Get('/coffee')
  async allCoffees(): Promise<CoffeeList> {
    const coffee = await Coffee.find()
    return coffee
  }

  // GET COFFEE BY ID
  @Get('/coffee/:id')
  async getCoffee(
    @Param('id') id: any
    ): Promise<Coffee> {
    const coffee = await Coffee.findOneById(id)
    if (!coffee) throw new NotFoundError('We promised you coffee, but could not find it 😱')
    return coffee
  }

  // CREATE COFFEEE
  @Authorized()
  @Post(':coffeeTypeId/coffee')
  @HttpCode(201)
  async createCoffee(
    @Param('coffeeTypeId') coffeeTypeId: any,
    // @Body() data: any,
    @CurrentUser() user: User)
    : Promise<Coffee> {  
      const coffeetype = await CoffeeType.findOneById(coffeeTypeId)
      if (!coffeetype) throw new NotFoundError('We promised you coffee, but could not find it 😱')
      console.log('coffeetype', coffeetype);
      !await user.password
      const entity = await Coffee.create({
      coffeetype,
      user
    }).save()
    const newCoffee = await Coffee.findOneById(entity.coffeeId)
    
    // io.emit('action', {
    //   type: 'ADD_COFFEE',
    //   payload: newCoffee
    // })
    return newCoffee!
  }
  
  // UPDATE COFEE BY ID
  @Authorized()
  @Patch('/coffee/:id')
  async updateCoffee(
    @Param('id') coffeeId: any,
    @CurrentUser() user: User,
    @Body() update: Partial<Coffee>
    ) {
      const coffee = await Coffee.findOneById(coffeeId)
      console.log(update, "update")
      console.log(coffee, "coffee")
      if (!coffee) throw new BadRequestError('Omg, I think we lost your coffee!🙀')
      if (coffee.user.userId === user.userId) return await Coffee.merge(coffee, update).save()
      else throw new BadRequestError('You dont own this coffee biatch, so you cant edit nuthin')
    }
  }