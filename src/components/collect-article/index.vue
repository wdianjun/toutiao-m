<template>
  <van-button
    :icon="star ? 'star' : 'star-o'"
    :class="{ collected: star }"
    :loading="loading"
    @click="onCollect"
  />
</template>

<script>
import { addCollect, deleteCollect } from '@/api/article'
export default {
  name: 'CollectArticle',
  components: {},
  props: {
    star: {
      type: Boolean,
      required: true
    },
    artId: {
      type: [String, Number],
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
    async onCollect () {
      this.loading = true
      try {
        if (this.star) {
          await deleteCollect(this.artId)
        } else {
          await addCollect(this.artId)
        }
        // 更新视图 点击收藏状态
        this.$emit('update:star', !this.star)
        this.$nextTick(() => {
          this.$toast.success(this.star ? '收藏成功' : '取消收藏')
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
