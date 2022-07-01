<template>
  <div class="channel-edit">
    <!-- 我的频道 -->
    <van-cell :border="false">
      <div slot="title" class="title-text">我的频道</div>
      <van-button
        class="edit-btn"
        type="danger"
        plain
        round
        size="mini"
        @click="isEdit = !isEdit"
        >{{ isEdit ? "完成" : "编辑" }}</van-button
      >
    </van-cell>
    <van-grid class="my-grid" :gutter="10">
      <!-- 进行数据铺设的地方 -->
      <van-grid-item
        class="grid-item"
        v-for="(channel, index) in myChannels"
        :key="channel.id"
        @click="onChannelMyClick(index, channel.id)"
      >
        <van-icon
          slot="icon"
          name="clear"
          v-show="isEdit && fixedChannel.indexOf(channel.id) === -1"
        ></van-icon>
        <span class="text" slot="text" :class="{ active: index === active }">{{
          channel.name
        }}</span>
      </van-grid-item>
    </van-grid>

    <!-- 频道推荐 -->
    <van-cell :border="false">
      <div slot="title" class="title-text">频道推荐</div>
    </van-cell>
    <van-grid class="recommend-grid" :gutter="10">
      <!-- 进行数据铺设的地方 -->
      <van-grid-item
        class="grid-item"
        icon="plus"
        :text="channel.name"
        v-for="(channel, index) in recommentChannels"
        :key="index"
        @click="onAddChannel(channel)"
      />
    </van-grid>
    <!-- /频道推荐 -->
  </div>
</template>

<script>
import { getAllChannels, addUserChannel, deleteUserChannel } from '@/api/channel'
import _ from 'lodash'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage'
export default {
  name: 'ChannelEdit',
  components: {},
  props: {
    myChannels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      allChannels: [],
      isEdit: false, // 控制点击时的×
      fixedChannel: [0]// 存储那些频道不允许删除的 要存频道id
    }
  },
  computed: {
    ...mapState(['token']),
    // 定义方法 频道推荐与我的频道作比较，过滤重复的
    recommentChannels () {
      // return this.allChannels.filter(val => {
      //   return !this.myChannels.find(item => {
      //     return item.id === val.id
      //   })
      // })
      // 使用lodash
      return _.differenceBy(this.allChannels, this.myChannels, 'id')
    }
  },
  watch: {},
  created () {
    this.loadgetAllChannels()
  },
  mounted () { },
  methods: {
    async loadgetAllChannels () {
      try {
        const { data } = await getAllChannels()
        console.log(data)
        this.allChannels = data.data.channels
      } catch (err) {
        console.log('获取频道失败')
      }
    },
    //  定义一个点击推荐频道触发的事件
    async onAddChannel (channel) {
      this.$emit('AddChannel', channel)
      // 判断用户是否登录
      if (this.token) {
        // 有token发请求
        try {
          await addUserChannel({
            id: channel.id,
            seq: channel.length
          })
        } catch (err) {
          this.$toast.fail('获取频道失败！')
        }
      } else {
        // 没有存到本地
        setItem('TOUTIAO_CHANNELS', this.myChannels)
      }
    },
    // 定义一个点击我的频道触发的事件
    async onChannelMyClick (index, id) {
      if (this.isEdit) {
        // 阻止固定的频道选项删除 查找id为0的找到又不等于-1所以为true 就终止
        if (this.fixedChannel.indexOf(id) !== -1) return
        // 编辑功能
        this.$parent.$parent.channels.splice(index, 1)
        // 如果删除的的index<=active，为了让高亮效果维持需要让active-1
        if (index <= this.active) {
          this.$emit('update:active', this.active - 1)
        }
        // 删除指定频道
        // 判断用户是否登录
        if (this.token) {
          // 有token发请求
          try {
            await deleteUserChannel(id)
          } catch (err) {
            this.$toast.fail('操作失败！')
          }
        } else {
          // 没有存到本地
          setItem('TOUTIAO_CHANNELS', this.myChannels)
        }
      } else {
        // 用sync修饰符修改父组件的数据
        this.$emit('update:active', index)
        // 关闭弹出层用$parent操作父组件中的方法
        this.$parent.$parent.isChannelEditShow = false
      }
    }
  }

}
</script>

<style scoped lang="less">
.channel-edit {
  padding: 85px 0;
  .title-text {
    font-size: 32px;
    color: #333333;
  }

  .edit-btn {
    width: 104px;
    height: 48px;
    font-size: 26px;
    color: #f85959;
    border: 1px solid #f85959;
  }

  /deep/ .grid-item {
    width: 160px;
    height: 86px;
    .van-grid-item__content {
      white-space: nowrap;
      background-color: #f4f5f6;
      .van-grid-item__text,
      .text {
        font-size: 28px;
        color: #222;
        margin-top: 0;
      }
      .active {
        color: red;
      }
      .van-grid-item__icon-wrapper {
        position: unset;
      }
    }
  }

  /deep/ .my-grid {
    .grid-item {
      .van-icon-clear {
        position: absolute;
        right: -10px;
        top: -10px;
        font-size: 30px;
        color: #cacaca;
        z-index: 2;
      }
    }
  }

  /deep/ .recommend-grid {
    .grid-item {
      .van-grid-item__content {
        flex-direction: row;
        .van-icon-plus {
          font-size: 28px;
          margin-right: 6px;
        }
      }
    }
  }
}
</style>
