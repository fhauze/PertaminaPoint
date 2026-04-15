<template>
  <div class="w-full px-6 py-4 flex items-center justify-between backdrop-blur-md bg-white/30 border-b border-emerald-100 z-20">
    <button @click="goBack" class="flex items-center gap-2 text-emerald-600 hover:text-emerald-800 transition-colors">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      <span class="font-semibold">Kembali</span>
    </button>
  </div>

  <div class="flex flex-col min-h-screen bg-gradient-to-b from-green-200 to-lime-100 text-gray-900 select-none"
       style="background-image:url('/images/footer.png'); background-size:cover; background-position:center;">
    <div class="text-center mt-8">
      <h1 class="text-4xl font-extrabold bg-gradient-to-r from-emerald-500 to-lime-500 bg-clip-text text-transparent">🌿 Temukan Kata Positif</h1>
      <p class="text-gray-500 mt-2">Temukan kata kata positif yang ada di bawah ini 📖</p>
    </div>
    <div class="text-center mt-8">
      <div class="text-sm text-gray-600">Level: <span class="font-semibold text-gray-800">{{ currLevel + 1 }} / {{ levels.length }}</span></div>
      <div class="text-sm mt-0.5 text-emerald-700 font-bold">⏳ {{ timeLeft }}s</div>
    </div>

    <main class="flex-1 flex flex-col items-center justify-center p-4">
      <div ref="gridRef" class="grid gap-1" :style="gridStyle">
        <template v-for="(row, r) in grid" :key="r">
          <div v-for="(letter, c) in row" :key="`${r}-${c}`"
               @mousedown.prevent="startSelect(r,c)"
               @mouseenter="dragSelect(r,c)"
               @mouseup="endSelect"
               @touchstart.prevent="startSelect(r,c)"
               @touchmove.prevent="dragSelectTouch($event)"
               @touchend.prevent="endSelect"
               class="flex items-center justify-center text-lg sm:text-xl font-bold rounded-xl cursor-pointer transition-all duration-200 ease-out shadow-md aspect-square"
               :class="cellClass(r,c)">
            {{ letter }}
          </div>
        </template>
      </div>

      <div class="mt-6 bg-white bg-opacity-80 p-4 rounded-3xl shadow-lg w-full max-w-lg border border-lime-200">
        <h2 class="font-semibold text-green-800 mb-2 text-center">Cari kata berikut:</h2>
        <div class="flex flex-wrap justify-center gap-2">
          <span v-for="w in words" :key="w" class="px-3 py-1 rounded-full text-sm font-semibold shadow transition-all duration-200"
                :class="foundWords.includes(w) ? 'bg-green-300 text-green-900 animate-bounce-glow' : 'bg-lime-100 text-green-700 hover:bg-green-200 hover:scale-105'">
            {{ w }}
          </span>
        </div>
        <p class="mt-3 text-xs text-green-700 italic text-center">Temukan semua kata positif untuk hati yang ceria!</p>
      </div>
    </main>

    <footer class="p-4 flex justify-center gap-3">
      <button @click="resetGame" class="px-6 py-2 bg-gradient-to-r from-lime-400 to-green-500 text-white font-bold rounded-full shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200">
        🔄 Main Lagi
      </button>
    </footer>
  </div>
</template>
<script>
export default {
  name: "Find-words",
}
</script>
<script setup>
import { ref, onMounted, computed, watch } from "vue";

/* ---------- data kata ---------- */
const allWords = [
  "TENANG","SABAR","SYUKUR","CINTA","GEMBIRA","BANGGA","PERCAYA","SEMANGAT","OPTIMIS","IKHLAS",
  "BAHAGIA","PEDULI","CERIA","HARMONI","SETIA","JUJUR","RAMAH","TABAH","TULUS","BERANI","MAJU","DAMAI","RIANG"
];

/* ---------- levels (tambahkan waktu tiap level) ---------- */
const levels = [
  { name: "Easy", count: 4, time: 60 },
  { name: "Medium", count: 6, time: 45 },
  { name: "Hard", count: 8, time: 30 },
  { name: "Extreme", count: 10, time: 20 }
];

const currLevel = ref(0);
const size = computed(() => levels[currLevel.value].count);

/* ---------- reactive state ---------- */
const grid = ref([]);
const words = ref([]);
const foundWords = ref([]);
const selectedCells = ref([]);
const gridRef = ref(null);
const isSelecting = ref(false);
const wordPositions = {}; // diisi saat kata ditempatkan
// const placedWords = {}; 

const gridStyle = computed(() => ({ gridTemplateColumns: `repeat(${size.value}, minmax(0,1fr))`, width: "90vw", maxWidth: "500px" }));

/* ---------- timer ---------- */
let timer = null;
const timeLeft = ref(levels[currLevel.value].time);

function startTimer() {
  if (timer) clearInterval(timer);
  timeLeft.value = levels[currLevel.value].time;
  timer = setInterval(() => {
    timeLeft.value--;
    if (timeLeft.value <= 0) {
      clearInterval(timer);
      timer = null;
      // waktu habis -> reset level (tetap di level sama)
      resetGame();
      startTimer();
    }
  }, 1000);
}

/* ---------- helper: pilih kata yang muat ---------- */
const shuffle = (arr) => arr.slice().sort(() => Math.random() - 0.5);

function candidatePoolForSize(sz) {
  return allWords.filter(w => w.length <= sz);
}

function pickWordsForLevel() {
  const pool = shuffle(candidatePoolForSize(size.value));
  const desired = levels[currLevel.value].count;
  if (pool.length <= desired) return pool.slice(0, pool.length);
  return pool.slice(0, desired);
}

/* ---------- placement utils (8 arah) ---------- */
const DIRECTIONS = [ [1,0],[-1,0],[0,1],[0,-1], [1,1],[-1,-1],[1,-1],[-1,1] ];

function canPlace(g, word, r, c, dr, dc) {
  for (let i = 0; i < word.length; i++) {
    const nr = r + dr * i;
    const nc = c + dc * i;
    if (nr < 0 || nc < 0 || nr >= size.value || nc >= size.value) return false;
    if (g[nr][nc] !== "" && g[nr][nc] !== word[i]) return false;
  }
  return true;
}

function placeAt(g, word, r, c, dr, dc) {
  const cells = [];
  for (let i = 0; i < word.length; i++) {
    const nr = r + dr * i;
    const nc = c + dc * i;
    g[nr][nc] = word[i];
    cells.push({ r: nr, c: nc });
  }
  wordPositions[word] = cells;
}

/* 1) coba intersection lalu 2) fallback random */
function placeWordWithIntersection(g, word) {
  // intersection: cari huruf yang sama di grid yg sudah terisi
  for (let r = 0; r < size.value; r++) {
    for (let c = 0; c < size.value; c++) {
      const letterHere = g[r][c];
      if (!letterHere) continue;
      for (let idx = 0; idx < word.length; idx++) {
        if (word[idx] !== letterHere) continue;
        for (const [dr, dc] of DIRECTIONS) {
          const startR = r - dr * idx;
          const startC = c - dc * idx;
          if (canPlace(g, word, startR, startC, dr, dc)) {
            placeAt(g, word, startR, startC, dr, dc);
            return true;
          }
        }
      }
    }
  }

  // fallback random tries
  const triesMax = 300;
  for (let t = 0; t < triesMax; t++) {
    const [dr, dc] = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
    const r = Math.floor(Math.random() * size.value);
    const c = Math.floor(Math.random() * size.value);
    if (canPlace(g, word, r, c, dr, dc)) {
      placeAt(g, word, r, c, dr, dc);
      return true;
    }
  }
  return false;
}

/* ---------- build grid (re-try strategy) ---------- */
function fillEmpty(g) {
  const abc = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let r = 0; r < size.value; r++) {
    for (let c = 0; c < size.value; c++) {
      if (!g[r][c]) g[r][c] = abc[Math.floor(Math.random() * abc.length)];
    }
  }
}

function generateGrid() {
  const maxAttempts = 8;
  const chosenWords = pickWordsForLevel();
  const desiredCount = Math.min(chosenWords.length, levels[currLevel.value].count);

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    // reset wordPositions
    for (const k in wordPositions) delete wordPositions[k];

    const g = Array.from({ length: size.value }, () => Array(size.value).fill(""));
    // coba tempatkan kata panjang dulu
    const wordsToPlace = chosenWords.slice(0, desiredCount).sort((a,b) => b.length - a.length);

    let allPlaced = true;
    for (const w of wordsToPlace) {
      const ok = placeWordWithIntersection(g, w);
      if (!ok) { allPlaced = false; break; }
    }

    if (allPlaced) {
      fillEmpty(g);
      grid.value = g;
      // words.value = wordsToPlace;
      words.value = Object.keys(wordPositions);
      return true;
    }
    // else ulangi generate
  }

  // fallback (jarang terjadi)
  const fallbackG = Array.from({ length: size.value }, () => Array(size.value).fill(""));
  fillEmpty(fallbackG);
  grid.value = fallbackG;
  words.value = chosenWords.slice(0, Math.min(chosenWords.length, levels[currLevel.value].count));
  return false;
}

/* ---------- UI selection & validation ---------- */
// function cellClass(r, c) {
//   const sel = selectedCells.value.some(p => p.r === r && p.c === c);
//   const found = Object.values(wordPositions).flat().some(p => p.r === r && p.c === c);
//   return found ? "bg-green-300 text-green-900 scale-105" : sel ? "bg-yellow-200 text-yellow-900 scale-105" : "bg-white text-green-700 hover:bg-green-100 hover:scale-105";
// }
function cellClass(r, c) {
  const sel = selectedCells.value.some(p => p.r === r && p.c === c);

  // highlight hanya jika kata ditemukan user (masuk ke foundWords)
  const found = foundWords.value.some(word =>
    wordPositions[word]?.some(p => p.r === r && p.c === c)
  );

  return found
    ? "bg-green-300 text-green-900 scale-105"
    : sel
    ? "bg-yellow-200 text-yellow-900 scale-105"
    : "bg-white text-green-700 hover:bg-green-100 hover:scale-105";
}


function startSelect(r,c){ isSelecting.value = true; selectedCells.value = [{r,c}]; }
function dragSelect(r,c){ if (isSelecting.value) { const last = selectedCells.value.at(-1); if(last.r !== r || last.c !== c) selectedCells.value.push({r,c}); } }
function dragSelectTouch(e){ if (!isSelecting.value) return; const t = e.touches[0]; const rect = gridRef.value.getBoundingClientRect(); const s = rect.width / size.value; const x = Math.floor((t.clientX - rect.left) / s); const y = Math.floor((t.clientY - rect.top) / s); if (x >= 0 && y >= 0 && x < size.value && y < size.value) dragSelect(y, x); }

/* endSelect: validasi arah lalu cek kata */
function endSelect(){
  if(!isSelecting.value) return;
  const cells = selectedCells.value;
  if (cells.length < 2) { selectedCells.value = []; isSelecting.value = false; return; }

  const dx = Math.sign(cells[1].r - cells[0].r);
  const dy = Math.sign(cells[1].c - cells[0].c);

  const valid = cells.every((cell, idx) => {
    if (idx === 0) return true;
    return cell.r === (cells[0].r + dx * idx) && cell.c === (cells[0].c + dy * idx);
  });

  if (!valid) { selectedCells.value = []; isSelecting.value = false; return; }

  const formed = cells.map(p => grid.value[p.r][p.c]).join("");
  if (words.value.includes(formed) && !foundWords.value.includes(formed)) {
    foundWords.value.push(formed);
    // mark positions (already stored when placed)
    // panggil checkLevelComplete untuk auto next level
    checkLevelComplete();
  }

  selectedCells.value = [];
  isSelecting.value = false;
}

/* ---------- level completion ---------- */
function checkLevelComplete() {
  if (foundWords.value.length === words.value.length) {
    if (timer) { clearInterval(timer); timer = null; }
    // show small delay lalu naik level (jika masih ada)
    setTimeout(() => {
      if (currLevel.value < levels.length - 1) {
        currLevel.value++;
        resetGame();
        startTimer();
      } else {
        // last level finished: bisa reset ke awal atau tampilkan pesan
        alert("🌟 Semua level selesai! Selamat :)");
        // reset kembali ke level 0 atau tetap
        currLevel.value = 0;
        resetGame();
        startTimer();
      }
    }, 300);
  }
}

/* ---------- controls ---------- */
function resetGame() {
  foundWords.value = [];
  selectedCells.value = [];
  for (const k in wordPositions) delete wordPositions[k];
  generateGrid();
}

function goBack(){ window.history.back(); }

/* ---------- init ---------- */
onMounted(() => {
  generateGrid();
  startTimer();
});

/* optional: kalau level berubah, restart timer dan grid */
watch(currLevel, () => {
  resetGame();
  startTimer();
});
</script>

<style scoped>
/* Pastikan ada aspect-square (Tailwind) — jika tidak, fallback: */
.grid > * > * { aspect-ratio: 1 / 1; } /* fallback bila Tailwind aspect-square tidak tersedia */

@keyframes bounceGlow { 0%,100%{box-shadow:0 0 8px rgba(72,255,140,.6);transform:scale(1);} 50%{box-shadow:0 0 20px rgba(72,255,140,1);transform:scale(1.05);} }
.animate-bounce-glow{animation:bounceGlow 1s infinite;}
</style>
