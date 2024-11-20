<template>
  <div class="progress-bar-container">
    <div class="progress-text">
      {{ text }}<span class="dots"></span>
    </div>
    <div class="progress-bar-wrapper">
      <div class="progress-bar" :style="{ width: progress + '%', backgroundColor: color }">
        <span class="progress-text-inside">{{ progress }}%</span>
      </div>
    </div>
    <slot v-if="progress === 100" name="complete"></slot>
  </div>
</template>

<script>
export default {
  props: {
    progress: {
      type: Number,
      required: true,
      default: 0,
    },
    text: {
      type: String,
      default: 'ダウンロード中'
    },
    color: {
      type: String,
      default: '#1E90FF', // デフォルトの色
    }
  },
  data() {
    return {
      dotsIndex: 0,
    };
  },
  computed: {
    animatedDots() {
      const sizes = ['small', 'medium', 'large'];
      return sizes[this.dotsIndex % sizes.length];
    }
  },
  mounted() {
    this.startDotsAnimation();
  },
  beforeDestroy() {
    clearInterval(this.dotsInterval);
  },
  methods: {
    startDotsAnimation() {
      this.dotsInterval = setInterval(() => {
        this.dotsIndex++;
      }, 500); // 0.5秒ごとにドットのサイズを変える
    }
  }
}
</script>

<style scoped>
.progress-bar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f3f3f3;
  border-radius: 5px;
  padding: 10px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
}

.progress-text {
  text-align: center;
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: bold;
  width: 400px;
  color: #fff;
}

.dots {
  margin-left: 5px;
  animation: dotsAnimation 1.5s infinite;
}

.dots::after {
  content: '...';
  animation: dotsAnimation 1.5s infinite;
}

.progress-bar-wrapper {
  width: 80%;
  max-width: 600px;
  height: 25px;
  border: 2px solid #ccc;  /* 枠のスタイル */
  border-radius: 5px;
  overflow: hidden;
  background: #fdfdfd;
}

.progress-bar {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: bold;
  transition: width 0.3s ease;
}

.progress-text-inside {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  color: #ffa128;
}
@keyframes dotsAnimation {
  0% { content: ' • ・・'; }
  50% { content: ' ・ • ・'; }
  66% { content: ' ・・ •'; }
  75% { content: ' ・・ •'; }
  100% { content: ' • ・・'; }
}
</style>
