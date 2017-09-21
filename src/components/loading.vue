<template>
  <div class="td-component-loading">
    <div class="loading-container">
      <span v-for="i in 8" :key="i"></span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Loading'
}
</script>

<style lang="scss">
.td-component-loading {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, .8);

  .loading-container {
    width: 100px;
    height: 100px;
    position: relative;

    span {
      display: inline-block;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: #58b7ff;
      position: absolute;
      animation: td-component-loading-load 1.04s ease infinite;

      &:nth-child(1) {
        left: 0;
        top: 50%;
        margin-top:-8px;
        animation-delay:0.13s;
      }

      &:nth-child(2) {
        left: 14px;
        top: 14px;
        animation-delay:0.26s;
      }

      &:nth-child(3) {
        left: 50%;
        top: 0;
        margin-left: -8px;
        animation-delay:0.39s;
      }

      &:nth-child(4) {
        top: 14px;
        right:14px;
        animation-delay:0.52s;
      }

      &:nth-child(5) {
        right: 0;
        top: 50%;
        margin-top:-8px;
        animation-delay:0.65s;
      }

      &:nth-child(6) {
        right: 14px;
        bottom:14px;
        animation-delay:0.78s;
      }

      &:nth-child(7) {
        bottom: 0;
        left: 50%;
        margin-left: -8px;
        animation-delay:0.91s;
      }

      &:nth-child(8) {
        bottom: 14px;
        left: 14px;
        animation-delay:1.04s;
      }
    }
  }

  @keyframes td-component-loading-load {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0.2;
    }
  }
}
</style>
