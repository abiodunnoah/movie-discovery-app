import './assets/main.css';
import './index.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faHeart as fasHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faBookmark as fasBookmark } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as farBookmark } from '@fortawesome/free-regular-svg-icons';

library.add(fasHeart, farHeart, fasBookmark, farBookmark);

import App from './App.vue';
import router from './router';
import naive from 'naive-ui';
import { useUserDataStore } from './stores/userData';

import '@fortawesome/fontawesome-free/css/all.css';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(naive);
app.component('font-awesome-icon', FontAwesomeIcon);

import { useThemeStore } from './stores/Theme';
const themeStore = useThemeStore();
themeStore.applyTheme();

app.mount('#app');

useUserDataStore().init();
