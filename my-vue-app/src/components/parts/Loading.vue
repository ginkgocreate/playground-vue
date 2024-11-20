<template>
  <div v-if="loading" class="spinner-wrapper">
    <div class="spinner">
      <div 
        v-for="n in 15" 
        :key="n" 
        :style="getCircleStyle(n)" 
        class="spinner-circle"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GradientSpinner',
  props: {
    loading: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    getCircleStyle(index) {
      const angle = (index - 1) * 24; // 360度を15個に分割
      return {
        transform: `rotate(${angle}deg) translate(40px)`,
        animationDelay: `${index * 0.1}s`,
      };
    }
  }
};
</script>

<style scoped lang="scss">
@import '@top/variables';

.spinner-wrapper {
  display: flex;
  justify-content: center;
  height: 100%;
  margin-top: 100px;
}

.spinner {
  width: 100px;
  height: 100px;
  position: relative;
}

.spinner-circle {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  position: absolute;
  top: 0;
  left: 50%;
  margin-left: -6px;
  background-color: $light-gray-color; 
  animation: spinner-animation 1.5s linear infinite;
}

@keyframes spinner-animation {
  0% {
    background-color: $primary-color;
  }
  100% {
    background-color: $light-gray-color;
  }
}
</style>