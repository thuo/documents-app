# Documents API

[![Build Status](https://travis-ci.org/andela-hthuo/documents-api.svg?branch=develop)](https://travis-ci.org/andela-hthuo/documents-api)
[![codecov](https://codecov.io/gh/andela-hthuo/documents-api/branch/develop/graph/badge.svg)](https://codecov.io/gh/andela-hthuo/documents-api/branch/develop)
[![Code Climate](https://codeclimate.com/github/andela-hthuo/documents-api/badges/gpa.svg)](https://codeclimate.com/github/andela-hthuo/documents-api)
[![Dependency Status](https://david-dm.org/andela-hthuo/documents-api.svg)](https://david-dm.org/andela-hthuo/documents-api)

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/andela-hthuo/documents-api/tree/develop)

A REST API for a document management system. The system only allows authenticated users to create documents. Each user has a role which determines the kind of access they have in the system. Each document defines access level to indicate who can read or edit it.

## Deploying locally
### Prerequisites
* [Node.js & npm](https://docs.npmjs.com/getting-started/installing-node)
* [MongoDB](https://docs.mongodb.com/manual/installation/)
* [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

### Installing

#### Clone the repo
```bash
git clone https://github.com/andela-hthuo/documents-api.git
```
#### Install npm dependencies

Make sure the project directory your working directory **if it isn't already**.
```bash
cd documents-api
```
Install the dependencies
```bash
npm install
```

### Running the server
#### Start the MongoDB server if you don't have it running.
```bash
mongod
```
#### Start the server
Start the development server.
```bash
npm run start-dev

```

**Alternatively**, start the production server.
```bash
npm start

```
**Note:** make sure the project directory your working directory before starting the server.
