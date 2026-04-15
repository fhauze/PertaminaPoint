<template>
  <!-- Header Section -->
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
    </div>
  <div
    class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-teal-100 to-lime-200 p-6"
  >
    <div
      class="max-w-lg w-full bg-white/80 rounded-3xl shadow-lg p-6 backdrop-blur-lg"
    >
      <!-- Judul -->
      <h2 class="text-2xl font-bold text-emerald-700 mb-2">
        {{ mission.name }}
      </h2>
      <p class="text-gray-700 mb-4">{{ mission.description }}</p>

      <!-- Daftar Task -->
      <div
        v-for="task in mission.tasks"
        :key="task.id"
        class="flex flex-col gap-3 mb-4 border-b pb-4"
      >
        <div class="flex items-center justify-between">
          <span class="text-sm font-semibold text-gray-700">
            {{ task.type === "scan-qr" ? "Scan QR Code" : "Upload Gambar" }}
          </span>

          <button
            v-if="!task.completed"
            @click="handleTask(task)"
            class="px-3 py-1 bg-emerald-500 text-white text-xs rounded-lg hover:bg-emerald-600"
          >
            Selesaikan
          </button>
          <span v-else class="text-emerald-600 font-semibold">✅ Selesai</span>
        </div>

        <!-- ✅ SCAN QR -->
        <div
          v-if="activeTask && activeTask.id === task.id && task.type === 'scan-qr'"
          class="border rounded-lg overflow-hidden"
        >
          <!-- Kamera tersedia -->
          <div v-if="!cameraUnavailable">
            <QrcodeStream
              :constraints="constraints"
              @decode="onScanSuccess"
              @detect="onDetect"
              @init="onInit"
            />
            <p class="text-xs text-gray-500 text-center mt-2">
              Arahkan kamera ke QR Code...
            </p>
            <button
              @click="manualMode = !manualMode"
              class="text-xs mt-2 px-2 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
            >
              {{ manualMode ? 'Kembali ke Kamera' : 'Gunakan Mode Manual (Upload QR)' }}
            </button>
          </div>

          <!-- Fallback upload jika kamera tidak tersedia -->
          <div v-else class="flex flex-col items-center gap-2 mt-2">
            <p class="text-sm text-gray-600">📷 Kamera tidak tersedia. Unggah QR code secara manual:</p>
            <input
              type="file"
              accept="image/*"
              @change="onFileSelected"
              class="text-sm border rounded p-2"
            />
            <button
              @click="uploadImage"
              class="px-3 py-1 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600"
            >
              Upload & Simpan
            </button>
          </div>
        </div>

        <!-- ✅ UPLOAD IMAGE -->
        <div
          v-if="activeTask && activeTask.id === task.id && task.type === 'upload-photo'"
          class="flex flex-col gap-2"
        >
          <input
            type="file"
            accept="image/*"
            @change="onFileSelected"
            class="text-sm border rounded p-2"
          />
          <button
            @click="uploadImage"
            class="px-3 py-1 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600"
          >
            Upload & Simpan
          </button>
        </div>
      </div>

      <!-- ✅ Final Button -->
      <button
        v-if="isMissionComplete && mission.status !== 'claimed'"
        @click="finishMission"
        class="w-full mt-4 py-2 bg-yellow-500 text-white font-bold rounded-lg hover:bg-yellow-600 transition"
      >
        Tandai Sebagai Selesai
      </button>
    </div>
  </div>
</template>

<script setup>
  /* eslint-disable */
  import { ref, computed, onMounted } from "vue"
  import { QrcodeStream } from "vue-qrcode-reader"
  import api from "@/util/api"
  import { useRoute } from "vue-router"
  // import { createMissionLog } from '@/services/missions';
  // import { useAuthStore } from '@/stores/auth'

  const mission = ref({
    id: 1,
    name: "Cari Artefak Laut",
    description: "Scan QR dan upload bukti penemuan artefak.",
    status: "in_progress",
    tasks: [
      { id: 1, type: "scan_qr", completed: false },
      { id: 2, type: "upload_image", completed: false },
    ],
  })

  const user_id = 42
  const activeTask = ref(null)
  const selectedFile = ref(null)
  const cameraUnavailable = ref(false)
  const constraints = ref({ facingMode: "environment" })
  const scanning = ref(false)
  const detectedOnce = ref(false)
  const router = useRoute();
  // const authStore = useAuthStore()
  // const currentUser = computed(() => authStore.currentUser)

  function goBack() {
      window.history.back('/mission/missions');
  }

  onMounted(async () => {
    if(router.query.mission){
      const data = router.query.mission
      mission.value = JSON.parse(data)
    }

    try {
      const devices = await navigator.mediaDevices.enumerateDevices()
      const videoDevices = devices.filter((d) => d.kind === "videoinput")

      if (videoDevices.length === 0) {
        cameraUnavailable.value = true
      } else {
        constraints.value = {
          facingMode: videoDevices.length > 1 ? "environment" : "user",
        }
      }
    } catch (err) {
      console.warn("Tidak bisa mendeteksi kamera:", err)
      cameraUnavailable.value = true
    }
  })

  async function onDetect(detectedCodes) {
    if (!detectedCodes || detectedCodes.length === 0) return
    if (detectedOnce.value) return 

    detectedOnce.value = true
    const code = detectedCodes[0].rawValue
    console.log("🎯 QR terdeteksi:", code)

    try {
      scanning.value = true
      await api.post("task/tasks", {
        mission: mission.value.id,
        user_id,
        type: "scan-qr",
        data: code,
        completed_at: new Date().toISOString(),
      })

      completeTask(activeTask.value)
      activeTask.value = null
      alert("QR berhasil disimpan ke server!")
    } catch (error) {
      console.error("Gagal menyimpan QR:", error)
      alert("Gagal menyimpan data ke server.")
    } finally {
      scanning.value = false
    }
  }
  const isMissionComplete = computed(() =>
    mission.value.tasks?.every((t) => t.completed)
  )
  
  function handleTask(task) {
    console.log(task)
    activeTask.value = task
  }

  function onInit(promise) {
    promise.catch((error) => {
      console.error(error)
      if (error.name === "NotAllowedError") {
        alert("Akses kamera ditolak. Izinkan kamera di browser Anda.")
      } else if (error.name === "NotFoundError") {
        alert("Tidak ada kamera terdeteksi di perangkat ini.")
      } else if (error.name === "NotReadableError") {
        alert("Kamera sedang digunakan oleh aplikasi lain.")
      } else {
        alert("Gagal mengakses kamera: " + error.message)
      }
      cameraUnavailable.value = true
    })
  }
  async function onScanSuccess(result) {
    if (!result) return
    console.log("QR ditemukan:", result)

    try {
      // await api.post("task/tasks", {
      //   mission: mission.value.id,
      //   user_id: user_id,
      //   type: "scan-qr",
      //   data: result,
      //   completed_at: new Date().toISOString(),
      // })
      this.startMission({
        mission: mission.value.id,
        user_id: user_id,
        type: "scan-qr",
        data: result,
        coin: mission.value.coin,
        point: mission.value.point,
        completed_at: new Date().toISOString(),
        claimed_at: new Date().toISOString(),
      })

      completeTask(activeTask.value)
      activeTask.value = null
      alert("QR berhasil disimpan ke server.")
    } catch (error) {
      console.error(error)
      alert("Gagal menyimpan data ke server.")
    }
  }
  function onFileSelected(e) {
    selectedFile.value = e.target.files[0]
  }

  async function uploadImage() {
    if (!selectedFile.value) return alert("Pilih gambar dulu!")

    const formData = new FormData()
    formData.append("mission", mission.value.id);
    formData.append("user_id", user_id);
    formData.append("status", "completed");
    formData.append("coin", mission.value.coin);
    formData.append("point", mission.value.point);
    formData.append("image_log", selectedFile.value);
    
    try {
      await api.post("mission/mission-logs/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      completeTask(activeTask.value)
      activeTask.value = null
      selectedFile.value = null
      alert("📸 Gambar berhasil diupload!")
    } catch (error) {
      console.error(error)
      alert("Gagal upload gambar.")
    }
  }
  function completeTask(task) {
    task.completed = true
  }

  function finishMission() {
    mission.value.status = "completed"
    alert("🎉 Misi selesai! Semua task telah disimpan.")
  }

  // async function startMission(mission) {
  //   if (!mission || !mission.id) {
  //     console.error("⚠️ Invalid mission:", mission);
  //     return;
  //   }
  //   console.log("mission: ", mission)
  //   await createMissionLog({
  //     mission: mission.id,
  //     user_id: currentUser.id,
  //     status: 'in_progress',
  //     coin: mission.coin,
  //     point: mission.point
  //   });

  //   mission.userStatus = 'in_progress';
  // }
</script>

<style scoped>
video {
  width: 100%;
  height: auto;
  border-radius: 0.75rem;
}
</style>
