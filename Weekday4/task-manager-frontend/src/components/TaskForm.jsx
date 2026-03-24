import { useState } from "react";
import api from "../services/api";

const TaskForm = ({ onTaskAdded }) => {
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    completed: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // This sends the full object to your backend /api/tasks route
      await api.post("/tasks", taskData);
      
      // Reset form
      setTaskData({ title: '', description: '', completed: false });
      
      // Refresh the list
      onTaskAdded();
    } catch (err) {
      console.error("Failed to add task", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 space-y-4">
      <input
        placeholder="Task Title"
        className="w-full p-3 border rounded-lg"
        value={taskData.title}
        onChange={(e) => setTaskData({...taskData, title: e.target.value})}
      />
      <textarea
        placeholder="Description"
        className="w-full p-3 border rounded-lg"
        value={taskData.description}
        onChange={(e) => setTaskData({...taskData, description: e.target.value})}
      />
      <label className="flex items-center gap-2">
        <input 
          type="checkbox" 
          checked={taskData.completed}
          onChange={(e) => setTaskData({...taskData, completed: e.target.checked})}
        />
        Mark as completed
      </label>
      <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
        Add Task
      </button>
    </form>
  );
};

export default TaskForm;