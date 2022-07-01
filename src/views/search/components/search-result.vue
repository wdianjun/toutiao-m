<template>
  <div class="search-result">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      :error.sync="error"
      error-text="请求失败，点击重新加载"
      @load="onLoad"
    >
      <van-cell
        v-for="(article, index) in list"
        :key="index"
        :title="article.title"
      />
    </van-list>
  </div>
</template>

<script>
import { getSearchResult } from '@/api/search'
export default {
  name: 'SearchResult',
  components: {},
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1,
      per_page: 20,
      error: false
    }
  },
  computed: {},
  watch: {},
  created () { },
  mounted () { },
  methods: {
    // 获取搜索结果的方法
    async onLoad () {
      // 1.获取数据
      try {
        const { data } = await getSearchResult({
          page: this.page,
          per_page: this.per_page,
          q: this.searchText
        })
        // 测试代码，可以删除
        // if (Math.random() > 0.5) {
        //   JSON.parse('dsnajndjsa')
        // }
        // console.log(data)
        const { results } = data.data
        // 2.将数据追加到数组中
        this.list.push(...results)
        // 3.关闭loading
        this.loading = false
        // 4.判断是否还有数据
        if (results.length) {
          this.page++
        } else {
          this.finished = true
        }
        // console.log(data)
      } catch (err) {
        this.error = true
        this.loading = false
        // this.$toast.fail('操作失败')
      }
    }
  }
}
</script>
<style scoped lang="less"></style>
