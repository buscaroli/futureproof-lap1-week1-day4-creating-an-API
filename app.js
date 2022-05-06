const express = require('express')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(cors())

// Error Handling
class StudentNotFoundError extends Error {
  constructor() {
    super('That student is not in our Database!')
    this.name = 'StudentNotFoundError'
  }
}

class StudentExistsError extends Error {
  constructor() {
    super('A student with that name already exists')
    this.name = 'StudentExistsError'
  }
}

// Sample Data
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

  try {
    if (foundStudentIndex !== -1) {
      throw new StudentExistsError()
    } else {
      students.push(newStudent)
      res.status(201).send(newStudent)
    }
  } catch (err) {
    res.status(405).send({ error: err.message })
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
      throw new StudentNotFoundError()
    } else {
      students.splice(foundStudentIndex, 1)
      let message = `${studentName} has been deleted.`
      console.log(message)
      res.status(200).send({ message })
    }
  } catch (err) {
    res.status(404).send({ error: err.message })
  }
})

app.put('/students/:name', (req, res) => {
  const studentNameToMatch = req.params.name
  let newData = req.body

  try {
    let studentIndex = students.findIndex(
      (student) => student.name === studentNameToMatch
    )

    if (studentIndex === -1) {
      throw new StudentNotFoundError()
    } else {
      students.splice(studentIndex, 1, newData)
      res.status(200).send(newData)
    }
  } catch (err) {
    res.status(404).send({ error: err.message })
  }
})

module.exports = app
