<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b 
  from-green-100 to-green-300 pb-28 pr-2 pl-2 mb-[-10px]"
    style="background-image:url('/images/footer.png'); 
    background-repeat:no-repeat; 
    background-position:bottom; 
    background-size: contain;"
  >
    <div class="relative w-40 h-50 flex items-end justify-center z-30 px-[10px]">
        <img
          :src="selectedProfile.img"
          :alt="selectedCharacter.name"
          class="w-32 md:w-40 lg:h-[60] object-contain relative z-30 pb-12"
        />
        <div
            class="absolute w-[30px] h-[30px] right-4 top-[85px] z-40 bg-yellow-400 hover:bg-green-400 transition cursor-pointer"
            style="
              -webkit-mask: url('/images/icon-edit.svg') no-repeat center;
              -webkit-mask-size: contain;
              mask: url('/images/icon-edit.svg') no-repeat center;
              mask-size: contain;
            "
            @click="changeAva('profile')"
          >
        </div>
    </div>
    <h2 class="mt-[-70px] mb-6 text-md font-bold text-grey-400">{{ this.savedUser?.username || 'S'}}</h2>
    
    <div class="w-full max-w-md md:max-w-xl flex flex-col items-center z-60 px-2">
      <div class="bg-lime-200 shadow-xl rounded-2xl p-6 flex flex-col items-center 
        relative w-full bg-cover bg-center bg-no-repeat" 
        style="background-image: url('/images/bghero.jpg')">
        <div class="relative w-40 h-50 flex items-end justify-center z-30 px-[10px] mt-[40px]">
          <img
            :src="selectedCharacter.img"
            :alt="selectedCharacter.name"
            class="w-40 h-60 object-contain relative z-30 pb-12"
          />
        </div>
        <div class="flex flex-row items-start justify-between gap-4 w-full pt-5 absolute bottom-2 left-0 px-4">
          <div class="bg-white w-[90px] h-[60px] md:w-[120px] rounded-xl p-1 shadow-lg flex flex-col">
            <span class="text-xs font-bold text-gray-800 items-center text-center">{{ 'KOIN' }}</span>
            <div class="flex items-end justify-center gap-2 p-1">
              <img src="/images/token-poin.svg" alt="coin" class="w-6 h-6" />
              <span class="font-bold">{{ this.points }}</span>
            </div>
          </div>
          <div class="bg-white w-[90px] h-[60px] md:w-[120px] rounded-xl p-1 shadow-lg flex flex-col">
            <span class="text-xs font-bold text-gray-800 items-center text-center">{{ 'Daily Quest' }}</span>
            <div class="flex items-end justify-center gap-2 p-1">
              <span class="font-bold">{{ this.totalDone }}/{{ this.totalTask }}</span>
            </div>
          </div>
        </div>
        <div class="flex items-center justify-center w-[30px] h-[30px] rounded-full border-4 border-green-500 bg-white hover:bg-green-400 absolute top-2 right-2 cursor-pointer z-50">
          <img src="/images/but-nav-koleksi.png" alt="img" class="w-[20px] h-[20px] " 
          @click="changeAva('character')">
        </div>
      </div>
    </div>

    <div class="logo w-full max-w-md md:max-w-xl flex flex-col items-center mt-4">
      <div class="bg-grey shadow-xl rounded-2xl px-16 py-1 flex flex-col items-center bg-white/50 backdrop-blur-sm">
        <h2 class="mt-4 mb-4 text-md font-bold text-grey-400">Mission List</h2>
      </div>
    </div>

    <div class="w-full max-w-7xl px-4">
      <div v-if="missions.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        <div 
          v-for="mission in missions"
          :key="mission.id"
          class="flex flex-col items-center transform transition-transform duration-300 hover:scale-105"
          >
            <div
              class="relative rounded-3xl p-6 shadow-2xl-soft flex items-start gap-4 w-full py-[10px] overflow-hidden min-h-[180px]"
              :class="{
              'bg-green-100 pointer-events-none opacity-95': mission.userStatus === 'completed',
              'bg-yellow-100': mission.userStatus === 'in_progress',
              'bg-white': mission.userStatus === 'not_started'
            }"
            >
              <div
                v-if="mission.userStatus === 'completed'"
                class="absolute inset-0 flex justify-end items-center pr-6 z-0"
              >
                <span
                  class="text-[48px] md:text-[56px] font-extrabold text-green-600/15 rotate-[-20deg] select-none pointer-events-none"
                  style="mix-blend-mode: multiply;"
                >
                  SELESAI
                </span>
              </div>
              
              <div class="flex-shrink-0 mt-1 relative z-10">
                <img src="/images/qicon2.png" alt="Quest Icon" class="w-12 h-12" />
              </div>

              <div class="flex-1 relative z-10">
                <h2 class="text-lg font-bold text-gray-800 line-clamp-1">{{ mission.name }}</h2>
                <p class="text-sm text-gray-600 mb-2 line-clamp-2">{{ mission.description }}</p>

                <div class="flex flex-wrap items-center gap-3 text-[10px] md:text-xs text-gray-700 pt-2 border-t border-gray-100">
                  <span class="flex items-center gap-1">
                    <svg class="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 11V5a1 1 0 012 0v6a1 1 0 01-2 0zM10 13a1 1 0 100 2 1 1 0 000-2z"/>
                    </svg>
                    {{ timeLeftDH(mission.date_time_from_valid,mission.date_time_to_valid) }}
                  </span>

                  <span class="flex items-center gap-1">
                    <svg class="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 15a5 5 0 100-10 5 5 0 000 10z" /><path fill-rule="evenodd" d="M10 0a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 100-16 8 8 0 000 16z" clip-rule="evenodd"/>
                    </svg>
                    +{{ mission.coin }}
                  </span>
                  <span class="flex items-center gap-1">
                    <svg class="w-4 h-4 text-green-600 transform rotate-180" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 14a1 1 0 01-.707-.293l-4-4a1 1 0 011.414-1.414L10 11.586l3.293-3.293a1 1 0 011.414 1.414l-4 4A1 1 0 0110 14z"/>
                    </svg>
                    +100mm
                  </span>
                </div>

                <div class="flex items-center gap-4 text-xs text-gray-700">
                  <button
                    v-if="mission.userStatus !== 'completed'"
                    :disabled="!isMissionActive(mission.date_time_from_valid, mission.date_time_to_valid)"
                    class="w-full mt-4 py-2 px-4 rounded-lg bg-red-600 text-white font-bold hover:bg-green-700 transition disabled:bg-gray-400"
                    @click="handleMissionClick(mission)"
                  >
                    {{ mission.userStatus === 'in_progress' ? 'LANJUTKAN' : 'MULAI QUEST' }}
                  </button>
                  <div v-else class="w-full mt-4 py-4 px-4"></div>
                </div>
              </div>
            </div>
        </div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        <div class="w-full flex flex-col items-center transform transition-transform duration-300 hover:scale-105">
            <div class="relative rounded-3xl p-6 shadow-2xl-soft flex items-start gap-4 w-full py-[10px] overflow-hidden bg-white">
              <div class="absolute inset-0 flex justify-end items-center pr-6 z-0">
                <span class="text-[30px] font-extrabold text-green-600/15 rotate-[-20deg] select-none pointer-events-none">Coming Soon</span>
              </div>
              <div class="flex-shrink-0 mt-1 relative z-10">
                <img src="/images/qicon2.png" alt="Quest Icon" class="w-12 h-12 opacity-50" />
              </div>
              <div class="flex-1 relative z-10">
                <h2 class="text-xl font-bold text-gray-400">{{ 'Mission Draft' }}</h2>
                <p class="text-sm text-gray-300 mb-2">{{ '-------------------------------------------' }}</p>
                <div class="flex items-center gap-4 text-xs text-gray-300 pt-2">
                   <span>---</span><span>---</span><span>---</span>
                </div>
                <button disabled class="w-full mt-4 py-2 px-4 rounded-lg bg-gray-200 text-gray-400 font-bold">
                   Coming Soon
                </button>
              </div>
            </div>
        </div>
      </div>
    </div>

    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[100] px-4"
    >
      <div class="bg-white rounded-2xl p-6 w-full max-w-sm md:max-w-md max-h-[90vh] overflow-y-auto relative shadow-2xl">
        <h2 class="text-xl font-bold mb-4 text-center">Pilih {{ modalType === 'profile' ? 'Profil' : 'Karakter' }}</h2>

        <button @click="showModal = false" class="absolute top-4 right-4 text-gray-500 hover:text-black text-xl">✕</button>

        <div class="grid grid-cols-3 gap-4" v-if="modalType === 'profile'">
          <div 
            v-for="prof in profiles" 
            :key="prof.name"
            @click="profileListSelected(prof)"
            class="cursor-pointer hover:scale-105 transform transition flex flex-col items-center p-2 rounded-xl hover:bg-gray-50"
          >
            <img :src="prof.img" :alt="prof.name" class="w-16 h-16 rounded-full border-2 border-transparent hover:border-green-500"/>
            <span class="text-[10px] md:text-xs mt-2 text-center">{{ prof.name }}</span>
          </div>
          
          <div class="col-span-3 flex flex-col gap-3 mt-6">
            <button 
              @click="$router.push('/profile/mission-history')"
              class="w-full bg-yellow-400 text-indigo-900 font-bold px-4 py-3 rounded-xl shadow-md hover:bg-yellow-300 active:scale-95 transition-all text-sm"
            >
              ⭐ Lihat Riwayat Poin
            </button>
            <button 
              @click="handleLogout"
              class="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-rose-600 
                    text-white font-semibold py-3 px-6 rounded-xl shadow-md hover:opacity-90 transform transition-all active:scale-95 text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-4" v-if="modalType === 'character'">
          <div 
            v-for="char in characters" 
            :key="char.name"
            @click="clickCharacter(char)"
            class="cursor-pointer hover:scale-105 transform transition flex flex-col items-center p-2 rounded-xl hover:bg-gray-50"
          >
            <img :src="char.img" :alt="char.name" class="w-16 h-16 object-contain"/>
            <span class="text-[10px] md:text-xs mt-2 text-center">{{ char.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { computed } from "vue"
import { getContent } from '@/services/content';
import { getMissions,getMissionLogs, createMissionLog, getUserPoint } from '@/services/missions';
import { useAuthStore } from '@/stores/auth'
import { nextTick } from 'vue';

export default {
  name: "App",
  data() {
    return {
      characters: [
        { name: "Bear", img: "../images/char/bear.png" },
        { name: "Rabbit", img: "../images/char/rabbit.png" },
        { name: "Fox", img: "../images/char/fox.png" },
        { name: "Brown Bear", img: "../images/char/brownbear.png" },
        { name: "Lion", img: "../images/char/lion.png" },
        { name: "Monkey", img: "../images/char/monkey.png" },
        { name: "Pig", img: "../images/char/pig.png" },
        { name: "Sheep", img: "../images/char/sheep.png" },
        { name: "Tiger", img: "../images/char/tiger.png" },
      ],

      profiles : [
        {name : "profile", img: "/images/propic-001.svg"},
        {name : "profile", img: "/images/propic-blank.svg"},
      ],

      selectedCharacter: { name: "Tiger", img: "../images/char/tiger.png" },
      showModal:false,
      selectedProfile : {name : "profile", img: "/images/propic-001.svg"},
      modalType : "profile",
      isDone : true,
      contents : getContent(),
      missions : [],
      now : Date.now(),
      timer: null,
      misi:[],
      logs:[],
      authStore : useAuthStore(),
      savedUser : JSON.parse(localStorage.getItem('user')) || {},
      points :0,
      totalTask : 0,
      totalDone :0,
    };
  },
  methods: {
    clickCharacter(char) {
      this.selectedCharacter = char;
      this.showModal = false;
    },
    changeAva(type) {
      this.modalType = type;
      this.showModal = true;
    },
     profileListSelected(profile) {
      this.selectedProfile = profile;
      this.showModal = false;
    },
    // isMissionActive(dateFrom, timeFrom) {
    //   if (!dateFrom || !timeFrom) return false;
    //   const start = new Date(`${dateFrom}T${timeFrom}`);
    //   const now = this.now ? new Date(this.now) : new Date();
    //   return now >= start;
    // },
    isMissionActive(from, to) {
      if (!from || !to) return false;
      const start = new Date(from);
      const end = new Date(to);
      const now = new Date();
      return now >= start && now <= end;
    },
    async myPoints(){
      const points = await getUserPoint();
      this.points = points.myPoints;
      this.totalTask = points.activeTaskCount;
      this.totalDone = points.myActiveTaskCompleteCount;
    },
    async getMission() {
      const res = await getMissions();
      this.missions = res.results;
    },
    async getLogs(){
      const resLog = await getMissionLogs();
      this.logs = resLog.results;
    },
    timeLeftDH(dateValidFrom, dateValidTo) {
      if (!dateValidFrom || !dateValidTo) return "—";

      try {
        const start = new Date(dateValidFrom);
        const end = new Date(dateValidTo);   
        const now = new Date(this.now); 

        const diffToStart = start - now;
        const diffToEnd = end - now;

        const pad = (n) => String(n).padStart(2, "0")
        if (diffToStart > 0) {
          const totalSeconds = Math.floor(diffToStart / 1000);
          const hours = Math.floor(totalSeconds / 3600);
          const minutes = Math.floor((totalSeconds % 3600) / 60);
          const seconds = totalSeconds % 60;
          return `⏳ ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
        }
        if (diffToEnd > 0) {
          const totalSeconds = Math.floor(diffToEnd / 1000);
          const hours = Math.floor(totalSeconds / 3600);
          const minutes = Math.floor((totalSeconds % 3600) / 60);
          const seconds = totalSeconds % 60;
          return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
        }
        return "❌ Waktu habis";
      } catch (e) {
        console.error("timeLeftDH error:", e);
        return "—";
      }
    },
    timeLeft3(dateValidFrom,dateValidTo, timeValidFrom, timeToValid) {
      if (!dateValidFrom || !timeValidFrom || !dateValidFrom || !timeToValid) return "—";

      const validDate = new Date(`${dateValidFrom}T${timeValidFrom}`);
      const target = new Date(`${dateValidTo}T${timeToValid}`);
      const diffMs = target - validDate;
      
      if (diffMs <= 0) return "Waktu habis";

      const totalSeconds = Math.floor(diffMs / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      const pad = (num) => String(num).padStart(2, '0');

      return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    },
    timeLeft(dateFrom, dateTo, timeFrom, timeTo) {
      if (!dateFrom || !timeFrom || !dateTo || !timeTo) return "—";
      const start = new Date(`${dateFrom}T${timeFrom}`);
      const end = new Date(`${dateTo}T${timeTo}`);
      const current = this.now;

      const pad = (num) => String(num).padStart(2, "0");
      const diffToStart = start - current;
      const diffToEnd = end - current;
      if (diffToStart > 0) {
        const totalSeconds = Math.floor(diffToStart / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return `⏳ ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
      }
      if (diffToEnd > 0) {
        const totalSeconds = Math.floor(diffToEnd / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
      }
      return "❌ Waktu habis";
    },
    downtimeHours(from, to) {
      if (!from || !to) return '-';
      const [fh, fm] = from.split(':').map(Number);
      const [th, tm] = to.split(':').map(Number);
      const start = fh * 60 + fm;
      const end = th * 60 + tm;
      const diff = end - start;
      const hours = (diff / 60).toFixed(2);
      return hours;
    },
    async getMissions() {
      const [resMissions, resLogs] = await Promise.all([
        getMissions(), 
        getMissionLogs() 
      ]);

      const logs = resLogs.results || [];
      this.misi = resMissions.results.map(mission => {
        const log = logs.find(l => l.mission === mission.id) || {};
        return {
          ...mission,
          user_id: log.user_id || null,
          userStatus: log.status || 'not_started', // status default
          claimed_at: log.claimed_at || null,
          completed_at: log.completed_at || null,
          coin_earned: log.coin || mission.coin,
          point_earned: log.point || mission.point,
          image_log: log.image_log || null,
        };
      });
      this.missions = this.misi
    },
    handleMissionClick(mission) {
      const missionWithTask = {
        ...mission,
        tasks:[
          {id: mission.id,name:mission.name, type: mission.task, completed:false}
        ]
      }
      if (mission.userStatus === 'completed') return;
      if (mission.userStatus === 'not_started') {
        // this.startMission(mission);
      }
      if (mission.task === 'scan-qr') {
        this.$router.push({ 
          name: 'quest-missions', 
          params: { id: mission.id } , 
          query: { mission: JSON.stringify(missionWithTask) } 
        });
      } else {
        this.$router.push({ 
          name: 'quest-missions', 
          params: { id: mission.id } , 
          query: { mission: JSON.stringify(missionWithTask) } 
        });
      }
    },

    async startMission(mission) {
      if (!mission || !mission.id) {
        return;
      }
      await createMissionLog({
        mission: mission.id,
        user_id: this.currentUser?.value?.id,
        status: 'in_progress',
        coin: mission.coin,
        point: mission.point
      });

      mission.userStatus = 'in_progress';
    },
    async handleLogout() {
      try {
        await this.authStore.logout();
        await nextTick(); 
        this.$router.push("/login");
      } catch (err) {
        console.error("Logout failed:", err);
      }
    },
  },
  mounted() {
      // this.getLogs();
      this.myPoints();
      this.getMission();
      this.getMissions();
      this.timer = setInterval(() => {
      this.now = Date.now();
    }, 1000);
  },

  beforeUnmount() {
    clearInterval(this.timer);
  },
  computed: {
    currentUser() {
      return this.authStore.currentUser;
    }
  }
}; 
</script>