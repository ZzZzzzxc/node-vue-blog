<template>
  <div @getSearchQuery='sendSearchQuery'>
    <a-row style="height:60px;line-height:60px">
      <a-col :span="4">
        <addButton v-if="hasAddButton" :option="addButtonOption" />
      </a-col>
      <a-col :span="8"></a-col>
      <a-col :span="6"></a-col>
      <a-col :span="6"><search @getSearchQuery='sendSearchQuery' v-if="hasSearchInput" :option="searchOption"/></a-col>
    </a-row>
  </div>
</template>
<script>
import search from "./search/search";
import addButton from "./addButton/addButton";
export default {
  props: {
    hasSearchInput: {
      type:Boolean,
      default:true
    },
    hasAddButton:  {
      type:Boolean,
      default:true
    },
    addButtonOption:{
      type:Function,
      default:()=>{console.log('addButtonOption')}
    },
    searchOption:{
      type:Function,
      default:()=>{console.log('search')}
    }
  },
  data() {
    return {};
  },
  components: { search, addButton },
  methods:{
    sendSearchQuery(value){
      this.$emit('handleSearch',value)
    }
  }
};
</script>
<style scoped></style>
