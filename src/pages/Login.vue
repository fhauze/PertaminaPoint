<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-green-100 to-green-300 p-4
    mb-[-100px]"
    style="background-image:url('/images/footer.png'); 
    background-repeat:no-repeat; 
    background-position:bottom; 
    background-size: 100% 200px;"
    margin-bottom=-10px;
  >
    <!-- Container utama -->
    <div class="w-full max-w-sm sm:max-w-md bg-white rounded-3xl shadow-lg p-6 sm:p-8 flex flex-col items-center">
      <!-- Logo -->
      <div class="flex flex-col items-center">
        <img src="/images/logo.png" alt="Logo" class="w-24 h-auto mb-4" />
      </div>

      <!-- Avatar/Profile -->
      <div class="relative w-32 h-32 flex items-center justify-center mb-6">
        <img
          :src="selectedProfile.img"
          :alt="selectedCharacter.name"
          class="w-32 h-32 object-contain rounded-full border-4 border-lime-400 shadow-md"
        />
      </div>

      <!-- Form -->
      <div class="w-full">
        <form @submit.prevent="login">
          <div class="mb-4">
            <input
              v-model="username"
              placeholder="Username"
              type="text"
              class="w-full h-12 px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-2xl
                    focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-400"
            />
          </div>

          <div class="mb-6">
            <input
              v-model="password"
              type="password"
              placeholder="Password"
              class="w-full h-12 px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-2xl
                    focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-400"
            />
          </div>

          <button
            @click="login"
            class="w-full h-12 bg-lime-500 text-white font-semibold rounded-2xl 
                  hover:bg-lime-400 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500"
          >
            LOGIN
          </button>

          <div class="w-full flex items-center justify-center mt-4">
            <router-link to="/register" class="text-blue-600 font-semibold hover:underline">
              REGISTER
            </router-link>
          </div>
        </form>
      </div>
    </div>
    <LoadingComponent :show="isLoading" />
  </div>
</template>

<script>
export default {
  name: "LoginPage",
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
      profiles: [
        { name: "profile", img: "/images/propic-001.svg" },
        { name: "profile", img: "/images/propic-blank.svg" },
      ],
      selectedCharacter: { name: "Tiger", img: "../images/char/tiger.png" },
      selectedProfile: { name: "profile", img: "/images/propic-001.svg" },
      isLoading: false,
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
  },
};
</script>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import LoadingComponent   from '@/components/Loading.vue'

const router = useRouter()
const auth = useAuthStore()
const username = ref('')
const password = ref('')
const error = ref('')
const isLoading = ref(false)

async function login() {
  try {
    isLoading.value = true
    await auth.login(username.value, password.value)
    
    router.push('/')
  } catch (err) {
    error.value = err.message
  }finally{
    isLoading.value = false;
  }
}
</script>

<style scoped>
/* Tambahan kecil untuk tampilan */
body {
  font-family: 'Inter', sans-serif;
}
#loading {
  position: fixed;
  inset: 0;
}
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

</style>