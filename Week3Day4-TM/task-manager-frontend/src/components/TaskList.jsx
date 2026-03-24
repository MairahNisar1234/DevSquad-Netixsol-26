import { useState } from "react";

export const TaskList = ({ tasks, onDelete, onUpdate }) => {
  const [editingId, setEditingId] = useState(null);
  // 1. Include 'completed' in your form state
  const [editForm, setEditForm] = useState({ title: '', description: '', completed: false });

  const startEdit = (task) => {
    setEditingId(task._id);
    setEditForm({ title: task.title, description: task.description, completed: task.completed });
  };

  const handleSave = async (id) => {
    await onUpdate(id, editForm);
    setEditingId(null);
  };

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div key={task._id} className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
          {editingId === task._id ? (
            <div className="space-y-2">
              <input className="w-full p-2 border rounded" value={editForm.title} onChange={(e) => setEditForm({...editForm, title: e.target.value})} />
              <input className="w-full p-2 border rounded" value={editForm.description} onChange={(e) => setEditForm({...editForm, description: e.target.value})} />
              
              {/* Checkbox while editing */}
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={editForm.completed} onChange={(e) => setEditForm({...editForm, completed: e.target.checked})} />
                Completed
              </label>
              
              <button onClick={() => handleSave(task._id)} className="bg-green-500 text-white px-3 py-1 rounded">Save</button>
            </div>
          ) : (
            <div>
              <h3 className={`text-xl font-bold ${task.completed ? 'line-through text-slate-400' : ''}`}>{task.title}</h3>
              <p className="text-slate-600">{task.description}</p>
              
              {/* Toggle while viewing */}
              <div className="mt-2 flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={task.completed}
                    onChange={() => onUpdate(task._id, { ...task, completed: !task.completed })}
                  />
                  <span>{task.completed ? "Completed" : "Mark Complete"}</span>
                </label>
                
                <div className="flex gap-2">
                  <button onClick={() => startEdit(task)} className="text-blue-500">Edit</button>
                  <button onClick={() => onDelete(task._id)} className="text-red-500">Delete</button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};