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

      <!-- Breadcrumb / Path -->
      <div class="text-sm text-gray-600">
      </div>
    </div>
  <section
    class="relative w-full max-w-3xl mx-auto mt-10 p-6 rounded-3xl bg-white/60 
           backdrop-blur-lg border border-white/40 shadow-lg overflow-hidden"
  >
    <!-- Decorative gradient background glow -->
    <div
      class="absolute inset-0 bg-gradient-to-br from-emerald-100 via-lime-50 to-transparent 
             opacity-70 blur-2xl -z-10"
    ></div>

    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <h2
        class="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r 
               from-emerald-500 to-lime-500 bg-clip-text text-transparent"
      >
        📖 Sinopsis
      </h2>
      <span
        class="text-xs uppercase tracking-wide bg-emerald-100 text-emerald-700 
               font-semibold px-3 py-1 rounded-full"
      >
        Manga Detail
      </span>
    </div>

    <!-- Synopsis Text / Empty State -->
    <transition name="fade" mode="out-in">
      <template v-if="synopsis">
        <p
          key="has-synopsis"
          class="text-gray-700 leading-relaxed text-justify indent-6"
        >
          {{ synopsis }}
        </p>
      </template>
      <template v-else>
        <div
          key="no-synopsis"
          class="flex flex-col items-center justify-center py-8 text-gray-400 italic"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-10 h-10 mb-2 opacity-60"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 8c-1.657 0-3 1.343-3 3 0 .85.355 1.622.93 2.172C8.355 13.622 8 14.394 8 15.244 8 17.82 10.24 20 12 20s4-2.18 4-4.756c0-.85-.355-1.622-.93-2.172.575-.55.93-1.322.93-2.172 0-1.657-1.343-3-3-3z"
            />
          </svg>
          <p>Sinopsis belum tersedia.</p>
        </div>
      </template>
    </transition>

    <!-- Gradient Border Glow -->
    <div
      class="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r 
             from-lime-400 via-emerald-300 to-cyan-300 animate-[pulse_3s_infinite]"
    ></div>
  </section>
</template>

<script>
export default {
  name: "MangaSynopsis",
  props: {
    synopsis: {
      type: String,
      required: false,
      default: "",
    },
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.8s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
@keyframes pulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}
</style>
