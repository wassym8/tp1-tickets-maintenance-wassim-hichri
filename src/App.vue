<script setup>
import TicketList from './components/TicketList.vue'
</script>

<template>
  <main class="page">
    <header class="page-header">
      <h1>Tickets de maintenance</h1>
      <p>Suivi des incidents déclarés par les utilisateurs.</p>
    </header>
    <TicketList />
  </main>
</template>

<style>
:root {
  --fond: #f5f7f6;
  --surface: #ffffff;
  --texte: #1c2b2a;
  --texte-doux: #4d5f5d;
  --bordure: #cfd9d7;
  --accent: #0f5c57;
  color-scheme: light;
}
* { box-sizing: border-box; }
body {
  margin: 0;
  background: var(--fond);
  color: var(--texte);
  font-family: 'Segoe UI', system-ui, -apple-system, Roboto, sans-serif;
  line-height: 1.5;
}
.page { max-width: 960px; margin: 0 auto; padding: 2rem 1rem 3rem; }
.page-header h1 { margin: 0; font-size: 1.75rem; }
.page-header p { margin: .25rem 0 1.5rem; color: var(--texte-doux); }
</style>
