<template>
  <div id="app">

    <router-view/>
  </div>
</template>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

}
body{
  color: black;
  background: #e6e6e6;
}
// #046cab

// 图片和父元素一样大小
.auto_img{
  width: 100%;
  display: block;
}

.clear::after {
  content: "";
  display: block;
  clear: both;
}

</style>
