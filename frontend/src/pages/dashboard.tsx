import React, { useEffect, useState } from 'react';
import api from '../services/api';
// Definicja typu dla zadań (zgodna z modelem w .NET i DTO)
interface CloudTask {
  id: number;
  name: string;
  isCompleted: boolean;
}
const Dashboard = () => {
  // Stan dla listy zadań, błędów, stanu ładowania oraz nazwy nowego zadania
  const [items, setItems] = useState<CloudTask[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [newTaskName, setNewTaskName] = useState("");

  const fetchTasks = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await api.get<CloudTask[]>('/tasks');
      setItems(response.data);
    } catch (err) {
      console.error("Szczegóły błędu:", err);
      setError("Błąd połączenia z API. Sprawdź, czy backend działa.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchTasks();
  }, []);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = newTaskName.trim();
    if (!trimmedName) {
      setError("Nazwa zadania nie może być pusta.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      await api.post('/tasks', { name: trimmedName });
      setNewTaskName("");
      await fetchTasks();
    } catch (err) {
      console.error("Błąd podczas dodawania zadania:", err);
      setError("Nie udało się dodać zadania. Spróbuj ponownie.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCompletion = async (task: CloudTask) => {
    setError("");
    setIsLoading(true);

    try {
      await api.put(`/tasks/${task.id}`, {
        ...task,
        isCompleted: !task.isCompleted,
      });
      await fetchTasks();
    } catch (err) {
      console.error("Błąd podczas aktualizacji zadania:", err);
      setError("Nie udało się zaktualizować zadania. Spróbuj ponownie.");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTask = async (id: number) => {
    setError("");
    setIsLoading(true);

    try {
      await api.delete(`/tasks/${id}`);
      await fetchTasks();
    } catch (err) {
      console.error("Błąd podczas usuwania zadania:", err);
      setError("Nie udało się usunąć zadania. Spróbuj ponownie.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
      <h1>☁️ Cloud App Dashboard</h1>
      {/* Komunikat o błędzie */}
      {error && (
        <div style={{ background: '#fff3cd', color: '#856404', padding: '10px', borderRadius: '5px', margin: '20px auto', maxWidth: '400px' }}>
          {error}
        </div>
      )}

      {/* Formularz dodawania zadań */}
      <form onSubmit={handleAddTask} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Wpisz nowe zadanie..."
          value={newTaskName}
          onChange={(e) => setNewTaskName(e.target.value)}
          style={{ padding: '10px', width: '250px', borderRadius: '4px', border: '1px solid #ccc' }}
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !newTaskName.trim()}
          style={{
            marginLeft: '10px',
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            opacity: isLoading ? 0.6 : 1,
          }}
        >
          {isLoading ? 'Ładowanie...' : 'Dodaj Zadanie'}
        </button>
      </form>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {isLoading && items.length === 0 && <p>Ładowanie zadań...</p>}
        {!isLoading && items.length === 0 && !error && <p>Brak zadań. Czas coś zaplanować!</p>}

        <ul style={{ listStyle: 'none', padding: 0 }}>
          {items.map((item) => (
            <li
              key={item.id}
              style={{
                background: '#f8f9fa',
                margin: '5px',
                padding: '10px 20px',
                borderRadius: '8px',
                borderLeft: item.isCompleted ? '5px solid #28a745' : '5px solid #6c757d',
                width: '350px',
                textAlign: 'left',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span>
                <strong>{item.name}</strong> {item.isCompleted ? '✅' : '⏳'}
              </span>

              <span>
                <button
                  onClick={() => void toggleCompletion(item)}
                  disabled={isLoading}
                  style={{
                    marginRight: '6px',
                    padding: '5px 10px',
                    backgroundColor: item.isCompleted ? '#6c757d' : '#28a745',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  {item.isCompleted ? 'Przywróć' : 'Zakończ'}
                </button>
                <button
                  onClick={() => void deleteTask(item.id)}
                  disabled={isLoading}
                  style={{
                    padding: '5px 10px',
                    backgroundColor: '#dc3545',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Usuń
                </button>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default Dashboard;