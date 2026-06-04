const express = require('express')
const cors = require('cors')
require('dotenv').config()
const pool = require('./src/db')
const authRoutes = require('./src/routes/authRoutes')
const taskRoutes = require('./src/routes/taskRoutes')

const app = express()

app.use(cors())
app.use(express.json())

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.log('Database connection failed:', err)
  } else {
    console.log('Database connected at:', res.rows[0].now)
  }
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/tasks', taskRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'FlowTask API is running!' })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})