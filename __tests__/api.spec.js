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

  it('responds to a GET request of the "/students/Kevin" endpoint (Kevin is not present on the DatabAse) with a HTML Status of 404 (Not Allowed)', (done) => {
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

  it('responds to a DELETE request of the "/students/Matt" endpoint with a HTTP Status of 404 (Not Found)', (done) => {
    request(api).delete('/students/Matt').expect(204, done)
  })

  it('responds to a DELETE request of the "/students/Simon" endpoint with a HTTP Status of 204 (Deleted)', (done) => {
    const testData = [
      {
        name: 'Simon',
        subject: 'Math',
        grade: 'sufficient',
      },
    ]

    request(api).delete('/students/Simon').expect(204, done)
  })
})
