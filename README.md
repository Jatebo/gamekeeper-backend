# PROJECT-GAMEKEEPER API

#### Link: https://project-gamekeeper.herokuapp.com/

<br>

### Background

The aim of this project is to build a working API using a PSQL database, which is interacted with using [node-postgres](https://node-postgres.com/). The API makes the information from this PSQL database available to front-end architecture, just as real-world backend services do so.

The database consists of information on board game categories, website users, board game reviews and finally their associated comments.

A list of all available/configured endpoints can be found at [/api](https://project-gamekeeper.herokuapp.com/api).

<br><br><br>

## Setup instructions

Fork and copy the GitHub URL of the repo, before cloning onto your machine using the command line - be sure to cd to the folder in which you'd like to clone the repo beforehand:

```console
 git clone <GitHub URL>
```

once the repo has been cloned onto the local machine, use the node package manager to install the repo's dependencies:

```console
npm install
```

In the package.json file, check that the below dependencies, scripts and jest config are showing:

```json
 "devDependencies": {
    "jest": "^27.2.0",
    "jest-sorted": "^1.0.12",
    "supertest": "^6.1.6"
  },
  "dependencies": {
    "dotenv": "^10.0.0",
    "express": "^4.17.1",
    "pg": "^8.7.1",
    "pg-format": "^1.0.4"
  }
```

```json
 "scripts": {
    "setup-dbs": "psql -f ./db/setup.sql",
    "seed": "node ./db/seeds/run-seed.js",
    "test": "NODE_ENV=test jest",
    "seed:prod": "NODE_ENV=production DATABASE_URL=
    $(heroku config:get DATABASE_URL) npm run seed",
    "start": "node listen.js",
  }
```

```json
"jest": {"setupFilesAfterEnv": ["jest-sorted"]}
```

Once the dependencies have been installed, you can move on to setting up the databases with SQL (if you haven't already created them). By running the setup-dbs script in the terminal, you will drop the databases if they exist, and create new ones - one for development and a test one.

```console
npm run setup-dbs
```

\*\* **Important - dotenv files** \*\*

This projects uses dotenv, but as .env. files are listed in the .gitignore file, you need to create and define your own, saved as .env.development and .env.test. An example of the format require can be found in the .env-example file in the root directory. Make sure to replace "database_name_here" from the example with whatever you named your databases when they were set up on Psql.

<br><br>

## Seeding the database

In order to seed the local database, you can run the pre-made script from the package.json file. This will insert the data from the db/data/development-data folder into your newly created databases, having dropped and re-created the tables for the database before inserting the data.

```console
npm run seed
```

NB - test data will be automatically seeded during testing.

Once the seed script has been run, you can choose to execute the 'peek.sql' file in the terminal to write the contents of the database tables to a .txt file for easy viewing - this file can then be found in the folder specified - for instance, the db folder in the below example.

```console
psql -f ./db/peek.sql > ./db/peek.txt
```

<br><br>

## Testing

This project makes use of jest and supertest for testing purposes. The tests can be run with the npm t command, which will run all tests, or specific test files can be run (either the utils tests or the app tests).

```console
npm t

npm t app

npm t utils
```

<br><br>

## Node & Postgres versions

**min Node version required:** v14.16.1

**min PostgreSQL version required:** 13.4

---
