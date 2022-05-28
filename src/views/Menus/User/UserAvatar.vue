<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>更换头像</span>
    </div>
    <div>
      <!-- 图片，用来展示用户选择的头像 -->
      <img src="../../../assets/images/avatar.jpg" alt="" class="preview"/>

      <!-- 按钮区域 -->
      <div class="btn-box">
        <input type="file" accept="image/*" ref="iptFile" style="display: none"></input>
        <el-button type="primary" icon="el-icon-plus" @click="chooseImg">选择图片</el-button>
        <el-button type="success" icon="el-icon-upload" disabled>上传头像</el-button>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'UserAvatar',
  methods: {
    chooseImg () {
      this.$refs.iptFile.click()
    }
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
