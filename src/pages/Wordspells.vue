<template>
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
    <div class="text-sm text-gray-600">
      <!-- <span class="text-emerald-600 font-medium cursor-pointer hover:underline" @click="goEntertainment">Entertainment</span>
      <span class="mx-2">›</span>
      <span class="text-emerald-600 font-medium cursor-pointer hover:underline" @click="goBack">Mini Games</span>
      <span class="mx-2">›</span> -->
      <span class="text-gray-700 font-semibold">Temukan Kata</span>
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
    <main class="flex-1 flex flex-col items-center justify-center relative">
      <canvas ref="canvas" class="absolute inset-0 pointer-events-none"></canvas>
      <div class="bg-white text-gray-800 px-5 py-2 rounded-full shadow-lg text-2xl font-bold mb-8 min-h-[50px] flex items-center justify-center">
        {{ currentWord || "..." }}
      </div>
      <div
        ref="circleRef"
        class="relative flex items-center justify-center"
        style="width: 300px; height: 300px;"
        @touchend="endSelect"
        @mouseup="endSelect"
      >
        <div
          v-for="(letter, i) in letters"
          :key="i"
          :data-index="i"
          class="absolute flex items-center justify-center bg-white text-indigo-700 rounded-full font-bold shadow-lg transition-all duration-200 active:scale-90 select-none"
          :style="letterPosition(i)"
          :class="[
            totalSizeClass,
            selectedIndexes.includes(i) ? 'bg-yellow-300 text-yellow-900 scale-105' : ''
          ]"
          @mousedown="startSelect(i)"
          @touchstart.prevent="startSelect(i)"
          @mouseenter="dragSelect(i)"
        >
          {{ letter }}
        </div>
      </div>
      <div class="mt-8 bg-white bg-opacity-20 p-4 rounded-2xl w-full max-w-md text-center shadow-md">
        <h2 class="font-semibold mb-2 text-lg">✨ Kata yang Kamu Temukan:</h2>
        <div class="flex flex-wrap justify-center gap-2 min-h-[40px]">
          <span
            v-for="word in foundWords"
            :key="word"
            class="px-3 py-1 rounded-full text-sm font-semibold bg-green-300 text-green-900 animate-pulse"
          >
            {{ word }}
          </span>

          <span v-if="foundWords.length === 0" class="text-gray-200 italic">
            Belum ada kata ditemukan 🌱
          </span>
        </div>
      </div>

      <button
        @click="resetGame"
        class="mt-8 px-6 py-2 bg-pink-500 rounded-full font-bold text-white shadow hover:bg-pink-600 active:scale-95"
      >
        🔄 Main Lagi
      </button>
    </main>
  </div>
</template>
<script>
    export default {
        name: "word-spells"
    }
</script>
<script setup>
    import { ref, onMounted,onUnmounted, nextTick, computed } from "vue";

    const allWords = [
    "TENANG", "SABAR", "SYUKUR", "CINTA", "GEMBIRA", "BANGGA",
    "IKHLAS", "CERIA", "SETIA", "JUJUR", "RAMAH", "TABAH", "TULUS", "BERANI", "DAMAI"
    ];

    const words = ref([]);
    const letters = ref([]);
    const foundWords = ref([]);
    const selectedIndexes = ref([]);
    const currentWord = ref("");
    const isSelecting = ref(false);
    const circleRef = ref(null);
    const canvas = ref(null);

    function shuffle(array) {
        return array.sort(() => Math.random() - 0.5);
    }
    
    const totalSizeClass = computed(() => {
        const total = letters.value.length;
        if (total <= 7) return "w-16 h-16 text-3xl";
        if (total <= 9) return "w-14 h-14 text-2xl";
        return "w-12 h-12 text-xl";
    });

    function initGame() {
        const chosen = shuffle([...allWords]).slice(0, 4);
        words.value = chosen;
        const maxCounts = {};
        chosen.forEach(word => {
            const temp = {};
            for (const ch of word) temp[ch] = (temp[ch] || 0) + 1;
            for (const [ch, cnt] of Object.entries(temp)) {
            maxCounts[ch] = Math.max(maxCounts[ch] || 0, cnt);
            }
        });

        let fullLetterSet = Object.entries(maxCounts).flatMap(([ch, cnt]) => Array(cnt).fill(ch));
        const MIN_LETTERS = 7;
        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
        if (fullLetterSet.length < MIN_LETTERS) {
            const fillers = shuffle(alphabet.filter(a => !fullLetterSet.includes(a)))
            .slice(0, MIN_LETTERS - fullLetterSet.length);
            fullLetterSet = fullLetterSet.concat(fillers);
        }

        const MAX_LETTERS = 12;
        if (fullLetterSet.length > MAX_LETTERS) {
            fullLetterSet = fullLetterSet.slice(0, MAX_LETTERS);
        }

        letters.value = shuffle(fullLetterSet);
        foundWords.value = [];
        selectedIndexes.value = [];
        currentWord.value = "";
        drawConnections();
    }

    function letterPosition(index) {
        const total = letters.value.length;
        const containerSize = 300;
        const center = containerSize / 2;
        const radius = (containerSize / 2) - 40;
        const angle = (index / total) * (2 * Math.PI) - Math.PI / 2;
        const x = center + radius * Math.cos(angle);
        const y = center + radius * Math.sin(angle);
        const baseSize = total <= 8 ? 60 : total <= 10 ? 52 : 46;

        return {
            left: `${x}px`,
            top: `${y}px`,
            width: `${baseSize}px`,
            height: `${baseSize}px`,
            transform: "translate(-50%, -50%)"
        };
    }

    // mobile
    function handleTouchMove(event) {
      if (!isSelecting.value) return;

      const touch = event.touches[0];
      const element = document.elementFromPoint(touch.clientX, touch.clientY);

      if (!element) return;

      // Cek apakah elemen yang disentuh adalah salah satu huruf
      const indexAttr = element.getAttribute("data-index");
      if (indexAttr !== null) {
        const i = parseInt(indexAttr);
        dragSelect(i);
      }
    }


    function startSelect(index) {
        isSelecting.value = true;
        selectedIndexes.value = [index];
        currentWord.value = letters.value[index];
        drawConnections();
    }

    function dragSelect(index) {
        if (!isSelecting.value) return;
        if (!selectedIndexes.value.includes(index)) {
            selectedIndexes.value.push(index);
            currentWord.value += letters.value[index];
            drawConnections();
        }
    }

    function endSelect() {
        if (!isSelecting.value) return;
        const attempt = currentWord.value.toUpperCase();

        if (words.value.includes(attempt)) {
            if (!foundWords.value.includes(attempt)) {
            foundWords.value.push(attempt);
            alert(`🎉 Hebat! Kamu menemukan kata ${attempt}!`);
            } else {
            alert("⚡ Kata ini sudah kamu temukan!");
            }
        } else {
            alert("😅 Belum benar, coba lagi!");
        }

        isSelecting.value = false;
        selectedIndexes.value = [];
        currentWord.value = "";
        drawConnections();

        if (foundWords.value.length === words.value.length) {
            setTimeout(() => alert("🌟 Semua kata ditemukan! Kamu luar biasa!"), 300);
        }
        }

        function drawConnections() {
        const ctx = canvas.value?.getContext("2d");
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);

        if (selectedIndexes.value.length < 2) return;

        const canvasBox = canvas.value.getBoundingClientRect();
        const nodes = selectedIndexes.value.map((i) => {
            const el = circleRef.value.children[i];
            const box = el.getBoundingClientRect();
            return {
            x: box.left + box.width / 2 - canvasBox.left,
            y: box.top + box.height / 2 - canvasBox.top,
            };
        });

        ctx.strokeStyle = "rgba(255,255,255,0.9)";
        ctx.lineWidth = 5;
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(nodes[0].x, nodes[0].y);
        for (let i = 1; i < nodes.length; i++) ctx.lineTo(nodes[i].x, nodes[i].y);
        ctx.stroke();
    }

    function resetGame() {
        initGame();
    }

    // function goEntertainment(){
    //   window.history.back('/entertainment');
    // }
    
    function goBack(){
      window.history.back('/entertainment/mini-games');
    }
    
    
    onMounted(async () => {
        await nextTick();
        const rect = circleRef.value.getBoundingClientRect();
        canvas.value.width = rect.width;
        canvas.value.height = rect.height;
        initGame();
        
        window.addEventListener("touchmove", handleTouchMove);
    });

    onUnmounted(() => {
      window.removeEventListener("touchmove", handleTouchMove);
    });

</script>

<style scoped>
    @keyframes pulseGlow {
        0%, 100% { box-shadow: 0 0 10px rgba(255,255,255,0.6); }
        50% { box-shadow: 0 0 20px rgba(255,255,255,0.9); }
    }
    .animate-pulse {
        animation: pulseGlow 1s infinite;
    }
</style>
