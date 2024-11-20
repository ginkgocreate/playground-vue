<template>
  <button class="custom-button" @click="onClick" :style="buttonStyle">
    <slot></slot>
  </button>
</template>

<script>
export default {
  props: {
    width: {
      type: String,
      default: 'auto',
    },
    height: {
      type: String,
      default: 'auto',
    },
    fontSize: {
      type: String,
      default: '16px',
    },
    color: {
      type: String,
      default: 'ffffff',
    },
    background: {
      type: String,
      default: '#49CCBF',
    },
  },
  methods: {
    onClick(){
      this.$emit('click')
    }
  },
  computed: {
    buttonStyle() {
      return {
        width: this.width,
        height: this.height,
        fontSize: this.fontSize,
        color: this.color,
        background: this.background,
      }
    }
  },
};
</script>

<style scoped>
.custom-button {
  border: none;
  border-radius: 20px;
  margin: 5px 0;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.custom-button:focus {
  outline: none;
}
</style>
