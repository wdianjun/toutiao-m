<template>
  <div class="update-name">
    <!-- 导航栏 -->
    <van-nav-bar
      title="设置昵称"
      left-text="取消"
      right-text="完成"
      @click-left="$emit('update:close', false)"
      @click-right="confirm"
    />
    <!-- /导航栏 -->
    <!-- 输入框 -->
    <div class="field-wrap">
      <van-field
        v-model.trim="name"
        rows="2"
        autosize
        type="textarea"
        maxlength="11"
        placeholder="请输入昵称"
        show-word-limit
      />
    </div>
    <!-- /输入框 -->
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'
export default {
  name: 'UpdateName',
  components: {},
  props: {
    close: {
      type: Boolean,
      required: true
    },
    localName: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      name: this.localName
    }
  },
  computed: {},
  watch: {},
  created () { },
  mounted () { },
  methods: {
    async confirm () {
      // 弹出loading页面
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true, // 禁止背景点击
        duration: 0 // 持续展示
      })
      // 拿数据发请求
      try {
        // const message = this.message
        // if (!message.length) {
        //   return this.$toast('昵称不能为空')
        // }
        await updateUserProfile({ name: this.name })
        // 请求成功，关弹层，修改父组件的user.name,提示成功
        this.$emit('update:close', false)
        this.$emit('update:localName', this.name)
        this.$toast.success('修改成功')
      } catch (error) {
        this.$toast.fail('修改失败')
      }

      // 失败，提示更新失败
    }
  }
}
</script>

<style scoped lang="less">
.field-wrap {
  padding: 20px;
}
</style>
