const express = require('express')
const cors = require('cors')
require('dotenv').config()
const pool = require('./src/db')
const authRoutes = require('./src/routes/authroutes')
const taskRoutes = require('./src/routes/taskroutes')

const app = express()

// Fix CORS
app.use(cors({
  origin: 'https://flowtask-xi-henna.vercel.app',
  credentials: true
}))

app.use(express.json())

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.log('Database connection failed:', err)
  } else {
    console.log('Database connected at:', res.rows[0].now)
  }
})

app.use('/api/auth', authRoutes)
app.use('/api/tasks', taskRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'FlowTask API is running!' })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})