<template>
  <!-- バリデーションを行う場合は必ずFieldIdを渡す --> 
  <div class="input-wrapper">
    <input
      :value="formattedValue"
      @input="onInput($event.target.value)"
      @blur="emitFormattedValue"
      @change="onInput($event.target.value)"
      :disabled="disabled"
      :maxLength="maxLength"
      :style="inputStyle"
      :class="{ error: hasError }"
    />
  </div>
</template>

<script>
import { InputFormat } from '@top/objects'
export default {
  props: {
    value: {
      type: [Number, String],
      default: ''
    },
    formatStyle: {
      type: String,
      default: 'Normal', // デフォルト、Phone、PostCode、Amount、Date
    },
    dateFormat: {
      type: String,
      default: 'yyyy/MM/dd' // 日付フォーマット選択
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
    fontSize: {
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
    fieldId: {
      type: String,
      default: 'common',
      required: false,
    },
    fieldName: {
      type: String,
      default: '',
      required: false,
    },
  },
  data() {
    return {
      hasError: false,
      errorMessage: '',
      formattedValue: this.formatValue(this.value),
      maxLength: 1000,
    };
  },
  watch: {
    value(newVal) {
      this.formattedValue = this.formatValue(newVal);
    }
  },
  computed: {
    inputStyle() {
      return {
        height: this.height,
        width: this.width,
        fontWeight: this.fontWeight,
        color: this.color,
        background: this.background,
        fontSize: this.fontSize,
        textAlign: this.textAlign,
        borderWidth: this.borderThick,
        borderColor: this.borderColor,
        borderStyle: this.borderType,
        borderRadius: this.borderRadius,
      };
    }
  },
  methods: {
    // フォーマットに応じて値を変換
    formatValue(value) {
      switch (this.formatStyle) {
        case InputFormat.Phone:
          this.maxLength = 13;
          return value;
        case InputFormat.PostCode:
          this.maxLength = 7 + 1;
          return this.formatPostalCode(value);
        case InputFormat.Amount:
          return this.formatAmount(value);
        case InputFormat.Date:
          this.maxLength = 8 + 1;
          return this.formatDate(value);
        default:
          return value;
      }
    },
    // 郵便番号フォーマット xxx-xxxx
    formatPostalCode(value) {
      if (!value) return '';
      const cleanedValue = value.replace(/\D/g, ''); // 数字以外の文字を削除
      if (cleanedValue.length <= 3) return cleanedValue;
      return `${cleanedValue.slice(0, 3)}-${cleanedValue.slice(3)}`;
    },
    // 金額フォーマット（カンマ区切り）
    formatAmount(value) {
      if (!value) return '';
      const cleanedValue = value.replace(/,/g, ''); // カンマを削除
      return cleanedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ','); // 3桁ごとにカンマを追加
    },
    // 日付フォーマット（スラッシュ区切り）
    formatDate(value) {
      if (!value) return '';
      let cleanedValue = value.replace(/[^0-9]/g, ''); // 数字以外の文字を削除
      switch (this.dateFormat) {
        case 'yyyy/MM/dd':
          return cleanedValue.replace(/(\d{4})(\d{2})(\d{2})/, '$1/$2/$3');
        case 'yyyy-MM-dd':
          return cleanedValue.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
        case 'yyyyMMdd':
          return cleanedValue; // フォーマットしない
        default:
          return cleanedValue;
      }
    },
    onInput(value) {
      this.formattedValue = this.formatValue(value); 
      this.$emit('input', this.formattedValue); 
      this.$emit('change'); 
    },
    emitFormattedValue() {
      this.$emit('blur');
      this.validateValue(this.formattedValue);
    },
    // バリデーション
    validateValue(value) {
      this.hasError = false;
      this.errorMessage = '';
      let fieldName = '';
      if (this.formatStyle === InputFormat.Phone && !/^\d{2,5}-\d{1,4}-\d{4}$/.test(value)) {
        this.hasError = true;
        fieldName = this.fieldName ? this.fieldName : '電話番号';
        this.errorMessage = `正しい${fieldName}を入力してください。`;
      } else if (this.formatStyle === InputFormat.PostCode && !/^\d{3}-\d{4}$/.test(value)) {
        this.hasError = true;
        fieldName = this.fieldName ? this.fieldName : '郵便番号';
        this.errorMessage = `正しい${fieldName}を入力してください。`;
      } else if (this.formatStyle === InputFormat.HalfCharacter && !/^[\u0020-\u007E]+$/.test(value)) {
        this.hasError = true;
        this.errorMessage = `${this.fieldName}半角英数字で入力してください。`;
      }

      if(this.hasError){ this.$emit('error', this.errorMessage); }

      this.commitErrorToStore();
    },
    commitErrorToStore() {
      if (this.hasError) {
        // vuexへエラープッシュ
        this.pushError(this.fieldId, this.hasError, this.errorMessage);
      } else {
        this.removeError(this.fieldId);
      }
    }
  }
};
</script>

<style scoped>
input {
  padding: 5px 10px;
}
.input-wrapper {
  text-align: center;
}
</style>
