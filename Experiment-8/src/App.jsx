import React, { useEffect, useState } from 'react'

function TaskForm({ title, setTitle, onAdd }) {
  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return
    onAdd(trimmed)
    setTitle('')
  }
  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <input className="flex-1 border rounded px-3 py-2" placeholder="Add a task..." value={title} onChange={(e) => setTitle(e.target.value)} />
      <button className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
    </form>
  )
}

function TaskItem({ task, onToggle, onDelete }) {
  return (
    <li className="flex items-center justify-between py-2">
      <label className="flex items-center gap-2">
        <input type="checkbox" checked={task.completed} onChange={() => onToggle(task.id)} />
        <span className={task.completed ? 'line-through text-gray-500' : ''}>{task.title}</span>
      </label>
      <button onClick={() => onDelete(task.id)} className="text-red-600 text-sm">Delete</button>
    </li>
  )
}

function TaskList({ tasks, onToggle, onDelete }) {
  if (tasks.length === 0) return <p className="text-gray-500 italic">No tasks found</p>
  return (
    <ul className="divide-y">
      {tasks.map((t) => (
        <TaskItem key={t.id} task={t} onToggle={onToggle} onDelete={onDelete} />
      ))}
    </ul>
  )
}

export default function App() {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const local = localStorage.getItem('e8_tasks')
    if (local) {
      try {
        setTasks(JSON.parse(local))
        setLoading(false)
        return
      } catch {}
    }
    fetch('/tasks.json').then((r) => r.json()).then((data) => setTasks(data)).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    localStorage.setItem('e8_tasks', JSON.stringify(tasks))
  }, [tasks])

  function addTask(text) {
    setTasks((prev) => [{ id: Date.now(), title: text, completed: false }, ...prev])
  }
  function toggleTask(id) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)))
  }
  function deleteTask(id) {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  function downloadJson() {
    const blob = new Blob([JSON.stringify(tasks, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'tasks.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">React To-Do List</h1>
      <div className="bg-white rounded shadow p-4">
        <TaskForm title={title} setTitle={setTitle} onAdd={addTask} />
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-semibold">Tasks</h2>
          <button onClick={downloadJson} className="text-sm text-blue-600 underline">Download JSON</button>
        </div>
        {loading ? <p className="text-gray-500">Loading...</p> : <TaskList tasks={tasks} onToggle={toggleTask} onDelete={deleteTask} />}
      </div>
      <p className="text-xs text-gray-500 mt-6">Experiment 8: React + Vite + Tailwind</p>
    </div>
  )
}


