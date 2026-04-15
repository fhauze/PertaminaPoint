<template>
  <!-- Header Section -->
  <div class="w-full px-6 py-4 flex items-center justify-between backdrop-blur-md bg-white/30 border-b border-emerald-100 z-20">
    <!-- Back Button -->
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
      <!-- <span class="text-emerald-600 font-medium cursor-pointer hover:underline" @click="goEntertainment">Entertainment</span>
      <span class="mx-2">›</span>
      <span class="text-emerald-600 font-medium cursor-pointer hover:underline" @click="goBack">Mini Games</span>
      <span class="mx-2">›</span> -->
      <span class="text-gray-700 font-semibold">Pasangan Gambar</span>
    </div>
  </div>
  <div
    class="min-h-screen flex flex-col items-center justify-start bg-gradient-to-b from-green-100 to-green-300 pb-28 pr-2 pl-2 mb-[-10px] relative overflow-hidden"
     style="background-image:url('/images/footer.png'); 
    background-repeat:no-repeat; 
    background-position:bottom; 
    background-size: 100% 200px;"
    margin-bottom=-10px;
  >
    <!-- Top Bar -->
    <div class="text-center mt-8">
      <h1 class="text-4xl font-extrabold bg-gradient-to-r from-emerald-500 to-lime-500 bg-clip-text text-transparent">
        <span>🌿</span>Game Makanan Nusantara
      </h1>
      <p class="text-gray-500 mt-2">Temukan pasangan gambar sesuai gambar daerahnya 📖</p>
    </div>
    <!-- Game Area -->
    <main class="flex-1 w-full flex flex-col items-center justify-center mt-6">
      <!-- Loading -->
      <div v-if="isLoading" class="flex flex-col items-center justify-center mt-12">
        <div class="loader mb-4"></div>
        <p class="text-green-800 font-semibold text-lg">Menyiapkan kartu...</p>
      </div>

      <!-- Game Grid -->
      <div
        v-else
        class="grid grid-cols-3 gap-4 w-full max-w-md mt-4 px-4 animate-fade-in-up"
      >
        <div
          v-for="(card, index) in cards"
          :key="index"
          class="relative w-full aspect-square cursor-pointer perspective"
          @click="flipCard(index)"
        >
          <div
            class="transition-transform duration-700 transform-style-preserve-3d w-full h-full"
            :class="{ 'rotate-y-180': flippedIndexes.includes(index) || card.isMatched }"
          >
            <!-- Card Back -->
            <div
              class="absolute w-full h-full bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex flex-col items-center justify-center text-white backface-hidden border-4 border-lime-200 shadow-lg hover:scale-105 transition-transform"
            >
              <span class="text-4xl font-bold drop-shadow-lg">🍀</span>
              <small class="mt-1 font-medium text-xs">Klik Aku!</small>
            </div>

            <!-- Card Front -->
            <div
              class="absolute w-full h-full rounded-xl border-4 border-lime-300 overflow-hidden rotate-y-180 backface-hidden shadow-xl"
              :class="{ 'bg-green-200': card.isMatched }"
            >
              <img
                :src="card.content"
                alt="Card"
                class="w-full h-full object-cover"
                @error="onImageError"
              />
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer note -->
    <footer class="absolute bottom-4 text-sm text-green-900 opacity-80">
      © 2025 Freekake Kids — Belajar sambil bermain 🌼
    </footer>
  </div>
</template>

<script>
import api from '@/util/api';

export default {
  name: "FlipCardGameKids",
  data() {
    return {
      contentId: 3,
      cards: [],
      pairs: {},
      flippedIndexes: [],
      isLoading: true,
    };
  },
  async mounted() {
    await this.loadData();
  },
  methods: {
    async loadData() {
      try {
        const res = await api.get(
          `/content/contents/${this.contentId}`
        );

        const data = res.data.data || {};
        const items = data.items || [];
        const pairs = data.pairs || {};

        this.pairs = pairs;

        const duplicated = [...items];
        duplicated.sort(() => Math.random() - 0.5);

        this.cards = duplicated.map((url) => ({
          content: url,
          isMatched: false,
        }));

        this.isLoading = false;
      } catch (e) {
        console.error("Load failed", e);
      }
    },

    flipCard(index) {
      const card = this.cards[index];
      if (card.isMatched || this.flippedIndexes.includes(index)) return;

      this.flippedIndexes.push(index);

      if (this.flippedIndexes.length === 2) {
        const first = this.cards[this.flippedIndexes[0]];
        const second = this.cards[this.flippedIndexes[1]];
        const isMatch =
          this.pairs[first.content] === second.content ||
          this.pairs[second.content] === first.content;

        setTimeout(() => {
          if (isMatch) {
            first.isMatched = true;
            second.isMatched = true;
          }
          this.flippedIndexes = [];
        }, 1000);
      }
    },

    goEntertainment(){
      window.history.back('/entertainment');
    },

    goBack(){
      window.history.back('/entertainment/mini-games');
    },

    onImageError(event) {
      event.target.src = "https://via.placeholder.com/120x120?text=🍰";
    },
  },
};
</script>

<style scoped>
.perspective {
  perspective: 1000px;
}
.transform-style-preserve-3d {
  transform-style: preserve-3d;
}
.rotate-y-180 {
  transform: rotateY(180deg);
}
.backface-hidden {
  backface-visibility: hidden;
}

/* Futuristic Loader */
.loader {
  width: 50px;
  height: 50px;
  border: 6px solid rgba(255, 255, 255, 0.5);
  border-top-color: #22c55e;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* Cute animation */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in-down {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out;
}

.animate-fade-in-down {
  animation: fade-in-down 0.6s ease-out;
}
</style>
