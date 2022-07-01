<template>
  <div class="comment-reply">
    <van-nav-bar
      :title="comment.reply_count ? `${comment.reply_count}条回复` : '暂无回复'"
      ><van-icon
        slot="left"
        name="cross"
        @click="$emit('update:isReplyShow', false)"
    /></van-nav-bar>
    <div class="scroll-wrap">
      <!-- 调用封装好的comment-item组件 -->
      <!-- 当前评论项 -->
      <CommentItem :comment="comment" />
      <!-- /当前评论项 -->
      <!-- 全部回复 -->
      <van-cell title="全部回复" />
      <!-- /全部回复 -->
      <!-- 评论回复的组件 -->
      <CommentList :source="comment.com_id" :list="list" type="c" />
      <!-- /评论回复的组件 -->
    </div>
    <!-- 底部区域 -->
    <div class="reply-bottom">
      <van-button
        class="write-btn"
        size="small"
        round
        @click="isPostShow = true"
        >写评论</van-button
      >
    </div>
    <!-- /底部区域 -->
    <!-- 发布评论按钮 -->
    <van-popup v-model="isPostShow" position="bottom">
      <CommentPost
        :target="comment.com_id"
        :art_id="articleId"
        :comment="comment"
      />
    </van-popup>
    <!-- /发布评论按钮 -->
  </div>
</template>

<script>
import CommentItem from './comment-item.vue'
import CommentList from './comment-list.vue'
import CommentPost from './comment-post.vue'
export default {
  // 获取依赖注入的数据
  inject: {
    articleId: {
      type: [Number, String]
    }
  },
  name: 'CommentReply',
  components: {
    CommentItem,
    CommentList,
    CommentPost
  },
  props: {
    comment: {
      type: Object,
      required: true
    },
    isReplyShow: {
      type: Boolean
    }
  },
  data () {
    return {
      list: [],
      isPostShow: false // 弹框是否显示
    }
  },
  computed: {},
  watch: {},
  created () { },
  mounted () { },
  methods: {}
}
</script>
<style scoped lang="less">
// .scroll-wrap {
//   position: fixed;
//   top: 92px;
//   left: 0;
//   right: 0;
//   bottom: 88px;
//   overflow-y: auto;
// }

.reply-bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 88px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border-top: 1px solid #d8d8d8;
  .write-btn {
    width: 60%;
  }
}
</style>
