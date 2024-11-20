<template>
  <button 
    :class="['custom-button', { 'with-icon': icon, 'is-disabled': isDisabled }]" 
    @click="handleClick"
    :style="buttonStyle"
    :disabled="isDisabled"
  >
    <i v-if="icon" :class="['button-icon', icon]"></i>
    <span>{{ label }}</span>
  </button>
</template>

<script>
export default {
  name: 'CustomButton',
  props: {
    label: {
      type: String,
      default: 'Button',
    },
    size: {
      type: String,
      default: 'medium',
    },
    icon: {
      type: String,
      default: '',
    },
    width: {
      type: String,
      default: 'auto',
    },
    height: {
      type: String,
      default: 'auto',
    },
    borderRadius: {
      type: String,
      default: '4px',
    },
    fontSize: {
      type: String,
      default: '16px',
    },
    fontWeight: {
      type: String,
      default: 'bold',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    margin: {
      type: String,
      default: '5px',
    }
  },
  computed: {
    buttonStyle() {
      return {
        width: this.width,
        height: this.height,
        fontSize: this.fontSize,
        'border-radius': this.borderRadius,
        margin: this.margin,
        'font-weight': this.fontWeight,
      };
    },
    isDisabled() {
      return this.disabled;
    }
  },
  methods: {
    handleClick() {
      this.$emit('click');
    }
  }
};
</script>

<style lang="scss">
@import '@top/variables';
.custom-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;
  white-space: nowrap;
}

.custom-button {
  background-color: $primary-color;
  color: white;
}

.with-icon {
  gap: 10px;
}

.button-icon {
  font-size: 20px;
}

.custom-button:hover {
  box-shadow: 0 4px 8px $primary-deep-color;
  background: $primary-light-color;
}

.custom-button:active {
  box-shadow: none;
}

.is-disabled {
  background-color: #d3d3d3; 
  color: #808080; 
  cursor: not-allowed;
}
</style>
