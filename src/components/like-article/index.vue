<template>
  <van-button
    :icon="like === 1 ? 'good-job' : 'good-job-o'"
    :class="{ collected: like === 1 }"
    :loading="loading"
    @click="onLike"
  />
</template>

<script>
import { addLike, deleteLike } from '@/api/article'
export default {
  name: 'LikeArticle',
  components: {},
  props: {
    like: {
      type: Number,
      required: true
    },
    artId: {
      type: [String, Number, Object],
      required: true,
      default: ''
    }
  },
  data () {
    return {
      loading: false
    }
  },
  created () { },
  mounted () { },
  methods: {
    async onLike () {
      this.loading = true
      try {
        if (this.like === 1) {
          await deleteLike(this.artId)
          this.$emit('update:like', -1)
        } else {
          await addLike(this.artId)
          this.$emit('update:like', 1)
        }
        // 更新视图 点击收藏状态
        this.$nextTick(() => {
          this.$toast.success(this.like === 1 ? '点赞成功' : '取消点赞')
        })
      } catch (err) {
        this.$toast.fail('操作失败，请重试！')
      }
      this.loading = false
    }
  },
  computed: {},
  watch: {}
}
</script>

<style lang='less' scoped>
.collected {
  .van-icon {
    color: #ffa550;
  }
}
</style>
