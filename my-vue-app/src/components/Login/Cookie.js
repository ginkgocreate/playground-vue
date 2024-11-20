import CryptoJS  from 'crypto-js';

const key = 'trs-&%&#&#%&$&-12fda21';
const key_account = key + "_account";
const key_pass = key + "_pass";
const key_save = key + "_save";
const secret = 'secretKey-###';

export default class Cookie {
  constructor($cookies) {
    this.$cookie = $cookies;
    this.account = '';
    this.password = '';
    this.save = '';
  }

  load() {
    const cookie = this.$cookie;
    // cookieから読込 もし無ければ空文字を返す
    const get = (key, defaultValue = '') => {
      return cookie.isKey(key) ? cookie.get(key) : defaultValue;
    };

    this.account = get(key_account);
    this.password = get(key_pass);
    this.save = get(key_save)
  }

  // 期限切れの単位は日
  set(account, password, save, expires = 30) {
    const cookie = this.$cookie;
    // 保存可否によって、cookieから情報を消す
    const store = (key, value, isRemove = false) => {
      if (isRemove) {
        cookie.remove(key);
      } else {
        cookie.set(key, value, {expires: expires});
      }
    }
    // 保存するチェックボックスの値を反転させる
    const isRemove = !save;
    store(key_account, account, isRemove);
    store(key_pass, this.encrypt(password), isRemove);
    store(key_save, save, isRemove);

  }

  // 暗号化
  encrypt(value) {
    return CryptoJS.AES.encrypt(value, secret),toString();
  }

  // 復号化
  decrypt(value) {
    try {
      const bytes = CryptoJS.AES.decrypt(value, secret);
      return bytes.toString(CryPtoJS.enc.Utf8);
    } catch (e) {
      return '';
    }
  }

}