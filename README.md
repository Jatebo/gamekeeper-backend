# PROJECT-GAMEKEEPER API

Link: https://project-gamekeeper.herokuapp.com/

## Background

---

The aim of this project is to build a working API using a PSQL database, which is interacted with using [node-postgres](https://node-postgres.com/). The API makes the information from this PSQL database available to front-end architecture, just as real-world backend services do so.

The database consists of information on board game categories, website users, board game reviews and finally their associated comments.

A list of all available/configured endpoints can be found at [/api](https://project-gamekeeper.herokuapp.com/api).

## Setup instructions

---

fork and copy the GitHub URL of the repo, before cloning onto your machine using the command line - be sure to cd to the folder in which you'd like to clone the repo beforehand:

```console
 git clone <GitHub URL>
```

once the repo has been cloned onto the local machine, use the node package manager to install the repo's dependencies:

```console
npm install
```

in the package.json file, check that the below dependencies, scripts and jest config are showing:

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
    "seed:prod": "NODE_ENV=production DATABASE_URL=$(heroku config:get DATABASE_URL) npm run seed",
    "start": "node listen.js"
  }
```

```json
"jest": {"setupFilesAfterEnv": ["jest-sorted"]}
```

**Important - dotenv files**

## Node & Postgres versions

---

**min Node version required:** v14.16.1

**min PostgreSQL version required:** 13.4

- Write your README, including the following information:
  - [ ] Link to hosted version
  - [ ] Write a summary of what the project is
  - [ ] Provide clear instructions of how to clone, install dependencies, seed local database, and run tests
  - [ ] Include information about how to create the two `.env` files
  - [ ] Specify minimum versions of `Node.js` and `Postgres` needed to run the project

**Remember that this README is targetted at people who will come to your repo (potentially from your CV or portfolio website) and want to see what you have created, and try it out for themselves(not _just_ to look at your code!). So it is really important to include a link to the hosted version, as well as implement the above `GET /api` endpoint so that it is clear what your api does.**

---
