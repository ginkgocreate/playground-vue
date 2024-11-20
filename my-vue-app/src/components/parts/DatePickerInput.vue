<template>
  <div class="datepicker-input-wrapper" ref="inputWrapper">
    <div v-if="isDatepickerOpen" class="datepicker-overlay" @click="closeDatepicker"></div>
    <Datepicker
      :value="date"
      ref="datepickerInput"
      @input="handleDateChange"
      @closed="closeDatepicker"
      @selected="handleDateChange"
      format="yyyy/MM/dd"
      class="datepicker-input"
      :class="datepickerPosition"
      :language="ja"
      :disabled="disabled"
    />
    <i 
      v-show="!disabled"
      class="far fa-window-close"
      :class="clearButtonClass"
      @click="submmitEmpty"
    ></i>
    <i 
      v-show="!disabled"
      class="far fa-calendar-alt icon calendar-icon" 
      @click="showDatePicker"></i>
  </div>
</template>

<script>
import Datepicker from 'vuejs-datepicker';
import { ja } from 'vuejs-datepicker/dist/locale';

export default {
  components: {
    Datepicker
  },
  data() {
    return {
      ja: ja,
      date: "",
      isDatepickerOpen: false,
    }
  },
  props: {
    value: {
      type: String,
      default: '',
    },
    side: {
      type: String,
      default: 'left',
    },
    disabled: {
      type: Boolean,
      default: false
    }, 
    height: {
      type: String,
      default: '40px',
    },
    width: {
      type: String,
      default: '125px',
    },
    borderColor: {
      type: String,
      default: '#transparent',
    },
    borderWidth: {
      type: String,
      default: '1px',
    },
    borderStyle: {
      type: String,
      default: 'solid',
    },
    fontSize: {
      type: String,
      default: '15px',
    },
    fontFamily: {
      type: String,
      default: 'Arial, sans-serif',
    },
    backgroundColor: {
      type: String,
      default: '#fff',
    },
    color: {
      type: String,
      default: '#000000',
    },
  },
  watch: {
    value(newValue) {
      this.date = this.formatDateString(newValue);
    },
    height() {
      this.applyStyles();
    },
    width() {
      this.applyStyles();
    },
    borderColor() {
      this.applyStyles();
    },
    borderWidth() {
      this.applyStyles();
    },
    borderStyle() {
      this.applyStyles();
    },
    fontSize() {
      this.applyStyles();
    },
    fontFamily() {
      this.applyStyles();
    },
    backgroundColor() {
      this.applyStyles();
    },
    color() {
      this.applyStyles();
    },
  },
  computed: {
    datepickerPosition() {
      return {
        'datepicker-left': this.side === 'left',
        'datepicker-right': this.side === 'right'
      };
    },
    clearButtonClass() {
      return this.date ? 'icon-clear' : 'icon-clear-hidden icon-clear-alternative';
    }
  },
  created() {
    this.date = this.formatDateString(this.value);
    this.$emit('input', this.date);
  },
  mounted() {
    const inputElement = this.$refs.datepickerInput.$el.querySelector("input");
      inputElement.addEventListener('click', () => {
        this.isDatepickerOpen = true;
      });
      // カレンダーに対する制御
      const datepickerEl = this.$refs.datepickerInput?.$el;
      const calendarElement = this.$refs.datepickerInput.$el.querySelector('.vdp-datepicker__calendar');
      const calendarElements = datepickerEl?.querySelectorAll('.vdp-datepicker__calendar');
      document.addEventListener('focusout', (event) => {
        // フォーカスがカレンダー外の要素に移動した場合にのみ閉じる
        if (!calendarElement.contains(event.relatedTarget)) {
          this.isDatepickerOpen = false;
          calendarElements[1].style.display = 'none'; 
        }
      });
      this.applyStyles();
  },
  methods: {
    applyStyles() {
      const root = this.$refs.datepickerInput.$el.querySelector('input');
      if (root) {
        root.style.setProperty('--backgroundColor', this.backgroundColor);
        root.style.setProperty('--height', this.height);
        root.style.setProperty('--width', this.width);
        root.style.setProperty('--fontSize', this.fontSize);
        root.style.setProperty('--borderColor', this.borderColor);
        root.style.setProperty('--borderWidth', this.borderWidth);
        root.style.setProperty('--borderStyle', this.borderStyle);
        root.style.setProperty('--fontFamily', this.fontFamily);
        root.style.setProperty('--color', this.color);
      }
      const divElement = this.$refs.inputWrapper;
      if (divElement) {
        divElement.style.backgroundColor = this.backgroundColor;
      }
    },
    formatDate(date) {
      const year = date.getFullYear();
      const month = ('0' + (date.getMonth() + 1)).slice(-2);
      const day = ('0' + date.getDate()).slice(-2);
      return `${year}/${month}/${day}`;
    },
    handleDateChange(date) {
      this.date = this.formatDate(date);
      this.$emit('input', this.date);
      this.$emit('change');
      this.isDatepickerOpen = false;
    },
    openDatepicker() {
      this.showDatePicker();
    },
    closeDatepicker() {
      this.$emit('input', this.date);
      this.$emit('change');
      this.isDatepickerOpen = false;
      if(this.$refs.datepickerInput){
        this.$refs.datepickerInput.close();
      }
    },
    showDatePicker() {
      if(this.disabled) {return;}
        this.isDatepickerOpen = true;
      if (!this.$refs.datepickerInput.isOpen) {
        this.$refs.datepickerInput.showCalendar();
      } else {
        this.isDatepickerOpen = false;
        this.$refs.datepickerInput.close();
      }
    },
    submmitEmpty() {
      if(this.disabled) {return;}
      this.$emit('input', '');
    },
    beforeDestroy() {
      const inputElement = this.$refs.datepickerInput.$el.querySelector('input');
      inputElement.removeEventListener('focus', this.openDatepicker);
    },
  },
};
</script>       

<style lang="scss">
@import '@top/variables';
$day-width: 48.25px;
$primary-opposite-color: #ff8d1e;
$secondary-color: #D1E7FF;
$thirdary-color: #FFF;
$day-primary-color: #f5faff;
$day-secondary-color: #c5e2fc;
$day-font-color: #59aeff;
$now-selected-font-color: #e17009;
$now-selected-border-color: #fad42e;
$now-selected-background-color: #ffc0cb; // 選択している日付

.datepicker-input-wrapper {
  display: flex;
  align-items: center;
  max-width: 99%;
}

.datepicker-input svg {
  display: none;
}

.icon {
  color: $primary-color;
  margin: 0;
  transform: translateX(-10%);
  height: 8px;
}

.datepicker-input-wrapper .calendar-icon {
  color: $primary-color;
}

.icon-clear {
  color: #FF0000;
  position: relative;
  transform: translateX(-120%);
  width: 20px;
  height: 16px;
}

.icon-clear-hidden::before {
  display: none;
}

.icon-clear-alternative {
  width: 20px;
}

.datepicker-input input:focus-visible {
  outline: none;
}

.datepicker-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9998;
}

.datepicker-input {

    input {
      display: flex;
      justify-content: center;
      text-align: center;
      align-items: middle;
      padding: 5px 10px;
      background-color: var(--backgroundColor) !important;
      height: var(--height) !important;
      width: var(--width) !important;
      font-size: var(--fontSize) !important;
      border: var(--borderWidth) var(--borderStyle) var(--borderColor) !important;
      font-family: var(--fontFamily) !important;
      color: var(--color) !important;
      border: 1px solid transparent;
    }

   .vdp-datepicker__calendar {
      position: fixed; /* 親要素からの絶対位置にする */
      top: 30%; /* 必要に応じて位置を調整 X-axis */
      left: 30%; /* 必要に応じて位置を調整 Y-axis */
      z-index: 9999; /* 他の要素の上に表示 */
      width: 361px;
      height: 327px;
      font-family: "Hiragino Kaku Gothic ProN", sans-serif;
      border: 1px solid #c5dbec;
      border-radius: 5px;

    div {
      padding: 3px;
    }
  
    .month {
      font-size: 13px;
      font-weight: bold;
      background: #f5f8fc;
      color: $day-font-color;
      border: solid 1px #D1E7FF;
      width: 150px;
      height: 35px;
      padding-top: 0px;
      padding-bottom: 10px;
      margin: 10px 0 0 19px;
      vertical-align: middle;
              
      &.selected {
        border: 1px solid $now-selected-border-color;
        background: $now-selected-background-color;
        font-weight: bold;
        color: $now-selected-font-color;
      }
    }
      
    .year {
      font-size: 13px;
      font-weight: bold;
      background: #f5f8fc;
      color: $day-font-color;
      border: solid 1px #D1E7FF;
      width: 150px;
      height: 42px;
      padding-top: 0px;
      padding-bottom: 10px;
      margin: 12px 0 0 19px;
      vertical-align: middle;

      &.selected {
        border: 1px solid $now-selected-border-color;
        background: $now-selected-background-color;
        font-weight: bold;
        color: $now-selected-font-color;
      }
    }

    .cell {

      &.day-header {
        font-size: 16px;
        font-weight: bold;
        color: $primary-color;
        margin: 1px;
        margin-bottom: 5px;
        width: $day-width;
      }

      &.day {
        background: $day-primary-color;
        color: $day-font-color;
        font-weight: bold;
        font-size: 14px;
        margin: 1px;
        padding-right: 3px;
        text-align: right;
        vertical-align: middle;
        height: 35px;
        border: 1px solid $day-secondary-color;
        width: $day-width;
        
        &.selected {
          border: 1px solid #79b7e7;
          background: $now-selected-background-color 50% 50% repeat-x;
          font-weight: bold;
          color: $now-selected-font-color;
        }

        &.today {
          border: 1px solid $now-selected-border-color;
          background: #faf6e3;
          color: $primary-opposite-color;
        }
      }

      &.blank {
        background: transparent;
        border: none;
      }

    }

    header {
      margin: 5px;
      
      span {

        background: $primary-color;
        color: $thirdary-color;
        font-weight: bold;
        
        &:focus {
          background: $now-selected-border-color;
        }

        &.next {
          border-top-right-radius: 5px;
          border-bottom-right-radius: 5px;
            
          &:hover {
            background: $now-selected-background-color;
          }

        }
      
        &.prev {
          border-top-left-radius: 5px;
          border-bottom-left-radius: 5px;
          
          &:hover {
            background: $now-selected-background-color;
          }

        }
        
      }
      
    }

  }

  .calendar-button-icon {
    background: $primary-color;  
  }

  .day__month_btn, .prev, .next {
    font-family: "Hiragino Kaku Gothic ProN", sans-serif;
    background: $primary-color;
    font-weight: bold;
  }

  /* DatePickerのInput要素のラッパー */
  .mx-datepicker {
    width: 115px;
  }
  }

/* Responsive対応 */
@media (max-width: 750px) {
  .datepicker-right .vdp-datepicker__calendar {
    right: -35%;
    left: auto;
  }
}

@media (max-width: 480px) {
  .datepicker-input input {
    font-size: 14.8px;
  }

  .datepicker-input .vdp-datepicker__calendar {
    width: 325px;
    height: 300px;
    font-family: "Hiragino Kaku Gothic ProN", sans-serif;
  }

  .datepicker-input .cell {
    text-align: center;
    padding: 0;
    width: 43.25px;
  }

  .datepicker-input .cell.day-header {
    color: black;
    font-size: 14px;
    font-weight: bold;
    margin: 1px;
    margin-bottom: 5px;
  }

  .datepicker-input .cell.day {
    height: 31.5px;
    font-size: 12.85px;
    font-weight: normal;
  }
}
</style>
