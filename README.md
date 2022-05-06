# FUTUREPROOF Bootcamp - Create and Test an API

### LAP 1 - Week 1 - Day 4

This was an exercise given to the students of the Futureproof Bootcamp (Auguste Cohort).

## Objective

Create and Test a REST API.

## Implementation

The server code has been separated into two separate files called index.js and app.js.
This has allowed us to run a separate testing server that doesn't conflict with the main server:

- when running either the production and the development server, the index.js file is called. Within the index.js file there is an import from app.js (where the routes are). The server is started with a call to app.listen() which is in the index.js file.
- when running the testing suite the api.spec.js file is run and within it there is an import from app.js (where the routes are). The server is started with a call to app.listen() before each test is run from within the app.spec.js file.

## Technologies

- nodeJS
- expressJS: to rapidly develop a and deploy a local server.
- jest: testing framework
- supertest: to test the HTTP endpoints
- nodemon: to rerun the development server after each file save
- HoppScotch: to test the API endpoints
- cors: to allow external services (eg HoppScotch) to connect to the server

## How to Use

To run the server:

```bash
  npm start
```

To run the development environment (with nodemon):

```bash
  npm run dev
```

To run the testing suite:

```bash
  npm test
```

To check the test coverage (thanks to Jest):

```bash
  npm run coverage
```

## Interesting

When developing the DELETE route I first choose an HTTP status of 204 as I had read online that it was a suitable status for that specific action. However I came across (what I thought was) a bug where the server wouldn't send the deletion message back to the user. It turns out that when sending an HTTP Response of 204 the send() call is completely ignored as 204 means that the is NO DATA TO SEND BACK.
I then decided to use the HTTP Response of 200 (OK) as it is also an appropriate status as I am saying that the action has been successful. With that response I have been able to send a short message to inform the user that the action was successful.

## Thanks

I'd like to thank [Amir](https://github.com/aha000111) for helping me out while developing the tests and with the presentation 👍
