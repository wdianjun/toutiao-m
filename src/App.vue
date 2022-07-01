<template>
  <div id="app">
    <keep-alive include="LayoutIndex">
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
<style lang="less">
.box {
  width: 100px;
  height: 50px;
  background-color: pink;
}
</style>
