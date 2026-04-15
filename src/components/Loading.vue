<template>
  <div v-if="show" class="overlay">
    <Vue3Lottie
      :animationData="animation"
      :height="200"
      :width="200"
      autoplay
      loop
    />
  </div>
</template>

<script>
import { Vue3Lottie } from "vue3-lottie";
import animation from "@/assets/images/loading.json";

export default {
  name: "LoadingComponent",
  components: { Vue3Lottie },

  props: {
    show: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      animation
    };
  }
};
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(1px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}
</style>
