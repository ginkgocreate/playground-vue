<template>
  <div :class="buttonClass" type="button" :style="buttonStyle" @click="handleClick">
    <i :class="iconClass"></i>
  </div>
</template>

<script>
export default {
  props: {
    enabled: {
      type: Boolean,
      required: false,
      default: true,
    },
    height: {
      type: String,
      required: false,
      default: '27px',
    },
    width: {
      type: String,
      required: false,
      default: '42px',
    },
    direction: {
      type: String,
      required: true,
      validator: value => ['Up', 'Down', 'Left', 'Right'].includes(value),
    },
    enabledColor: {
      type: String,
      required: false,
      default: '#aaa',
    },
    disabledColor: {
      type: String,
      required: false,
      default: '#e6e6e6',
    },
    borderRadius: {
      type: String,
      required: false,
      default: '6px',
    },
  },
  computed: {
    buttonClass() {
      return this.enabled ? 'valid' : 'invalid';
    },
    iconClass() {
      const iconClasses = {
        Up: 'fas fa-caret-up',
        Down: 'fas fa-caret-down',
        Left: 'fas fa-caret-left',
        Right: 'fas fa-caret-right'
      };
      return iconClasses[this.direction];
    },
    buttonStyle() {
      return {
        backgroundColor: this.enabled ? this.enabledColor : this.disabledColor,
        borderColor: this.enabled ? this.enabledColor : this.disabledColor,
        borderRadius: this.borderRadius,
        height: this.height,
        width: this.width,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      };
    }
  },
  methods: {
    handleClick() {
      if (this.enabled) {
        this.$emit('click');
      }
    },
  }
};
</script>

<style scoped>
.valid {
  color: #fff;
  border: 1px solid;
}

.invalid {
  color: #fff;
  border: 1px solid;
  pointer-events: none;
}

.fas {
  font-size: 1.6em;
}

/* Responsive Support */
@media (max-width: 480px) {
  .fas {
    font-size: 1.2em;
  }
  button {
    width: 37px;
    height: 50px;
  }
}
</style>
