const { useEffect, useState } = React;

function App() {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(true);

    // Load from localStorage, else from tasks.json
    useEffect(() => {
        const local = localStorage.getItem("e8_tasks");
        if (local) {
            try {
                setTasks(JSON.parse(local));
                setLoading(false);
                return;
            } catch {}
        }
        fetch("./tasks.json")
            .then(r => r.json())
            .then(data => setTasks(data))
            .finally(() => setLoading(false));
    }, []);

    // Persist to localStorage on change
    useEffect(() => {
        localStorage.setItem("e8_tasks", JSON.stringify(tasks));
    }, [tasks]);

    function addTask(e) {
        e.preventDefault();
        const trimmed = title.trim();
        if (!trimmed) return;
        const newTask = { id: Date.now(), title: trimmed, completed: false };
        setTasks(prev => [newTask, ...prev]);
        setTitle("");
    }

    function toggleTask(id) {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    }

    function deleteTask(id) {
        setTasks(prev => prev.filter(t => t.id !== id));
    }

    function downloadJson() {
        const blob = new Blob([JSON.stringify(tasks, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "tasks.json";
        a.click();
        URL.revokeObjectURL(url);
    }

    return (
        <div className="bg-white rounded shadow p-4">
            <form onSubmit={addTask} className="flex gap-2 mb-4">
                <input
                    className="flex-1 border rounded px-3 py-2"
                    placeholder="Add a task..."
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                />
                <button className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
            </form>

            <div className="flex justify-between items-center mb-2">
                <h2 className="font-semibold">Tasks</h2>
                <button onClick={downloadJson} className="text-sm text-blue-600 underline">Download JSON</button>
            </div>

            {loading ? (
                <p className="text-gray-500">Loading...</p>
            ) : tasks.length === 0 ? (
                <p className="text-gray-500 italic">No tasks found</p>
            ) : (
                <ul className="divide-y">
                    {tasks.map(task => (
                        <li key={task.id} className="flex items-center justify-between py-2">
                            <label className="flex items-center gap-2">
                                <input type="checkbox" checked={task.completed} onChange={() => toggleTask(task.id)} />
                                <span className={task.completed ? "line-through text-gray-500" : ""}>{task.title}</span>
                            </label>
                            <button onClick={() => deleteTask(task.id)} className="text-red-600 text-sm">Delete</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);


