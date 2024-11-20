<template>
  <div id="input-wrapper">
    <input
      @focus="handleFocus"
      @blur="handleBlur"
      @change="handleChange"
      class="custom-input"
      :style="inputStyle" 
      :disabled="disabled" 
      v-model="inputValue" />
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    height: {
      type: String,
      default: '20px'
    },
    width: {
      type: String,
      default: '120px'
    },
    fontWeight: {
      type: String,
      default: 'normal'
    },
    color: {
      type: String,
      default: '#000000'
    },
    background: {
      type: String,
      default: '#ffffff'
    },
    inputFontSize: {
      type: String,
      default: '16px'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    textAlign: {
      type: String,
      default: 'left'
    },
    borderThick: {
      type: String,
      default: '1px'
    },
    borderColor: {
      type: String,
      default: '#ddd'
    },
    borderType: {
      type: String,
      default: 'solid'
    },
    borderRadius: {
      type: String,
      default: '1px'
    },
    formatStyle: {
      type: String,
      default: 'Normal'
    }
  },
  data() {
    return {
      inputValue: this.formatValue(this.value)
    };
  },
  computed: {
    inputStyle() {
      return {
        color: this.color,
        backgroundColor: this.background,
        fontSize: this.inputFontSize,
        height: this.height,
        width: this.width,
        textAlign: this.textAlign,
        border: `${this.borderThick} ${this.borderType} ${this.borderColor}`,
        borderRadius: this.borderRadius,
        'font-weight': this.fontWeight,
      };
    }
  },
  watch: {
    value(newValue) {
      this.inputValue = this.formatValue(newValue);
    },
    inputValue(newValue) {
      this.$emit('input', newValue);
      this.$emit('change', newValue);
    }
  },
  methods: {
    formatValue(value) {
      if (this.formatStyle === 'PostCode') {
        return this.formatPostCode(value);
      }
      return value;
    },
    formatPostCode(value) {
      if (!value) return '';
      const cleaned = value.replace(/\D/g, ''); // îÒêîéöÇçÌèú
      if (cleaned.length <= 3) return cleaned;
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}`;
    },
    handleFocus() {
      this.$emit('focus');
    },
    handleBlur() {
      this.inputValue = this.formatValue(this.inputValue);
      this.$emit('blur');
      this.$emit('input', this.inputValue);
    },
    handleChange() {
      this.inputValue = this.formatValue(this.inputValue); 
      this.$emit('change');
    }
  }
};
</script>

<style scoped>
.custom-input {
  padding: 5px 10px;
}
</style>
