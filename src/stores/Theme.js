import { defineStore } from 'pinia';

export const useThemeStore = defineStore('theme', {
  state: () => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') {
      return { theme: saved };
    }
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return { theme: prefersDark ? 'dark' : 'light' };
    // return { theme: 'light' };
  },
  actions: {
    toggleTheme() {
      this.theme = this.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', this.theme);
      this.applyTheme();
    },
    applyTheme() {
      const html = document.documentElement;
      if (this.theme === 'dark') html.classList.add('dark');
      else html.classList.remove('dark');
    },
  },
});
