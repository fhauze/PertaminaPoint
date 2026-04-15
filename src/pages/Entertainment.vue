<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-emerald-200 via-teal-100 to-lime-200 
      relative overflow-hidden text-gray-800 mb-[-10px]"
      style="background-image:url('/images/footer.png'); 
      background-repeat:no-repeat; 
      background-position:bottom; 
      background-size: 100% 200px;"
      margin-bottom=-10px;
  >
    <!-- Background Glow & Floating Elements -->
    <div class="absolute inset-0 z-0">
      <div class="absolute top-10 left-10 w-72 h-72 bg-emerald-300/30 blur-3xl rounded-full animate-pulse"></div>
      <div class="absolute bottom-10 right-10 w-96 h-96 bg-lime-400/30 blur-3xl rounded-full animate-pulse"></div>
    </div>

    <!-- Logo Section -->
  

    <!-- Main Card -->
    <div
      class="backdrop-blur-xl bg-white/30 border border-white/40 rounded-3xl shadow-2xl p-6 mt-10 w-[90%] max-w-md 
        flex flex-col items-center text-center relative overflow-hidden"
    >
      <div
        class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-lime-400 via-emerald-300 to-cyan-300 rounded-t-3xl animate-[pulse_3s_infinite]"
      ></div>

      <img
        src="/images/but-nav-hiburan.png"
        alt="Hiburan"
        class="w-40 h-auto mt-6 transition-transform duration-500 hover:scale-110"
      />

      <h2 class="text-3xl font-extrabold mt-4 bg-gradient-to-r from-emerald-500 to-lime-500 bg-clip-text text-transparent tracking-wide">
        Hiburan
      </h2>
      <p class="text-gray-600 mt-2 text-sm">Pilih hiburan favoritmu dan nikmati keseruannya</p>
    </div>

    <!-- Character Grid -->
    <!-- <div class="w-[90%] max-w-md grid grid-cols-2 gap-6 mt-10 px-2 z-20 pb-[40px]"
    >
      <div
        v-for="hiburan in hiburans"
        :key="hiburan.name"
        @click="toMangas(hiburan.name)"
        class="group cursor-pointer flex flex-col items-center p-1 rounded-2xl 
          backdrop-blur-md bg-white/40 border border-white/30 shadow-lg 
          hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
      >
        <img
          :src="hiburan.img"
          :alt="hiburan.name"
          class="w-20 h-20 object-contain group-hover:scale-110 transition-transform duration-300"
        />
        <p class="mt-3 text-emerald-700 font-semibold group-hover:text-emerald-500 transition-colors duration-300">
          {{ hiburan.name }}
        </p>
      </div>
    </div> -->
    <!-- <div class="w-[90%] max-w-5xl grid grid-cols-2 sm:grid-cols-3 
     lg:grid-cols-4 gap-6 mt-10 px-4 z-20 pb-[40px] mx-auto"> -->
    <div class="w-[90%] max-w-md grid grid-cols-2 gap-6 mt-10 px-2 z-20 pb-[40px]"
    >
      <div
        v-for="hiburan in hiburans"
        :key="hiburan.name"
        @click="toContents(hiburan.name)"
        class="group cursor-pointer relative flex flex-col items-center justify-center p-4 rounded-2xl
              backdrop-blur-xl bg-white/30 border border-white/40 shadow-lg 
              hover:shadow-[0_0_25px_rgba(34,197,94,0.4)] hover:bg-white/50
              transform-gpu transition-all duration-300 hover:-translate-y-2 hover:scale-105"
        @mousemove="onMouseMove($event, hiburan.name)"
        @mouseleave="resetTilt(hiburan.name)"
        :style="{ transform: tiltTransforms[hiburan.name] }"
      >
        <div v-if="hiburan.badge"
            class="absolute top-2 right-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow">
          {{ hiburan.badge }}
        </div>
        <div class="relative w-24 h-24 flex items-center justify-center">
          <img
            :src="hiburan.img"
            :alt="hiburan.name"
            class="w-full h-full object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-500"
          />
          <div
            class="absolute inset-0 bg-gradient-to-t from-emerald-400/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          ></div>
        </div>
        <p class="mt-3 text-emerald-800 font-bold tracking-wide group-hover:text-emerald-600 transition-colors duration-300">
          {{ hiburan.name }}
        </p>
      </div>
    </div>

  </div>
</template>

<script>
import router from '@/router';
import { getContent } from '@/services/content';
import { getGenre } from '@/services/genre';

export default {
  name: "Entertain-ment",
  data() {
    return {
      genres : [],
      hiburans: [
        { name: "Manga", img: "/images/manga.png" , badge:"Popular"},
        { name: "Mini Game", img: "/images/games.png",badge:"New" },
        { name: "Videos", img: "/images/char/bear.png",badge:"Remaining" },
        { name: "Cerita Rakyat", img: "/images/char/fox.png",badge:"Remaining" },
      ],
      contents : getContent(),
      tiltTransforms: {}
    };
  },
  methods: {
    toContents(title) {
      if(title == 'Manga'){
        router.push('/entertainment/mangas') 
      }
      if(title == 'Mini Game'){
        router.push('/entertainment/mini-games/')
      }
    },
    async loadGenres() {
      const res = await getGenre();
      this.genres = res.results;
    },
    onMouseMove(event, name) {
      const card = event.currentTarget;
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rotateY = ((x / rect.width) - 0.5) * 15;
      const rotateX = ((y / rect.height) - 0.5) * -15;
      // this.$set(this.tiltTransforms, name, `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`);
      this.tiltTransforms = {
        ...this.tiltTransforms,
        [name]: `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`
      };
    },
    resetTilt(name) {
      // this.$set(this.tiltTransforms, name, `rotateY(0deg) rotateX(0deg)`);
      this.tiltTransforms = {
        ...this.tiltTransforms,
        [name]: `rotateY(0deg) rotateX(0deg)`
      };
    },
  },
  mounted() {
    this.loadGenres();
  }
};
</script>

<style scoped>
  @keyframes pulse {
    0%, 100% { opacity: 0.5; transform: scale(1); }
    50% { opacity: 0.8; transform: scale(1.05); }
  }

  /* Tambahan efek glow lembut di hover */
  .group:hover img {
    filter: drop-shadow(0 0 10px rgba(72, 187, 120, 0.5));
  }
  .group {
    perspective: 1000px;
  }
</style>

<script setup>

</script>
