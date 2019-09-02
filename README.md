# NuffCoffee - Robert Langereis

This is the backend (REST API) for a coffee counting platform, by Robert Langereis, as a solo leisure project.

It has these endpoints:

- `POST /users`: sign up as new user
- `POST /logins`: log in and receive a JWT
- `POST /coffee`: create a new coffee
- `PATCH /coffee/:id`: update an existing coffee
- `GET /coffee`: list all coffees

## Running

- You need a working Postgres database that is preferrably empty (drop all the tables) and running
- Install the dependencies using `npm install`
- `npm run dev`
- This backend requires a frontend that can be found here: https://github.com/robertlangereis/nuffCoffee-React
