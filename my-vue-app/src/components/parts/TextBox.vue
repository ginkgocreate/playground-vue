<template>
  <div>
    <input 
      :type="getType" 
      :disabled="disabled" 
      :readonly="readonly" 
      :placeholder="placeholder" 
      :class="ime" 
      v-model="value_" 
      v-show="!isTextArea"
      @input="$emit('update:value', $event.target.value)"
      @focus="addCapsLockListener"
      @blur="removeCapsLockListener"
      />  
  </div>
</template>
<script>
export default {
  props:{
    value:String
    ,disabled:Boolean
    ,readonly:Boolean
    ,placeholder:String
    ,ime:{type:String,default:"alphanum"}
    ,isPassword:Boolean
    ,isTextArea:Boolean
    ,optHeight:{type:Number,default:80}
  },
  data(){
    const ret = {
      value_:this.value,
      height_: this.optHeight + "px"
    }
      return ret;
  },
  computed:{
    getType(){
      return this.isPassword ? "password" : "text";
    }        
  },
  watch:{
    value(v){
      this.value_ = v;
    },
    value_(v){
      this.$emit("update:value",v);
    }
  },
  methods: {
    addCapsLockListener() {
      window.addEventListener('keydown', this.checkCapsLock);
    },
    removeCapsLockListener() {
      window.removeEventListener('keydown', this.checkCapsLock);
    },
    checkCapsLock(event) {
      const isCapsLockOn = event.getModifierState && event.getModifierState('CapsLock');
      this.$emit('caps-lock', isCapsLockOn);
    }
  }
}
</script>
<style lang="scss" scoped>
  input, textarea{
    margin: 0 5px 0 5px;
    font-size: 18px;
    height: 40px;
    width: 300px;        
    border: 1px solid #ddd;
    border-radius: 5px;
    padding: 0 3px;
    box-sizing: border-box;      
  }
  textarea{
    padding: 3px;
  }
  ::placeholder {
    color: #ccc;
  }
  /* 旧Edge対応 */
  ::-ms-input-placeholder {
    color: #ccc;
  }
  /* IE対応 */
  :-ms-input-placeholder {
    color: #ccc;
  }
</style>