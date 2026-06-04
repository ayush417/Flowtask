import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from './api'

function Dashboard() {
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState('')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const user = JSON.parse(localStorage.getItem('user'))

  // Fetch tasks when page loads
  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const response = await API.get('/tasks')
      setTasks(response.data)
    } catch (error) {
      console.log('Error fetching tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const addTask = async () => {
    if (newTask.trim() === '') return
    try {
      const response = await API.post('/tasks', { title: newTask })
      setTasks([...tasks, response.data])
      setNewTask('')
    } catch (error) {
      console.log('Error adding task:', error)
    }
  }

  const toggleTask = async (id, completed) => {
    try {
      const response = await API.put(`/tasks/${id}`, { completed: !completed })
      setTasks(tasks.map(task => task.id === id ? response.data : task))
    } catch (error) {
      console.log('Error updating task:', error)
    }
  }

  const deleteTask = async (id) => {
    try {
      await API.delete(`/tasks/${id}`)
      setTasks(tasks.filter(task => task.id !== id))
    } catch (error) {
      console.log('Error deleting task:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading tasks...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">FlowTask</h1>
        <div className="flex items-center gap-4">
          <span>Hi, {user?.name}</span>
          <button
            onClick={handleLogout}
            className="bg-white text-blue-600 px-4 py-1 rounded hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto mt-10 px-4">
        <h2 className="text-2xl font-bold text-gray-700 mb-6">My Tasks</h2>

        {/* Add Task */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Add a new task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={addTask}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add
          </button>
        </div>

        {/* Task List */}
        {tasks.map(task => (
          <div
            key={task.id}
            className="bg-white p-4 rounded-lg shadow mb-3 flex justify-between items-center"
          >
            <span className={task.completed ? 'line-through text-gray-400' : 'text-gray-700'}>
              {task.title}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => toggleTask(task.id, task.completed)}
                className={`px-3 py-1 rounded text-white text-sm ${task.completed ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'}`}
              >
                {task.completed ? 'Undo' : 'Complete'}
              </button>
              <button
                onClick={() => deleteTask(task.id)}
                className="px-3 py-1 rounded text-white text-sm bg-red-500 hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {tasks.length === 0 &&
          <p className="text-center text-gray-400 mt-10">No tasks yet. Add one above!</p>
        }

      </div>
    </div>
  )
}

export default Dashboard