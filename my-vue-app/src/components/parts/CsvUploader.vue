<template>
  <div class="csv-uploader">
    <input
      type="text"
      v-model="fileName"
      placeholder="ファイルを選択してください"
      readonly
    />
    <input
      type="file"
      @change="handleFileChange"
      accept=".csv"
      ref="fileInput"
      class="hidden-file-input"
    />
    <CustomButton 
      @click="triggerFileInput"
      label="ファイルを選択"
      fontSize="15px"
      height="30px"
    />
    <CustomButton 
      @click="emitCSVData"
      label="アップロード"
      height="30px"
    />
  </div>
</template>

<script>
import CustomButton from '@parts/CustomButton';
export default {
  components: {
    CustomButton,
  },
  data() {
    return {
      fileName: '',   
      selectedFile: null,
      csvData: '',
    };
  },
  methods: {
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    handleFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.fileName = file.name;
        this.selectedFile = file;

        // CSVファイルの文字コードを判別し、読み込む
        this.readFileWithEncoding(file);
      }
    },
    readFileWithEncoding(file) {
      const reader = new FileReader();

      // バイナリとしてファイルを読み込む
      reader.readAsArrayBuffer(file);

      reader.onload = (event) => {
        const arrayBuffer = event.target.result;
        const encodings = ['utf-8', 'shift_jis'];
        let csvData = '';

        for (const encoding of encodings) {
          const decoder = new TextDecoder(encoding, { fatal: true });
          try {
            csvData = decoder.decode(arrayBuffer);
            this.csvData = csvData; 
            break;
          } catch (error) {
            console.error(`Failed to decode with ${encoding}:`, error);
          }
        }

        if (!csvData) {
          alert('ファイルの文字コードを判定できませんでした');
          this.clear();
        }
      };
      
    },
    emitCSVData() {
      this.$emit('csv-loaded', this.csvData); 
      this.clear();
    },
    clear() {
      this.selectedFile = null;
      this.fileName = '';
      this.csvData = '';
      // inputタグの値をリセット
      this.$refs.fileInput.value = ''; 
    }
  }
};
</script>

<style scoped>
.csv-uploader {
  display: flex;
  gap: 10px;
  align-items: center;
}

input[type="text"] {
  width: 250px;
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.hidden-file-input {
  display: none;
}
</style>
