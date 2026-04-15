<template>
  <div
    class="min-h-screen flex flex-col bg-gradient-to-b from-emerald-100 via-lime-50 to-white 
    text-gray-800 relative overflow-hidden"
    @scroll.passive="handleScroll"
  >
    <!-- Header -->
    <div
      class="w-full px-6 py-4 flex items-center justify-between 
      backdrop-blur-md bg-white/30 border-b border-emerald-100 z-20 sticky top-0"
    >
      <button
        @click="goBack"
        class="flex items-center gap-2 text-emerald-600 hover:text-emerald-800 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        <span class="font-semibold">Kembali</span>
      </button>

      <!-- Breadcrumb -->
      <div class="text-sm text-gray-600">
        <span class="text-emerald-600 font-medium cursor-pointer hover:underline" @click="goHome">Beranda</span>
        <span class="mx-2">›</span>
        <span class="text-gray-700 font-semibold cursor-pointer hover:underline" @click="toMangas">Manga</span>
        <span class="mx-2">›</span>
        <span class="text-gray-700 font-semibold">Baca Manga</span>
      </div>
    </div>

    <!-- Judul -->
    <div class="text-center mt-8">
      <h1 class="text-3xl font-extrabold bg-gradient-to-r from-emerald-500 to-lime-500 bg-clip-text text-transparent">
        {{ mangaTitle }}
      </h1>
      <p class="text-gray-500 mt-2">Chapter {{ chapter_id }}</p>
    </div>

    <!-- Manga Scroll Viewer -->
    <div ref="scrollContainer" class="flex flex-col items-center justify-start w-full mt-6 px-4 pb-20 overflow-y-auto">
      <transition-group name="fade" tag="div" class="w-full max-w-2xl space-y-8">
        <div
          v-for="(page, index) in pages"
          :key="index"
          class="flex flex-col items-center"
        >
          <img
            :src="page.media"
            :alt="'Halaman ' + (index + 1)"
            class="w-full rounded-xl shadow-lg border border-white/40 object-contain"
          />
          <p class="text-sm text-gray-500 mt-2">Halaman {{ index + 1 }}</p>
        </div>
      </transition-group>

      <!-- Loading Spinner -->
      <div v-if="isLoadingNext" class="flex justify-center mt-6 mb-10">
        <svg class="animate-spin h-6 w-6 text-emerald-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
import router from '@/router'
import api from '@/util/api'
// import { forEach } from 'core-js/core/array';

export default {
  name: "MangaPageScrollReader",
  props: ["manga_id", "chapter_id"],
  data() {
    return {
      pages: [],
      mangaTitle: "Loading...",
      nextUrl: null,
      isLoadingNext: false,
      scrollThreshold: 400,
    }
  },
  methods: {
    goBack() {
      router.back()
    },
    goHome() {
      router.push('/')
    },
    toMangas() {
      router.push('/entertainment/mangas')
    },

    async loadPages(url = null) {
      try {
        this.isLoadingNext = true
        const endpoint = url || `/entertainment/manga/${this.manga_id}/chapters/${this.chapter_id}/pages/`
        const res = await api.get(endpoint)
        const data = res.data

        // kalau backend pakai pagination
        if (data.results) {
          this.pages.push(...data.results)
          this.nextUrl = data.next
        } else {
          this.pages.push(...data)
          this.nextUrl = null
        }

        if (this.pages.length > 0 && this.pages[0].chapter?.manga?.title) {
          this.mangaTitle = this.pages[0].chapter.manga.title
        }
      } catch (err) {
        console.error("Gagal memuat halaman:", err)
      } finally {
        this.isLoadingNext = false
      }
    },

    handleScroll() {
      const container = document.documentElement
      const scrollBottom = container.scrollHeight - (window.scrollY + window.innerHeight)
      if (scrollBottom < this.scrollThreshold && this.nextUrl && !this.isLoadingNext) {
        this.loadPages(this.nextUrl)
      }
    },
  },
  mounted() {
    this.loadPages()
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
