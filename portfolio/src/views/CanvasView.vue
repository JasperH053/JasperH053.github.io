<template>
  <canvas
    ref="myCanvas"
    @mousedown="tekenPixel"
    class="pixel-canvas"
  ></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

import achtergrondImg from '@/assets/images/Mountain-Dusk.png'

const myCanvas = ref<HTMLCanvasElement | null>(null)

// Jouw penseel instellingen voor als je klikt
const pixelGrootte = 10 
const huidigeKleur = '#ff0044' 

onMounted(() => {
  if (!myCanvas.value) return
  const canvas = myCanvas.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // Maak het canvas exact even groot als het scherm
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  ctx.imageSmoothingEnabled = false

  const img = new Image()
  img.src = achtergrondImg

  img.onload = () => {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
  }
})

function tekenPixel(event: MouseEvent) {
  if (!myCanvas.value) return
  const canvas = myCanvas.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const rect = canvas.getBoundingClientRect()
  const muisX = event.clientX - rect.left
  const muisY = event.clientY - rect.top

  // Rond de klik af naar het dichtstbijzijnde 'pixel-blokje' van 10x10
  const pixelX = Math.floor(muisX / pixelGrootte) * pixelGrootte
  const pixelY = Math.floor(muisY / pixelGrootte) * pixelGrootte

  // Teken het nieuwe pixel-blokje over de achtergrond heen
  ctx.fillStyle = huidigeKleur
  ctx.fillRect(pixelX, pixelY, pixelGrootte, pixelGrootte)
}
</script>

<style scoped>
.pixel-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  cursor: crosshair; 
}
</style>