import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faHeart as fasHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(fasHeart, farHeart);

import App from './App.vue';
import router from './router';
import naive from 'naive-ui';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(naive);
app.component('font-awesome-icon', FontAwesomeIcon);

app.mount('#app');
