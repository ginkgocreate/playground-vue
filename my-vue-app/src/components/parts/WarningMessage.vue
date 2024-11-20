<template>
  <div v-if="visible">
    <i class="fas fa-exclamation-circle"></i>
    <span id="message">{{ message }}</span>
  </div>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      required: true,
    },
    visible: {
      type: Boolean,
      required: true,
    }
  },
  methods: {
    
  },
};
</script>

<style scoped>

  .fas {
    font-size: 12.8px;
    color: red;
  }

  #message {
    padding-left: 2px;
    font-size: 12.8px;
    font-weight: bold;
    font-family: "Hiragino Kaku Gothic ProN", sans-serif;
    color: red;
  }

  /* Responsive対応 */
  @media (max-width: 480px) {
  .fas, #message { font-size: 11.52px; }
  }

</style>
