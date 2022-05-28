<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>基本资料</span>
    </div>
    <!-- 表单 -->
    <el-form
      :model="userForm"
      :rules="userFormRules"
      ref="userFormRef"
      label-width="100px">
      <!--      用户名-->
      <el-form-item label="登录名称" prop="username">
        <el-input v-model="userForm.username" disabled></el-input>
      </el-form-item>
      <!--      用户昵称-->
      <el-form-item label="用户昵称" prop="nickname">
        <el-input v-model="userForm.nickname"></el-input>
      </el-form-item>
      <!--      用户邮箱-->
      <el-form-item label="用户邮箱" prop="email">
        <el-input v-model="userForm.email"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">提交修改</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  name: 'UserInfo',
  methods: {
    submit () {
      this.$refs.userFormRef.validate(async valid => {
        if (!valid) return  //校验失败
        const { data: res } = await this.$http.put(
          '/my/userinfo',
          this.userForm
        )
        if (res.code !== 0) return this.$message.warning(res.message)
        this.$message.success(res.message)
        // 触发actions中的函数 更新vuex的数据
        this.$store.dispatch('initUserinfo')
      })
    },
    //重置
    resetForm () {
      this.userForm = Object.assign({}, this.$store.state.userInfo)
    }
  },
  data () {
    return {
      // 存储表单的数据对象
      //表单初始值  使用浅拷贝
      userForm: Object.assign({}, this.$store.state.userInfo),
      // 存储表单验证规则对象
      userFormRules: {
        nickname: [
          { required: true, message: '请输入用户昵称', trigger: 'blur' },
          { pattern: /^\S{1,10}$/, message: '昵称必须是1-10位的非空字符串', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
        ]
      }
    }
  }
}
</script>

<style lang="less" scoped>
.el-form {
  width: 500px;
}
</style>
