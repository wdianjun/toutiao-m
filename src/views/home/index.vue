<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" fixed>
      <van-button
        class="search-btn"
        slot="title"
        type="info"
        size="small"
        round
        icon="search"
        to="/search"
        >搜索</van-button
      >
    </van-nav-bar>
    <!-- /导航栏 -->
    <!-- 频道列表 -->
    <van-tabs class="channel-tabs" v-model="active" swipeable animated border>
      <van-tab
        v-for="channel in channels"
        :title="channel.name"
        :key="channel.id"
      >
        <!-- 频道的文章列表 -->
        <ArticleList :channel="channel"></ArticleList>
        <!-- 频道的文章列表 /-->
      </van-tab>
      <!-- 右侧自定义内容 -->
      <!-- 占位元素 -->
      <div slot="nav-right" class="placeholder"></div>
      <!-- 右侧按钮 -->
      <div
        slot="nav-right"
        class="hamburger-btn"
        @click="isChannelEditShow = true"
      >
        <i class="toutiao toutiao-gengduo"></i>
      </div>
    </van-tabs>
    <!-- /频道列表 -->
    <!-- 弹出层 -->
    <van-popup
      v-model="isChannelEditShow"
      close-icon-position="top-left"
      closeable
      position="bottom"
      :style="{ height: '100%' }"
    >
      <ChannelEdit
        :my-channels="channels"
        :active.sync="active"
        @AddChannel="onAddChannel"
      ></ChannelEdit>
    </van-popup>
  </div>
</template>

<script>
// 导入获取用户频道的函数
import { getUserChannel } from '@/api/user'
import ArticleList from './components/article_list.vue'
import ChannelEdit from './components/channel-edit.vue'
import { mapState } from 'vuex'
import { getItem } from '@/utils/storage'
export default {
  name: 'HomeIndex',
  components: {
    ArticleList,
    ChannelEdit
  },
  props: {},
  data () {
    return {
      active: 0,
      channels: [],
      isChannelEditShow: false, // 弹层的状态
      top: null,
      children: {}
    }
  },
  computed: {
    ...mapState(['token'])
  },
  watch: {},
  created () {
    this.getUserChannels()
  },
  // 离开这个组件的路由导航守卫
  beforeRouteLeave (to, from, next) {
    // 跳着点击 active 有问题
    // this.top = this.$refs.article[this.active].$el.scrollTop

    // 1 跳走的时候获取组件的滚动位置
    // 找父盒子(tab的父盒子是永远存在，点哪个就在哪个父盒子找article-container内容)
    // 找所有文章列表的父盒子对应的active
    const el = document.querySelectorAll('.van-tab__pane-wrapper')[this.active]
    // 在找父盒子下面对应的article-container盒子
    this.children = el.querySelector('.article-container')
    this.top = this.children.scrollTop
    next()
  },
  activated () {
    // if (this.$refs.article) {
    // this.$refs.article[this.active].$el.scrollTop = this.top
    // }
    this.children.scrollTop = this.top
  },
  mounted () { },
  methods: {
    async getUserChannels () {
      try {
        const { data } = await getUserChannel()
        // console.log(data)
        this.channels = data.data.channels // 两种情况，有token拿的就是登陆后的，没有就是默认频道
        // ① 登陆过 if进不来拿的就是登录过的数据
        // ② 没登录过 也没有操作过数据（本地存储为false）拿的是请求默认的
        // ③ 没登录过 操作过数据（本地存储为true）拿的就是本地的
        if (this.token === null && getItem('TOUTIAO_CHANNELS')) {
          this.channels = getItem('TOUTIAO_CHANNELS')
        }
      } catch (err) {
        this.$toast.fail('获取用户频道列表失败！')
      }
    },
    // 定义添加用户频道的函数
    onAddChannel (channel) {
      this.channels.push(channel)
    }
  }
}
</script>

<style scoped lang="less">
.home-container {
  padding-top: 174px;
  padding-bottom: 100px;
  /deep/ .van-nav-bar__title {
    max-width: unset;
  }
  .search-btn {
    width: 555px;
    height: 64px;
    background-color: #5babfb;
    border: none;
    font-size: 28px;
    .van-icon {
      font-size: 32px;
    }
  }
}
/deep/ .channel-tabs {
  .van-tabs__wrap {
    position: fixed;
    top: 92px;
    z-index: 1;
    left: 0;
    right: 0;
    height: 82px;
  }

  .van-tab {
    border-right: 1px solid #edeff3;
    min-width: 200px;
    font-size: 30px;
    color: #777777;
  }

  .van-tab--active {
    color: #333333;
  }

  .van-tabs__nav {
    padding-bottom: unset;
  }

  .van-tabs__line {
    bottom: 8px;
    width: 31px !important;
    height: 6px;
    background-color: #3296fa;
  }

  .placeholder {
    // 不参与flex计算
    flex-shrink: 0;
    width: 66px;
    height: 82px;
  }

  .hamburger-btn {
    position: fixed;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 66px;
    height: 82px;
    background-color: #fff;
    background-color: rgba(255, 255, 255, 0.902);
    i.toutiao {
      font-size: 33px;
    }
    // 利用&添加伪元素
    &:before {
      content: "";
      position: absolute;
      left: 0;
      width: 1px;
      height: 58px;
      background-image: url(~@/assets/gradient-gray-line.png);
      background-size: contain;
    }
  }
}
</style>
