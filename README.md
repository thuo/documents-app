# Documents App

[![Build Status](https://travis-ci.org/andela-hthuo/documents-app.svg?branch=develop)](https://travis-ci.org/andela-hthuo/documents-app)
[![codecov](https://codecov.io/gh/andela-hthuo/documents-api/branch/develop/graph/badge.svg)](https://codecov.io/gh/andela-hthuo/documents-api/branch/develop)
[![Code Climate](https://codeclimate.com/github/andela-hthuo/documents-app/badges/gpa.svg)](https://codeclimate.com/github/andela-hthuo/documents-app)
[![Dependency Status](https://david-dm.org/andela-hthuo/documents-app.svg)](https://david-dm.org/andela-hthuo/documents-app)

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/andela-hthuo/documents-api/tree/develop)

 Document management app.

## Deploying locally
### Prerequisites
* [Node.js & npm](https://docs.npmjs.com/getting-started/installing-node)
* [MongoDB](https://docs.mongodb.com/manual/installation/)
* [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

### Installing

#### Clone the repo
```bash
git clone https://github.com/andela-hthuo/documents-app.git
```
#### Install npm dependencies

Make sure the project directory your working directory **if it isn't already**.
```bash
cd documents-app
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

#### Export/set environment variables
The environment variables used by the server are:
* `MONGODB_URI`
* `NODE_ENV`
* `PORT`
* `SECRET_KEY`
* `ADMIN_EMAIL`
* `ADMIN_PASSWORD`

**NOTE:** All these variables have defaults but it's highly recommended to set your own **``SECRET_KEY``** and **`ADMIN_PASSWORD`** because these should not be public while their defaults have been checked into source control.

#### Start the server
Start the development server.
```bash
npm run start-dev

```

**Alternatively**, start the production server.
```bash
npm start

```
**NOTE:** Make sure the project directory your working directory before starting the server.

#### Using the app

Open http://http://localhost:3000. You can run the app in a different port by setting the `PORT` environment variable.

**NOTE:** A default admin user is created with the email in **`ADMIN_EMAIL`** and the password **`ADMIN_PASSWORD`** environment variables.

## The API
[API documentation](API.md)

## LICENSE
[MIT](LICENSE)
