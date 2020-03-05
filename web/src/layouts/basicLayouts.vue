<template>
  <div>
    <Nav />
    <Content>
      <transition name="fade" slot="routerView">
        <router-view></router-view>
      </transition>
    </Content>
    <Footer />
    <BackToTop />
  </div>
</template>
<script>
import Nav from "./components/nav";
import Footer from "./components/footer";
import Content from "./components/content";
import BackToTop from "../components/backToTop";
export default {
  name: "layout",
  components: {
    Nav,
    Footer,
    Content,
    BackToTop
  },
  data() {
    return {};
  }
};
</script>
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}
.fade-enter {
  opacity: 0;
  transform: translateY(-20px);
}
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
