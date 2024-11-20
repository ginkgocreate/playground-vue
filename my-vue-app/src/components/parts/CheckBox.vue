<template>
  <div>
    <div :style="wrapperStyle" class="check-box-wrapper">
      <div :style="labelStyle" v-if="isLeftVisible && requiredLabel">{{ leftText }}</div>
      <div>
        <input 
          :style="inputStyle"
          type="checkbox" 
          @focus="handleFocus"
          @blur="handleBlur"
          @change="change" 
          :disabled="disabled" 
          :checked="normalizedValue"
        />
      </div>
      <div :style="labelStyle" v-if="isRightVisible && requiredLabel">{{ rightText }}</div>
    </div>
  </div>
</template>


<script>
export default {
  props: {
    value: {
      type: [Boolean, String, Number, Object],
      default: false,
    },
    leftText: String,
    rightText: String,
    disabled: {
      type: Boolean, 
      default: false
    },
    gap: {
      type: String,
      default: "5px",
    },
    fontWeight: {
      type: String,
      default: "normal",
    },
    fontSize: {
      type: String,
      default: "16px",
    },
    fontColor: {
      type: String,
      default: "#333333",
    },
    requiredLabel: {
      type: Boolean,
      default: true,
    },
    width: {
      type: String,
      default: "100%"
    },
    height: {
      type: String,
      default: "25px"
    }
  },
  computed: {
    normalizedValue() {
      // value が真偽値でない場合は false にする
      return this.isTruthy(this.value);
    },
    isLeftVisible() {
      return !!this.leftText;
    },
    isRightVisible() {
      return !!this.rightText;
    },
    wrapperStyle() {
      return{ 
        width: this.width,
        height: this.height,
        'display': 'flex',
        'justify-content' : 'center',
        'align-items': 'middle',
      }
    },
    inputStyle() {
      return {
        marginLeft: this.isLeftVisible ? this.gap : '0',
        marginRight: this.isRightVisible ? this.gap : '0',
      };
    },
    labelStyle() {
      return {
        fontWeight: this.fontWeight,
        fontSize: this.fontSize,
        color: this.fontColor,
        'vertical-align': 'center',
      };
    }
  },
  methods: {
    handleFocus() {
      this.$emit('focus');
    },
    isTruthy(val) {
      // val が true, "true", 1 などの真を表す値の場合は true を返す
      if (typeof val === 'boolean') return val;
      if (typeof val === 'string') return val.trim().toLowerCase() === 'true';
      if (typeof val === 'number') return val === 1;
      return false; // 空白、undefined、その他はすべて false
    },
    handleBlur(event) {
      this.$emit('input', event.target.checked);
      this.$emit('blur');
    },
    change(event) {
      this.$emit('input', event.target.checked);
      this.$emit('change');
    }
  }
}
</script>


<style scoped>
.check-box-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
