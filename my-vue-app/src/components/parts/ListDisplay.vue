<template>
  <div>
    <div 
      @click="toggleList"
      :class="['toggle-button', { 'hovered': hoverButton }]"
      @mouseover="hoverButton = true"
      @mouseleave="hoverButton = false"
    >
      {{ groupName }}
    </div>
    <SlideUpDown :active="showList">
      <div 
        v-for="(item, index) in items" 
        :key="index" 
        @click="itemClicked(index)"
        :class="['list-item', { 'hovered': hoverIndex === index }]"
        @mouseover="mouseoverButtons(index)" 
        @mouseleave="mouseleaveButtons"
      >
        {{ item.displayName }}
      </div>
    </SlideUpDown>
  </div>
</template>

<script>
import SlideUpDown from "vue-slide-up-down";

export default {
  components: {
    SlideUpDown,
  },
  props: {
    showList: {
      type: Boolean,
      required: false,
      default: false,
    },
    groupName: {
      type: String,
      required: true,
    },
    items: {
      type: Array,
      required: true,
      validator(value) {
        return value.every(item => 'displayName' in item && 'propertyName' in item);
      },
    },
    width: {
      type: String,
      default: '150px',
    },
    height: {
      type: String,
      default: '50px',
    },
    buttonFontSize: {
      type: String,
      default: '16px',
    },
    listFontSize: {
      type: String,
      default: '16px',
    },
  },
  data() {
    return {
      hoverButton: false,
      hoverIndex: null,
    };
  },
  created() {
    this.innerShowList = false;
  },
  computed: {
    buttonStyle() {
      return {
        width: this.width,
        height: this.height,
        fontSize: this.buttonFontSize,
      };
    },
    listItemStyle() {
      return {
        width: this.width,
        height: this.height,
        fontSize: this.listFontSize,
      };
    },
  },
  methods: {
    mouseoverButtons(index) {
        this.hoverIndex = index;
        this.hoverButton = true;
    },
    mouseleaveButtons() {
        this.hoverButton = false;
        this.hoverIndex = null;
    },
    itemClicked(index) {
      this.$emit('item-selected', this.items[index].propertyName);
    },
    toggleList() {
      this.$emit('toggle');
    }
  },
};
</script>

<style scoped lang="scss">
@import '@top/variables';

.toggle-button {
  background-color: $primary-color; 
  width: 150px;
  height: 50px; 
  font-size: 16px; 
  color: $font-color-white; 
  text-align: center;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toggle-button.hovered {
  background-color: $primary-hovoer-color; 
}

.list-item {
  background-color: $secondary-color;
  width: 150px; 
  height: 50px; 
  font-size: 16px; 
  color: $primary-color; 
  text-align: center;
  cursor: pointer;
  transition: background-color 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
  width: 100%;
}

.list-item.hovered {
  background-color: $secondary-hovoer-color; 
}
</style>
