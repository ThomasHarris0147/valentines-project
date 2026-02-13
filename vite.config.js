import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: process.env.NODE_ENV === 'production' 
    ? (process.env.GITHUB_REPOSITORY 
        ? `/${process.env.GITHUB_REPOSITORY.split('/')[1]}/`
        : './')
    : '/',
})

