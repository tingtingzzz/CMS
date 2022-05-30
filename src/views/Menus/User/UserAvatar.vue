<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>更换头像</span>
    </div>
    <div>
      <!-- 图片，用来展示用户选择的头像 -->
      <img :src="avatar" alt="" class="preview" v-if="avatar"/>
      <img src="../../../assets/images/avatar.jpg" alt="" v-else>

      <!-- 按钮区域 -->
      <div class="btn-box">
        <input type="file" accept="image/*"
          ref="iptFile"
          style="display: none"
          @change="onchangeFile">
        </input>
        <el-button type="primary"
          icon="el-icon-plus"
          @click="$refs.iptFile.click()">选择图片
        </el-button>
        <el-button type="success"
          icon="el-icon-upload"
          :disabled="avatar===''"
          @click="onUploacImge"
        >上传头像
        </el-button>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'UserAvatar',
  data () {
    return {
      avatar: ''
    }
  },
  methods: {
    async onUploacImge () {
      const { data: res } = await this.$http.patch('/my/update/avatar', {
        avatar: this.avatar
      })
      if (res.code !== 0) return this.$message.error(res.message)
      this.$message.success(res.message)
      await this.$store.dispatch('initUserinfo')
      this.avatar = ''
    },
    onchangeFile (e) {
      const fileList = e.target.files
      if (fileList.length > 0) {
        const render = new FileReader()
        render.readAsDataURL(fileList[0])
        render.addEventListener('load', () => {
          this.avatar = render.result
        })
      } else {
        this.avatar = ''
      }
    }
    // chooseImg () {
    //   this.$refs.iptFile.click()
    // }
  }
}
</script>

<style lang="less" scoped>
.btn-box {
  margin-top: 10px;
}

.preview {
  object-fit: cover;
  width: 350px;
  height: 350px;
}
</style>
