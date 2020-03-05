<template>
  <div id="content-body">
    <slot name="routerView"></slot>
  </div>
</template>

<style scoped>
#content-body {
  position: relative;
  margin-top: 80px;
  padding: 2rem 0;
  overflow: hidden;
}
</style>
