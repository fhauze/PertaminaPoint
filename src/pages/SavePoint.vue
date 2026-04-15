<template>
  <div class="fixed inset-0 h-screen w-screen flex flex-col bg-[#C1F4C5] overflow-hidden relative z-50">
    
    <div class="bg-blue-900 overflow-hidden relative flex-1 shadow-inner md:m-4 md:rounded-3xl">
      
      <div class="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10 text-white">
        <div class="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
          <Trophy :size="14" class="text-yellow-400" /> {{ score }}
        </div>
        <div class="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold">{{ timeLeft }}s</div>
      </div>

      <div v-if="!gameOver" 
        class="absolute inset-0"
        @touchmove="handleTouchMove"
        @mousemove="handleMouseMove"
      >
        <div class="absolute bottom-0 w-full h-24 bg-blue-800/50"></div>
        
        <div v-for="drop in drops" :key="drop.id" 
          class="absolute text-blue-300" 
          :style="{ left: drop.x + '%', top: drop.y + '%' }"
        >
          <div class="w-4 h-6 bg-blue-400 rounded-full rounded-t-none shadow-sm"></div>
        </div>

        <div class="absolute bottom-10" :style="{ left: nozzlePos + '%', transform: 'translateX(-50%)' }">
          <div class="w-12 h-16 bg-red-600 rounded-t-xl border-t-4 border-red-400 flex items-center justify-center shadow-lg">
            <div class="w-8 h-8 rounded-full border-2 border-white/20 flex items-center justify-center">
              <div class="w-4 h-4 bg-white/40 rounded-full"></div>
            </div>
          </div>
          <div class="w-4 h-10 bg-gray-700 mx-auto"></div>
        </div>
      </div>

      <div v-else class="absolute inset-0 bg-blue-900/95 flex flex-col items-center justify-center p-6 text-white text-center z-20">
        <Trophy :size="60" class="text-yellow-400 mb-4" />
        <h3 class="text-2xl font-bold">Waktu Habis!</h3>
        <div class="text-4xl font-black my-4 text-blue-400">{{ score }}</div>
        <p class="text-xs mb-8 opacity-70">Poin telah ditambahkan. Cek peringkatmu di menu Leaderboard!</p>
        <button @click="$emit('close')" class="px-8 py-3 bg-white text-blue-900 rounded-2xl font-bold shadow-xl active:scale-95 transition-transform">
          KLAIM POIN
        </button>
      </div>
    </div>

    <div class="h-24 w-full bg-[#C1F4C5] relative">
       </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Trophy } from 'lucide-vue-next'

// const emit = defineEmits(['close'])

// Game state
const score = ref(0)
const timeLeft = ref(15)
const gameOver = ref(false)
const nozzlePos = ref(50)
const drops = ref([])

// Timers
let gameTimer = null
let dropGenerator = null
let gameLoop = null

// Start game
onMounted(() => {
  startGame()
})

// Cleanup
onUnmounted(() => {
  clearInterval(gameTimer)
  clearInterval(dropGenerator)
  clearInterval(gameLoop)
})

const startGame = () => {
  // Timer
  gameTimer = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--
    } else {
      gameOver.value = true
      clearInterval(gameTimer)
      clearInterval(dropGenerator)
      clearInterval(gameLoop)
    }
  }, 1000)

  // Drop generator
  dropGenerator = setInterval(() => {
    if (!gameOver.value) {
      drops.value.push({
        id: Date.now() + Math.random(),
        x: Math.random() * 90 + 5,
        y: -10
      })
    }
  }, 800)

  // Game loop
  gameLoop = setInterval(() => {
    if (!gameOver.value) {
      updateDrops()
    }
  }, 30)
}

const updateDrops = () => {
  const newDrops = drops.value.map(d => ({ ...d, y: d.y + 2 }))
  
  // Check collisions
  const caught = newDrops.filter(d => 
    d.y > 80 && d.y < 90 && Math.abs(d.x - nozzlePos.value) < 15
  )
  
  if (caught.length > 0) {
    score.value += caught.length * 10
  }
  
  // Remove caught or out-of-bounds drops
  drops.value = newDrops.filter(d => 
    d.y < 100 && !caught.includes(d)
  )
}

const handleTouchMove = (e) => {
  const rect = e.currentTarget.getBoundingClientRect()
  const touchX = e.touches[0].clientX - rect.left
  nozzlePos.value = Math.max(10, Math.min(90, (touchX / rect.width) * 100))
}

const handleMouseMove = (e) => {
  const rect = e.currentTarget.getBoundingClientRect()
  const mouseX = e.clientX - rect.left
  nozzlePos.value = Math.max(10, Math.min(90, (mouseX / rect.width) * 100))
}
</script>

<style scoped>
/* Penting: Gunakan v-deep untuk memaksa body tidak scroll 
   ketika komponen ini aktif 
*/
:deep(body) {
  overflow: hidden !important;
  overscroll-behavior: none;
  position: fixed;
  width: 100%;
}
</style>