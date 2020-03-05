<template>
  <div>
    <a-button type="primary" @click="showDrawer">
      <a-icon type="setting" theme="filled" spin style="font-size:30px" />
    </a-button>
    <a-drawer
      title="快速设置"
      placement="right"
      :closable="false"
      @close="onClose"
      :visible="visible"
    >
      <section>
        <p>主题颜色</p>
        <a-radio-group
          @change="e => handleSettingChange('navTheme', e.target.value)"
          :value="$route.query.navTheme || 'light'"
        >
          <a-radio value="dark">Dark</a-radio>
          <a-radio value="light">Light</a-radio>
        </a-radio-group>
      </section>
      <section>
        <p>导航栏位置</p>
        <a-radio-group
          @change="e => handleSettingChange('navLayout', e.target.value)"
          :value="$route.query.navLayout || 'inline'"
        >
          <a-radio value="inline">Left</a-radio>
          <a-radio value="horizontal">Top</a-radio>
        </a-radio-group>
      </section>
      <section>
        <p>导航栏是否固定</p>
        <a-radio-group
          @change="e => handleSettingChange('navFixed', e.target.value)"
          :value="$route.query.navFixed || 'fixed'"
        >
          <a-radio value="fixed">固定</a-radio>
          <a-radio value="unfixed">非固定</a-radio>
        </a-radio-group>
      </section>
    </a-drawer>
  </div>
</template>
<script>
export default {
  data() {
    return {
      visible: false
    };
  },
  methods: {
    showDrawer() {
      this.visible = true;
    },
    onClose() {
      this.visible = false;
    },
    handleSettingChange(type, value) {
      this.$router.push({ query: { ...this.$route.query, [type]: value } });
    }
  }
};
</script>
<style scoped>
.ant-btn {
  z-index: 999;
  position: fixed;
  top: 40%;
  right: -24px;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  transition: 1s;
  border: none;
  opacity: 0.8;
}
.ant-btn:hover {
  background: yellowgreen;
}
</style>
