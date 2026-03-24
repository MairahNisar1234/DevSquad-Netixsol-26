import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // 1. Import useNavigate
import api from "../services/api";
import TaskForm from "../components/TaskForm";
import { TaskList } from "../components/TaskList.jsx"; // Note the braces!

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate(); // 2. Initialize it here

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleUpdate = async (id, updatedData) => {
    try {
      await api.put(`/tasks/${id}`, updatedData);
      fetchTasks();
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const deleteTask = async (id) => {
    await api.delete(`/tasks/${id}`);
    fetchTasks();
  };

  // 3. Move this inside the component
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    // 4. Fixed typo: bg-gradient-to-br
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        
        {/* Floating Logout Button (Top Right) */}
        <div className="flex justify-end mb-4">
          <button 
            onClick={handleLogout}
            className="px-6 py-2 bg-white text-rose-500 font-bold rounded-xl shadow-md hover:bg-rose-50 transition"
          >
            Logout
          </button>
        </div>

        <header className="text-center mb-12">
          <h1 className="text-6xl font-black text-slate-800 tracking-tight">
            Task <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-500">Master</span>
            <span className="ml-4 inline-flex items-center justify-center bg-white shadow-lg text-blue-600 text-2xl h-12 w-12 rounded-2xl font-bold">
              {tasks.length}
            </span>
          </h1>
        </header>

        <div className="space-y-10">
          <section>
            <TaskForm onTaskAdded={fetchTasks} />
          </section>

          <section>
            <TaskList tasks={tasks} onDelete={deleteTask} onUpdate={handleUpdate} />
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;