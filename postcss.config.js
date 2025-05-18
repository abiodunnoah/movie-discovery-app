// postcss.config.js
import tailwindcssPostcss from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';

export default {
  plugins: [
    tailwindcssPostcss(), // ← the new package
    autoprefixer(),
  ],
};
