<template>
  <div class="tooltip-container" :style="tooltipStyle">
    <div class="close-button">
      <i class="far fa-times-circle" @click="close"></i>
    </div>
    <div class="tooltip-arrow" :style="arrowStyle"></div>
    <div class="tooltip-message">{{ message }}</div>
  </div>
</template>

<script>
export default {
  props: {
    propKey: {
      type: String,
      required: true,
    },
    backgroundColor: {
      type: String,
      default: '#f44336', 
    },
    borderColor: {
      type: String,
      default: '#d32f2f', 
    },
    fontSize: {
      type: String,
      default: '14px',
    },
    fontColor: {
      type: String,
      default: '#ffffff', 
    },
    top: {
      type: String,
      default: '-60px', 
    },
    left: {
      type: String,
      default: '50%', 
    },
  },
  computed: {
    tooltipStyle() {
      return {
        backgroundColor: this.backgroundColor,
        borderColor: this.borderColor,
        fontSize: this.fontSize,
        color: this.fontColor,
        top: this.top,
        left: this.left,
      };
    },
    arrowStyle() {
      return {
        borderTopColor: this.backgroundColor, 
      };
    },
    message() {
      return this.$store.getters.errorMessage(this.propKey);
    }
  },
  methods: {
    close() {
      this.$emit('close'); 
    }
  }
};
</script>

<style scoped>
.tooltip-container {
  position: absolute;
  transform: translateX(-50%);
  background-color: var(--color, #f44336); 
  border: 1px solid var(--border-color, #d32f2f); 
  color: var(--font-color, white);
  font-size: var(--font-size, 14px);
  padding: 5px 10px;
  border-radius: 5px;
  white-space: nowrap;
  z-index: 999; 
}

.tooltip-arrow {
  position: absolute;
  bottom: -10px; 
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 10px solid;
}

.tooltip-message {
  padding: 5px 5px 10px 5px;
  line-height: 1.2;
}

.close-button {
  display: flex;
  justify-content: right;
}
</style>
