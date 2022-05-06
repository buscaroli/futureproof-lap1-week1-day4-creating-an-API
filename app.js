const express = require('express')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(cors())

class StudentNotFoundError extends Error {
  constructor() {
    super('That student is not in our Database!')
    this.name = 'StudentNotFoundError'
  }
}

const students = [
  { id: 1, name: 'Matt', subject: 'Math', grade: 'good' },
  { id: 2, name: 'Simon', subject: 'History', grade: 'excellent' },
]

app.get('/', (req, res) => {
  res.send("Welcome to the Student's Page!")
})

app.get('/students', (req, res) => {
  res.json(students)
})

app.get('/students/:name', (req, res) => {
  try {
    const studentName = req.params.name
    console.log(studentName)

    // Searching for the student by name
    // As Array.prototype.filter returns an array I access the first element
    const foundStudent = students.filter(
      (student) =>
        student.name.toLocaleLowerCase() === studentName.toLowerCase()
    )[0]
    console.log('foundStudent', foundStudent)

    if (!foundStudent) {
      throw new StudentNotFoundError()
    } else {
      res.send({
        name: foundStudent.name,
        subject: foundStudent.subject,
        grade: foundStudent.grade,
      })
    }
  } catch (err) {
    res.status(404).send({ error: err.message })
  }
})

module.exports = app
