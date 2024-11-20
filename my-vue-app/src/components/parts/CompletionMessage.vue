<template>
  <div v-if="visible" class="modal-overlay" @click="closeModalOutside">
    <div class="completion-message">
      <div class="message-content">
        <slot>{{ message }}</slot>
      </div>
      <div>
        <button @click="closecompletion" class="close-button">はい</button>
      </div>  
    </div>
  </div>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      required: true
    },
  },
  data() {
    return {
      visible: true
    };
  },
  methods: {
    closecompletion() {
      this.visible = false;
      this.$emit('close');
    },
    closeModalOutside(event) {
      if (event.target === event.currentTarget) {
        this.closecompletion();
      }
    }
  },
};
</script>

<style scoped>

.modal-overlay {
  z-index: 2;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
}

.completion-message {
  border: 1px solid #f0ad4e;
  background-color: #fff;
  color: #8a6d3b;
  padding: 15px;
  margin-bottom: 20px;
  position: fixed;
  inset: 0;
  margin: auto;
  border-radius: 4px;
  width: 50%;
  height: 5%;
  display: flex;
  flex-flow: column;
  align-items: center;
}

.close-button {
  background-color: #fff;
  border: 1px solid black;
  border-radius: 2px;
  font-size: 1rem;
  top: 15px;
  right: 10px;
}
</style>
