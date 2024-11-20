<template>
  <div class="toggle-button">
    <div @click="toggle('left')" class="square left-square" :class="{ active: value === options[0] }">{{ buttonNames[0] }}</div>
    <div @click="toggle('right')" class="square right-square" :class="{ active: value === options[1] }">{{ buttonNames[1] }}</div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      required: true
    },
    options: {
      type: Array,
      required: true,
      validator(value) {
        return value.length === 2;
      }
    },
    buttonNames: {
      type: Array,
      required: true,
      validator(value) {
        return value.length === 2;
      }
    }
  },
  data() {
    return {
      currentSide: 'left',
    }
  },
  created() {
    this.currentSide = this.value === 'address1' ? 'left' : 'right';
  },
  methods: {
    toggle(side) {

      // 非アクティブなトグルを触れたときのみ反転させる
      if ( this.currentSide === side ) { return }
        
      this.currentSide = side
      const newValue = this.value === this.options[0] ? this.options[1] : this.options[0];
      this.$emit('input', newValue);
      this.$emit('change',newValue);

    }
  }
};
</script>

<style scoped>
.toggle-button {
  width: 220px; 
  height: 25px; 
  cursor: pointer;
  display: flex;
  background-color: #DDDDDD;
  border-radius: 5px;

}


.square {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  transition: background-color 0.3s ease;
  color: #FFFFFF;
  font-weight: bold;
}

.right-square {
  border-radius: 0 5px 5px 0;
}

.left-square {
  border-radius: 5px 0 0 5px;
}

.left-square.active {
  background-color: #4DC9BE; 
  height: 100%;
}

.right-square.active {
  height: 100%;
  background-color: #4DC9BE;
}
</style>
