# Cloud Management for Manufacturing

---

## Pre-requisite Software

- Docker: <https://www.docker.com/products/docker-desktop/>
- Node.JS: <https://nodejs.org/en/>
- Yarn: <https://yarnpkg.com/getting-started/install>

## Running the Cloud Services

**Important: please go through the project and update any urls that need to be updated, this project does include a MQTT broker being spun up so you can use this or the public test mosquitto one**

1. In the root project folder run `yarn install` to install all of the project dependencies
2. Check that all connection strings and URLs within the project is correct, there is an improvement that could be made here to use NestJS configuration to abstract these variables.
3. Once the node packages have been installed, run the db in detached mode using the command `docker-compose run -d db`
4. Once the db is up and running, run the following command to push the database schema using a tool called Prisma `yarn prisma db push`
5. Once the schema is pushed up you are ready to run the entire solution using the command `docker-compose up`

## Running the Monitor UI

1. `cd monitor-ui` from the root folder of the project
2. Run `yarn install` to install dependencies
3. Run `yarn dev` to run the UI in development mode and follow the URL the console spits out.

OR

3. Run `yarn build` then `yarn start` to run a production version.
