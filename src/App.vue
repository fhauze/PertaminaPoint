<template>
  <div class="min-h-screen flex flex-col bg-gradient-to-r from-emerald-200 via-teal-100 to-lime-200 pb-24 pt-0">
    <div id="breadcrumb-target"></div>
    <div class="w-full h-[100px] items-center justify-items-center p-2 mt-20 mb-[20px] from-emerald-200 via-teal-100 to-lime-200">
      <div class="w-48 h-[100%]">
        <img
            src="@/assets/images/logo_mypertamina.png"
            :alt="logo"
            class="object-contain relative z-30 pb-0 w-[100%] h-[100%] md:w-64"
        />
      </div>
    </div>
    <!-- Page Content -->
    <router-view v-slot="{ Component }">
      <div class="flex-1">
        <component :is="Component" />
      </div>
    </router-view>

    <!-- Bottom Navigation -->
    <nav v-if="!['/register', '/login'].includes($route.path)" class="fixed bottom-0 left-0 w-full border-t shadow-lg flex justify-center gap-[100px] items-center z-50 h-[90px] bg-lime-200">
      <router-link 
        to="/" 
        class="flex flex-col items-center text-gray-600 hover:text-green-500 p-2"
        active-class="text-green-600 font-bold"
        exact
      >
        <img src="/images/but-nav-home.png" class="w-10 h-10" />
        <span class="text-xs font-bold">Home</span>
      </router-link>

      <router-link 
        to="/character" 
        class="flex flex-col items-center text-gray-600 hover:text-green-500 p-2"
        active-class="text-green-600 font-bold"
      >
        <img src="/images/but-nav-koleksi.png" class="w-10 h-10" />
        <span class="text-xs font-bold">Koleksi</span>
      </router-link>

      <router-link 
        to="/entertainment" 
        class="flex flex-col items-center text-gray-600 hover:text-green-500 p-2"
        active-class="text-green-600 font-bold"
      >
        <img src="/images/but-nav-hiburan.png" class="w-10 h-10" />
        <span class="text-xs font-bold">Hiburan</span>
      </router-link>

    </nav>
  </div>
</template>

<script>
export default {
  name: "App",
}
</script>
