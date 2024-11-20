<template>
  <div>
    <input
      :value="formattedValue"
      @input="onInput($event.target.value)"
      @blur="emitFormattedValue"
      :disabled="disabled"
      :style="inputStyle" 
      :class="{ error: hasError }"
    />
    <span v-if="hasError" class="error-message">{{ errorMessage }}</span>
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
    },
    wantValidation: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      hasError: false,
      errorMessage: '',
      formattedValue: this.formatWithHyphen(this.value),
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
    value(newVal) {
      this.formattedValue = this.formatWithHyphen(newVal);
    }
  },
  methods: {
    // ハイフンなしの文字列にハイフンを追加してフォーマット
    formatWithHyphen(value) {
      if (!value) return '';
      const cleanedValue = value.replace(/\D/g, ''); // 数字以外の文字を削除
      if (cleanedValue.length <= 3) return cleanedValue;
      if (cleanedValue.length <= 7) return `${cleanedValue.slice(0, 3)}-${cleanedValue.slice(3)}`;
      return `${cleanedValue.slice(0, 3)}-${cleanedValue.slice(3, 7)}-${cleanedValue.slice(7, 11)}`;
    },
    // ハイフンを除去した文字列を取得
    stripHyphen(value) {
      return value.replace(/-/g, '');
    },
    // 入力時にハイフンなしでemitし、表示はハイフン付きに更新
    onInput(value) {
      const strippedValue = this.stripHyphen(value);
      this.$emit('input', strippedValue); // ハイフンなしの電話番号をemit
      this.formattedValue = this.formatWithHyphen(strippedValue); // ハイフン付きにフォーマットして表示
    },
    // フォーカスが外れた時にエラーがないかを確認
    emitFormattedValue() {
      if(this.wantValidation) {this.validatePhone(this.stripHyphen(this.formattedValue));}
    },
    // 簡単な電話番号バリデーション
    validatePhone(value) {
      this.hasError = false;
      this.errorMessage = '';
      const isValidPhone = /^\d{10,11}$/.test(value); // 電話番号は10桁または11桁
      if (!isValidPhone) {
        this.hasError = true;
        this.errorMessage = '正しい電話番号を入力してください。';
      }
    }
  }
};
</script>

<style scoped>
.error-message {
  color: red;
  font-size: 12px;
  margin-top: 5px;
}
</style>
