const app = require('../app.js') // to have access to the express object
const request = require('supertest') // to be able to use jest for testing

let api

describe('testing the API server', () => {
  // Before starting each test we open a server on port 3000
  beforeAll(() => {
    api = app.listen(3000, () => {
      console.log('Test server running on port 3000')
    })
  })

  // After running each test we close the server to free the connection
  afterAll((done) => {
    console.log('Gracefully stopping test server')
    api.close(done)
  })

  it('responds to a GET request of the "/" endpoint with a HTTP Status of 200 (OK)', (done) => {
    request(api).get('/').expect(200, done)
  })

  it('responds to a GET request of the "/students" endpoint with a HTTP Status of 200 (OK)', (done) => {
    request(api).get('/students').expect(200, done)
  })

  it('responds to a GET request of the "/students/Kevin" endpoint (Kevin is not present on the DatabAse) with a HTML Status of 404 (Not Found)', (done) => {
    request(api)
      .get('/students/Kevin')
      .expect(404)
      .expect({ error: 'That student is not in our Database!' }, done)
  })

  it('responds to a POST request of the "/students" endpoint with a HTTP Status of 201 (Created)', (done) => {
    const testData = {
      name: 'Melvin',
      subject: 'History',
      grade: 'Excellent',
    }

    request(api)
      .post('/students')
      .send(testData)
      .expect(201)
      .expect(testData, done)
  })

  it('responds to a POST request of the "/students" endpoint (Student already exists in the Database) with a HTTP Status of 405 (Not Allowed)', (done) => {
    const testData = {
      name: 'Simon',
      subject: 'History',
      grade: 'Excellent',
    }

    request(api)
      .post('/students')
      .send(testData)
      .expect(405)
      .expect({ error: 'A student with that name already exists' }, done)
  })

  it('responds to a DELETE request of the "/students/Kelvin1324dgj" endpoint (Kelvin is NOT in the DataBase) with a HTTP Status of 404 (Not Found)', (done) => {
    request(api).delete('/students/Kelvin1324dgj').expect(404, done)
  })

  it('responds to a DELETE request of the "/students/Simon" endpoint with a HTTP Status of 200 (OK), after creating the user', (done) => {
    const testData = {
      name: 'Melvin2468qet',
      subject: 'History',
      grade: 'Excellent',
    }

    request(api)
      .post('/students')
      .send(testData)
      .expect(201)
      .expect(testData, done)

    request(api).delete('/students/Melvin2468qet').expect(200, done)
  })

  it('responds to a PUT request of the "/students/Simon" endpoint with a HTTP Status of 200 (OK)', (done) => {
    const testData = {
      name: 'Arthur2468adgj',
      subject: 'Geography',
      grade: 'Sufficient',
    }

    request(api)
      .put('/students/Simon')
      .send(testData)
      .expect(200)
      .expect(testData, done)
  })

  it('responds to a PUT request of the "/students/Kevin246zcb" endpoint (student not in the Database) with a HTTP Status of 404 (NOT FOUND)', (done) => {
    const testData = {
      name: 'Arthur2468adgj',
      subject: 'Geography',
      grade: 'Sufficient',
    }

    request(api)
      .put('/students/Kevin246zcb')
      .send(testData)
      .expect(404)
      .expect({ error: 'That student is not in our Database!' }, done)
  })
})
