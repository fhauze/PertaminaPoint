<template>
  <!-- Header Section -->
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
  <div
    class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-emerald-200 via-teal-100 to-lime-200 
      relative overflow-hidden text-gray-800 mb-[-10px]"
      style="background-image:url('/images/footer.png'); 
      background-repeat:no-repeat; 
      background-position:bottom; 
      background-size: 100% 200px;"
      margin-bottom=-10px;
  >
    <div class="absolute inset-0 z-0">
      <div class="absolute top-10 left-10 w-72 h-72 bg-emerald-300/30 blur-3xl rounded-full animate-pulse"></div>
      <div class="absolute bottom-10 right-10 w-96 h-96 bg-lime-400/30 blur-3xl rounded-full animate-pulse"></div>
    </div>
    
    <div
      class="backdrop-blur-xl bg-white/30 border border-white/40 rounded-3xl shadow-2xl p-6 mt-10 w-[90%] max-w-md 
        flex flex-col items-center text-center relative overflow-hidden"
    >
      <div
        class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-lime-400 via-emerald-300 to-cyan-300 rounded-t-3xl animate-[pulse_3s_infinite]"
      ></div>

      <img
        src="/images/games.png"
        alt="Hiburan"
        class="w-40 h-auto mt-6 transition-transform duration-500 hover:scale-110"
      />

      <h2 class="text-3xl font-extrabold mt-4 bg-gradient-to-r from-emerald-500 to-lime-500 bg-clip-text text-transparent tracking-wide">
        Mini Game
      </h2>
      <p class="text-gray-600 mt-2 text-sm">Pilih game favoritmu dan mainkan sesuka kamu</p>
    </div>
    <div class="w-[90%] max-w-md grid grid-cols-2 gap-6 mt-10 px-2 z-20 pb-[40px]"
    >
      <div
        v-for="game in games"
        :key="game.name"
        @click="toContents(game)"
        class="
            group cursor-pointer relative flex flex-col items-center justify-center p-4 rounded-2xl
            backdrop-blur-xl bg-white/30 border border-white/40 shadow-lg 
            hover:shadow-[0_0_25px_rgba(34,197,94,0.4)] hover:bg-white/50
            transform-gpu transition-all duration-300 hover:-translate-y-2 hover:scale-105"
        @mousemove="onMouseMove($event, game.name)"
        @mouseleave="resetTilt(game.name)"
        :style="{ transform: tiltTransforms[game.name] }"
      >
        <div v-if="game.badge"
            class="absolute top-2 right-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow">
          {{ game.badge }}
        </div>
        <div class="relative w-24 h-24 flex items-center justify-center">
          <img
            :src="game.img"
            :alt="game.name"
            class="w-full h-full object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-500"
          />
          <div
            class="absolute inset-0 bg-gradient-to-t from-emerald-400/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          ></div>
        </div>
        <p class="mt-3 text-emerald-800 font-bold tracking-wide group-hover:text-emerald-600 transition-colors duration-300">
          {{ game.name }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    name: "mini-games",
    data(){
      return{
            games: [
                { name: "Temukan kata", img: "/images/crossword.png", badge:"New" },
                { name: "Tebak Gambar", img: "/images/cards.png", badge:"New" },
                { name: "Word Spells", img: "/images/word-spells.png", badge:"New" },
                { name: "Point Save", img: "/images/cards.png"},
                { name: "Game Motor", img: "/images/crossword.png"},
            ],
            tiltTransforms: {}
        };
    },
    methods: {
        toContents(content) {
            if(content){
                if(content.name == "Temukan kata"){
                    this.$router.push({ name: "game-find-words", params: { content: content } });
                }else if(content.name == "Tebak Gambar"){
                    this.$router.push({ name: "flipcard", params: { content: content } });
                }else if(content.name == "Word Spells"){
                  this.$router.push({name: "word-spells", params: {content: content}})
                }else if(content.name == "Point Save"){
                  this.$router.push({name:"point-save", params: {content: content}})
                }else if(content.name == 'Game Motor'){
                  this.$router.push({name:'moto-game'});
                }
            }
        },
        resetTilt(name) {
            this.tiltTransforms = {
                ...this.tiltTransforms,
                [name]: `rotateY(0deg) rotateX(0deg)`
            };
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
        goBack(){
          window.history.back('/entertainment');
        }
    }
}
</script>