<template>
  <div class="min-h-screen flex flex-col bg-gradient-to-r from-emerald-200 via-teal-100 to-lime-200 overflow-x-hidden"> 
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
          <span class="text-emerald-600 font-medium cursor-pointer hover:underline" @click="goBack">Missions</span>
          <span class="mx-2">›</span>
          <span class="text-gray-700 font-semibold">Check-in</span>
        </div>
      </div>
    </Teleport>
    <div
      class="flex-1 flex flex-col items-center pt-6 px-4 pb-10"
      style="background-image:url('/images/footer.png'); 
      background-repeat:no-repeat; 
      background-position:bottom; 
      background-size: 100% auto;"
    >
      <div
        class="backdrop-blur-xl bg-white/30 border border-white/40 rounded-3xl shadow-2xl p-6 w-full max-w-md 
          flex flex-col items-center text-center relative overflow-hidden mb-6"
      >
        <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-100 via-green-200 to-green-300 animate-pulse"></div>
        
        <img
          src="@/assets/images/checkin-logo.jpg"
          alt="Hiburan"
          class="w-32 sm:w-40 h-auto mt-2 transition-transform duration-500 hover:scale-105"
        />

        <h2 class="text-2xl sm:text-3xl font-extrabold mt-4 bg-gradient-to-r from-emerald-600 to-lime-600 bg-clip-text text-transparent tracking-wide">
          Check In
        </h2>
        <p class="text-gray-600 mt-1 text-xs sm:text-sm px-4">Pilih game favoritmu dan mainkan sesuka kamu</p>
      </div>

      <div class="w-full max-w-md bg-white/90 sm:bg-white border border-emerald-50 rounded-[1.5rem] shadow-xl p-6 sm:p-8 relative overflow-hidden">
          <div class="absolute top-0 right-0 w-20 h-20 bg-lime-100/50 rounded-full -mr-10 -mt-10"></div>
          
          <form @submit.prevent="login" class="relative z-10 space-y-5">
              <div>
                  <label class="block text-[10px] font-bold text-emerald-800 uppercase tracking-widest mb-2 ml-1">Username</label>
                  <input
                  v-model="username"
                  type="text"
                  placeholder="Masukkan username anda..."
                  class="w-full h-12 sm:h-14 px-5 sm:px-6 text-gray-700 bg-emerald-50/50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/10 outline-none transition-all font-medium text-sm sm:text-base"
                  />
              </div>

              <div>
                  <label class="block text-[10px] font-bold text-emerald-800 uppercase tracking-widest mb-1.5 ml-1">Unggah Foto</label>
                  <div 
                    @click="$refs.fileInput.click()"
                    class="relative w-full h-28 sm:h-32 border-2 border-dashed border-emerald-200 rounded-2xl bg-emerald-50/30 hover:bg-emerald-50 hover:border-emerald-400 transition-all cursor-pointer flex flex-col items-center justify-center overflow-hidden group"
                  >
                    <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleFileUpload" />

                    <div v-if="photoPreview" class="absolute inset-0 w-full h-full">
                        <img :src="photoPreview" class="w-full h-full object-cover" />
                        <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span class="text-white text-xs font-bold">Ganti Foto</span>
                        </div>
                    </div>

                    <div v-else class="text-center p-4">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 sm:h-8 sm:w-8 mx-auto text-emerald-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p class="text-[10px] sm:text-[11px] text-emerald-600 font-semibold leading-tight">Ambil atau Cari Foto</p>
                    </div>
                  </div>
                  <div class="flex flex-col gap-1.5 mt-10">
                    <p class="text-[11px] font-bold text-amber-900 uppercase tracking-tight">Perhatian sebelum unggah:</p>
                    <ul class="space-y-1">
                      <li class="flex items-center gap-2 text-[10.5px] text-amber-800/80 leading-relaxed">
                        <span class="w-1 h-1 rounded-full bg-amber-400"></span>
                        Pastikan <span class="font-bold text-amber-900">GPS/Lokasi</span> di HP Anda aktif.
                      </li>
                      <li class="flex items-center gap-2 text-[10.5px] text-amber-800/80 leading-relaxed">
                        <span class="w-1 h-1 rounded-full bg-amber-400"></span>
                        Berikan izin <span class="font-bold text-amber-900">Akses Lokasi</span> saat diminta browser.
                      </li>
                      <li class="flex items-center gap-2 text-[10.5px] text-amber-800/80 leading-relaxed">
                        <span class="w-1 h-1 rounded-full bg-amber-400"></span>
                        Gunakan <span class="font-bold text-amber-900">Foto Asli Kamera</span> (Bukan Screenshot/WA).
                      </li>
                    </ul>
                  </div>
              </div>

              <button
                  type="submit"
                  class="w-full h-12 sm:h-14 bg-gradient-to-r from-emerald-600 to-lime-500 text-white font-bold rounded-2xl shadow-lg shadow-emerald-200 hover:shadow-emerald-300 hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center gap-3 text-sm sm:text-base"
              >
                  MASUK
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
              </button>
          </form>
      </div>
    </div>
  </div>
</template>

<script>
import { getPhotoLocation,getDeviceInfo, errorMessage,successMessage, warningMessage, getCurrentPosition } from '@/util/utils';
export default {
    name: 'check-in',
    data() {
      return {
        username: '',
        photoPreview: null,
      }
    },
    methods: {
      goBack() {
        window.history.back();
      },
      async handlePos(){
        return await getCurrentPosition();
      },
      async handleFileUpload(event) {
        const file = event.target.files[0];
        const currPos = this.handlePos();
        if (!file) return;
        if(!currPos) return;

        try {
          const photoLoc = await getPhotoLocation(file);
          const deviceInfo = await getDeviceInfo(file);
          if(currPos){
            if (photoLoc) {
              console.log("Lokasi Foto:", photoLoc);
              successMessage(`Foto diambil di: ${photoLoc.lat}, ${photoLoc.lng}`);
            } else {
              warningMessage("Foto tidak memiliki data lokasi (GPS).");
            }
            console.log("Lokasi Foto:", photoLoc);
            console.log("Informasi Device:", deviceInfo);
            }

          this.photoPreview = URL.createObjectURL(file);

        } catch (err) {
          errorMessage("Gagal membaca metadata foto");
        }
      },
      login() {
        console.log('Login logic here');
      }
    },
}
</script>