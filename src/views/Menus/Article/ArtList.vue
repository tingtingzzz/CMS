<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>文章列表</span>
      </div>
      <!-- 搜索区域 -->
      <div class="search-box">
        <el-form :inline="true" :model="q">
          <el-form-item label="文章分类">
            <el-select v-model="q.cate_id" placeholder="请选择分类" size="small">
              <el-option
                :label="item.cate_name"
                :value="item.id"
                v-for="item in ArtCateList"
                :key="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发布状态" style="margin-left: 15px;">
            <el-select v-model="q.state" placeholder="请选择状态" size="small">
              <el-option label="已发布" value="已发布"></el-option>
              <el-option label="草稿" value="草稿"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small"
              @click="getArticleList()"
            >筛选
            </el-button>
            <el-button type="info" size="small"
              @click="resetForm"
            >重置
            </el-button>
          </el-form-item>
        </el-form>
        <!-- 发表文章的按钮 -->
        <el-button type="primary" size="small" class="btn-pub"
          @click="pubDialogVisible=true"
        >发表文章
        </el-button>
      </div>

      <!-- 文章表格区域 -->
      <el-table
        :data="ArticleList"
        style="width: 100%">
        <el-table-column prop="title" label="文章标题">
          <template v-slot="{row}">
            <el-link type="primary"
              @click="showDetail(row.id)">
              {{ row.title }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column
          prop="cate_name"
          label="文章分类">
        </el-table-column>
        <el-table-column
          prop="pub_date"
          label="发布时间">
          <template v-slot=" {row}">
            {{ formData(row.pub_date) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="state"
          label="状态">
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="{row}">
            <el-button type="danger" size="mini"
              @click="deleteArticle(row.id) "
            >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="q.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="q.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <!-- 发表文章对话框start -->
    <el-dialog
      title="发表文章"
      :visible.sync="pubDialogVisible"
      fullscreen
      :before-close="handleClose"
      @closed="closeResetForm"
    >
      <!-- 发布文章的表单区域 -->
      <el-form
        :model="pubForm"
        :rules="pubFormRules"
        ref="pubFormRef"
        label-width="100px">
        <el-form-item label="文章标题" prop="title">
          <el-input v-model="pubForm.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="文章分类" prop="cate_id">
          <el-select v-model="pubForm.cate_id" placeholder="请选择分类" style="width: 100%;">
            <el-option
              v-for="item in ArtCateList"
              :key="item.id"
              :label="item.cate_name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <!--        内容-->
        <el-form-item label="文章内容" prop="content">
          <quill-editor v-model="pubForm.content"></quill-editor>
        </el-form-item>
        <el-form-item label="文章封面">
          <!-- 用来显示封面的图片 -->
          <img src="../../../assets/images/cover.jpg" alt="" class="cover-img" ref="imgRef"/>
          <br/>
          <!-- 文件选择框，默认被隐藏 -->
          <input type="file"
            style="display: none;"
            accept="image/*"
            ref="iptFile"
            @change="onChangeFile"
          />
          <!-- 选择封面的按钮 -->
          <el-button type="text" @click="$refs.iptFile.click()">+ 选择封面</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="pubArticle('已发布')">发布文章</el-button>
          <el-button type="info" @click="pubArticle('草稿')">存为草稿</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 发表文章对话框end -->
    <!-- 查看文章详情的对话框start -->
    <el-dialog title="文章预览" :visible.sync="detaiVisible" width="80%">
      <h1 class="title">{{ artDetail.title }}</h1>

      <div class="info">
        <span>作者：{{ artDetail.nickname || artDetail.username }}</span>
        <span>发布时间：{{ formData(artDetail.pub_date) }}</span>
        <span>所属分类：{{ artDetail.cate_name }}</span>
        <span>状态：{{ artDetail.state }}</span>
      </div>

      <!-- 分割线 -->
      <el-divider></el-divider>

      <img :src="'https://big-event-vue-api-t.itheima.net' + artDetail.cover_img" alt=""/>

      <div v-html="artDetail.content"></div>
    </el-dialog>

    <!-- 查看文章详情的对话框end -->
  </div>
</template>

<script>
//文件如果小于8kb就会转成besa64的字符串
//大于8kb就会返回一个文件路径
import defaultImg from '@/assets/images/cover.jpg'
import dayjs from 'dayjs'

export default {
  name: 'ArtList',
  data () {
    return {

      artDetail: {},
      detaiVisible: false,
      //保存的总数
      total: 0,
      // 查询参数对象
      q: {
        pagenum: 1,
        pagesize: 5,
        cate_id: '',
        state: ''
      },
      //控制发布文章对话框显示和隐藏
      pubDialogVisible: false,
      pubForm: {
        title: '',
        cate_id: '',
        content: '',
        cover_img: null,
        state: ''
      },
      // 表单的验证规则对象
      pubFormRules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          { min: 1, max: 30, message: '文章标题的长度为1-30个字符', trigger: 'blur' }
        ],
        cate_id: [{ required: true, message: '请选择文章分类', trigger: 'change' }],
        content: [
          { required: true, message: '请输入文章内容', trigger: 'blur' }
        ]
      },
      //  保存文章分类
      ArtCateList: [],
      //  保存文章列表
      ArticleList: []
    }
  },
  created () {
    //获取文章分类列表
    this.getArtCateList()
    //获取文章列表数据
    this.getArticleList()
  },
  methods: {
    //删除 文章
    deleteArticle (id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async _ => {
          const { data: res } = await this.$http.delete('/my/article/info', {
            params: { id }
          })
          if (res.code !== 0) return this.$message.error(res.message)
          this.$message.success(res.message)
          if (this.ArticleList.length === 1 && this.q.pagenum > 1) {
            this.q.pagenum --
          }
          //重新获取数据
          await this.getArticleList()
        })
        .catch(_ => {})
    },
    // 获取详情页数据
    async showDetail (id) {
      const { data: res } = await this.$http.get('/my/article/info', {
        params: {
          id
        }
      })
      if (res.code === 0) {
        this.artDetail = res.data
        this.detaiVisible = true
      }
    },
    //重置表单
    resetForm () {
      this.q = {
        pagenum: 1,
        pagesize: 5,
        cate_id: '',
        state: ''
      }
      // 重新发送请求
      this.getArticleList()
    },
    //切换每一页显示多少条时触发
    handleSizeChange (val) {
      // console.log(`每页 ${ val } 条`)
      this.q.pagesize = val
      this.q.pagenum = 1
      this.getArticleList()
    },
    //切换页码时触发
    handleCurrentChange (val) {
      // console.log(`当前页: ${ val }`)
      this.q.pagenum = val
      this.getArticleList()
    },

    //格式化时间
    formData (time) {
      return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
    },
    //获取文章列表数据
    async getArticleList () {
      const { data: res } = await this.$http.get('/my/article/list', {
        params: this.q
      })
      if (res.code === 0) {
        this.ArticleList = res.data
        this.total = res.total
      }
    },
    //重置表单
    closeResetForm () {
      this.$refs.pubFormRef.resetFields()
      this.pubForm.cover_img = null
      this.pubForm.state = ''
      this.$refs.imgRef.setAttribute('src', defaultImg)
    },
    //发布文章
    pubArticle (state) {
      this.pubForm.state = state
      this.$refs.pubFormRef.validate(async valid => {
        if (!valid) return this.$message.error('文章信息不完整')
        if (this.pubForm.cover_img === null) return this.$message.error('请上传文章封面')
        //FormData 是一种传输格式
        const fd = new FormData()
        //Object.keys可以得到对象里面的键
        Object.keys(this.pubForm).forEach(key => {
          fd.append(key, this.pubForm[key])
        })
        const { data: res } = await this.$http.post('/my/article/add', fd)
        if (res.code !== 0) return this.$message.error(res.message)
        this.$message.success(res.message)
        //关闭对话框
        this.pubDialogVisible = false
        //清空 input type=file的值
        this.$refs.iptFile.value = ''
        //  重新获取数据
        await this.getArticleList()
      })
    },
    //获取图片
    onChangeFile (e) {
      const filelist = e.target.files
      if (filelist.length > 0) {
        this.pubForm.cover_img = filelist[0]
        //createObjectURL 能够将图片对象储存到内存中 返回一个对象地址
        const url = URL.createObjectURL(filelist[0])
        // this.$refs.imgRef.setAttribute可以更换属性
        this.$refs.imgRef.setAttribute('src', url)
      } else {
        this.pubForm.cover_img = null
        this.$refs.imgRef.setAttribute('src', defaultImg)
      }
    },
    //获取文章分类列表
    async getArtCateList () {
      const { data: res } = await this.$http.get('/my/cate/list')
      if (res.code === 0) {
        this.ArtCateList = res.data
      }
    },
    handleClose (done) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(_ => {
          done()
        })
        .catch(_ => {})
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .ql-editor {
  min-height: 300px;
}
.el-pagination {
  margin-top: 15px;
}
// 设置图片封面的宽高
.cover-img {
  width: 400px;
  height: 280px;
  object-fit: cover;
}
.search-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  .btn-pub {
    margin-top: 5px;
  }
}
</style>
