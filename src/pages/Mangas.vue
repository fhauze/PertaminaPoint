<template>
  <div
    class="min-h-screen flex flex-col bg-gradient-to-b from-emerald-100 via-lime-50 to-white 
    text-gray-800 relative overflow-hidden mb-[-10px]"
  >
  <Teleport to="#breadcrumb-target">
    <div class="w-full px-6 py-4 flex items-center justify-between backdrop-blur-md bg-white/30 border-b border-emerald-100 z-20">
      <button @click="goBack" class="flex items-center gap-2 text-emerald-600 hover:text-emerald-800 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        <span class="font-semibold">Kembali</span>
      </button>
      <!-- Breadcrumb -->
      <div class="text-sm text-gray-600">
        <span class="text-emerald-600 font-medium cursor-pointer hover:underline" @click="goBack">Entertainment</span>
        <span class="mx-2">›</span>
        <span class="text-gray-700 font-semibold">Mini Game</span>
      </div>
    </div>
 </Teleport>

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
        v-for="manga in mangas"
        :key="manga.title"
        @click="toMangaDetaial(manga.title)"
        class="group cursor-pointer rounded-2xl bg-white/60 backdrop-blur-lg p-4 shadow-md border border-white/40
               hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden"
      >
        <!-- Manga Cover -->
        <div class="relative">
          <img
            :src="manga.cover"
            :alt="manga.title"
            class="w-full h-48 object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>

        <!-- Manga Info -->
        <div class="mt-3 text-center">
          <h3 class="font-semibold text-lg text-gray-800 truncate">{{ manga.title }}</h3>
          <p class="text-sm text-gray-500">{{ manga.genre }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MangaList",
  data() {
    return {
      mangas: [
        { title: "Naruto", genre: "Action", cover: "/images/manga/naruto.png" },
        { title: "One Piece", genre: "Adventure", cover: "/images/manga/onepiece.png" },
        { title: "Demon Slayer", genre: "Fantasy", cover: "/images/manga/demonslayer.png" },
        { title: "Attack on Titan", genre: "Drama", cover: "/images/manga/attackot.png" },
        { title: "Full Metal Alchemist", genre: "Action", cover: "/images/manga/fullmetal.png" },
        { title: "Jujutsu Kaisen", genre: "Supernatural", cover: "/images/manga/jujutsu.png" },
      ],
    };
  },
  methods: {
    goBack() {
      window.history.back('/entertainment/mangas');
    },
    goHome() {
      this.$router.push("/");
    },
    toMangaDetaial(title){
        const check = this.mangas.filter((manga) => manga.title == title)

        if(check[0].title == 'One Piece'){
            return this.$router.push(`/entertainment/manga/${check[0].id ?? 1}/chapters`)
        }
    }
  },
};
</script>

<style scoped>
/* Tambahan animasi halus di hover */
.group:hover img {
  filter: drop-shadow(0 0 10px rgba(72, 187, 120, 0.3));
}
</style>
