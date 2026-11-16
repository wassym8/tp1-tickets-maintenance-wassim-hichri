import axios from 'axios'

// Client Axios avec une URL de base : on n'écrit plus l'adresse complète à chaque appel
const api = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 5000,
})

// GET /tickets : renvoie le tableau de tickets
export async function getTickets() {
  const response = await api.get('/tickets')
  return response.data
}
