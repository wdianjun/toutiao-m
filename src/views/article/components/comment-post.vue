<template>
  <div class="comment-post">
    <van-field
      class="post-field"
      v-model.trim="message"
      rows="2"
      autosize
      type="textarea"
      maxlength="50"
      placeholder="请输入留言"
      show-word-limit
    />
    <van-button class="post-btn" @click="onPost" :disabled="!message.length"
      >发布</van-button
    >
  </div>
</template>

<script>
import { addComment } from '@/api/comment'
export default {
  name: 'CommentPost',
  data () {
    return {
      message: ''
    }
  },
  props: {
    target: {
      type: [Number, String, Object],
      required: true
    },
    art_id: {
      type: [Number, String, Object],
      default: null
    },
    comment: {
      type: Object
    }
  },
  computed: {},
  watch: {},
  created () { },
  mounted () { },
  methods: {
    async onPost () {
      this.$toast.loading({
        message: '发布中...',
        forbidClick: true, // 禁用背景点击
        duration: 0 // 持续时间，默认 2000，0 表示持续展示不关闭
      })

      try {
        const { data } = await addComment({
          target: this.target.toString(), // 评论目标id（评论文章即文章id，对评论进行回复则为评论id） 防止有大数字最好也执行一下toString方法！
          content: this.message, // 评论内容
          art_id: this.art_id // 文章id，对评论内容发表回复时，需要传递此参数，表明所属文章id。对文章进行评论，不要传此参数。
        })
        // console.log(data)
        this.$toast.success('发布成功')
        // 将请求来的数据添加到父组件（comment-list）的list中
        this.$parent.$parent.list.unshift(data.data.new_obj)
        // 关闭弹层
        this.$parent.$parent.isPostShow = false
        // 清空文本框
        this.message = ''
        // 更改回复的数量
        if (this.comment !== undefined) {
          this.$parent.$parent.$parent.$parent.comment.reply_count++
        }
        // TODO==>
        // 关闭弹出层
        // 将发布内容显示到列表顶部
        // 清空文本框
      } catch (err) {
        this.$toast.fail('发布失败')
      }
    }
  }
}
</script>

<style scoped lang="less">
.comment-post {
  display: flex;
  align-items: center;
  padding: 32px 0 32px 32px;
  .post-field {
    background-color: #f5f7f9;
  }
  .post-btn {
    width: 150px;
    border: none;
    padding: 0;
    color: #6ba3d8;
    &::before {
      display: none;
    }
  }
}
</style>
