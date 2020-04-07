<template>
  <div class="circle-loading">
    <slot/>
  </div>
</template>

<style>
@keyframes loading_right {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.circle-loading {
  position: relative;
  border: 4px solid rgb(184, 187, 191);
  border-radius: 100%;
  width: 40px;
  height: 40px;
  line-height: 40px;
  font-size: 12px;
  font-weight: bold;
  box-shadow: 0 1px 2px 1px rgba(0, 0, 0, 0.2),
    inset 0 1px 2px 1px rgba(0, 0, 0, 0.2);
  color: hsl(39, 94%, 50%);
  transition: 0.3s;
  margin: 0 auto;
}
.circle-loading::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -24px;
  margin-top: -24px;
  display: block;
  border: 4px solid transparent;
  border-top-color: hsl(39, 94%, 50%);
  border-radius: 100%;
  width: 40px;
  height: 40px;
  animation: loading_right infinite 2s ease;
}
</style>