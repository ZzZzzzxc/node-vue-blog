<template>
  <div style="display:inline-block">
    <a-input-search
      placeholder="Enter"
      style="width: 200px"
      @search="beforeSearch"
      v-model="value"
    />
  </div>
</template>

<script>
export default {
  props: {
  },
  data() {
    return {
      value: null
    };
  },
  methods: {
    beforeSearch(){
      this.$emit('getSearchQuery',this.value)
    }
  }
};
</script>
