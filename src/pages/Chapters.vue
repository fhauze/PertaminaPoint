<template>
  <div
    class="min-h-screen flex flex-col bg-gradient-to-b from-emerald-100 via-lime-50 to-white 
    text-gray-800 relative overflow-hidden mb-[-10px]"
  >
    <div class="w-full px-6 py-4 flex items-center justify-between backdrop-blur-md bg-white/30 border-b border-emerald-100 z-20">
      <button
        @click="goBack"
        class="flex items-center gap-2 text-emerald-600 hover:text-emerald-800 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        <span class="font-semibold">Kembali</span>
      </button>

      <!-- Breadcrumb / Path -->
      <div class="text-sm text-gray-600">
        <span class="text-emerald-600 font-medium cursor-pointer hover:underline" @click="goHome">Beranda</span>
        <span class="mx-2">›</span>
        <span class="text-gray-700 font-semibold">Manga</span>
        <span class="mx-2">›</span>
        <span class="text-gray-700 font-semibold">Chapters</span>
      </div>
    </div>

    <!-- Title -->
    <div class="text-center mt-8">
      <h1 class="text-4xl font-extrabold bg-gradient-to-r from-emerald-500 to-lime-500 bg-clip-text text-transparent">
        Daftar Manga
      </h1>
      <p class="text-gray-500 mt-2">Temukan bacaan favoritmu di sini 📖</p>
    </div>

    <!-- Manga Grid -->
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mt-10 px-6 pb-20">
      <div
        v-for="chapter in chapters"
        :key="chapter.chapter"
        class="group cursor-pointer rounded-2xl bg-white/60 backdrop-blur-lg p-4 shadow-md border border-white/40
               hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden"
      >
        <div class="mt-0 text-center">
          <h3 class="font-semibold text-lg text-gray-800 truncate">Chapter {{ chapter.chapter }}</h3>
        </div>
        <!-- Manga Cover -->
        <div class="relative" @click="toPage(chapter.id,chapter.chapter)">
          <img
            :src="chapter.manga?.featured_image"
            :alt="chapter.status"
            class="w-full h-48 object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>

        <!-- Manga Info -->
        <div class="mt-3 text-center">
          <!-- <h3 class="font-semibold text-lg text-gray-800 truncate">Chapter {{ chapter.chapter }}</h3> -->
          <p class="text-sm text-gray-500">
            <button @click="toSynopsis(chapter.manga)" 
              class="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 me-2 mb-2">
               <h3 class="font-semibold text-lg text-gray-800 truncate">📖 Synopsis</h3>
            </button>
          </p>
        </div>

        <!-- <button @click="toSynopsis(chapter.manga)">
          Synopsis
        </button> -->
      </div>
    </div>
  </div>
</template>

<script>
import router from '@/router';
import { getChapters } from '@/services/manga';

export default {
  name: "manga-chapter",
  props: ["id"],
  data() {
    return {
      genres : [],
      chapters: [],
      images: [
        {id:1, image:'/images/manga.png'},
        {id:2, image:'/images/manga1.png'},
        {id:3, image:'/images/manga2.png'}
      ],
    };
  },
  methods: {
    goBack() {
      router.back();
    },
    toPage(manga_id,chapter_id) {
      router.push(`/entertainment/manga/${manga_id}/chapters/${chapter_id}/pages`);
    },
    async loadContent() {
      const res = await getChapters(this.id);
      this.chapters = res.results;
    },
    toSynopsis( manga) {
      router.push({
        name: 'manga-sinopsis',
        params: { id: manga.id },
        query: { synopsis: manga.synopsis }
      });
    }
  },
  mounted() {
    this.loadContent();
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
</style>

<script setup>

</script>
