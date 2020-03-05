<template>
  <div>
    <a-layout style="min-height: 100vh">
      <a-layout-sider
        v-model="collapsed"
        :theme="navTheme"
        v-if="navLayout === 'inline'"
        :class="[
          `nav-theme-${navTheme}`,
          `nav-inline-${navFixed}`,
          'nav-inline'
        ]"
        :defaultCollapsed="false"
        collapsible
      >
        <div class="logo-silder"><a-icon type="robot" /></div>
        <SiderMenu
          :layout="navLayout"
          :theme="navTheme"
          :collapsed="!collapsed"
        />
      </a-layout-sider>
      <a-layout
        ><a-layout-header
          :class="[
            `nav-theme-${navTheme}`,
            `nav-${navFixed}-${navLayout}`,
            `header-basic`
          ]"
          :theme="navTheme"
        >
          <div :class="[`header-left`]">
            <div class="header-menu" v-if="navLayout != 'inline'">
              <div class="logo-header" style="float:left">
                <a-icon type="robot" />
              </div>
              <SiderMenu
                :theme="navTheme"
                :layout="navLayout"
                v-if="navLayout != 'inline'"
              />
            </div>
            <ToolMenu :navTheme="navTheme" />
          </div>
        </a-layout-header>
        <a-layout-content
          :class="[
            `content-container`,
            `content-container-${navFixed}-${navLayout}`,
            collapsed
              ? `${navLayout}-${navFixed}-collapsed`
              : `${navLayout}-${navFixed}-uncollapsed`
          ]"
        >
        <a-skeleton :loading="loading" active  >
          <transition name="fade">
            <a-card :bordered="false">
              <router-view :key="$route.fullPath" />
            </a-card>
          </transition>
        </a-skeleton>
        </a-layout-content>
        <Footer />
      </a-layout>
      <SettingDrawer />
      <a-back-top />
    </a-layout>
  </div>
</template>
<script>
import Footer from "./footer/Footer";
import SiderMenu from "./siderMenu/SiderMenu";
import SettingDrawer from "../components/settingDrawer";
import ToolMenu from "./toolMenu/ToolMenu";

export default {
  components: { Footer, SiderMenu, SettingDrawer, ToolMenu },
  data() {
    return {
      collapsed: false,
      loading:true
    };
  },
  computed: {
    navTheme() {
      return this.$route.query.navTheme || "light";
    },
    navLayout() {
      return this.$route.query.navLayout || "inline";
    },
    navFixed() {
      return this.$route.query.navFixed || "fixed";
    }
  },
  mounted(){
    this.loading = false
  }
};
</script>

<style scoped>
.content-container {
  padding: 0 8px;
}
.logo-silder {
  height: 64px;
  text-align: center;
  width: 100%;
  text-align: center;
  line-height: 64px;
  color: #1890ff;
  overflow: hidden;
  text-overflow: ellipsis;
  border-right: 0.1px solid rgba(0, 0, 0, 0.65);
}
.logo-header {
  height: 64px;
  text-align: center;
  width: 120px;
  text-align: center;
  line-height: 64px;
  color: #1890ff;
  overflow: hidden;
  text-overflow: ellipsis;
}
.nav-inline {
  z-index: 101;
}
.inline-fixed-uncollapsed {
  margin: 20px 20px 20px 220px;
}
.inline-fixed-collapsed {
  margin: 20px 20px 20px 100px;
}
.horizontal-fixed-uncollapsed {
  margin: 20px;
  padding: 64px 8px 8px 8px;
}
.horizontal-fixed-collapsed {
  margin: 20px;
  padding: 8px;
}
.inline-unfixed-uncollapsed {
  margin: 20px;
}
.inline-unfixed-collapsed {
  margin: 20px;
}
.horizontal-unfixed-uncollapsed {
  margin: 20px;
}
.horizontal-unfixed-collapsed {
  margin: 20px;
}
.content-container-fixed-inline {
  margin-top: 84px;
}
.nav-theme-light {
  background: #fff;
}
.nav-theme-dark {
  background: #001529;
}
.nav-inline-fixed {
  overflow: auto;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
}
.nav-inline-unfixed {
  height: auto;
  position: static;
}
.nav-fixed-inline {
  position: fixed;
  width: 100%;
}
.header-basic {
  width: 100%;
  height: 64px;
  z-index: 100;
  color: #9e9ea3;
  border-bottom: 0.1px solid;
}
.header-left {
  width: 100%;
  height: 64px;
}
.nav-fixed-horizontal {
  position: fixed;
}
.header-menu {
  max-width: 60%;
  display: inline-block;
  margin-left: 30px;
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
