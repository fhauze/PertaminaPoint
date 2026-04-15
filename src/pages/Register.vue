<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-green-100 to-green-300 p-4
    mb-[-100px]"
    style="background-image:url('/images/footer.png'); 
    background-repeat:no-repeat; 
    background-position:bottom; 
    background-size: 100% 200px;"
    margin-bottom=-10px;
  >
    <!-- CARD / CONTAINER -->
    <div class="w-full max-w-sm sm:max-w-md bg-white rounded-3xl shadow-xl p-6 sm:p-8 flex flex-col items-center">      
      <!-- LOGO -->
      <div class="flex flex-col items-center mb-4">
        <img src="/images/logo.png" alt="Logo" class="w-24 h-auto mb-2" />
        <h2 class="text-xl font-bold text-gray-700">{{ selectedCharacter.name }}</h2>
      </div>
      <!-- PROFILE AVATAR -->
      <div class="relative w-32 h-32 flex items-center justify-center mb-6">
        <img
          :src="selectedProfile.img"
          :alt="selectedCharacter.name"
          class="w-32 h-32 object-contain rounded-full border-4 border-lime-400 shadow-md"
        />
      </div>
      <!-- INPUT FIELDS -->
      <div class="w-full space-y-4">
        <input
          v-model="username"
          type="text"
          placeholder="Phone"
          class="w-full h-12 px-4 text-gray-700 bg-gray-50 border border-gray-300 rounded-2xl 
                 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-400 shadow-sm"
        />
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          class="w-full h-12 px-4 text-gray-700 bg-gray-50 border border-gray-300 rounded-2xl 
                 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-400 shadow-sm"
        />
        <input
          v-model="re_password"
          type="password"
          placeholder="Re-password"
          class="w-full h-12 px-4 text-gray-700 bg-gray-50 border border-gray-300 rounded-2xl 
                 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-400 shadow-sm"
        />
        <!-- REGISTER BUTTON -->
        <button
          @click="register"
          class="w-full h-12 bg-lime-500 text-white font-semibold rounded-2xl 
                 hover:bg-lime-400 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500"
        >
          REGISTER
        </button>

        <!-- LOGIN LINK -->
        <div class="flex items-center justify-center mt-2">
          <router-link to="/login">
            <span class="font-bold text-sm text-blue-600 hover:underline">L O G I N</span>
          </router-link>
        </div>

        <!-- ERROR MESSAGE -->
        <p v-if="error" class="text-red-500 text-sm mt-2 text-center">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "RegisterPage",
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
      showModal: false,
      modalType: "profile",
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

const router = useRouter()
const auth = useAuthStore()
const username = ref('')
const password = ref('')
const re_password = ref('')
const error = ref('')

async function register() {
  try {
    await auth.register(username.value, password.value, re_password.value)
    router.push('/login')
  } catch (err) {
    console.error(err)
    error.value = err.response?.data?.detail || err.message || 'Registration failed'
  }
}
</script>

<style scoped>
body {
  font-family: 'Inter', sans-serif;
}
</style>
