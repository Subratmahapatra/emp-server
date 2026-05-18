const express = require('express')
const cors = require('cors')
const fs = require('fs')
const app = express()

app.use(cors())
app.use(express.json())

// Read db.json
const getDB = () => JSON.parse(fs.readFileSync('./db.json', 'utf8'))
const saveDB = (data) => fs.writeFileSync('./db.json', JSON.stringify(data, null, 2))

// GET all employees
app.get('/employees', (req, res) => {
  const db = getDB()
  res.json(db.employees)
})

// POST add employee
app.post('/employees', (req, res) => {
  const db = getDB()
  const newEmployee = { id: Date.now(), ...req.body }
  db.employees.push(newEmployee)
  saveDB(db)
  res.json(newEmployee)
})

// PUT update employee
app.put('/employees/:id', (req, res) => {
  const db = getDB()
  const id = Number(req.params.id)
  db.employees = db.employees.map(e => e.id === id ? { ...e, ...req.body } : e)
  saveDB(db)
  res.json(db.employees.find(e => e.id === id))
})

// DELETE employee
app.delete('/employees/:id', (req, res) => {
  const db = getDB()
  const id = Number(req.params.id)
  db.employees = db.employees.filter(e => e.id !== id)
  saveDB(db)
  res.json({ message: 'Deleted successfully' })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})