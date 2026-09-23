<script setup lang="ts">
import PagePanel from '@/components/PagePanel.vue'
import image1 from '@/assets/Images/image1.png'
import frame from '@/assets/Images/wolk-lijst.png'
</script>

<template>
  <PagePanel next="/about">
    <div class="text-box">
      <header>
        <h1>Wed Sep 23 8:39PM</h1>
        <p>- Jasper Hubers</p>
      </header>

      <figure class="cloud-frame">
        <img class="photo" :src="image1" alt="Beschrijving van de foto" />
        <img class="frame" :src="frame" alt="" aria-hidden="true" />
      </figure>

      <p>
        Ik begon deze website, een dag nadat ik mijn 3 daagse frontends
        project had ingeleverd.
      </p>
      <p>hi</p>
    </div>
  </PagePanel>
</template>

<style scoped>
.text-box {
  max-width: 60ch;
  padding: 10px;
}

.text-box::after {
  content: "";
  display: block;
  clear: both;
}

header {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: baseline;
}

/* De lijst met foto, rechts in de tekst */
.cloud-frame {
  position: relative;
  float: right;
  width: 40%;
  max-width: 194px;
  aspect-ratio: 97 / 122;
  margin: 0 0 10px 16px;
}

/* De foto, precies in het gat van de lijst */
.photo {
  position: absolute;
  left: 11.34%;
  top: 9.02%;
  width: 77.32%;
  height: 81.97%;
  object-fit: cover;
}

/* De lijst, bovenop de foto */
.frame {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  image-rendering: pixelated;
  pointer-events: none;
}

@media (max-width: 500px) {
  .cloud-frame {
    float: none;
    width: 100%;
    max-width: 388px;
    margin: 10px 0;
  }
}
</style>