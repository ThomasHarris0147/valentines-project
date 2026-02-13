<template>
  <div id="app">
    <!-- Pin Board Page -->
    <PinBoard v-if="showPinBoard" />
    
    <!-- Massage Question Page -->
    <MassageQuestion 
      v-else-if="showMassageQuestion"
      @yes-clicked="handleMassageYes"
    />
    
    <!-- Back Scratch Question Page -->
    <BackScratchQuestion 
      v-else-if="showBackScratchQuestion"
      @yes-clicked="handleBackScratchYes"
    />
    
    <!-- Lamborghini Question Page -->
    <LamborghiniQuestion 
      v-else-if="showLamborghiniQuestion"
      @yes-clicked="handleLamborghiniYes"
    />
    
    <!-- Money Question Page -->
    <MoneyQuestion 
      v-else-if="showMoneyQuestion"
      @yes-clicked="handleMoneyYes"
    />
    
    <!-- Valentine Question Page -->
    <ValentineQuestion 
      v-else-if="showValentineQuestion"
      @yes-clicked="handleValentineYes"
    />
    
    <!-- Initial screen with buttons -->
    <template v-else>
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
          <h1 class="message">{{ message }}</h1>
          <div class="sparkles">✨</div>
        </div>
        
        <div class="buttons" ref="buttonsContainer">
          <button 
            @click="handleYesClick" 
            class="btn yes-btn"
          >
            <span class="btn-text">Yes</span>
            <span class="heart-icon">💖</span>
          </button>
          <button 
            ref="noBtn"
            @mouseenter="startTracking"
            @mouseleave="stopTracking"
            :style="noButtonStyle"
            class="btn no-btn"
          >
            <span class="btn-text">No</span>
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { gsap } from 'gsap'
import PinBoard from './components/PinBoard.vue'
import ValentineQuestion from './components/ValentineQuestion.vue'
import MoneyQuestion from './components/MoneyQuestion.vue'
import LamborghiniQuestion from './components/LamborghiniQuestion.vue'
import BackScratchQuestion from './components/BackScratchQuestion.vue'
import MassageQuestion from './components/MassageQuestion.vue'

export default {
  name: 'App',
  components: {
    PinBoard,
    ValentineQuestion,
    MoneyQuestion,
    LamborghiniQuestion,
    BackScratchQuestion,
    MassageQuestion
  },
  setup() {
    const message = ref('Do you love me?')
    const mouseX = ref(0)
    const mouseY = ref(0)
    const isTracking = ref(false)
    const animationFrameId = ref(null)
    const noButtonX = ref(0)
    const noButtonY = ref(0)
    const showValentineQuestion = ref(false)
    const showMoneyQuestion = ref(false)
    const showLamborghiniQuestion = ref(false)
    const showBackScratchQuestion = ref(false)
    const showMassageQuestion = ref(false)
    const showPinBoard = ref(false)
    const noBtn = ref(null)
    const buttonsContainer = ref(null)
    const currentTween = ref(null)

    const noButtonStyle = computed(() => {
      return {
        position: 'relative',
        left: `${noButtonX.value}px`,
        top: `${noButtonY.value}px`
      }
    })

    const updateMousePosition = (event) => {
      mouseX.value = event.clientX
      mouseY.value = event.clientY
      
      if (isTracking.value) {
        moveButtonAway()
      }
    }

    const getDistance = (x1, y1, x2, y2) => {
      return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
    }

    const moveButtonAway = () => {
      if (!noBtn.value) return
      
      const buttonRect = noBtn.value.getBoundingClientRect()
      const buttonCenterX = buttonRect.left + buttonRect.width / 2
      const buttonCenterY = buttonRect.top + buttonRect.height / 2
      
      // Calculate distance from cursor to button center
      const distance = getDistance(
        mouseX.value, 
        mouseY.value, 
        buttonCenterX, 
        buttonCenterY
      )
      
      // If cursor is close to the button, move it away immediately
      if (distance < 100) {
        // Kill any existing animation
        if (currentTween.value) {
          currentTween.value.kill()
        }
        
        // Calculate direction away from cursor
        const angle = Math.atan2(
          buttonCenterY - mouseY.value, 
          buttonCenterX - mouseX.value
        )
        // Move far enough to avoid cursor - distance increases as cursor gets closer
        const moveDistance = Math.max(80, (100 - distance) * 1.5)
        
        // Calculate target position
        const targetX = noButtonX.value + Math.cos(angle) * moveDistance
        const targetY = noButtonY.value + Math.sin(angle) * moveDistance
        
        // Create a proxy object for GSAP to animate
        const proxy = { x: noButtonX.value, y: noButtonY.value }
        
        // Animate smoothly with GSAP
        currentTween.value = gsap.to(proxy, {
          x: targetX,
          y: targetY,
          duration: 0.3,
          ease: 'power2.out',
          onUpdate: function() {
            noButtonX.value = proxy.x
            noButtonY.value = proxy.y
          }
        })
      }
      
      // Continue checking if tracking
      if (isTracking.value) {
        animationFrameId.value = requestAnimationFrame(moveButtonAway)
      }
    }

    const startTracking = () => {
      isTracking.value = true
      animationFrameId.value = requestAnimationFrame(moveButtonAway)
    }

    const stopTracking = () => {
      isTracking.value = false
      if (animationFrameId.value) {
        cancelAnimationFrame(animationFrameId.value)
      }
      if (currentTween.value) {
        currentTween.value.kill()
      }
    }

    const handleYesClick = () => {
      showValentineQuestion.value = true
    }

    const handleValentineYes = () => {
      showMoneyQuestion.value = true
    }

    const handleMoneyYes = () => {
      showLamborghiniQuestion.value = true
    }

    const handleLamborghiniYes = () => {
      showBackScratchQuestion.value = true
    }

    const handleBackScratchYes = () => {
      showMassageQuestion.value = true
    }

    const handleMassageYes = () => {
      showPinBoard.value = true
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

    onMounted(() => {
      // Track mouse position globally
      document.addEventListener('mousemove', updateMousePosition)
    })

    onBeforeUnmount(() => {
      document.removeEventListener('mousemove', updateMousePosition)
      if (animationFrameId.value) {
        cancelAnimationFrame(animationFrameId.value)
      }
      if (currentTween.value) {
        currentTween.value.kill()
      }
    })

    return {
      message,
      noButtonStyle,
      showValentineQuestion,
      showMoneyQuestion,
      showLamborghiniQuestion,
      showBackScratchQuestion,
      showMassageQuestion,
      showPinBoard,
      noBtn,
      buttonsContainer,
      startTracking,
      stopTracking,
      handleYesClick,
      handleValentineYes,
      handleMoneyYes,
      handleLamborghiniYes,
      handleBackScratchYes,
      handleMassageYes,
      getHeartStyle
    }
  }
}
</script>

