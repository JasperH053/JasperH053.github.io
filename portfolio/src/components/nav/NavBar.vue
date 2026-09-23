<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <nav class="nav">
    <RouterLink to="/home" class="cloud home" active-class="active-class-1">Enschede</RouterLink>
    <RouterLink to="/about" class="cloud about" active-class="active-class-2">User</RouterLink>
    <RouterLink to="/projects" class="cloud projects" active-class="active-class-3">Log</RouterLink>
  </nav>
</template>

<style scoped>
.nav {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: calc(var(--pixel) * 20);
  padding: calc(var(--pixel) * 6) 16px;
}

.cloud {
  position: relative;
  isolation: isolate;
  display: inline-grid;
  place-items: center;
  width: calc(var(--w) * var(--pixel));
  height: calc(var(--h) * var(--pixel));
  padding-top: calc(var(--pixel) * 3);
  color: var(--text);
  font-size: 22px;
  line-height: 1;
  text-decoration: none;
}

.cloud::before {
  content: '';
  position: absolute;
  z-index: -1;
  top: 50%;
  left: 50%;
  translate: -50% -50%;
  width: calc(var(--img-w, var(--w)) * var(--pixel));
  height: calc(var(--img-h, var(--h)) * var(--pixel));
  background: var(--img) center / 100% 100% no-repeat;
  image-rendering: pixelated;
  transition: all 100ms;
}

.cloud:focus-visible {
  outline: var(--pixel) solid var(--text);
  outline-offset: var(--pixel);
}

.home {
  --w: 30;
  --h: 16;
  --img: url('@/assets/clouds/home.png');
}

.about {
  --w: 33;
  --h: 16;
  --img: url('@/assets/clouds/about.png');
}


.projects {
  --w: 42;
  --h: 16;
  --img: url('@/assets/clouds/projects.png');
}

.active-class-1 {
  --img: url('@/assets/clouds/homeHover.png');
  --img-w: 48;
  --img-h: 24;
}

.active-class-2 {
  --img: url('@/assets/clouds/aboutHover.png');
  --img-w: 48;
  --img-h: 24;
}

.active-class-3 {
  --img: url('@/assets/clouds/projectsHover.png');
  --img-w: 48;
  --img-h: 24;
}

</style>
