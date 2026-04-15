<template>
  <div class="game-wrapper" ref="container">
    <div class="hud">
      <div class="stat-group">
        <div class="stat">🪙 {{ score }}</div>
        <div class="stat">🚀 {{ Math.floor(speed * 20) }} km/h</div>
      </div>
      <div class="stat timer" :class="{ 'low-time': timeLeft < 10 }">⏱️ {{ timeLeft }}s</div>
    </div>

    <canvas 
      ref="gameCanvas" 
      @mousedown="handleStart"
      @mousemove="handleMove"
      @mouseup="handleEnd"
      @touchstart.prevent="handleStart"
      @touchmove.prevent="handleMove"
      @touchend.prevent="handleEnd"
    ></canvas>

    <div v-if="gameState !== 'PLAYING'" class="overlay">
      <div class="modal">
        <h1 class="title">{{ gameState === 'START' ? 'MOTO DRIFT PRO' : 'RACE FINISHED' }}</h1>
        
        <div v-if="gameState === 'START'" class="input-section">
          <input v-model="playerName" placeholder="Masukkan Nama Anda" maxlength="12" />
        </div>

        <div class="leaderboard">
          <h3>🏆 5 SKOR TERBAIK</h3>
          <div class="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Pos</th>
                  <th>Nama</th>
                  <th>Skor</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(entry, index) in leaderBoard" :key="index" :class="{ 'current': entry.isNew }">
                  <td>{{ index + 1 }}</td>
                  <td>{{ entry.name }}</td>
                  <td>{{ entry.score }}</td>
                </tr>
                <tr v-if="leaderBoard.length === 0">
                  <td colspan="3">Belum ada catatan skor.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="actions">
          <button @click="startGame" class="play-btn" :disabled="!playerName">
            {{ gameState === 'START' ? 'GAS SEKARANG!' : 'MAIN LAGI' }}
          </button>
          <button v-if="leaderBoard.length > 0" @click="downloadJSON" class="export-btn">
            💾 EKSPOR SKOR (JSON)
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const gameCanvas = ref(null);
const container = ref(null);
const score = ref(0);
const timeLeft = ref(30);
const gameState = ref('START');
const playerName = ref('Player 1');
const leaderBoard = ref([]);

let ctx = null;
let animationFrame = null;
let timerInterval = null;

const player = { x: 0, y: 0, w: 45, h: 85, targetX: 0, targetY: 0, tilt: 0 };
let speed = 0;
let roadOffset = 0;
let trackCurve = 0;
let coins = [];
let isDragging = false;

// --- PERSISTENCE ---
const loadScores = () => {
  const saved = localStorage.getItem('moto_drift_scores');
  if (saved) leaderBoard.value = JSON.parse(saved);
};

const saveScore = (finalScore) => {
  const newEntry = {
    name: playerName.value || 'Anonymous',
    score: finalScore,
    date: new Date().toISOString(),
    isNew: true
  };
  let scores = [...leaderBoard.value.map(s => ({ ...s, isNew: false })), newEntry];
  scores.sort((a, b) => b.score - a.score);
  leaderBoard.value = scores.slice(0, 5);
  localStorage.setItem('moto_drift_scores', JSON.stringify(leaderBoard.value));
};

const downloadJSON = () => {
  const data = JSON.stringify(leaderBoard.value, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'leaderboard_moto.json';
  link.click();
  URL.revokeObjectURL(url);
};

// --- INPUT LOGIC ---
const getPointerPos = (e) => {
  const rect = gameCanvas.value.getBoundingClientRect();
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  return {
    x: clientX - rect.left - player.w / 2,
    y: clientY - rect.top - player.h / 2
  };
};

// PERBAIKAN: e sekarang digunakan untuk memanggil getPointerPos
const handleStart = (e) => { 
  if (gameState.value !== 'PLAYING') return;
  isDragging = true;
  const pos = getPointerPos(e);
  player.targetX = pos.x;
  player.targetY = pos.y;
};

const handleMove = (e) => {
  if (!isDragging || gameState.value !== 'PLAYING') return;
  const pos = getPointerPos(e);
  player.targetX = pos.x;
  player.targetY = pos.y;
};

const handleEnd = () => {
  isDragging = false;
};

// --- CORE ENGINE ---
const resizeCanvas = () => {
  if (container.value && gameCanvas.value) {
    gameCanvas.value.width = container.value.clientWidth;
    gameCanvas.value.height = container.value.clientHeight;
    player.x = gameCanvas.value.width / 2 - player.w / 2;
    player.y = gameCanvas.value.height - 150;
    player.targetX = player.x;
    player.targetY = player.y;
  }
};

const update = () => {
  if (gameState.value !== 'PLAYING') return;
  const W = gameCanvas.value.width;
  const H = gameCanvas.value.height;

  const prevX = player.x;
  player.x += (player.targetX - player.x) * 0.15;
  player.y += (player.targetY - player.y) * 0.15;
  player.tilt = (player.x - prevX) * 2.5;

  player.x = Math.max(0, Math.min(W - player.w, player.x));
  player.y = Math.max(H * 0.1, Math.min(H - player.h, player.y));

  const throttle = (H - player.y) / H;
  speed += (throttle * 20 - speed) * 0.05;

  roadOffset += speed;
  trackCurve = Math.sin(roadOffset * 0.005) * (W * 0.15);

  coins.forEach((coin, i) => {
    coin.y += speed + 3;
    const dist = Math.sqrt((player.x + player.w/2 - coin.x)**2 + (player.y + player.h/2 - coin.y)**2);
    if (dist < 45) { score.value += 10; coins.splice(i, 1); }
    if (coin.y > H + 50) coins.splice(i, 1);
  });

  if (Math.random() < 0.06 && speed > 2) {
    const roadWidth = W > 600 ? 450 : W * 0.85;
    coins.push({
      x: (W/2 - roadWidth/2 + 50) + Math.random() * (roadWidth - 100) + trackCurve,
      y: -50, r: 15
    });
  }
};

const draw = () => {
  if (!ctx || !gameCanvas.value) return;
  const W = gameCanvas.value.width;
  const H = gameCanvas.value.height;

  ctx.fillStyle = '#1b5e20';
  ctx.fillRect(0, 0, W, H);

  const roadW_B = W > 600 ? 500 : W * 0.9;
  const roadW_T = roadW_B * 0.5;
  ctx.fillStyle = '#333';
  ctx.beginPath();
  ctx.moveTo(W/2 - roadW_T/2 + trackCurve, 0);
  ctx.lineTo(W/2 + roadW_T/2 + trackCurve, 0);
  ctx.lineTo(W/2 + roadW_B/2, H);
  ctx.lineTo(W/2 - roadW_B/2, H);
  ctx.fill();

  ctx.strokeStyle = '#fff';
  ctx.setLineDash([30, 40]);
  ctx.lineDashOffset = -roadOffset * 2;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(W/2 + trackCurve * 0.5, 0);
  ctx.lineTo(W/2, H);
  ctx.stroke();
  ctx.setLineDash([]);

  coins.forEach(c => {
    ctx.fillStyle = '#f1c40f';
    ctx.beginPath(); ctx.arc(c.x, c.y, c.r, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();
  });

  ctx.save();
  ctx.translate(player.x + player.w/2, player.y + player.h/2);
  ctx.rotate(player.tilt * Math.PI / 180);
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.beginPath(); ctx.ellipse(0, 45, 20, 8, 0, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = '#e74c3c';
  ctx.fillRect(-player.w/2, -player.h/2, player.w, player.h);
  ctx.fillStyle = '#222';
  ctx.fillRect(-12, -25, 24, 25);
  ctx.restore();

  update();
  animationFrame = requestAnimationFrame(draw);
};

const startGame = () => {
  score.value = 0; timeLeft.value = 30; coins = []; speed = 0;
  gameState.value = 'PLAYING';
  resizeCanvas();
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (timeLeft.value > 0) timeLeft.value--;
    else {
      gameState.value = 'OVER';
      saveScore(score.value);
      clearInterval(timerInterval);
    }
  }, 1000);
};

onMounted(() => {
  ctx = gameCanvas.value.getContext('2d');
  loadScores();
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  draw();
});

onUnmounted(() => {
  window.removeEventListener('resize', resizeCanvas);
  clearInterval(timerInterval);
  cancelAnimationFrame(animationFrame);
});
</script>

<style scoped>
.game-wrapper {
  position: relative; width: 100%; height: 100vh;
  background: #000; overflow: hidden; touch-action: none;
}
canvas { display: block; width: 100%; height: 100%; }

.hud {
  position: absolute; top: 20px; width: 100%; display: flex;
  justify-content: space-between; padding: 0 25px; z-index: 10; pointer-events: none;
}
.stat {
  background: rgba(0,0,0,0.85); color: #fff; padding: 10px 15px;
  border-radius: 10px; font-weight: bold; border: 2px solid #f1c40f;
}
.timer.low-time { color: #ff5252; border-color: #ff5252; animation: blink 0.5s infinite; }
@keyframes blink { 50% { opacity: 0.5; } }

.overlay {
  position: absolute; inset: 0; background: rgba(0,0,0,0.9);
  display: flex; align-items: center; justify-content: center; z-index: 100;
}
.modal {
  background: #1e1e1e; padding: 30px; border-radius: 20px;
  text-align: center; color: #fff; width: 90%; max-width: 400px; border: 1px solid #333;
}
.input-section { margin-bottom: 20px; }
.input-section input {
  width: 100%; padding: 12px; border-radius: 10px; border: none;
  background: #333; color: #fff; text-align: center; font-size: 1rem;
}
.leaderboard {
  background: #252525; border-radius: 15px; padding: 15px; margin-bottom: 20px;
}
.leaderboard h3 { font-size: 0.9rem; color: #f1c40f; margin-bottom: 10px; }
table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
th { border-bottom: 1px solid #444; padding-bottom: 5px; opacity: 0.7; }
td { padding: 8px 5px; border-bottom: 1px solid #333; }
tr.current { color: #2ecc71; font-weight: bold; }

.actions { display: flex; flex-direction: column; gap: 10px; }
.play-btn {
  background: #f1c40f; color: #000; border: none; padding: 15px;
  border-radius: 50px; font-weight: 900; cursor: pointer;
}
.play-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.export-btn {
  background: transparent; color: #f1c40f; border: 1px solid #f1c40f;
  padding: 10px; border-radius: 50px; font-size: 0.8rem; cursor: pointer;
}
</style>