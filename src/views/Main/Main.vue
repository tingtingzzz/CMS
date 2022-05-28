<template>
  <el-container class="main-container">
    <!-- 头部区域 -->
    <el-header>
      <!-- 左侧的 logo -->
      <img src="../../assets/images/logo.png" alt=""/>
      <!-- 右侧的菜单 -->
      <el-menu
        class="el-menu-top"
        mode="horizontal"
        background-color="#23262E"
        text-color="#fff"
        active-text-color="#409EFF"
      >
        <el-submenu index="1">
          <template slot="title">
            <!-- 头像 -->
            <img :src="userInfo.user_pic" alt="" class="avatar" v-if="userInfo.user_pic"/>
            <img src="../../assets/logo.png" alt="" class="avatar" v-else/>
            <span>个人中心</span>
          </template>
          <el-menu-item index="1-1"><i class="el-icon-s-operation"></i>基本资料</el-menu-item>
          <el-menu-item index="1-2"><i class="el-icon-camera"></i>更换头像</el-menu-item>
          <el-menu-item index="1-3"><i class="el-icon-key"></i>重置密码</el-menu-item>
        </el-submenu>
        <el-menu-item index="2" @click="logout"><i class="el-icon-switch-button"></i>退出</el-menu-item>
      </el-menu>
    </el-header>
    <el-container>
      <!-- 侧边栏区域 -->
      <el-aside width="200px">
        <div class="user-box">
          <img :src="userInfo.user_pic" alt="" v-if="userInfo.user_pic"/>
          <img src="../../assets/logo.png" alt="" v-else/>
          <span>{{ userInfo.nickname || userInfo.username }}</span>
        </div>
        <el-menu
          default-active="/home"
          class="el-menu-vertical-demo"
          background-color="#23262E"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          router
        >
          <template v-for="item in menusList">
            <!-- 不包含子菜单的“一级菜单” -->
            <el-menu-item
              :index="item.indexPath"
              :key="item.indexPath"
              v-if="!item.children"
            ><i :class="item.icon"></i>
              {{ item.title }}
            </el-menu-item>
            <!-- 包含子菜单的“一级菜单” -->
            <el-submenu
              :index="item.indexPath"
              :key="item.indexPath"
              v-else
            >
              <template slot="title">
                <i :class="item.icon"></i>
                <span>{{ item.title }}</span>
              </template>
              <el-menu-item
                :index="childItem.indexPath"
                :key="childItem.indexPath"
                v-for="childItem in item.children"
              ><i :class="childItem.icon"></i>
                {{ childItem.title }}
              </el-menu-item>
            </el-submenu>
          </template>
        </el-menu>
      </el-aside>
      <el-container>
        <!-- 页面主体区域 -->
        <el-main>
          <router-view></router-view>
        </el-main>
        <!-- 底部 footer 区域 -->
        <el-footer>© www.itheima.com - 黑马程序员</el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
//辅助函数
import { mapState } from 'vuex'

export default {
  name: 'Main',
  data () {
    return {
      menusList: []
    }
  },
  computed: {
    ...mapState(['userInfo', 'token'])
  },
  created () {
    if (this.token) {
      this.$store.dispatch('initUserinfo')
      //调用函数
      this.initMenus()
    } else {
      this.$router.push('/login')
    }
  },
  methods: {
    async initMenus () {
      //发送请求
      const { data: res } = await this.$http.get('/my/menus')
      //把请求成功的数据保存
      if (res.code === 0) {
        this.menusList = res.data
      }
    },
    logout () {
      this.$confirm('确定要退出嘛', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.commit('updateToken', '')
        this.$store.commit('updateUserInfo', {})
        this.$router.push('/login')
        this.$message.success('退出成功!')
      }).catch(() => {
        //取消
      })
    }
  }

}
</script>

<style lang="less" scoped>
.main-container {
  height: 100%;

  .el-header,
  .el-aside {
    background-color: #23262e;
  }

  .el-header {
    padding: 0;
    display: flex;
    justify-content: space-between;
  }

  .el-main {
    overflow-y: scroll;
    height: 0;
    background-color: #F2F2F2;
  }

  .el-footer {
    background-color: #eee;
    font-size: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.avatar {
  border-radius: 50%;
  width: 35px;
  height: 35px;
  background-color: #fff;
  margin-right: 10px;
  object-fit: cover;
}

.user-box {
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 1px solid #000;
  border-bottom: 1px solid #000;
  user-select: none;

  img {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    background-color: #fff;
    margin-right: 15px;
    object-fit: cover;
  }

  span {
    color: white;
    font-size: 12px;
  }
}
</style>
