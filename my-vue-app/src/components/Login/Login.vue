<template>
  <div class="login-container">
    <h2>ログイン</h2>
    <form @submit.prevent="login">
      <div class="form-group">
        <label for="account">アカウント</label>
        <input
          ref="password"
          id="account"
          type="text"
          v-model="account"
          placeholder="アカウントを入力"
          @blur="validateAccount"
        />
        <p v-if="errorMessage === 'アカウントを入力してください'" class="error">{{ errorMessage }}</p>
      </div>

      <div class="form-group">
        <label for="password">パスワード</label>
        <input
          ref="password"
          id="password"
          type="password"
          v-model="password"
          placeholder="パスワードを入力"
          @blur="validatePassword"
        />
        <p v-if="errorMessage === 'パスワードを入力してください'" class="error">{{ errorMessage }}</p>
      </div>

      <div class="form-group">
        <label>
          <input type="checkbox" v-model="saveLoginInfo" /> ログイン情報を保存する
        </label>
      </div>

      <button type="submit" :disabled="isLoading">
        {{ isLoading ? 'ログイン中...' : 'ログイン' }}
      </button>

      <p v-if="errorMessage && !['アカウントを入力してください', 'パスワードを入力してください'].includes(errorMessage)" class="error">
        {{ errorMessage }}
      </p>
    </form>
  </div>
</template>

<script>
import Cookie from "./Cookie.js"

export default {
  data() {
    return {
      account: "",
      password: "",
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
        this.errorMessage = "アカウントを入力してください";
      } else {
        this.errorMessage = "";
      }
    },
    validatePassword() {
      if (!this.password || this.password.length < 6) {
        this.errorMessage = "パスワードを入力してください";
      } else {
        this.errorMessage = "";
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
  border: 1px solid #ddd;
  border-radius: 5px;
  background: #f9f9f9;
}

.form-group {
  margin-bottom: 15px;
}

input {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  box-sizing: border-box;
}

button {
  width: 100%;
  padding: 10px;
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
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
