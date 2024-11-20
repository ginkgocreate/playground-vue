<template>
  <div class="file-upload-component">
    <CustomButton 
      class="file-upload-label"
      :style="inputStyle"
      @click="triggerFileInput"
      :label="buttonText"
    />
    <input
      type="file"
      id="file-upload"
      class="file-upload-input"
      @change="handleFileUpload"
      multiple
      ref="fileInput" 
      :accept="allowedExtensionsList"
    />
    <div v-if="showFileName">
      <p>ファイル名: {{ fileName }}</p>
    </div>
    <div v-if="showFileCount">
      <p>選択されたファイルの枚数: {{ fileCount }}</p>
    </div>
  </div>
</template>

<script>
import Compressor from 'compressorjs';
import CustomButton from '@parts/CustomButton'
export default {
  components: {
    CustomButton,
  },
  props: {
    buttonText: {
      type: String,
      default: 'ファイルをアップロード',
    },
    showFileName: {
      type: Boolean,
      default: false,
    },
    showFileCount: {
      type: Boolean,
      default: false,
    },
    width: {
      type: String,
      default: '40px',
    },
    height: {
      type: String,
      default: '20px',
    },
    textAlign: {
      type: String,
      default: 'center',
    },
    fontSize: {
      type: String,
      default: '15px',
    },
    fontWeight: {
      type: String,
      default: 'bold',
    },
    margin: {
      type: String,
      default: '5px',
    },
    borderRadius: {
      type: String,
      default: '5px',
    },
    maxFiles: {
      type: Number,
      default: 5, 
    },
    allowedExtensions: {
      type: Array,
      default: () => ['jpg', 'png', 'pdf'], 
    },
  },
  data() {
    return {
      fileName: '',
      fileCount: 0,
      files: [],
      isError: false,
    };
  },
  computed: {
    inputStyle() {
      return {
        width: this.width,
        height: this.height,
        'text-align': this.textAlign,
        'font-size': this.fontSize,
        'font-weight': this.fontWeight,
        margin: this.margin,
        'border-radius': this.borderRadius,
      };
    },
    allowedExtensionsList() {
      return this.allowedExtensions.map(ext => `.${ext}`).join(',');
    }
  },
  methods: {
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    compressFiles(files) {

      this.files = []; 
      this.isError = false;

      const promises = files.map((file) => {
            return new Promise((resolve, reject) => {
              const quality = this.getCompressionQuality(file.size);
              new Compressor(file, {
                quality: quality,
                maxWidth: 2000,
                maxHeight: 2000,
                success: (compressedFile) => {
                  if (!this.isError) {
                    this.files.push(compressedFile);
                    resolve();
                  } else {
                    reject();
                  }
                },
                error: () => {
                  this.isError = true;
                  reject();
                },
              });
            });
          });

          return Promise.allSettled(promises).then(() => {
            if (this.isError) {
              this.files = [];
            }
          });

    },
    handleFileUpload(event) {
      const files = event.target.files;
      if (!files) {return;}

      if (files.length > this.maxFiles) {
        alert(`ファイルの数が最大(${this.maxFiles})を超えています`);
        return;
      }

      const validFiles = Array.from(files).filter(file => {
        const extension = file.name.split('.').pop().toLowerCase();
        return this.allowedExtensions.includes(extension);
      });

      if (validFiles.length !== files.length) {
        alert(`選択されたファイルの一部は許可されていない拡張子です\n次のファイル形式より選択してください: ${this.allowedExtensions}`);
        return;
      }

      this.fileCount = validFiles.length;
      this.fileName = validFiles.length > 0 ? validFiles[0].name : '';

      const filePromises = validFiles.map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          const fileInfo = {
            fileName: file.name,
            FileContentBase64: '',
          };

          reader.onload = (e) => {
            fileInfo.FileContentBase64 = e.target.result.split(',')[1];
            resolve(fileInfo); 
          };

          reader.readAsDataURL(file); 
        });
      });

      Promise.all(filePromises).then(fileInfos => {
        this.$emit('file-selected', fileInfos);
        // inputの値を空にしないと、イベントが走らない
        this.$refs.fileInput.value = '';
      });
      
    },
  }
};
</script>

<style scoped lang="scss">
@import '@top/variables';

.file-upload-label {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: 5px;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

.file-upload-input {
  display: none;
}

p {
  margin: 0;
  padding: 4px 0;
}
</style>
