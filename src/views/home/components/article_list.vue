<template>
  <div class="article-container">
    <van-pull-refresh
      v-model="isRefreshLoading"
      @refresh="onRefresh"
      :success-text="isRefreshSuccessText"
      :success-duration="1500"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
      >
        <ArticleItem
          v-for="article in list"
          :key="article.art_id"
          :article="article"
        />
        <!-- <van-cell
          v-for="article in list"
          :key="article.art_id"
          :title="article.title"
        /> -->
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '@/api/article'
import ArticleItem from '@/components/article-item'
export default {
  name: 'ArticleList',
  components: {
    ArticleItem
  },
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      timestamp: Date.now(),
      error: false,
      isRefreshLoading: false, /* 下拉刷新会自动改为true */
      isRefreshSuccessText: ''/* 成功，失败的提示信息 */
    }
  },
  created () { },
  mounted () { },
  methods: {
    // 初始化或滚动到底部的时候会触发调用 onLoad
    async onLoad () {
      // 人为报错
      // const error = new Error('报错！')
      // throw (error)
      try {
        // 1. 请求获取数据
        const { data } = await getArticles({
          channel_id: this.channel.id,
          timestamp: this.timestamp,
          with_top: 1
        })
        // 测试随机报错效果
        // if (Math.random() > 0.5) {
        //   // JSON.parse('asedsawd')
        //   const error = new Error('报错！')
        //   throw (error)
        // }
        // console.log(data)
        // 拿一次数据就要把loading设置为false，触发onLoad事件自动把loading设置为true
        this.loading = false
        // 获取上一次的时间戳
        this.timestamp = data.data.pre_timestamp
        // 合并数据
        this.list.push(...data.data.results)
        // 或者
        // this.list = [...this.list, ...data.data.results]
        // 如果pre_timestamp的值为null说明是最后一页，要关闭onLoad事件
        if (this.timestamp === null) {
          this.finished = true
        }
      } catch (err) {
        // console.log('获取失败')
        this.error = true
        this.loading = false
      }
    },
    // 下拉触发此函数
    async onRefresh () {
      try {
        // 1. 请求获取数据
        const { data } = await getArticles({
          channel_id: this.channel.id,
          timestamp: +new Date(), /* 获取当前最新的时间戳 */
          with_top: 1
        })
        // 测试随机报错效果
        // if (Math.random() > 0.5) {
        //   JSON.parse('asedsawd')
        // }
        // 下拉刷新，直接覆盖旧数据
        this.list = data.data.results
        // 将isRefreshLoading设置为false，才能触发下一次刷新
        this.isRefreshLoading = false
        this.isRefreshSuccessText = `更新成功,更新了${this.list.length}条数据`
      } catch (err) {
        this.isRefreshSuccessText = '更新失败'
        this.isRefreshLoading = false
      }
    }
  },
  computed: {},
  watch: {}
}
</script>

<style lang='less' scoped>
.article-container {
  // 给每个标签设置容器，记住滚动的位置
  height: calc(100vh - 274px);
  overflow-y: auto;
}
</style>
