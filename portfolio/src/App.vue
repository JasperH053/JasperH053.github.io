<template>
  <header>
    <nav>
      <RouterLink to="/">Overview</RouterLink>
      <RouterLink to="/about">About</RouterLink>
    </nav>
  </header>

  <main>
    <RouterView />

    <NCanvas/>

  </main>
</template>

<script setup lang="ts">
  import { RouterLink, RouterView } from 'vue-router'
  import NCanvas from '@/views/CanvasView.vue'

  import '@/assets/main.scss'

</script>


<style scoped lang="scss">

p {
  text-align: center;
}

header {
  position: sticky;
  top: 0;
  z-index: 100;
}

nav {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  padding: 1.2rem 2rem;
  box-shadow: rgba(33, 35, 38, 0.1) 0px 10px 10px -10px;
  margin: 0 auto;
}

nav a {
  text-decoration: none;
  color: #ffffff; 
  font-weight: 600;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: all 0.2s ease-in-out;
}

nav a:hover {
  background-color: #f3f4f6;
  color: #111827; 
}

/* 
  Vue Router Magie: Vue voegt AUTOMATISCH de class 'router-link-active' 
  toe aan de link van de pagina waar je nu bent!
*/
nav a.router-link-active {
  color: #3b82f6;
  background-color: #eff6ff;
}
</style>
