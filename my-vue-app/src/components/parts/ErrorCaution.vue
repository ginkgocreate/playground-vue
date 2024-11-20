<template>
  <div v-if="visible" class="error-notification">
    <span>{{ message }}</span>
    <button @click="closeNotification">✖️</button>
  </div>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      default: 0, // ミリ秒 1000=1s
    },
  },
  data() {
    return {
      visible: true,
    };
  },
  mounted() {
    // durationが設定されていれば、その後自動的に閉じる
    if (this.duration > 0) {
      setTimeout(this.closeNotification, this.duration);
    }
  },
  methods: {
    closeNotification() {
      this.visible = false;
      this.$emit('closed');
    },
  },
};
</script>

<style scoped>
.error-notification {
  position: absolute;
  top: 15px;
  right: 15px;
  padding: 10px 20px;
  background-color: #f44336;
  color: white;
  border-radius: 5px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1000;
}

.error-notification button {
  background: none;
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;
}
</style>