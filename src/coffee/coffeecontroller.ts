import { 
  JsonController, Authorized, CurrentUser, Post, Param, BadRequestError, HttpCode, NotFoundError, Get, Body, Patch} from 'routing-controllers'
import User from '../users/entity'
import { Coffee, CoffeeType } from './entities'
// import {io} from '../index'

type CoffeeList = Coffee[]
type CoffeeTypeList = CoffeeType[]

@JsonController()
export default class CoffeeController {
  
  // GET ALL COFFEES
  @Get('/coffee')
  async allCoffees(): Promise<CoffeeList> {
    const coffee = await Coffee.find()
    return coffee
  }

  // GET ALL COFFEETYPES
  @Get('/coffeetypes')
  async allCoffeeTypes(): Promise<CoffeeTypeList> {
    const coffeetypes = await CoffeeType.find()
    return coffeetypes
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

  // CREATE COFFEEE LOG
  @Authorized()
  @Post(':coffeeTypeId/coffee')
  @HttpCode(201)
  async createCoffee(
    @Param('coffeeTypeId') coffeeTypeId: any,
    @Body() data: any,
    @CurrentUser() user: User)
    : Promise<Coffee> {  
      const {timeAdded, doubleShot} = data
      const coffeetype = await CoffeeType.findOneById(coffeeTypeId)
      if (!coffeetype) throw new NotFoundError('We promised you coffee, but could not find it 😱')
      console.log('coffeetype', coffeetype);
      !await user.password
      const entity = await Coffee.create({
      coffeetype,
      doubleShot,
      user,
      timeAdded
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
      if (coffee.user === user) return await Coffee.merge(coffee, update).save()
      else throw new BadRequestError('You dont own this coffee biatch, so you cant edit nuthin')
    }
  }