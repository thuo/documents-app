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

#### Export/set environment variables
The environment variables used by the API server are:
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

## Usage
Request bodies for **`POST`** and **`PUT`** can  be either JSON or URL encoded.

To send authenticated requests, send a **`POST`** request to **`/api/login`** to get a token. Send the token in an **`X-Access-Token`** header or a **`token`** query parameter, or a **`token`** field in the request body with any request to authenticate the request.

A default admin user is created with the email in **`ADMIN_EMAIL`** and the password **`ADMIN_PASSWORD`** environment variables.
## Reference

### /api/login
* #### POST

  Returns an authentication token.

  **Required fields**: *email*, *password*

### /api/users
* #### POST

  Creates a user.

  **Required fields**: *first_name*, *last_name*, *email*, *password*

  **Optional fields**: *username*

* #### GET

  Returns an array of all users.

  **_Requires authentication_**, **_Requires admin_**

### /api/documents
* #### GET

  Returns an array of all documents sorted by the publish date.

  If no authentication is provided, the list only includes public documents; if authentication is provided the list includes all documents that are not private documents belonging to other users.

  ##### Query string options
  * *skip* - Number of documents to skip
  * *limit* - Number of documents to return
  * *published_before* - Only return documents created before this date and time
  * *published_after* - Only return documents created before this date and time
  * *read_access* - Only return documents with this level of read access
  * *contains* - Only return documents that contain this text

  You can combined multiple options to obtain more specific filter criteria e.g to get first 10 documents published on a certain date, combine `limit=10`, `published_after=$START_OF_DAY` and `published_before=$END_OF_DAY`.

* #### POST

  Creates a document

  **Required fields**: *title*, *content*

  **Optional fields**: *read_access* - public, authenticated or private, *write_access* - authenticated or private

  **_Requires authentication_**

### /api/users/:id/documents
* #### GET

  Returns an array of all belonging to the user with id `:id`

  Subject to the conditions and query string options of **`GET /api/documents/:id`**

### /api/documents/:id
* #### GET

  Returns the user with id `:id`.

* #### PUT

  Updates the the document with id `:id`

  Requires the document not to be private or belong to the authenticated user.

  **Optional fields**: *title*, *content*

  **_Requires authentication_**

* #### DELETE

  Deletes the document with id `:id`.

  Requires the authenticated user to be either the owner of the document or an admin.

  **_Requires authentication_**


### /api/documents/:id/access
* #### PUT

  Updates the access options of the document with id `:id`

  Requires the authenticated user to be the owner of the document.

  **Optional fields**: *read_access* - public, authenticated or private, *write_access* - authenticated or private

  **_Requires authentication_**

### /api/users/:id
* #### GET

  Returns the user with id `:id`.

* #### PUT

  Updates the user with id `:id`.

  Requires that the user being updated is the authenticated user.

  **Optional fields**: *first_name*, *last_name*, *email*, *username*

  **_Requires authentication_**

* #### DELETE

  Deletes the user with id `:id`. Requires that the user being deleted is the authenticated user.

  **_Requires authentication_**

### /api/users/:id/password
* #### PUT

  Updates the password for the user with id `:id`. Requires that the user being updated is the authenticated user.

  **Required fields**: *old_password*, *password*

### /api/users/:id/role
* #### PUT

  Updates the role of the user with id `:id`.

  **Required fields**: *role* - the title of the role to assign the user e.g. admin

  **_Requires authentication_**, **_Requires admin_**

### /api/roles
* #### GET

  Returns an array of all roles.

### /api/roles/:id
* #### GET

  Returns the role with id `:id`.

* #### PUT

  Updates the role with id `:id`.

  **Optional fields**: *description*

  **_Requires authentication_**, **_Requires admin_**

### /api/roles/:id/users
* #### GET

  Returns an array of all users with the role with id `:id`.

  **_Requires authentication_**, **_Requires admin_**
