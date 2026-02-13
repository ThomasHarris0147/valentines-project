import { createApp } from 'vue'
import './assets/style.css'
import App from './App.vue'

try {
  const app = createApp(App)
  app.mount('#app')
} catch (error) {
  console.error('Error mounting Vue app:', error)
  document.getElementById('app').innerHTML = '<h1>Error loading app</h1><p>' + error.message + '</p>'
}

