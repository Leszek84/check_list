import axios from 'axios';

const api = axios.create({
  // Musisz mieć tutaj 8081, bo na tym porcie wystawiłeś Backend w Dockerze
  baseURL: 'http://localhost:8081/api', 
});

export default api;