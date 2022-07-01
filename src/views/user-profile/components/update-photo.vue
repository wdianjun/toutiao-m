<template>
  <div class="update-photo">
    <img class="img" :src="localPhoto" ref="img" />

    <div class="toolbar">
      <div class="cancel" @click="$emit('update:close', false)">取消</div>
      <div class="confirm" @click="onConfirm">完成</div>
    </div>
  </div>
</template>

<script>
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import { updateUserPhoto } from '@/api/user'
export default {
  name: 'UpdatePhoto',
  components: {},
  props: {
    localPhoto: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      cropper: null // 裁剪器对象
    }
  },
  created () { },
  mounted () {
    const image = this.$refs.img
    this.cropper = new Cropper(image, {
      viewMode: 1,
      dragMode: 'move',
      aspectRatio: 1,
      // autoCropArea: 1,
      cropBoxMovable: false,
      cropBoxResizable: false,
      background: false
    })
  },
  methods: {
    // 点击完成时间
    onConfirm () {
      // 基于服务端的裁切使用 getData 方法获取裁切参数
      // console.log(this.cropper.getData())

      // 纯客户端的裁切使用 getCroppedCanvas 获取裁切的文件对象
      // 如何上传文件
      //       看请求头：
      // 如果接口要求 Content-Type 是 application/json
      // 则传递普通 JavaScript 对象
      // axios会自动转为json对象

      // 如果接口要求 Content-Type 是 multipart/form-data
      // 则你必须传递 FormData 对象
      this.cropper.getCroppedCanvas().toBlob(blob => {
        // console.log(blob) // 裁剪后的结果信息
        // 弹出loading页面
        this.$toast.loading({
          message: '保存中...',
          forbidClick: true, // 禁止背景点击
          duration: 0 // 持续展示
        })
        // try {
        //   // 1.创建formData对象
        //   const obj = new FormData()
        //   // 2.给对象obj添加key和value
        //   obj.append('photo', blob)
        //   // 3.发请求
        //   const { data } = await updateUserPhoto(obj)
        //   // 4.更新父组件对象
        //   this.$emit('update:photo', data.data.photo)
        //   // 5.关闭弹层
        //   this.$emit('update:close', false)
        //   this.$toast.success('修改成功')
        // } catch (error) {
        //   this.$toast.fail('修改失败')
        // }
        // 调用封装的方法
        this.updateUserPhoto(blob)
      })
    },
    // 封装一下代码 async就不需要在blob那定义await 如果不封装还是要加asyan的
    async updateUserPhoto (blob) {
      try {
        // 1.创建formData对象
        const obj = new FormData()
        // 2.给对象obj添加key和value
        obj.append('photo', blob)
        // 3.发请求
        const { data } = await updateUserPhoto(obj)
        // 4.更新父组件对象
        this.$emit('update:photo', data.data.photo)
        // 5.关闭弹层
        this.$emit('update:close', false)
        this.$toast.success('修改成功')
      } catch (error) {
        this.$toast.fail('修改失败')
      }
    }
  },
  computed: {},
  watch: {}
}
</script>

<style lang='less' scoped>
.update-photo {
  background-color: #000;
  height: 100%;
  .toolbar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    .cancel,
    .confirm {
      width: 90px;
      height: 90px;
      font-size: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
    }
  }
}
.img {
  display: block;
  max-width: 100%;
}
</style>
