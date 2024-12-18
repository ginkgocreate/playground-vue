<template>
  <div>
    <div class="title">TRS Web</div>
      <div class="login-container">
      <div class="form-group">
        <input
          ref="password"
          id="account"
          type="text"
          v-model="account"
          placeholder="アカウントを入力"
          @blur="validateAccount"
        />
        <p v-if="accountCousionVisible" class="error">{{ 'アカウントは8桁半角数字で入力してください' }}</p>
      </div>

      <div class="form-group">
        <input
          ref="password"
          id="password"
          type="password"
          v-model="password"
          placeholder="パスワードを入力"
          @blur="validatePassword"
        />
        <p v-if="passwordCousionVisible" class="error">{{ 'パスワードは6文字以上入力してください' }}</p>
      </div>

      <div class="check-box">
        <label>
          <CheckBox v-model="saveLoginInfo" rightText="ログイン情報を記憶する" />
        </label>
      </div>

      <button @click="login" :disabled="isLoading">
        {{ isLoading ? 'ログイン中...' : 'ログイン' }}
      </button>

      <p v-if="errorMessage && !['アカウントを入力してください', 'パスワードを入力してください'].includes(errorMessage)" class="error">
        {{ errorMessage }}
      </p>
    </div>
  </div>
</template>

<script>
import Cookie from "./Cookie.js";
import CheckBox from "../parts/CheckBox.vue";

export default {
  components: {
    CheckBox,
  },
  data() {
    return {
      account: "",
      accountCousionVisible: false,
      password: "",
      passwordCousionVisible: false,
      saveLoginInfo: false,
      cookie: new Cookie(this.$cookies),
      isLoading: false,
      errorMessage: "",
    };
  },
  created() {
    this.loadFromCookie();
  },
  methods: {
    loadFromCookie(){
      // cookieにログイン情報を記憶させていれば、反映させる
      const cookie = this.cookie;
      cookie.load();
      this.account = cookie.userId;
      this.password = cookie.password;
      this.saveLoginInfo = cookie.save ? true : false;
    },
    setToCookie(){
      // ログイン情報を記憶するにﾁｪｯｸがあれば、cookieに記憶させる
      const cookie = this.cookie;
      cookie.set(this.account, this.password, this.saveLoginInfo);
    },
    validateAccount() {
      if (!this.account || this.account.length < 8 || isNaN(this.account)) {
        this.accountCousionVisible = true;
      } else {
        this.accountCousionVisible = false;
      }
    },
    validatePassword() {
      if (!this.password || this.password.length < 6) {
        this.passwordCousionVisible = true;
      } else {
        this.passwordCousionVisible = false;
      }
    },
    async login() {
      // 入力チェック
      if (!this.account) {
        this.errorMessage = "アカウントを入力してください";
        this.refs.account.focus();
        return;
      }
      if (!this.password) {
        this.errorMessage = "パスワードを入力してください";
        this.refs.password.focus();
        return;
      }

      // ログイン処理
      try {
        this.isLoading = true;
        this.errorMessage = "";

        const response = await this.mockLoginApi(this.account, this.password);

        if (response.success) {
          alert("ログイン成功！");
          this.setToCookie();
          // 遷移処理 (例: router.push('/dashboard'))
        } else {
          this.errorMessage = "アカウントまたはパスワードが正しくありません";
          this.account = '';
          this.password = '';
        }
      } catch (error) {
        console.log(error)
        this.errorMessage = "通信エラー、電波状況を確認してください";
      } finally {
        this.isLoading = false;
      }
    },
    mockLoginApi(account, password) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (account === "12345678" && password === "password") {
            resolve({ success: true });
          } else {
            resolve({ success: false });
          }
        }, 1000);
      });
    },
  },
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border-radius: 5px;
}

.title{
  border-bottom:  1px #ddd solid;
  height: 30px;
  display: flex;
  color: #5E83E6;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 1.2rem;
  width:90%;
  margin: auto;
}

.form-group {
  margin-bottom: 15px;
}

.check-box {
  display: flex;
  flex-direction: flex-start;
  margin: 25px 0 30px 5px;
}

input {
  font-size: 18px;
  width: 100%;
  height: 40px;
  padding: 0 3px;
  margin-top: 5px;
  box-sizing: border-box;
  border-radius: 3px;
  background: #fff;
  border: 1px #bbb solid;
}

input:focus {
  background-color: white; /* フォーカス時も白にする */
  box-shadow: none; /* フォーカスの青い枠を無効化 */
}

button {
  display: flex;
  align-items: center; /* 垂直中央揃え */
  justify-content: center; /* 水平方向中央揃え */
  width: 100%;
  height: 30px;
  background: #5E83E6;
  color: #fff;
  border: none;
  border-radius: 15px;
  cursor: pointer;
}

button:disabled {
  background: #ddd;
}

.error {
  color: red;
  font-size: 12px;
  margin-top: 5px;
}

</style>
