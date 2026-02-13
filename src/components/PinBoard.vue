<template>
  <div class="celebration-page">
    <h1 class="celebration-title">Yayyyy</h1>
    <div class="gif-container">
      <img 
        src="https://images.steamusercontent.com/ugc/1690522341905398802/3E1BB499FC8E46925E5C9F2A7F3164882029932F/?imw=512&&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false" 
        alt="Celebration GIF"
        class="celebration-gif"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'PinBoard'
}
</script>

<style scoped>
.celebration-page {
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
}

.celebration-title {
  font-size: 5rem;
  color: #d63384;
  margin-bottom: 3rem;
  text-shadow: 3px 3px 6px rgba(255, 255, 255, 0.8),
               0 0 30px rgba(255, 182, 193, 0.6);
  animation: fadeIn 0.5s ease-in, bounce 1s ease-in-out infinite;
  font-weight: bold;
  letter-spacing: 3px;
}

.gif-container {
  display: flex;
  justify-content: center;
  align-items: center;
  animation: fadeIn 0.8s ease-in;
}

.celebration-gif {
  max-width: 100%;
  height: auto;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: floatGif 3s ease-in-out infinite;
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

@keyframes bounce {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

@keyframes floatGif {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@media (max-width: 768px) {
  .celebration-title {
    font-size: 3rem;
    margin-bottom: 2rem;
  }
  
  .celebration-gif {
    max-width: 90%;
  }
}
</style>

