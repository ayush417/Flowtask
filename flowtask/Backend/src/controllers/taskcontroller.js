const pool = require('../db')

// Get all tasks for logged in user
const getTasks = async (req, res) => {
  try {
    const tasks = await pool.query(
      'SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    )
    res.json(tasks.rows)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// Create a new task
const createTask = async (req, res) => {
  const { title } = req.body
  try {
    const newTask = await pool.query(
      'INSERT INTO tasks (title, user_id) VALUES ($1, $2) RETURNING *',
      [title, req.user.id]
    )
    res.status(201).json(newTask.rows[0])
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// Update task (complete/incomplete)
const updateTask = async (req, res) => {
  const { id } = req.params
  const { completed } = req.body
  try {
    const updatedTask = await pool.query(
      'UPDATE tasks SET completed = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
      [completed, id, req.user.id]
    )
    res.json(updatedTask.rows[0])
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// Delete task
const deleteTask = async (req, res) => {
  const { id } = req.params
  try {
    await pool.query(
      'DELETE FROM tasks WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    )
    res.json({ message: 'Task deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

module.exports = { getTasks, createTask, updateTask, deleteTask }