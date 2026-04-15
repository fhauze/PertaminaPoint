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
      <span class="text-gray-700 font-semibold">Find Words</span>
    </div>
  </div>
  <div class="flex flex-col min-h-screen bg-gradient-to-b from-green-200 to-lime-100 text-gray-900 select-none"
       style="background-image:url('/images/footer.png'); background-size:cover; background-position:center;">
    <!-- Header -->
    <div class="text-center mt-8">
      <h1 class="text-4xl font-extrabold bg-gradient-to-r from-emerald-500 to-lime-500 bg-clip-text text-transparent">
        <span>🌿</span>Temukan Kata Positif
      </h1>
      <p class="text-gray-500 mt-2">Temukan kata kata positif yang ada di bawah ini 📖</p>
    </div>

    <!-- Grid Game -->
    <main class="flex-1 flex flex-col items-center justify-center p-4">
      <div
        ref="gridRef"
        class="grid gap-1"
        :style="{
          gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
          width: '90vw',
          maxWidth: '500px'
        }"
      >
        <!-- per baris -->
        <template v-for="(row, rowIndex) in grid" :key="rowIndex">
          <!-- per sel -->
          <div
            v-for="(letter, colIndex) in row"
            :key="`${rowIndex}-${colIndex}`"
            @mousedown.prevent="startSelect(rowIndex, colIndex)"
            @mouseenter="dragSelect(rowIndex, colIndex)"
            @mouseup="endSelect"
            @touchstart.prevent="startSelect(rowIndex, colIndex)"
            @touchmove.prevent="dragSelectTouch($event)"
            @touchend.prevent="endSelect"
            class="flex items-center justify-center text-lg sm:text-xl font-bold rounded-xl cursor-pointer 
                   transition-all duration-200 ease-out shadow-md"
            :class="cellClass(rowIndex, colIndex)"
          >
            {{ letter }}
          </div>
        </template>
      </div>

      <!-- Footer Words -->
      <div class="mt-6 bg-white bg-opacity-80 p-4 rounded-3xl shadow-lg w-full max-w-lg border border-lime-200">
        <h2 class="font-semibold text-green-800 mb-2 text-center">Cari kata berikut:</h2>
        <div class="flex flex-wrap justify-center gap-2">
          <span
            v-for="word in words"
            :key="word"
            class="px-3 py-1 rounded-full text-sm font-semibold shadow transition-all duration-200"
            :class="foundWords.includes(word) 
              ? 'bg-green-300 text-green-900 animate-bounce-glow'
              : 'bg-lime-100 text-green-700 hover:bg-green-200 hover:scale-105'"
          >
            {{ word }}
          </span>
        </div>
        <p class="mt-3 text-xs text-green-700 italic text-center">
          Temukan semua kata positif seperti sabar, cinta, syukur, dan gembira untuk hati yang ceria!
        </p>
      </div>
    </main>

    <!-- Footer Buttons -->
    <footer class="p-4 flex justify-center gap-3">
      <button
        @click="resetGame"
        class="px-6 py-2 bg-gradient-to-r from-lime-400 to-green-500 text-white font-bold rounded-full shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
      >
        🔄 Main Lagi
      </button>
    </footer>
  </div>
</template>

<script>
export default {
  name: "Find-words"
};
</script>

<script setup>
import { ref, onMounted } from "vue";

const size = 10;
const allWords = [
  "TENANG", "SABAR", "SYUKUR", "CINTA", "GEMBIRA", "BANGGA",
  "PERCAYA", "SEMANGAT", "OPTIMIS", "IKHLAS", "BAHAGIA", "PEDULI",
  "CERIA", "HARMONI", "SETIA", "JUJUR", "RAMAH", "TABAH", "TULUS",
  "BERANI", "MAJU", "DAMAI", "RIANG"
];

const words = ref([]);
const grid = ref([]);
const foundWords = ref([]);
const selectedCells = ref([]);
const isSelecting = ref(false);
const wordPositions = {};
const gridRef = ref(null);

function generateGrid() {
  const rand = (n) => Math.floor(Math.random() * n);
  const g = Array.from({ length: size }, () => Array(size).fill(""));
  const chosenWords = [...allWords].sort(() => Math.random() - 0.5).slice(0, 6);
  words.value = chosenWords;

  chosenWords.forEach((word) => {
    let placed = false;
    for (let tries = 0; tries < 100 && !placed; tries++) {
      const horizontal = Math.random() > 0.5;
      const row = rand(size - (horizontal ? 1 : word.length));
      const col = rand(size - (horizontal ? word.length : 1));

      let fits = true;
      for (let i = 0; i < word.length; i++) {
        const r = row + (horizontal ? 0 : i);
        const c = col + (horizontal ? i : 0);
        if (g[r][c] && g[r][c] !== word[i]) {
          fits = false;
          break;
        }
      }
      if (fits) {
        for (let i = 0; i < word.length; i++) {
          const r = row + (horizontal ? 0 : i);
          const c = col + (horizontal ? i : 0);
          g[r][c] = word[i];
        }
        placed = true;
      }
    }
  });

  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!g[r][c]) g[r][c] = letters[Math.floor(Math.random() * letters.length)];
    }
  }

  grid.value = g;
}

function cellClass(r, c) {
  const isSelected = selectedCells.value.some((pos) => pos.r === r && pos.c === c);
  const isFound = foundWords.value.some((word) =>
    wordPositions[word]?.some((p) => p.r === r && p.c === c)
  );

  if (isFound) return "bg-green-300 text-green-900 scale-105";
  if (isSelected) return "bg-yellow-200 text-yellow-900 scale-105";
  return "bg-white text-green-700 hover:bg-green-100 hover:scale-105";
}

function startSelect(r, c) {
  isSelecting.value = true;
  selectedCells.value = [{ r, c }];
}

function dragSelect(r, c) {
  if (!isSelecting.value) return;
  const last = selectedCells.value[selectedCells.value.length - 1];
  if (last.r !== r || last.c !== c) selectedCells.value.push({ r, c });
}

function dragSelectTouch(e) {
  if (!isSelecting.value) return;
  const touch = e.touches[0];
  const rect = gridRef.value.getBoundingClientRect();
  const cellSize = rect.width / size;
  const x = Math.floor((touch.clientX - rect.left) / cellSize);
  const y = Math.floor((touch.clientY - rect.top) / cellSize);
  if (x >= 0 && y >= 0 && x < size && y < size) dragSelect(y, x);
}

function endSelect() {
  if (!isSelecting.value) return;
  const selectedWord = selectedCells.value.map(({ r, c }) => grid.value[r][c]).join("");
  if (words.value.includes(selectedWord) && !foundWords.value.includes(selectedWord)) {
    foundWords.value.push(selectedWord);
    wordPositions[selectedWord] = [...selectedCells.value];
    if (foundWords.value.length === words.value.length) {
      setTimeout(() => alert("🎉 Semua kata ditemukan! Hebat sekali! 🌟"), 200);
    }
  }
  selectedCells.value = [];
  isSelecting.value = false;
}

function resetGame() {
  foundWords.value = [];
  selectedCells.value = [];
  generateGrid();
}

// function goEntertainment(){
//   window.history.back('/entertainment');
// }

function goBack(){
  window.history.back('/entertainment/mini-games');
}

onMounted(() => {
  resetGame();
});
</script>

<style scoped>
@keyframes bounceGlow {
  0%, 100% { box-shadow: 0 0 8px rgba(72, 255, 140, 0.6); transform: scale(1); }
  50% { box-shadow: 0 0 20px rgba(72, 255, 140, 1); transform: scale(1.05); }
}
.animate-bounce-glow {
  animation: bounceGlow 1s infinite;
}
</style>
