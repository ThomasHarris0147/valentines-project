<template>
  <div class="lamborghini-question-page">
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
        <h1 class="message">Will you buy me a Lamborghini?</h1>
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
          @click="showMathQuestion"
          class="btn no-btn"
        >
          <span class="btn-text">No</span>
        </button>
      </div>
    </div>

    <!-- Math Question Popup -->
    <Transition name="fade">
      <div v-if="showMathPopup" class="popup-overlay" @click.self="closeMathPopup">
        <div class="math-popup">
          <p class="math-context">You must answer correctly to select no</p>
          <h2 class="math-question">What's 1 + 1?</h2>
          <div class="math-choices">
            <button 
              v-for="(choice, index) in choices" 
              :key="index"
              @click="selectAnswer(choice)"
              class="math-choice-btn"
            >
              {{ choice.display }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Wrong Answer Popup -->
    <Transition name="fade">
      <div v-if="showWrongAnswer" class="popup-overlay" @click="closeWrongAnswer">
        <div class="wrong-answer-popup">
          <p class="wrong-message">Wrong answer</p>
          <button @click="closeWrongAnswer" class="popup-close-btn">OK</button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'LamborghiniQuestion',
  emits: ['yes-clicked'],
  setup(props, { emit }) {
    const showMathPopup = ref(false)
    const showWrongAnswer = ref(false)
    const buttonsContainer = ref(null)

    const choices = ref([
      { value: '0', display: '0' },
      { value: '3', display: '3' },
      { value: '-1', display: '-1' },
      { value: 'euler', display: 'e^(iπ)' }
    ])

    const showMathQuestion = () => {
      showMathPopup.value = true
    }

    const closeMathPopup = () => {
      showMathPopup.value = false
    }

    const selectAnswer = (choice) => {
      // All answers are wrong
      showMathPopup.value = false
      showWrongAnswer.value = true
    }

    const closeWrongAnswer = () => {
      showWrongAnswer.value = false
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
      showMathPopup,
      showWrongAnswer,
      buttonsContainer,
      choices,
      showMathQuestion,
      closeMathPopup,
      selectAnswer,
      closeWrongAnswer,
      handleYesClick,
      getHeartStyle
    }
  }
}
</script>

<style scoped>
.lamborghini-question-page {
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
}

.no-btn:hover {
  box-shadow: 0 12px 35px rgba(214, 51, 132, 0.5);
}

.btn-text {
  position: relative;
  z-index: 1;
}

/* Math Question Popup */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  animation: fadeIn 0.3s ease-in;
}

.math-popup {
  background: white;
  padding: 2.5rem 3rem;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  text-align: center;
  max-width: 500px;
  width: 90%;
  animation: popupBounce 0.4s ease-out;
}

.math-context {
  font-size: 1rem;
  color: #666;
  margin-bottom: 1rem;
  font-style: italic;
}

.math-question {
  font-size: 2rem;
  color: #d63384;
  margin-bottom: 2rem;
  font-weight: bold;
}

.math-choices {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.math-choice-btn {
  padding: 1rem 1.5rem;
  font-size: 1.3rem;
  background: linear-gradient(135deg, #ffcccc 0%, #ffb3ba 100%);
  color: #d63384;
  border: 3px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
  cursor: pointer;
  font-weight: bold;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 4px 15px rgba(214, 51, 132, 0.3);
}

.math-choice-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(214, 51, 132, 0.5);
}

.math-choice-btn:active {
  transform: scale(0.98);
}

/* Wrong Answer Popup */
.wrong-answer-popup {
  background: white;
  padding: 2rem 3rem;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  text-align: center;
  max-width: 400px;
  animation: popupBounce 0.4s ease-out;
}

.wrong-message {
  font-size: 1.5rem;
  color: #d63384;
  margin-bottom: 1.5rem;
  font-weight: bold;
}

.popup-close-btn {
  padding: 0.8rem 2rem;
  font-size: 1.2rem;
  background: linear-gradient(135deg, #ff6b9d 0%, #ff8fab 50%, #ffa8c5 100%);
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-weight: bold;
  box-shadow: 0 4px 15px rgba(255, 107, 157, 0.4);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.popup-close-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(255, 107, 157, 0.6);
}

@keyframes popupBounce {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
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

  .math-popup {
    padding: 2rem 1.5rem;
  }

  .math-question {
    font-size: 1.5rem;
  }

  .math-choice-btn {
    padding: 0.8rem 1rem;
    font-size: 1.1rem;
  }

  .math-choices {
    grid-template-columns: 1fr;
  }
}
</style>

