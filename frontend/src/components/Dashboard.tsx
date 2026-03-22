import React, { useEffect, useState } from 'react';
import api from '../services/api';

interface CloudTask {
  id: number;
  name: string;
  isCompleted: boolean;
}

const Dashboard = () => {
  const [items, setItems] = useState<CloudTask[]>([]);
  const [error, setError] = useState("");
  const [newTaskName, setNewTaskName] = useState(""); 

  const fetchTasks = () => {
    api.get('/tasks')
      .then((res: any) => {
        setItems(res.data);
      })
      .catch(() => {
        // Usunięto nieużywaną zmienną 'err', aby przejść build TS
        setError("Błąd połączenia z API.");
      });
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskName.trim()) return;
    try {
      await api.post('/tasks', { name: newTaskName });
      setNewTaskName("");
      fetchTasks();
    } catch {
      // Usunięto 'err' również tutaj
      setError("Nie udało się dodać zadania.");
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#2c3e50' }}>☁️ Cloud App Dashboard</h1>
      
      {error && (
        <div style={{ 
          background: '#ffeded', 
          color: '#d9534f', 
          padding: '10px', 
          borderRadius: '5px', 
          marginBottom: '15px',
          display: 'inline-block'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleAddTask} style={{ marginBottom: '30px' }}>
        <input 
          type="text" 
          value={newTaskName}
          onChange={(e) => setNewTaskName(e.target.value)}
          placeholder="Wpisz nową notatkę..."
          style={{ 
            padding: '12px', 
            width: '250px', 
            borderRadius: '4px', 
            border: '1px solid #ccc',
            fontSize: '16px'
          }}
        />
        <button 
          type="submit" 
          style={{ 
            padding: '12px 20px', 
            marginLeft: '10px', 
            background: '#3498db', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Dodaj zadanie
        </button>
      </form>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <ul style={{ listStyle: 'none', padding: 0, width: '100%', maxWidth: '400px' }}>
          {items.length === 0 && !error && <p>Brak zadań na liście. Dodaj coś!</p>}
          {items.map((item) => (
            <li 
              key={item.id} 
              style={{ 
                background: '#fff', 
                borderBottom: '1px solid #eee',
                margin: '5px 0', 
                padding: '15px', 
                borderRadius: '8px', 
                display: 'flex', 
                justifyContent: 'space-between',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              <span style={{ fontSize: '18px' }}>{item.name}</span>
              <span>{item.isCompleted ? '✅' : '⏳'}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;