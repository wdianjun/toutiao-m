<template>
  <van-cell class="comment-item">
    <van-image
      slot="icon"
      class="avatar"
      round
      fit="cover"
      :src="comment.aut_photo"
    />
    <div slot="title" class="title-wrap">
      <div class="user-name">{{ comment.aut_name }}</div>
      <van-button
        class="like-btn"
        :icon="comment.is_liking ? 'good-job' : 'good-job-o'"
        :class="{ liked: comment.is_liking }"
        @click="onCommentLike"
        >{{ comment.like_count || "赞" }}</van-button
      >
    </div>

    <div slot="label">
      <p class="comment-content">{{ comment.content }}</p>
      <div class="bottom-info">
        <span class="comment-pubdate">{{
          comment.pubdate | relativeTime
        }}</span>
        <van-button class="reply-btn" round @click="reply"
          >回复 {{ comment.reply_count }}</van-button
        >
      </div>
    </div>
  </van-cell>
</template>

<script>
import { addCommentLike, deleteCommentLike } from '@/api/comment'
export default {
  name: 'CommentItem',
  props: {
    // 每行的评论信息
    comment: {
      type: Object,
      required: true
    },
    index: {
      type: Number
      // required: true
    }
  },
  data () {
    return {
      commentLoading: true // 是否点赞中
    }
  },
  methods: {
    // 点赞的事件
    async onCommentLike () {
      this.commentLoading = true
      try {
        if (this.comment.is_liking) {
          await deleteCommentLike(this.comment.com_id)
          // 不能直接修改父组件的数据,需要$parent去修改父组件list里的数据，通过索引找到对应的那一项
          this.$parent.$parent.list[this.index].like_count--
        } else {
          await addCommentLike(this.comment.com_id)
          this.$parent.$parent.list[this.index].like_count++
        }
        // 更新视图
        this.$parent.$parent.list[this.index].is_liking = !this.$parent.$parent.list[this.index].is_liking
        this.$toast.success(this.$parent.$parent.list[this.index].is_liking ? '点赞成功' : '取消点赞')
      } catch (error) {
        this.$toast.fail('操作失败')
      }
      this.commentLoading = false
    },
    // 回复评论事件
    reply () {
      // 把comment传给父组件的父组件`index.vue`
      // 开启弹出层
      this.$parent.$parent.$parent.isReplyShow = true
      // 把数据传到父组件
      this.$parent.$parent.$parent.comment = this.comment
    }
  }
}
</script>

<style scoped lang="less">
.comment-item {
  .avatar {
    width: 72px;
    height: 72px;
    margin-right: 25px;
  }
  .title-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .user-name {
      color: #406599;
      font-size: 26px;
    }
  }
  .comment-content {
    font-size: 32px;
    color: #222222;
    word-break: break-all;
    text-align: justify;
  }
  .comment-pubdate {
    font-size: 19px;
    color: #222;
    margin-right: 25px;
  }
  .bottom-info {
    display: flex;
    align-items: center;
  }
  .reply-btn {
    width: 135px;
    height: 48px;
    line-height: 48px;
    font-size: 21px;
    color: #222;
  }
  .like-btn {
    height: 30px;
    padding: 0;
    border: none;
    font-size: 19px;
    line-height: 30px;
    margin-right: 7px;
    .van-icon {
      font-size: 30px;
    }
  }
  .liked {
    .van-button__icon {
      color: orange;
    }
  }
}
</style>
