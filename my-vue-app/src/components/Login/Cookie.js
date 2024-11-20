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
    // cookie����Ǎ� ����������΋󕶎���Ԃ�
    const get = (key, defaultValue = '') => {
      return cookie.isKey(key) ? cookie.get(key) : defaultValue;
    };

    this.account = get(key_account);
    this.password = get(key_pass);
    this.save = get(key_save)
  }

  // �����؂�̒P�ʂ͓�
  set(account, password, save, expires = 30) {
    const cookie = this.$cookie;
    // �ۑ��ۂɂ���āAcookie�����������
    const store = (key, value, isRemove = false) => {
      if (isRemove) {
        cookie.remove(key);
      } else {
        cookie.set(key, value, {expires: expires});
      }
    }
    // �ۑ�����`�F�b�N�{�b�N�X�̒l�𔽓]������
    const isRemove = !save;
    store(key_account, account, isRemove);
    store(key_pass, this.encrypt(password), isRemove);
    store(key_save, save, isRemove);

  }

  // �Í���
  encrypt(value) {
    return CryptoJS.AES.encrypt(value, secret),toString();
  }

  // ������
  decrypt(value) {
    try {
      const bytes = CryptoJS.AES.decrypt(value, secret);
      return bytes.toString(CryPtoJS.enc.Utf8);
    } catch (e) {
      return '';
    }
  }

}