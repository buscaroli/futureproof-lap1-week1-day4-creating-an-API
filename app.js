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
  { name: 'Matt', subject: 'Math', grade: 'good' },
  { name: 'Simon', subject: 'History', grade: 'excellent' },
]

app.get('/', (req, res) => {
  res.send("Welcome to the Student's Page!")
})

app.get('/students', (req, res) => {
  if (students.length === 0) {
    res.status(404).send({ error: 'No students in the Database.' })
  }
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

app.post('/students', (req, res) => {
  const newStudent = req.body

  const foundStudentIndex = students.findIndex(
    (student) =>
      student.name.toLocaleLowerCase() === newStudent.name.toLowerCase()
  )
  if (foundStudentIndex !== -1) {
    res.status(405).send({ message: 'Another user with the same name exists' })
  } else {
    students.push(newStudent)
    res.status(201).send(newStudent)
  }
})

app.delete('/students/:name', (req, res) => {
  try {
    const studentName = req.params.name
    const foundStudentIndex = students.findIndex(
      (student) =>
        student.name.toLocaleLowerCase() === studentName.toLowerCase()
    )
    console.log('delete - foundStudent', foundStudentIndex)

    if (foundStudentIndex === -1) {
      throw new StudentNotFoundError('We could not delete that student')
    } else {
      students.splice(foundStudentIndex, 1)
      let message = `${studentName} has been deleted.`
      console.log(message)
      res.status(204).send({ message })
    }
  } catch (err) {
    res.status(404).send({ error: err.message })
  }
})

module.exports = app
