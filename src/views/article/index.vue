<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      left-arrow
      title="黑马头条"
      @click-left="$router.back()"
    ></van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap">
      <!-- 加载中 -->
      <div class="loading-wrap" v-if="show === 0">
        <van-loading color="#3296fa" vertical>加载中</van-loading>
      </div>
      <!-- /加载中 -->

      <!-- 加载完成-文章详情 -->
      <div class="article-detail" v-if="show === 1">
        <!-- 文章标题 -->
        <h1 class="article-title">{{ article.title }}</h1>
        <!-- /文章标题 -->

        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
          <van-image
            class="avatar"
            slot="icon"
            round
            fit="cover"
            :src="article.aut_photo"
          />
          <div slot="title" class="user-name">{{ article.aut_name }}</div>
          <div slot="label" class="publish-date">
            {{ article.pubdate | relativeTime }}
          </div>
          <!-- 封装的组件 -->
          <FollowUser
            class="follow-btn"
            :isFollowed.sync="article.is_followed"
            :userId="article.aut_id"
          />
        </van-cell>
        <!-- /用户信息 -->

        <!-- 文章内容 -->
        <div
          class="article-content markdown-body"
          v-html="article.content"
          ref="article-content"
        ></div>
        <van-divider>正文结束</van-divider>
        <!-- 评论的组件 -->
        <!-- 评论的组件 -->
        <CommentList
          :source="article.art_id"
          :totalCount.sync="totalCount"
          :list="list"
        />
        <!-- /评论的组件 -->
        <!-- 底部区域 -->
        <div class="article-bottom">
          <van-button
            class="comment-btn"
            type="default"
            round
            size="small"
            @click="isPostShow = true"
            >写评论
          </van-button>
          <!-- 评论总数 -->
          <van-icon name="comment-o" :info="totalCount" color="#777" />
          <!-- /评论总数 -->

          <!-- 封装的点赞收藏组件 -->
          <CollectArticle
            class="btn-item"
            :star.sync="article.is_collected"
            :artId="article.art_id"
          />
          <!-- <van-icon color="#777" name="star-o" /> -->
          <LikeArticle :like.sync="article.attitude" :artId="article.art_id" />
          <!-- <van-icon color="#777" name="good-job-o" /> -->
          <van-icon name="share" color="#777777"></van-icon>
        </div>
        <!-- /底部区域 -->
        <!-- 发布评论弹出层 -->
        <van-popup v-model="isPostShow" position="bottom"
          ><CommentPost :target="article.art_id"></CommentPost
        ></van-popup>
        <!-- /发布评论弹出层 -->
        <!-- 回复评论弹出层 -->
        <van-popup v-model="isReplyShow" style="height: 85%" position="bottom"
          ><CommentReply
            v-if="isReplyShow"
            :comment="comment"
            :isReplyShow.sync="isReplyShow"
          />
        </van-popup>
        <!-- /回复评论弹出层 -->
      </div>
      <!-- /加载完成-文章详情 -->

      <!-- 加载失败：404 -->
      <div class="error-wrap" v-if="show === 2">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>
      <!-- /加载失败：404 -->

      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div class="error-wrap" v-if="show === 3">
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button class="retry-btn" @click="loadArticle">点击重试</van-button>
      </div>
      <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
    </div>
  </div>
</template>

<script>
import { getArticleById } from '@/api/article'
import dayjs from '@/utils/dayjs'
import { ImagePreview } from 'vant'
import FollowUser from '@/components/follow-user'
import CollectArticle from '@/components/collect-article'
import LikeArticle from '@/components/like-article'
import CommentList from './components/comment-list.vue'
import CommentPost from './components/comment-post.vue'
import CommentReply from './components/comment-reply.vue'
export default {
  // 依赖注入（特点：无论多深的组件都可以）
  provide () {
    return {
      articleId: this.articleId
    }
  },
  name: 'ArticleIndex',
  components: {
    FollowUser,
    CollectArticle,
    LikeArticle,
    CommentList,
    CommentPost,
    CommentReply
  },
  props: {
    // 使用props获取动态路由的数据
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data () {
    return {
      article: {}, // 2.定义变量存储文章详情
      show: 0, // 0代表loading
      loading: false,
      totalCount: 0, // 评论总数
      isPostShow: false, // 写评论弹出层
      list: [], // 保存CommentList里的数据
      isReplyShow: false, // 控制显示回复的弹层
      comment: null
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadArticle()
  },
  mounted () {
  },
  methods: {
    async loadArticle () {
      this.show = 0
      try {
        const { data } = await getArticleById(this.articleId)
        // 模拟网络原因或服务端异常
        // if (Math.random() > 0.5) {
        //   JSON.parse('fgdfsfds')
        // }
        this.article = data.data
        // 请求成功
        this.show = 1
        this.$nextTick(() => {
          // console.log(this.$refs['article-content'])
          this.previewImage()
        })
        // console.log(data)
      } catch (err) {
        // 请求失败
        // console.dir(err)
        // 只有服务器返回的错误才有状态码，自己手动模拟的情况下没有状态码
        if (err.response && err.response.status === 404) {
          this.show = 2
        } else {
          this.show = 3
        }
      }
    },
    // 预览图片处理事件函数
    previewImage () {
      // 获取到了容器节点
      const articleContent = this.$refs['article-content']
      const imgs = articleContent.querySelectorAll('img')
      // 获取所有 img 地址
      const images = []
      imgs.forEach((img, index) => {
        images.push(img.src)
        // 给每个 img 注册点击事件，在处理函数中调用预览
        img.onclick = () => {
          ImagePreview({
            images,
            startPosition: index,
            onClose () {
              this.$toast('关闭')
            }
          })
        }
      })
    }
  },
  filters: {
    relativeTime (value) {
      return dayjs().to(dayjs(value))
    }

  }
}
</script>

<style scoped lang="less">
@import "./github-markdown.css";

.article-container {
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
  }

  .article-detail {
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;

      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }

      .van-cell__label {
        margin-top: 0;
      }

      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }

      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }

      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      padding: 55px 32px;

      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;

    .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }

    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }

    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;

    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }

    /deep/.van-icon {
      font-size: 40px;

      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
  }
}
</style>
