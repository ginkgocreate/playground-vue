<template>
  <div class="dropdown">
    <div v-if="!isDisabled">
      <select 
        v-model="internalValue" 
        @focus="handleFocus"
        @blur="handleBlur"
        @change="emitSelection" 
        :style="computedStyles"
        :disabled="disabled"
        :textAlign="textAlign"
      >
      <option v-for="item in processedItems" :key="item.key" :value="item.key">
        {{ item.value }}
      </option>
      </select>
    </div>
    <div v-else>
      <select 
        :style="computedStyles"
        :disabled="true"
      >
      <option v-for="decoy in decoys" :key="decoy.key" :value="decoy.key">
        {{ decoy.value }}
      </option>
      </select>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      required: false,
      default: () => [ {key: "", value: ""} ],
    },
    value: {
      type: [ String, Number ],
      default: ''
    },
    includeEmpty: {
      type: Boolean,
      default: false
    },
    height: {
      type: String,
      default: 'auto'
    },
    width: {
      type: String,
      default: 'auto'
    },
    background: {
      type: String,
      default: '#ffffff'
    },
    textColor: {
      type: String,
      default: '#000000'
    },    
    fontSize: {
      type: String,
      default: '16px'
    },
    borderColor: {
      type: String,
      default: '#ccc'
    },
    borderWidth: {
      type: String,
      default: '1px'
    },
    borderStyle: {
      type: String,
      default: 'solid'
    },
    borderRadius: {
      type: String,
      default: '4px'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    fetchAutomaticWidth: {
      type: Boolean,
      default: false,
      required: false,
    },
    textAlign: {
      type: String,
      default: 'left',
      required: false,
    },
  },
  data() {
    return {
      internalValue: "",
    };
  },
  created() {
    if (this.value) {
      this.internalValue = this.value;
    }
  },
  computed: {
    computedStyles() {
      return {
        height: this.height,
        width: this.fetchAutomaticWidth ? 'auto' :  this.width,
        'min-width': this.width,
        backgroundColor: this.background,
        color: this.textColor,
        fontSize: this.fontSize,
        borderColor: this.borderColor,
        borderWidth: this.borderWidth,
        borderStyle: this.borderStyle,
        borderRadius: this.borderRadius,
        'text-align': this.textAlign,
      };
    },
    processedItems() {
      let itemsCopy = this.items ? [...this.items] : [{ key: '', value: '' }];
      if (this.includeEmpty) {
        itemsCopy.unshift({ key: '', value: '' });
      }
      // 重複キーを除外する
      const uniqueKeys = new Set();
      return itemsCopy.filter(item => {
        if (uniqueKeys.has(item.key)) {
          return false;
        }
        uniqueKeys.add(item.key);
        return true;
      });
    },
    isDisabled() {
      let itemsCopy = Array.isArray(this.items) && this.items.length > 0 ? [...this.items] : [{ key: '', value: '' }];
      if (!itemsCopy[0].key || !itemsCopy[0].value) {
        return true;
      }
      return false;
    },
    decoys() {
      return [{ key: "", value: "" }]
    }
  },
  watch: {
    value(newValue) {
      this.internalValue = newValue;
    }
  },
  mounted() {
    this.emitSelection();
  },
  methods: {
    getInitialValue() {
      if (!this.items || this.items.length === 0) {
        // itemsがundefinedまたは空の場合、decoyを使用
        return "";
      }

      if (this.includeEmpty) {
        return this.value || "";
      } else {
        const firstItem = this.items.find(item => item.key === this.value);
        return firstItem ? this.value : this.items[0].key;
      }
    },
    handleFocus() {
      this.$emit('focus');
    },
    handleBlur() {
      this.$emit('blur');
      this.$emit('input', this.internalValue);
    },
    emitSelection() {
      const selectedItem = this.processedItems.find(item => item.key === this.internalValue) || this.decoys[0];
      this.$emit('input', this.internalValue);
      this.$emit('change');
      this.$emit('selection-changed', { key: selectedItem.key, value: selectedItem.value });
    }
  }
};
</script>

<style scoped>
  .dropdown {
    display: flex;
  }
</style>
