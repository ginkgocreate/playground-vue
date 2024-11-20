<template>
  <input
    type="text"
    :value="formattedValue"
    @input="onInput"
    @blur="onBlur"
    @compositionstart="onCompositionStart"
    @compositionend="onCompositionEnd"
    :style="inputStyle"
    :maxlength="maxLength"
    :disabled="disabled"
  />
</template>

<script>
export default {
  data() {
    return {
      isComposing: false,
    }
  },
  props: {
    value: {
      type: [Number, String],
      default: 0
    },
    maxLength: {
      type: String,
      default: '',
    },
    width: {
      type: String,
      default: '100%',
    },
    height: {
      type: String,
      default: '40px',
    },
    borderRadius: {
      type: String,
      default: '0',
    },
    borderWidth: {
      type: String,
      default: '1px',
    },
    borderColor: {
      type: String,
      default: '#ddd',
    },
    textColor: {
      type: String,
      default: '#000',
    },
    fontSize: {
      type: String,
      default: '14px',
    },
    background: {
      type: String,
      default: '#fff',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    formattedValue() {
      return this.formatCurrency(this.value);
    },
    inputStyle() {
      return {
        width: this.width,
        height: this.height,
        borderRadius: this.borderRadius,
        borderWidth: this.borderWidth,
        borderColor: this.borderColor,
        color: this.textColor,
        fontSize: this.fontSize,
        borderStyle: 'solid',
        padding: '5px 10px',
        boxSizing: 'border-box',
        background: this.background,
      };
    },
  },
  watch: {
    value(newValue) {
      this.internalValue = newValue === undefined ? 0 : newValue;
    },
  },
  methods: {
    // IMEì¸óÕÇ≈ÇÃï∂éöêßå‰
    onCompositionStart() {
      this.isComposing = true;
    },
    onCompositionEnd(event) {
      this.isComposing = false;
      this.onInput(event);
    },
    formatCurrency(amount) {
      if (isNaN(amount)) {
        return '';
      }
      return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
    parseCurrency(value) {
      return value.replace(/,/g, '');
    },
    onInput(event) {
      // IMEì¸óÕíÜÇÕèàóùÇµÇ»Ç¢
      if (this.isComposing) return;
      let parsedValue = this.parseCurrency(event.target.value);
      if (isNaN(parsedValue) || parsedValue === '') {
        parsedValue = 0;
      }
      this.$emit('input', parsedValue);
    },
    onBlur(event) {
      event.target.value = this.formatCurrency(this.parseCurrency(event.target.value));
    },
  },
};
</script>

<style scoped>
input {
  text-align: right;
}
</style>
