<template>
  <div id="date-piker-wrapper">
    <div v-if="isDatepickerOpen" class="datepicker-overlay" @click="closeDatepicker"></div>
    <Datepicker
      :value="date"
      ref="datepicker"
      @input="handleDateChange"
      :format="format"
      :disabled="disabled"
      class="icon-custom-datepicker"
      :class="getStyle"
      :language="ja"
      :append-to-body="true"
    ></Datepicker>
    <i 
      class="far fa-window-close"
      :class="clearStyle"
      v-show="!disabled"
      @click="$emit('input', '')"
    ></i>
    <i class="far fa-calendar-alt icon" v-show="!disabled" @click="showDatePicker"></i>
  </div>
</template>

<script>
import Datepicker from 'vuejs-datepicker';
import {ja} from 'vuejs-datepicker/dist/locale';

export default {
  components: {
    Datepicker
  },
  data() {
    return {
      ja: ja,
      date: "",
      isDatepickerOpen: false,
      monthClickListeners: [],
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
    format: {
      type: String,
      default: 'yyyy/MM/dd'
    },
    disabled: {
      type: Boolean,
      default: false
    },
  },
  created() {
    // DatePickerへ渡す際はスラッシュ付与しなければならない
    // 正確にはformatへ合わせる形になる
    this.date = this.formatDateString(this.value);
  },
  beforeDestroy() {
    // フォーカスアウトイベントリスナーを削除
    document.removeEventListener('focusout', this.onFocusOut);

    // 月クリックのイベントリスナーを削除
    if (this.monthClickListeners) {
      this.monthClickListeners.forEach(({ element, listener }) => {
        element.removeEventListener('click', listener);
      });
    }
  },
  mounted() {
    if (this.format === 'yyyy/MM') {
      // 年月のみを取得するための処理
      const inputElement = this.$refs.datepicker.$el.querySelector("input");
      inputElement.addEventListener('click', () => {
        this.isDatepickerOpen = true;
        this.forciblyChangeToYMDatePicker();
      });
    } else {
      const inputElement = this.$refs.datepicker.$el.querySelector("input");
      inputElement.addEventListener('click', () => {
        this.isDatepickerOpen = true;
      });
      // カレンダーに対する制御
      const datepickerEl = this.$refs.datepicker?.$el;
      const calendarElement = this.$refs.datepicker.$el.querySelector('.vdp-datepicker__calendar');
      const calendarElements = datepickerEl?.querySelectorAll('.vdp-datepicker__calendar');
      document.addEventListener('focusout', (event) => {
        // フォーカスがカレンダー外の要素に移動した場合にのみ閉じる
        if (!calendarElement.contains(event.relatedTarget)) {
          this.isDatepickerOpen = false;
          calendarElements[1].style.display = 'none'; 
        }
      });
    }
  },
  watch: {
    value(newValue) {
      this.date = newValue;
    },
    isDatepickerOpen(newValue) {
      if (!newValue) {
        // isDatepickerOpen が false になったらイベントリスナーを削除
        this.monthClickListeners.forEach(({ element, listener }) => {
          element.removeEventListener('click', listener);
        });
        this.monthClickListeners = []; // リスナー配列をクリア
      }
    },
  },
  computed: {
    getStyle() {
      return {
        'left-side': this.side === 'left',
        'right-side': this.side === 'right'
      };
    },
    clearStyle() {
      return this.date ? 'clear-button' : 'clear-button-hide clear-button-alternative';
    },
  },
  methods: {
     forciblyChangeToYMDatePicker() {
      this.$nextTick(() => {
        const calendarElement = this.$refs.datepicker.$el.querySelector('.vdp-datepicker__calendar');
        
        // フォーカスアウトイベントをキャプチャするためのリスナー
        this.onFocusOut = (event) => {
          if (!calendarElement.contains(event.relatedTarget)) {
            const calendarElements = this.$refs.datepicker.$el.querySelectorAll('.vdp-datepicker__calendar');
            if (calendarElements[1]) {
              calendarElements[1].style.display = 'none';
            }
          }
        };
        document.addEventListener('focusout', this.onFocusOut);

        const datepickerEl = this.$refs.datepicker?.$el;
        const calendarElements = datepickerEl?.querySelectorAll('.vdp-datepicker__calendar');

        if (calendarElements) {
          calendarElements[0].style.display = 'none';
          calendarElements[1].style.display = 'block'; 
        }

        // 月クリック用のイベントリスナーを保存するための配列
        this.monthClickListeners = [];

        document.querySelectorAll('.vdp-datepicker__calendar .cell.month').forEach((monthCell) => {
          const clone = monthCell.cloneNode(true);
          monthCell.parentNode.replaceChild(clone, monthCell);

          const onMonthClick = (event) => {
            event.stopPropagation();
            event.preventDefault();

            const yearHeaderEl = this.$refs.datepicker.$el.querySelector('.month__year_btn.up');
            const year = yearHeaderEl.textContent.replace("年", "");
            const month = event.target.textContent.replace("月", "").padStart(2, 0);
            this.$emit('input', `${year}/${month}`);
            this.$emit('change');

            this.isDatepickerOpen = false;
            calendarElements[1].style.display = 'none'; 
            this.$refs.datepicker.close();
          };

          clone.addEventListener('click', onMonthClick);

          // リスナーを後で解除するために保存
          this.monthClickListeners.push({ element: clone, listener: onMonthClick });
        });
      });
    },
    formatDate(date) {
      const year = date.getFullYear();
      const month = ('0' + (date.getMonth() + 1)).slice(-2);
      const day = ('0' + date.getDate()).slice(-2);
      return `${year}/${month}/${day}`;
    },
    handleDateChange(date) {
      const formattedDate = this.formatDate(date);
      this.$emit('input', formattedDate);
      this.$emit('change');
      this.isDatepickerOpen = false;
    },
    showDatePicker() {
       if(!this.$refs.datepicker.isOpen) {
          this.isDatepickerOpen = true;
          if (this.format === 'yyyy/MM') {this.forciblyChangeToYMDatePicker();}
          const datepickerEl = this.$refs.datepicker?.$el;
          datepickerEl.querySelector("input").focus();
          this.$refs.datepicker.showCalendar();
        } else {
          this.isDatepickerOpen = false;
          this.$refs.datepicker.close();
        }
    },
    closeDatepicker() {
      this.$emit('input', this.date);
      this.$emit('change');
      this.isDatepickerOpen = false;
      if(this.$refs.datepicker){
        this.$refs.datepicker.close();
      }
    }
  }
};
</script>       

<style lang="scss" >
@import '@top/variables';
$day-width: 48.25px;
$primary-opposite-color: red;

$secondary-color: #ff8d1e;
$secondary-opposite-color: #1e90ff;
$thirdary-color: #FFF;

$day-primary-color: #fff; // 日付の背景色
$day-secondary-color: #e6e6e6; // 日付のボーダーカラー
$day-font-color: #59aeff; // 日付の文字色

$header-font-size: #f5f8fc;

$now-selected-font-color: #e17009;
$now-selected-border-color: #fad42e;
$now-selected-background-color: #ffc0cb; // 選択している日付

#date-piker-wrapper {
  width: 100%;
  max-width: 164px;
  display: flex;
  align-items: center;
}

.icon {
  margin-bottom: 9px;
  color: $primary-color;
  position: relative;
  right: 10px;
}

// clearボタン制御
.clear-button {
  color: #FF0000;
  position: relative;
  width: 20px;
  height: 20px;
  top: 2px;
  right: 23px;
}

.clear-button-hide::before {
  display: none;
}

.clear-button-alternative {
  width: 20px;
}

/* DatePickerのicon */
.icon-custom-datepicker svg {
  display: none;
}

/* DatePickerのInput要素 */
.icon-custom-datepicker input {
  height: 37px;
  width: 132px;
  border-radius: 5px;
  border: 1px solid lightgray;
  padding: 8px 23px 8px 8px;
  font-size: 16px;
  text-align: center;
  color: black;
  margin-right: 0px;
}

.icon-custom-datepicker input:focus-visible {
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

.icon-custom-datepicker {

  .vdp-datepicker__calendar {
      position: fixed; /* 親要素からの絶対位置にする */
      top: 30%; /* 必要に応じて位置を調整 X-axis */
      left: 30%; /* 必要に応じて位置を調整 Y-axis */
      z-index: 9999; /* 他の要素の上に表示 */
      width: 361px;
      height: 327px;
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
    background: #DFEFFC;  
  }

  .day__month_btn, .prev, .next {
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
    .right-side {
        .vdp-datepicker__calendar {
          right: -35%;
          left: auto;
        }
    }
}

/* Responsive対応 */
@media (max-width: 480px) {

.icon-custom-datepicker {

  input {
    font-size: 14.8px;
  }

  .vdp-datepicker__calendar {
    width: 325px;
    height: 300px;

    div {
      padding: 3px;
    }

    .cell {
      text-align: center;
      padding: 0;
      width: 43.25px;

      &.day-header {
        color: black;
        font-size: 14px;
        font-weight: bold;
        margin: 1px;
        margin-bottom: 5px;
      }

      &.day {
       height: 31.5px;
       font-size: 12.85px;
       font-weight: normal;
      }

    }

  }
 
}

}

</style>
