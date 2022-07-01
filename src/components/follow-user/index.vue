<template>
  <van-button
    v-if="isFollowed"
    round
    size="small"
    :loading="loading"
    @click="onFollow"
    >已关注</van-button
  >
  <van-button
    v-else
    type="info"
    color="#3296fa"
    round
    size="small"
    icon="plus"
    :loading="loading"
    @click="onFollow"
    >关注</van-button
  >
</template>

<script>
import { addFollow, deleteFollow } from '@/api/user'

export default {
  name: 'FollowUser',
  // model: {
  //   prop: 'isFollowed',
  //   event: 'changed'
  // },
  props: {
    // 是否关注了
    isFollowed: {
      type: Boolean,
      required: true
    },
    // 用户ID
    userId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data () {
    return {
      loading: false // 加载中控制变量
    }
  },
  methods: {
    async onFollow () {
      // 如果没有登录，就不允许操作
      // if (!this.$store.state.user) return this.$toast('请登录！')

      this.loading = true // 展示关注按钮的 loading 状态
      try {
        if (this.isFollowed) {
          // 已关注，要取消关注
          await deleteFollow(this.userId)
        } else {
          // 没有关注，要添加关注
          await addFollow(this.userId)
        }

        // 更新视图状态
        this.$emit('update:isFollowed', !this.isFollowed)
        // this.$emit('update-is_followed', !this.isFollowed)
      } catch (err) {
        console.log(err)
        if (err && err.response.status === 400) {
          this.$toast('你不能关注自己')
        } else {
          this.$toast.fail('操作失败')
        }
      }
      this.loading = false // 关闭关注按钮的 loading 状态
    }
  }
}
</script>

<style scoped lang="less"></style>
