<template>
  <!-- 注册页面的整体盒子 -->
  <div class='reg-container'>
    <!-- 注册的盒子 -->
    <div class='reg-box'>
      <!-- 标题的盒子 -->
      <div class='title-box'></div>
      <!-- 注册的表单区域 -->
      <el-form style='padding: 0 25px'
        :model='regForm' :rules='regFormRules' ref='regFormRef'
      >
        <!--        用户名-->
        <el-form-item prop='username'>
          <el-input placeholder='请输入用户名'
            prefix-icon='el-icon-user'
            v-model='regForm.username'
          ></el-input>
        </el-form-item>
        <!--        密码-->
        <el-form-item prop='password'>
          <el-input placeholder='请输入密码'
            prefix-icon='el-icon-unlock'
            v-model='regForm.password'
          ></el-input>
        </el-form-item>
        <!--        确认密码-->
        <el-form-item prop='repassword'>
          <el-input placeholder='请确认密码'
            prefix-icon='el-icon-unlock'
            v-model='regForm.repassword'
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button style='width: 100%'
            type='success' round
            @click='regNewUser'
          >注册
          </el-button>
          <el-link type='info' :underline='false'>去登陆</el-link>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Reg',
  methods: {
    regNewUser () {
      this.$refs.regFormRef.validate(async valid => {
        //valid 只有校验全部通过结果才是true 不然就是false
        if (!valid) return //校验不通过
        //发送请求
        const { data: res } = await this.$http.post('/api/reg', this.regForm)
        //请求失败 提示
        if (res.code !== 0) return this.$message.error(res.message)
        //请求成功 提示用户
        this.$message.success(res.message)
        await this.$router.push('/login')
      })
    }
  },
  data () {
    const samePwd = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.regForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      regForm: {
        username: '',
        password: '',
        repassword: ''
      },
      //验证规则
      regFormRules: {
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          {
            pattern: /^[a-zA-Z][a-zA-Z\d]{0,9}$/, message: '用户名必须是长度1-9位数字,不能以数字开头',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            pattern: /^\S{6,15}$/, message: '密码必须是长度6-15为非空字符串',
            trigger: 'blur'
          }
        ],
        repassword: [
          {
            pattern: /^\S{6,15}$/, message: '密码必须是长度6-15为非空字符串',
            trigger: 'blur'
          },
          { validator: samePwd, trigger: 'blur' }
        ]
      }
    }
  }
}
</script>

<style lang='less' scoped>
.reg-container {
  background: url('../../assets/images/login_bg.jpg') center;
  background-size: cover;
  height: 100%;

  .reg-box {
    width: 400px;
    height: 335px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    .title-box {
      height: 60px;
      background: url('../../assets/images/login_title.png') center no-repeat;
    }
  }
}
</style>

