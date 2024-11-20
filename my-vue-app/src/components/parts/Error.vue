<!--
エラー表示Component
API結果がstoreに格納したエラー情報から、
当該エラーを抽出し表示する
-->
<template>
  <div :class="{ 'no-message': !message.length }">
    <div class="Error-wrapper" v-show="message.length > 0">
      <div v-html="formattedMessage"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      default: ""
    },
    idx: {
      type: String,
      default: "-1"
    }
  },
  computed: {
    message() {
      const msgArray = this.$store.getters.errors(this.id, this.idx);
      return msgArray.join("\n");
    },
    formattedMessage() {
      const causionMark = '<i class="fas fa-exclamation-triangle"></i>&nbsp';
      return `${causionMark}${this.message.replace(/\n/g, `<br>${causionMark}`)}`;
    }
  }
};
</script>

<style lang="scss" scoped>
div {
  font-size: small;
  color: red;
  font-weight: bold;
  min-height: 10px;
  transition: min-height 0.3s;

  > span {
    margin-right: 3px;
  }

  &.no-message {
    min-height: 0;
  }
}

.Error-wrapper {
  display: flex;
  align-items: center;
  margin-top: 3px;
}

.fa-exclamation-triangle {
}

</style>
