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
`docker-compose up -d --build`

`docker inspect <POSTGRES_CONTAINER_ID>`
`docker inspect tormes-backend-postgres-database-1`

And get:

`"IPAddress": "x.x.x.x",`

to connect with pgAdmin on Host name/address

With this command, you will launch the Docker containers, which consist of 3 components: the PostgreSQL database, SonarCube and PG Admin which you can set up on a local server with the following configuration:

`Email: sergio.gomesan8@gmail.com`

`Password: tormes-backend`


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
$ npx jest src/

# test coverage
$ npm run coverage
```



## Docker-compose
docker ps
docker inspect <Container-ID>
"IPAddress": "172.21.0.2",

- PgAdmin: 172.21.0.2 -> server addres


## To create a Migration:

```bash
$ npm run migration:generate -- src/infraestructure/postgres/migrations/product/NombreDeLaMigracion
```


## Create a Stripe Webhook

Para poder usar Stripe en local, hay que conectarlo a través de su librería creando un webhook.

```bash
$ stripe listen --forward-to http://localhost:3000/tormes/api/checkout/webhook
```

Cuando ejecutemos ese comando nos dará un resultado similar a este:

```bash
$ stripe listen --forward-to http://localhost:3000/tormes/api/checkout/webhook

$ A newer version of the Stripe CLI is available, please update to: v1.22.0
> Ready! You are using Stripe API Version [2024-06-20]. Your webhook signing secret is whsec_e95920f68a806221d9711baa710d7d22aaeeb0c5532d1dc5825da8f5c8307fc0 (^C to quit)
```

Debemos copiar el secreto devuelto por la librería y añadirlo en el fichero .env en
la variable del entorno: STRIPE_WEBHOOK_SECRET