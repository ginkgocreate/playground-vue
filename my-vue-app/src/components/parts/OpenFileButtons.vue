<template>
  <div>
    <div v-for="(file, index) in files" :key="index">
      <button class="btnFile" :style="decidedStyle" @click="handleOpenFile(file.FilePath)">
        <span>{{ file.ButtonDisplayName }}</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    files: {
        type: Array,
        required: false,
        default: () => [],
    },
    width: {
        type: String,
        required: false,
        default: '200px',
    },
    height: {
        type: String,
        required: false,
        default: '30px',
    },
  },
  computed :{
    decidedStyle() {
        return {
            width: this.width,
            height: this.height,
        }
    }
  },
  methods: {
    handleOpenFile(filePath) {
      this.openFile(filePath);
    },
  },
};
</script>

<style>

.btnFile {
  cursor: pointer;
  border: solid 1px #489AB1;
  background-color: #EBF7FF;
  padding: 2px 0;
  border-radius: 8px;
  color: #489AB1;
  margin-bottom: 10px;
  font-size: 1em;
}

/* Responsive�Ή� */
@media (max-width: 480px) {

  .btnFile {
  }

}

</style>
