<template>
  <div class="update-birthday">
    <!--
      currentDate 双向绑定了日期选择器
        设置日期选择器的默认值
        同步日期选择器选择的日期
      min-date: 可选的最小日期
      max-date: 可选的最大日期
     -->
    <van-datetime-picker
      v-model="currentDate"
      type="date"
      title="选择年月日"
      :min-date="minDate"
      :max-date="maxDate"
      @cancel="onCancel"
      @confirm="onConfirm"
    />
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'
export default {
  name: 'UpdateBirthday',
  components: {},
  props: {
    localBirthday: {
      type: String,
      required: true

    }
  },
  data () {
    return {
      minDate: new Date(1950, 0, 1),
      maxDate: new Date(),
      currentDate: new Date(this.localBirthday)
    }
  },
  computed: {},
  watch: {},
  created () { },
  mounted () { },
  methods: {
    // 点击取消
    onCancel () {
      this.$emit('update:close', false)
    },
    // 确定事件
    async onConfirm (value) {
      // this
      // console.log(value)
      const birthday = this.$dayjs(value).format('YYYY-MM-DD')
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
        await updateUserProfile({ birthday: birthday })
        // 请求成功，关弹层，修改父组件的user.name,提示成功
        this.$emit('update:close', false)
        this.$emit('update:localBirthday', birthday)
        this.$toast.success('修改成功')
      } catch (error) {
        this.$toast.fail('修改失败')
      }
    }
  }
}
</script>

<style scoped lang="less">
</style>
