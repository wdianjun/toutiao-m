<template>
  <div class="search-history">
    <van-cell title="搜索历史">
      <div v-if="isDeleteShow">
        <span @click="$parent.searchHistorys = []">全部删除</span>
        &nbsp; &nbsp;
        <span @click="isDeleteShow = false">完成</span>
      </div>
      <van-icon name="delete" v-else @click="isDeleteShow = true" />
    </van-cell>
    <van-cell
      v-for="(item, index) in searchHistorys"
      :key="index"
      :title="item"
      @click="handlerClick(item, index)"
    >
      <van-icon name="close" v-show="isDeleteShow" />
    </van-cell>
  </div>
</template>

<script>
export default {
  name: 'SearchHistory',
  components: {},
  props: {
    searchHistorys: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      isDeleteShow: false
    }
  },
  computed: {},
  watch: {},
  created () { },
  mounted () { },
  methods: {
    handlerClick (item, index) {
      // 判断历史记录是否为删除状态还是完成状态
      if (this.isDeleteShow) {
        // 如果为true就是删除状态，点击删除父组件数据
        this.$parent.searchHistorys.splice(index, 1)
      } else {
        // 如果是完成状态就点击进行搜索,把对应的关键字传进去
        this.$parent.onSearch(item)
      }
    }
  }
}
</script>

<style scoped lang="less"></style>
