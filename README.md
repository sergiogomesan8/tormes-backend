<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

You need to have the backend up and running along with the Docker containers.

To run docker containers:
`docker compose up`

`docker inspect <POSTGRES_CONTAINER_ID>`

And get:

`"IPAddress": "x.x.x.x",`

to connect with pgAdmin on Host name/address

With this command, you will launch the Docker containers, which consist of 3 components: the PostgreSQL database, SonarCube and PG Admin which you can set up on a local server with the following configuration:

`Email: sergio.gomesan8@gmail.com`

`Password: tormesBackend`


```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test & Coverage

```bash
# unit tests
$ npm run test

# test coverage
$ npm run coverage
```



## Docker-compose
docker ps
docker inspect <Container-ID>
"IPAddress": "172.21.0.2",

- PgAdmin: 172.21.0.2 -> server addres
