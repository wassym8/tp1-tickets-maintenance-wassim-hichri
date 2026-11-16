<script setup>
import { ref, computed, onMounted } from 'vue'
import { getTickets } from '../services/ticketService'

// --- État réactif ---
const tickets = ref([])
const loading = ref(true)
const error = ref('')
const recherche = ref('')
const filtreStatut = ref('')
const filtrePriorite = ref('')

const statuts = ['Ouvert', 'En cours', 'Résolu']
const priorites = ['Haute', 'Moyenne', 'Basse']

// --- Chargement des données ---
async function charger() {
  loading.value = true
  error.value = ''
  try {
    tickets.value = await getTickets()
  } catch (e) {
    error.value = e.response
      ? `Le serveur a répondu avec une erreur (code ${e.response.status}).`
      : "Impossible de joindre l'API. Vérifiez que JSON Server est démarré : npx json-server db.json --port 3000"
  } finally {
    loading.value = false
  }
}
onMounted(charger)

// --- Recherche + filtres combinés ---
const ticketsFiltres = computed(() => {
  const terme = recherche.value.trim().toLowerCase()
  return tickets.value.filter((t) => {
    const okTitre = !terme || t.titre.toLowerCase().includes(terme)
    const okStatut = !filtreStatut.value || t.statut === filtreStatut.value
    const okPriorite = !filtrePriorite.value || t.priorite === filtrePriorite.value
    return okTitre && okStatut && okPriorite
  })
})

const nombreVisibles = computed(() => ticketsFiltres.value.length)

function reinitialiser() {
  recherche.value = ''
  filtreStatut.value = ''
  filtrePriorite.value = ''
}

function formaterDate(iso) {
  return new Date(iso).toLocaleDateString('fr-FR')
}

// Badges : couleur + symbole + texte (l'information ne repose pas sur la couleur seule)
const classePriorite = { Haute: 'haute', Moyenne: 'moyenne', Basse: 'basse' }
const symbolePriorite = { Haute: '▲', Moyenne: '■', Basse: '▼' }
const classeStatut = { Ouvert: 'ouvert', 'En cours': 'encours', 'Résolu': 'resolu' }
const symboleStatut = { Ouvert: '○', 'En cours': '◆', 'Résolu': '●' }
</script>

<template>
  <section aria-labelledby="titre-liste">
    <h2 id="titre-liste" class="sr-only">Liste des tickets</h2>

    <!-- Chargement -->
    <p v-if="loading" class="message" role="status">Chargement…</p>

    <!-- Erreur -->
    <div v-else-if="error" class="message erreur" role="alert">
      <p><strong>Erreur :</strong> {{ error }}</p>
      <button type="button" @click="charger">Réessayer</button>
    </div>

    <!-- Contenu -->
    <template v-else>
      <form class="filtres" @submit.prevent>
        <div class="champ champ-recherche">
          <label for="recherche">Rechercher par titre</label>
          <input id="recherche" v-model="recherche" type="search" placeholder="Ex. : imprimante" />
        </div>
        <div class="champ">
          <label for="statut">Statut</label>
          <select id="statut" v-model="filtreStatut">
            <option value="">Tous</option>
            <option v-for="s in statuts" :key="s" :value="s">{{ s }}</option>
          </select>
        </div>
        <div class="champ">
          <label for="priorite">Priorité</label>
          <select id="priorite" v-model="filtrePriorite">
            <option value="">Toutes</option>
            <option v-for="p in priorites" :key="p" :value="p">{{ p }}</option>
          </select>
        </div>
        <button type="button" class="secondaire" @click="reinitialiser">Réinitialiser</button>
      </form>

      <p class="compteur" aria-live="polite">
        {{ nombreVisibles }} ticket{{ nombreVisibles > 1 ? 's' : '' }} affiché{{ nombreVisibles > 1 ? 's' : '' }}
        sur {{ tickets.length }}
      </p>

      <div v-if="nombreVisibles === 0" class="message vide">
        <p>Aucun ticket ne correspond à votre recherche.</p>
        <button type="button" class="secondaire" @click="reinitialiser">Effacer les filtres</button>
      </div>

      <div v-else class="tableau-wrap">
        <table>
          <caption class="sr-only">Tickets de maintenance</caption>
          <thead>
            <tr>
              <th scope="col">Titre</th>
              <th scope="col">Demandeur</th>
              <th scope="col">Priorité</th>
              <th scope="col">Statut</th>
              <th scope="col">Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="t in ticketsFiltres" :key="t.id">
              <td>
                <strong>{{ t.titre }}</strong>
                <span class="desc">{{ t.description }}</span>
              </td>
              <td>{{ t.demandeur }}</td>
              <td>
                <span class="badge" :class="classePriorite[t.priorite]">
                  <span aria-hidden="true">{{ symbolePriorite[t.priorite] }}</span> {{ t.priorite }}
                </span>
              </td>
              <td>
                <span class="badge" :class="classeStatut[t.statut]">
                  <span aria-hidden="true">{{ symboleStatut[t.statut] }}</span> {{ t.statut }}
                </span>
              </td>
              <td>{{ formaterDate(t.dateCreation) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </section>
</template>

<style scoped>
.sr-only {
  position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0;
  overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0;
}

.filtres {
  display: flex; flex-wrap: wrap; gap: 1rem; align-items: flex-end;
  padding: 1rem; background: var(--surface);
  border: 1px solid var(--bordure); border-radius: 8px;
}
.champ { display: flex; flex-direction: column; gap: .25rem; }
.champ-recherche { flex: 1 1 220px; }
label { font-size: .875rem; font-weight: 600; }
input, select, button {
  font: inherit; padding: .5rem .65rem; border-radius: 6px;
  border: 1px solid #8a9c9a; background: #fff; color: var(--texte);
}
button {
  background: var(--accent); border-color: var(--accent); color: #fff; cursor: pointer;
}
button.secondaire { background: #fff; color: var(--accent); }
input:focus-visible, select:focus-visible, button:focus-visible {
  outline: 3px solid #e0a100; outline-offset: 2px;
}

.compteur { margin: 1rem 0 .5rem; color: var(--texte-doux); }

.message {
  padding: 1rem 1.25rem; border-radius: 8px;
  background: var(--surface); border: 1px solid var(--bordure);
}
.message p { margin: 0 0 .5rem; }
.message button { margin-top: .25rem; }
.erreur { background: #fdecea; border-color: #b3261e; color: #7a1712; }
.erreur button { background: #b3261e; border-color: #b3261e; }

.tableau-wrap {
  overflow-x: auto; background: var(--surface);
  border: 1px solid var(--bordure); border-radius: 8px;
}
table { width: 100%; border-collapse: collapse; min-width: 640px; }
th, td { text-align: left; padding: .75rem 1rem; vertical-align: top; }
thead th { background: #e8efee; font-size: .875rem; }
tbody tr + tr td { border-top: 1px solid var(--bordure); }
.desc { display: block; font-size: .875rem; color: var(--texte-doux); }

.badge {
  display: inline-block; padding: .15rem .6rem; border-radius: 999px;
  font-size: .85rem; font-weight: 600; border: 1px solid; white-space: nowrap;
}
.haute   { background: #fde7e4; color: #8c1d14; border-color: #b3261e; }
.moyenne { background: #fff1cc; color: #6b4a00; border-color: #b07a00; }
.basse   { background: #e3f1e5; color: #1d5a2a; border-color: #2e7d3f; }
.ouvert  { background: #e3edfb; color: #164a8a; border-color: #2a65b8; }
.encours { background: #efe6fa; color: #4a2a82; border-color: #6d44b0; }
.resolu  { background: #e6ebea; color: #35504d; border-color: #5f7a77; }
</style>
