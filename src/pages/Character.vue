<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-green-100 
  to-green-300 pb-28 pr-2 pl-2 mb-[-10px]"
    style="background-image:url('/images/footer.png'); 
    background-repeat:no-repeat; 
    background-position:bottom; 
    background-size: 100% 200px;"
    margin-bottom=-10px;
  >
    <div class="w-full max-w-md flex flex-col items-center z-60 mb-8" >
        <div class="relative flex items-end justify-center z-30 px-[10px] mt-[40px]">
          <img
            src="/images/logo.png"
            :alt="selectedCharacter.name"
            class="object-contain relative z-30 pb-0"
          />
        </div>
        <!-- <h2 class="mt-6 text-xl font-bold text-gray-700">
          {{ selectedCharacter.name }}
        </h2>
        <div class="relative w-40 h-50 flex items-end justify-center z-30 px-[10px]">
          <img
            :src="selectedProfile.img"
            :alt="selectedCharacter.name"
            class="w-40 h-60 object-contain relative z-30 pb-12"
          />
          <div
              class="absolute w-[30px] h-[30px] right-0 top-[100px] z-40 bg-green-600 hover:bg-green-400 transition"
              style="
                -webkit-mask: url('/images/icon-edit.svg') no-repeat center;
                -webkit-mask-size: contain;
                mask: url('/images/icon-edit.svg') no-repeat center;
                mask-size: contain;
              "
              @click="changeAva('profile')"
            ></div>
        </div> -->
     </div>
    <div class="w-full max-w-md flex flex-col items-center z-60">
      <div class="bg-lime-200 shadow-xl rounded-2xl p-6 flex flex-col items-center 
        relative w-full px-[10px] mx-[10px] bg-cover bg-center bg-no-repeat" 
        style="background-image: url('/images/bghero.jpg')">
        <div class="relative w-40 h-50 flex items-end justify-center z-30 px-[10px] mt-[40px]">
          <img
            :src="selectedCharacter.img"
            :alt="selectedCharacter.name"
            class="w-40 h-60 object-contain relative z-30"
            :class="screenWidth <= 400 ? 'pb-16' : 'pb-14'"
          />
        </div>

        <!-- <div class="absolute bottom-9 w-32 h-16 flex items-center justify-center perspective-800">
          <div class="w-28 h-4 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full absolute top-3 left-0 blur-sm opacity-70"></div>
          <div
            class="absolute w-28 h-8 rounded-full bg-white transform-gpu rotate-x-60 scale-y-50 shadow-md z-10 top-1"
          ></div>
          <div
            class="absolute w-28 h-8 rounded-full bg-grey transform-gpu rotate-x-60 scale-y-50 shadow-md z-10 top-3"
          ></div>
          <div
            class="absolute w-28 h-5 rounded-full bg-black opacity-30 blur-md bottom-5"
          ></div>
        </div> -->
        
        <!-- <div class="flex items-center justify-center w-[30px] h-[30px] rounded-full border-4 border-green-500 absolute top-2 right-2">
        <img src="/images/but-nav-koleksi.png" alt="img" class="w-[20px] h-[20px] " 
        @click="changeAva('character')">
        </div> -->
      </div>
    </div>

    <!-- Character Selection -->
     <div class="w-full max-w-md flex flex-col items-center z-60" >
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 w-full max-w-2xl">
          <div 
            v-for="char in characters" 
            :key="char.name"
            @click="selectedCharacter = char"
            class="cursor-pointer flex flex-col items-center p-4 rounded-xl 
            shadow-md hover:shadow-lg transition bg-white duration-300 hover:-translate-y-2
            "
            :class="{'ring-4 ring-green-400': selectedCharacter.name === char.name}"
          >
            <img :src="char.img" :alt="char.name" class="w-20 h-20 object-contain img-hover:scale-100 transition-transform duration-300"/>
            <!-- <p class="mt-2 text-gray-600 font-medium">{{ char.name }}</p> -->
          </div>
        </div>
      </div>
  </div>
</template>

<script>
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
    handleResize() {
      this.screenWidth = window.innerWidth;
    }
  },
  mounted() {
    window.addEventListener("resize", this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.handleResize);
  },
};
</script>

<style scope>
@keyframes zoom {
  0%, 100% {
    opacity: 0.5;
    transform: scale(1);
    color: red;
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
    color: green;
  }
}

.img-hover {
  filter: drop-shadow(0 0 10px rgba(72, 187, 120, 0.5));
}
</style>
