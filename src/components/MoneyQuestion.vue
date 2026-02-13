<template>
  <div class="money-question-page">
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
        <h1 class="message">Will you give me 10 billion baht?</h1>
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
        <div class="rope-container" ref="ropeContainer">
          <!-- Rope from right side - always visible -->
          <svg 
            class="rope-line"
            :viewBox="`0 0 ${windowWidth} ${windowHeight}`"
            preserveAspectRatio="none"
          >
            <line
              :x1="ropeEndX"
              :y1="ropeEndY"
              :x2="buttonX"
              :y2="buttonY"
              stroke="#8b6914"
              stroke-width="6"
              stroke-linecap="round"
            />
          </svg>
          <button 
            ref="noBtn"
            @mouseenter="startPulling"
            :style="noButtonStyle"
            class="btn no-btn"
          >
            <span class="btn-text">No</span>
          </button>
        </div>
      </div>

      <!-- Draggable scissors -->
      <div 
        ref="scissors"
        class="scissors"
        :style="scissorsStyle"
        @mousedown="startDragScissors"
      >
        ✂️
      </div>

      <!-- Tooltip message -->
      <Transition name="fade">
        <div v-if="showPopup" class="tooltip" :style="tooltipStyle">
          The scissors are not sharp enough
        </div>
      </Transition>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { gsap } from 'gsap'

export default {
  name: 'MoneyQuestion',
  emits: ['yes-clicked'],
  setup(props, { emit }) {
    const noBtn = ref(null)
    const buttonsContainer = ref(null)
    const ropeContainer = ref(null)
    const isPulling = ref(false)
    const mouseX = ref(0)
    const mouseY = ref(0)
    const pullAnimationId = ref(null)
    const noButtonX = ref(0)
    const noButtonY = ref(0)
    const currentTween = ref(null)
    const ropeEndX = ref(0)
    const ropeEndY = ref(0)
    const buttonX = ref(0)
    const buttonY = ref(0)
    const windowWidth = ref(window.innerWidth)
    const windowHeight = ref(window.innerHeight)
    const scissors = ref(null)
    const scissorsX = ref(50)
    const scissorsY = ref(100)
    const isDraggingScissors = ref(false)
    const dragOffset = ref({ x: 0, y: 0 })
    const showPopup = ref(false)
    const tooltipX = ref(0)
    const tooltipY = ref(0)

    const noButtonStyle = computed(() => {
      return {
        position: 'relative',
        left: `${noButtonX.value}px`,
        top: `${noButtonY.value}px`,
        transition: 'none'
      }
    })

    const scissorsStyle = computed(() => {
      return {
        left: `${scissorsX.value}px`,
        top: `${scissorsY.value}px`,
        cursor: isDraggingScissors.value ? 'grabbing' : 'grab'
      }
    })

    const tooltipStyle = computed(() => {
      return {
        left: `${tooltipX.value}px`,
        top: `${tooltipY.value}px`
      }
    })

    const updateMousePosition = (event) => {
      mouseX.value = event.clientX
      mouseY.value = event.clientY
    }

    const updateRopePosition = () => {
      if (!noBtn.value) return
      
      const buttonRect = noBtn.value.getBoundingClientRect()
      
      // Rope originates from right side of screen
      ropeEndX.value = window.innerWidth - 20
      ropeEndY.value = buttonRect.top + buttonRect.height / 2
      
      // Button center position (absolute screen coordinates)
      buttonX.value = buttonRect.left + buttonRect.width / 2
      buttonY.value = buttonRect.top + buttonRect.height / 2
    }

    const startPulling = () => {
      isPulling.value = true
      updateRopePosition()
      pullAnimationId.value = requestAnimationFrame(pullButton)
    }

    const pullButton = () => {
      if (!noBtn.value || !isPulling.value) return

      const buttonRect = noBtn.value.getBoundingClientRect()
      const buttonCenterX = buttonRect.left + buttonRect.width / 2
      const buttonCenterY = buttonRect.top + buttonRect.height / 2

      // Calculate distance from cursor to button
      const dx = mouseX.value - buttonCenterX
      const dy = mouseY.value - buttonCenterY
      const distance = Math.sqrt(dx * dx + dy * dy)

      // If cursor is close to button, pull button away towards rope direction (right)
      if (distance < 100) {
        const pullStrength = (100 - distance) / 100 // Stronger pull when closer
        
        // Calculate direction towards rope (right side of screen)
        const ropeDirectionX = 1 // Always pull right
        const ropeDirectionY = 0
        
        // Move button away from cursor in rope direction (accumulate movement, don't reset)
        const moveDistance = Math.max(20, pullStrength * 60)
        const targetX = noButtonX.value + ropeDirectionX * moveDistance
        const targetY = noButtonY.value + ropeDirectionY * moveDistance

        // Animate button movement
        if (currentTween.value) {
          currentTween.value.kill()
        }
        
        const proxy = { x: noButtonX.value, y: noButtonY.value }
        currentTween.value = gsap.to(proxy, {
          x: targetX,
          y: targetY,
          duration: 0.1,
          ease: 'power2.out',
          onUpdate: function() {
            noButtonX.value = proxy.x
            noButtonY.value = proxy.y
            updateRopePosition()
          }
        })
      }

      // Always update rope position
      updateRopePosition()

      if (isPulling.value) {
        pullAnimationId.value = requestAnimationFrame(pullButton)
      }
    }

    const handleYesClick = () => {
      emit('yes-clicked')
    }

    const startDragScissors = (event) => {
      isDraggingScissors.value = true
      const rect = scissors.value.getBoundingClientRect()
      dragOffset.value = {
        x: event.clientX - rect.left - rect.width / 2,
        y: event.clientY - rect.top - rect.height / 2
      }
      document.addEventListener('mousemove', dragScissors)
      document.addEventListener('mouseup', stopDragScissors)
      event.preventDefault()
    }

    const dragScissors = (event) => {
      if (!isDraggingScissors.value) return
      scissorsX.value = event.clientX - dragOffset.value.x
      scissorsY.value = event.clientY - dragOffset.value.y
    }

    const stopDragScissors = (event) => {
      if (!isDraggingScissors.value) return
      isDraggingScissors.value = false
      
      // Check if scissors are over the rope
      const scissorsRect = scissors.value.getBoundingClientRect()
      const scissorsCenterX = scissorsRect.left + scissorsRect.width / 2
      const scissorsCenterY = scissorsRect.top + scissorsRect.height / 2
      
      // Check if scissors center is near the rope line
      const distanceToRope = getDistanceToLine(
        scissorsCenterX,
        scissorsCenterY,
        ropeEndX.value,
        ropeEndY.value,
        buttonX.value,
        buttonY.value
      )
      
      // If scissors are close to rope (within 50px), show tooltip
      if (distanceToRope < 50) {
        // Position tooltip near scissors
        tooltipX.value = scissorsCenterX - 100
        tooltipY.value = scissorsCenterY - 60
        showPopup.value = true
        
        // Auto-hide tooltip after 3 seconds
        setTimeout(() => {
          showPopup.value = false
        }, 3000)
      }
      
      document.removeEventListener('mousemove', dragScissors)
      document.removeEventListener('mouseup', stopDragScissors)
    }

    const getDistanceToLine = (px, py, x1, y1, x2, y2) => {
      // Calculate distance from point to line segment
      const A = px - x1
      const B = py - y1
      const C = x2 - x1
      const D = y2 - y1
      
      const dot = A * C + B * D
      const lenSq = C * C + D * D
      let param = -1
      
      if (lenSq !== 0) {
        param = dot / lenSq
      }
      
      let xx, yy
      
      if (param < 0) {
        xx = x1
        yy = y1
      } else if (param > 1) {
        xx = x2
        yy = y2
      } else {
        xx = x1 + param * C
        yy = y1 + param * D
      }
      
      const dx = px - xx
      const dy = py - yy
      return Math.sqrt(dx * dx + dy * dy)
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

    const handleResize = () => {
      windowWidth.value = window.innerWidth
      windowHeight.value = window.innerHeight
      updateRopePosition()
    }

    onMounted(() => {
      document.addEventListener('mousemove', updateMousePosition)
      window.addEventListener('resize', handleResize)
      // Update rope position continuously to keep it visible
      setInterval(updateRopePosition, 100)
      updateRopePosition()
    })

    onBeforeUnmount(() => {
      document.removeEventListener('mousemove', updateMousePosition)
      window.removeEventListener('resize', handleResize)
      if (pullAnimationId.value) {
        cancelAnimationFrame(pullAnimationId.value)
      }
      if (currentTween.value) {
        currentTween.value.kill()
      }
    })

    return {
      noBtn,
      buttonsContainer,
      ropeContainer,
      scissors,
      isPulling,
      noButtonStyle,
      scissorsStyle,
      ropeEndX,
      ropeEndY,
      buttonX,
      buttonY,
      windowWidth,
      windowHeight,
      showPopup,
      tooltipStyle,
      startPulling,
      startDragScissors,
      handleYesClick,
      getHeartStyle
    }
  }
}
</script>

<style scoped>
.money-question-page {
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
  font-size: 3.5rem;
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

.rope-container {
  position: relative;
  display: inline-block;
}

.rope-line {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 1;
}

.rope-line line {
  filter: drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.3));
  animation: ropeSway 2s ease-in-out infinite;
}

@keyframes ropeSway {
  0%, 100% {
    opacity: 0.8;
  }
  50% {
    opacity: 1;
  }
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
  position: relative;
  z-index: 2;
}

.no-btn:hover {
  box-shadow: 0 12px 35px rgba(214, 51, 132, 0.5);
}

.btn-text {
  position: relative;
  z-index: 1;
}


.scissors {
  position: fixed;
  font-size: 3rem;
  cursor: grab;
  z-index: 100;
  user-select: none;
  filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3));
  transition: transform 0.1s ease-out;
}

.scissors:active {
  cursor: grabbing;
  transform: scale(1.1);
}

.tooltip {
  position: fixed;
  background: rgba(0, 0, 0, 0.85);
  color: white;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  white-space: nowrap;
  z-index: 10000;
  pointer-events: none;
  transform: translate(-50%, -100%);
  margin-top: -10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  animation: tooltipFadeIn 0.2s ease-out;
}

.tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-top-color: rgba(0, 0, 0, 0.85);
}

@keyframes tooltipFadeIn {
  from {
    opacity: 0;
    transform: translate(-50%, -100%) translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -100%) translateY(0);
  }
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

  .scissors {
    font-size: 2.5rem;
  }

  .popup-message {
    padding: 1.5rem 2rem;
    margin: 1rem;
  }

  .popup-message p {
    font-size: 1.2rem;
  }
}
</style>

