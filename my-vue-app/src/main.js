import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router';
import VueCookies  from 'vue-cookies'

const app = createApp(App);

app.config.globalProperties.$cookies = VueCookies;
VueCookies.config('30d');

app.use(router);
app.mount('#app');