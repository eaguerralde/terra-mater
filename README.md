
<h1 align="center" style="width: 610px;">Terra Mater</h1>
<h2 align="center" style="width: 610px; height: 60px">Repository of Earth's natural resources</h2>
<p align="center" style="width: 610px; height: 240px;">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a> <span style="font-size: 200px; line-height: 200px;">+</span> <a title="Roei raz, CC BY-SA 3.0 &lt;https://creativecommons.org/licenses/by-sa/3.0&gt;, via Wikimedia Commons" href="https://commons.wikimedia.org/wiki/File:Earth_simple_icon.png"><img width="200" alt="Earth simple icon" src="https://upload.wikimedia.org/wikipedia/commons/c/c0/Earth_simple_icon.png"></a>
</p>

## Description

This is a personal project where I'll explore [Nest](https://github.com/nestjs/nest) framework while building a system able store Earth's natural resources, what they are useful for and how to fetch these. I'll join my two passions here, coding and nature, focusing on the programming side first using plants as the data to explore. 

Using just one of Earth's life kingdoms should be enough to provide all challenges that will help me learn Nest framework. Once confident, other resource types like the rest of biology kingdoms, minerals, weather, etc... can be added focusing then on data models, all the different relations these have and how to present this information in a useful and intuitive way.

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```
## Features
- mysql database.
- TypeORM repositories.
- Authentication using passport with guards.
  - Login at `/auth/login` to obtain a token.
  - Set `Authorisation: Bearer [token]` heather at subsequent requests.
- Automatic parameter validation pipe based on DTOs.
- Exception handling pipe.
- Simple users CRUD module.
- Authorisation module using [casl](https://casl.js.org/)
- Swagger documentation at `/docs' automatically generated from code and comments.
- Environment config through .env file.
- Unit and e2e tests with separate .env file.


Earth icon by Roei raz, CC BY-SA 3.0 <https://creativecommons.org/licenses/by-sa/3.0>, via Wikimedia Commons
