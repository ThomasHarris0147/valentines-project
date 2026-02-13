<template>
  <div class="valentine-question-page">
    <!-- Floating hearts background -->
    <div class="hearts-container">
      <div 
        v-for="n in 20" 
        :key="n" 
        class="heart" 
        :style="getHeartStyle(n)"
      >
        💕
      </div>
    </div>

    <div class="container">
      <div class="message-wrapper">
        <h1 class="message">Will you be my valentine?</h1>
        <div class="sparkles">✨</div>
      </div>
      
      <div class="buttons" ref="buttonsContainer">
        <button 
          @click="handleYesClick" 
          class="btn yes-btn"
          :style="yesButtonStyle"
        >
          <span class="btn-text">Yes</span>
          <span class="heart-icon">💖</span>
        </button>
        <button 
          @click="handleNoClick"
          class="btn no-btn"
        >
          <span class="btn-text">No</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { gsap } from 'gsap'

export default {
  name: 'ValentineQuestion',
  emits: ['yes-clicked'],
  setup(props, { emit }) {
    const noClicks = ref(0)
    const yesButtonScale = ref(1)

    const yesButtonStyle = computed(() => {
      return {
        transform: `scale(${yesButtonScale.value})`
      }
    })

    const handleNoClick = () => {
      noClicks.value++
      // Make Yes button bigger each time No is clicked
      const newScale = yesButtonScale.value + 0.2
      
      // Animate the scale increase
      const proxy = { scale: yesButtonScale.value }
      gsap.to(proxy, {
        scale: newScale,
        duration: 0.3,
        ease: 'back.out(1.7)',
        onUpdate: function() {
          yesButtonScale.value = proxy.scale
        }
      })
    }

    const handleYesClick = () => {
      emit('yes-clicked')
    }

    const getHeartStyle = (index) => {
      const delay = (index * 0.3) % 15
      const left = (index * 5) % 100
      return {
        left: `${left}%`,
        top: `${(index * 4) % 100}%`,
        animationDelay: `${delay}s`,
        fontSize: `${1.5 + Math.random()}rem`
      }
    }

    return {
      yesButtonStyle,
      handleNoClick,
      handleYesClick,
      getHeartStyle
    }
  }
}
</script>

<style scoped>
.valentine-question-page {
  min-height: 100vh;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%);
}

.hearts-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.heart {
  position: absolute;
  font-size: 2rem;
  opacity: 0.3;
  animation: float 15s infinite ease-in-out;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  25% {
    transform: translateY(-20px) rotate(5deg);
  }
  50% {
    transform: translateY(-40px) rotate(-5deg);
  }
  75% {
    transform: translateY(-20px) rotate(3deg);
  }
}

.container {
  text-align: center;
  padding: 2rem;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.message-wrapper {
  position: relative;
  margin-bottom: 4rem;
}

.message {
  font-size: 4rem;
  color: #d63384;
  margin-bottom: 1rem;
  text-shadow: 3px 3px 6px rgba(255, 255, 255, 0.8),
               0 0 20px rgba(255, 182, 193, 0.5);
  animation: fadeIn 1s ease-in, pulse 2s ease-in-out infinite;
  font-weight: bold;
  letter-spacing: 2px;
}

.sparkles {
  font-size: 2rem;
  animation: sparkle 2s ease-in-out infinite;
  opacity: 0.8;
}

@keyframes sparkle {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.buttons {
  display: flex;
  gap: 2rem;
  justify-content: center;
  flex-wrap: wrap;
  position: relative;
  min-height: 150px;
  align-items: center;
}

.btn {
  padding: 1.2rem 3rem;
  font-size: 1.8rem;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  font-weight: bold;
  position: relative;
  font-family: 'Georgia', serif;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  overflow: visible;
}

.yes-btn {
  background: linear-gradient(135deg, #ff6b9d 0%, #ff8fab 50%, #ffa8c5 100%);
  color: white;
  box-shadow: 0 8px 25px rgba(255, 107, 157, 0.5),
              0 0 30px rgba(255, 182, 193, 0.4);
  border: 3px solid rgba(255, 255, 255, 0.5);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.yes-btn:hover {
  transform: scale(1.15) translateY(-5px);
  box-shadow: 0 12px 35px rgba(255, 107, 157, 0.7),
              0 0 40px rgba(255, 182, 193, 0.6);
}

.heart-icon {
  font-size: 1.5rem;
  animation: heartbeat 1s ease-in-out infinite;
}

@keyframes heartbeat {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.3);
  }
}

.no-btn {
  background: linear-gradient(135deg, #ffcccc 0%, #ffb3ba 100%);
  color: #d63384;
  box-shadow: 0 8px 25px rgba(214, 51, 132, 0.3);
  border: 3px solid rgba(255, 255, 255, 0.5);
  transition: transform 0.1s ease-out, box-shadow 0.3s ease;
}

.no-btn:hover {
  box-shadow: 0 12px 35px rgba(214, 51, 132, 0.5);
}

.btn-text {
  position: relative;
  z-index: 1;
}

@media (max-width: 768px) {
  .message {
    font-size: 2.5rem;
  }
  
  .btn {
    padding: 1rem 2rem;
    font-size: 1.5rem;
  }
  
  .buttons {
    flex-direction: column;
    gap: 1.5rem;
  }
}
</style>

