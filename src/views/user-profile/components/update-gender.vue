<template>
  <div class="update-gender">
    <van-picker
      title="标题"
      show-toolbar
      :columns="columns"
      @confirm="onConfirm"
      @cancel="onCancel"
      @change="onChange"
      :default-index="localSex"
    />
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'
export default {
  name: 'UpdateGender',
  components: {},
  props: {
    close: {
      type: Boolean,
      required: true
    },
    localSex: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      sex: '', // 保存的性别
      columns: ['男', '女']
    }
  },
  computed: {},
  watch: {},
  created () { },
  mounted () { },
  methods: {
    // 确定事件
    async onConfirm () {
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
        await updateUserProfile({ gender: this.sex })
        // 请求成功，关弹层，修改父组件的user.name,提示成功
        this.$emit('update:close', false)
        this.$emit('update:localSex', this.sex)
        this.$toast.success('修改成功')
      } catch (error) {
        this.$toast.fail('修改失败')
      }

      // 失败，提示更新失败
    },
    onCancel () {
      this.$emit('update:close', false)
    },
    onChange (picker, value, index) {
      // Toast(`当前值：${value}, 当前索引：${index}`);
      this.sex = index
    }
  }
}
</script>

<style scoped lang="less">
</style>
