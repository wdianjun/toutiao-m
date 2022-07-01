<template>
  <div class="search-container">
    <!-- 搜索栏 -->
    <!--
          Tips: 在 van-search 外层增加 form 标签，且 action 不为空，即可在 iOS 输入法中显示搜索按钮
         -->
    <form class="search-form" action="/">
      <van-search
        v-model.trim="searchText"
        show-action
        placeholder="请输入搜索关键词"
        background="#3296fa"
        @search="onSearch"
        @cancel="onCancel"
        @focus="onFocus"
      />
    </form>
    <!-- /搜索栏 -->

    <!-- v-show问题：一开始加载盒子是隐藏的，不会触底，onLoad事件不会触发 -->
    <!-- 搜索结果 -->
    <search-result v-if="this.show === 2" :searchText="searchText" />
    <!-- /搜索结果 -->

    <!-- 联想建议 -->
    <search-suggestion v-if="this.show === 1" :suggestions="suggestions" />
    <!-- /联想建议 -->

    <!-- 搜索历史记录 -->
    <search-history v-if="this.show === 0" :searchHistorys="searchHistorys" />
    <!-- /搜索历史记录 -->
  </div>
</template>

<script>
import SearchHistory from './components/search-history.vue'
import SearchResult from './components/search-result.vue'
import SearchSuggestion from './components/search-suggestion.vue'
import { getSearchSuggestions } from '@/api/search'
import { debounce } from 'lodash'
import { getItem, setItem } from '@/utils/storage'
export default {
  name: 'SearchPage',
  components: {
    SearchResult,
    SearchHistory,
    SearchSuggestion
  },
  props: {},
  data () {
    return {
      searchText: '',
      show: 0, // 0代表历史记录 1代表联想建议 2代表搜索结果
      suggestions: [], // 联想建议数据列表
      timer: null,
      searchHistorys: getItem('TOUTIAO_HISTRIES') || []
    }
  },
  created () { },
  mounted () { },
  methods: {
    onSearch (val) {
      // 1.判断搜索字段在历史记录里有没有存在
      const index = this.searchHistorys.indexOf(val)
      if (index !== -1) {
        // 如果存在就删除
        this.searchHistorys.splice(index, 1)
      }
      // 否则就添加到头部
      this.searchHistorys.unshift(val)

      this.searchText = val
      //  如果按回车输入框有内容就显示搜索结果2
      if (this.searchText) {
        this.show = 2
      }
    },
    onCancel () {
      this.$router.back()
    },
    onFocus () {
      // 输入框获取焦点，如果有内容则显示联想建议1
      if (this.searchText) {
        this.show = 1
        // 获取最新的联想建议
        this.loadSearchSuggestions(this.searchText)
      }
    },
    // 请求联想建议的请求
    async loadSearchSuggestions (q) {
      try {
        const { data } = await getSearchSuggestions(q)
        // console.log(data)
        // 处理后端数据返回null的情况
        if (data.data.options[0] == null) {
          this.suggestions = []
          return
        }
        this.suggestions = data.data.options
      } catch (err) {
        this.$toast('数据获取失败，请稍后重试')
      }
    }
  },
  computed: {},
  watch: {
    // searchText (newValue) {
    //   // 判断输入框 如果有内容则显示联想建议 没有显示历史记录
    //   clearTimeout(this.timer)
    //   this.timer = setTimeout(() => {
    //     if (newValue) {
    //       this.show = 1
    //       this.loadSearchSuggestions(newValue)
    //       // 发请求获取数据
    //     } else {
    //       this.show = 0
    //     }
    //   }, 500)
    // }
    // 利用lodash中的debounce做防抖
    searchText: debounce(function (newValue) {
      // 点击联想建议要展现搜索结果内容而不是联想建议
      if (this.show === 2) return
      if (newValue) {
        this.show = 1
        // 调用联想建议的方法
        this.loadSearchSuggestions(newValue)
        // 发请求获取数据
      } else {
        this.show = 0
      }
    }, 500),
    // 监听历史记录
    searchHistorys (value) {
      // 如果改变则存储
      setItem('TOUTIAO_HISTRIES', value)
    }
  }

}
</script>

<style lang='less' scoped>
.search-container {
  padding-top: 108px;
  .van-search__action {
    color: #fff;
  }
  .search-form {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
  }
}
</style>
