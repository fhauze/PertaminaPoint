<template>
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
      <span class="text-emerald-600 font-medium cursor-pointer hover:underline" @click="goEntertainment">History</span>
    </div>
  </div>
  <div class="min-h-screen bg-gradient-to-b from-green-100 to-green-300 text-white font-sans flex flex-col">
    <!-- Header -->
    <div class="text-center mt-8">
      <h1 class="text-4xl font-extrabold bg-gradient-to-r from-emerald-500 to-lime-500 bg-clip-text text-transparent pb-4">
        <span></span>Point History
      </h1>
      
    </div>
    <!-- Summary Card -->
    <div class="p-4 flex justify-center">
      <div class="bg-gradient-to-b from-green-100 to-green-200 bg-opacity-5 rounded-2xl p-6 text-center w-full max-w-sm shadow-lg backdrop-blur-md">
        <p class="text-md text-black font-bold">Total Poin </p>
        <h2 class="text-4xl font-bold text-yellow-300 animate-[pulse_3s_infinite]">{{ myTotalPoint }}</h2>
      </div>
    </div>

    <!-- Filter Section -->
    <div class="flex justify-center space-x-3 mt-2 mb-4">
      <button
        v-for="cat in categories"
        :key="cat"
        class="px-3 py-1 rounded-full text-sm font-semibold transition-all"
        :class="selectedCategory === cat
          ? 'bg-yellow-400 text-indigo-900'
          : 'bg-white bg-opacity-20 text-black hover:bg-opacity-40'"
        @click="selectedCategory = cat"
      >
        {{ cat }}
      </button>
    </div>

    <!-- Point History List -->
    <main class="flex-1 overflow-y-auto px-4 pb-6">
      <transition-group name="fade" tag="div" class="space-y-3 max-w-xl mx-auto">
        <div
          v-for="(entry) in filteredHistory"
          :key="entry.id"
          class="flex justify-between items-center bg-white bg-opacity-15 backdrop-blur-md rounded-xl p-4 shadow hover:bg-opacity-25 transition-all"
        >
          <div>
            <h3 class="font-semibold text-black">{{ entry.mission?.name || 'Unknown Mission'}} </h3>
            <p class="text-sm text-black">{{ entry.mission?.category }}</p>
            <p class="text-xs text-black">{{ entry.completed_at }}</p>
          </div>
          <span
            class="font-bold text-lg"
            :class="entry.points > 0 ? 'text-orange-300' : 'text-red-300'"
          >
            {{ entry.points > 0 ? '+' : '' }}{{ entry.point }}
          </span>
        </div>
      </transition-group>

      <p v-if="filteredHistory.length === 0" class="text-center mt-8 text-indigo-200 italic">
        Belum ada riwayat poin untuk kategori ini 🌱
      </p>
    </main>

    <!-- Footer -->
    <!-- <footer class="py-4 text-center bg-indigo-700 text-sm">
      🌟 Terus kumpulkan poin dari aktivitas positifmu!
    </footer> -->
  </div>
</template>

<script>
export default{
    name:'point-history'
}
</script>
<script setup>
  import { ref, computed, onMounted } from "vue";
  import { getUserPoint } from "@/services/missions";

  const myTotalPoint = ref(0);
  
  // Data contoh (bisa diganti dari backend)
  const pointHistory = ref([
    { id: 1, activity: "Menang Game Word Spells", source: "Game", points: 30, date: "2025-10-21 10:22" },
    { id: 2, activity: "Membaca artikel motivasi", source: "Content", points: 10, date: "2025-10-21 12:00" },
    { id: 3, activity: "Membaca manga positif", source: "Manga", points: 15, date: "2025-10-22 09:15" },
    { id: 4, activity: "Kehilangan streak harian", source: "Penalty", points: -5, date: "2025-10-22 09:20" },
    { id: 5, activity: "Menjawab quiz refleksi diri", source: "Quiz", points: 25, date: "2025-10-22 11:30" },
  ]);

  // Filter kategori
  const categories = ["Semua", "Game", "Content", "Manga", "Quiz", "Penalty"];
  const selectedCategory = ref("Semua");

  // Hitung total poin
  // const totalPoints = computed(() =>
  //   pointHistory.value.reduce((sum, e) => sum + e.points, 0)
  // );

  // Filter sesuai kategori
  const filteredHistory = computed(() => {
    if (selectedCategory.value === "Semua") return pointHistory.value;
    return pointHistory.value.filter(
      e => e.mission?.category.toLowerCase() === selectedCategory.value.toLowerCase()
    );
  });

  
  const totalPoints = computed(() =>
    pointHistory.value.reduce((sum, e) => sum + e.point, 0)
  );


  async function  getHistory(){
    const histories = await getUserPoint();
    const myPointHistory = histories.myTask;
    myTotalPoint.value =totalPoints //histories.myTaskCount
    pointHistory.value = myPointHistory
  }

  onMounted(() => {
    getHistory();
  });

</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: all 0.4s ease;
}
.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
