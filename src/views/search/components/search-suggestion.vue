<template>
  <div class="search-suggestion">
    <van-cell
      v-for="(text, index) in suggestions"
      :key="index"
      icon="search"
      @click="$parent.onSearch(text)"
    >
      <div slot="title" v-html="highLight(text)"></div>
    </van-cell>
  </div>
</template>

<script>
export default {
  name: 'SearchSuggestion',
  components: {},
  props: {
    suggestions: {
      type: Array,
      required: true
    }
  },
  data () {
    return {}
  },
  computed: {},
  watch: {},
  created () { },
  mounted () { },
  methods: {
    highLight (text) {
      // 定义需要高亮的字符串
      const highLightStr = `<span class="active">${this.$parent.searchText}</span>`
      // 定义正则表达式
      const reg = new RegExp(this.$parent.searchText, 'gi')
      // 一定要return
      return text.replace(reg, highLightStr)
    }
  }
}
</script>

<style scoped lang="less">
.search-suggestion {
  /deep/span.active {
    color: red;
  }
}
</style>
