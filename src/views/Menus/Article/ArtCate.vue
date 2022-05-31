<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix header-box">
        <span>文章分类</span>
        <el-button type="primary" size="mini" @click="dialogVisible = true"
        >添加分类
        </el-button
        >
      </div>
      <el-table :data="ArtCate" style="width: 100%" border>
        <el-table-column type="index" label="序号" width="50">
        </el-table-column>
        <el-table-column prop="cate_name" label="分类名称"></el-table-column>
        <el-table-column prop="cate_alias" label="分类别名"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="{ row }">
            <el-button
              type="primary"
              size="mini"
              @click="showEditDialog(row.id)"
            >修改
            </el-button>
            <el-button type="danger" size="mini" @click="deleteArtCate(row.id)"
            >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!--    添加分类对话框-->
    <el-dialog
      title="添加文章分类"
      :visible.sync="dialogVisible"
      width="35%"
      @closed="$refs.addFormRef.resetFields()"
    >
      <!-- 添加的表单 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="分类名称" prop="cate_name">
          <el-input v-model="addForm.cate_name"></el-input>
        </el-form-item>
        <el-form-item label="分类别名" prop="cate_alias">
          <el-input v-model="addForm.cate_alias"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addArtCate"> 确 定</el-button>
      </span>
    </el-dialog>
    <!--    修改文章分类的对话框-->
    <el-dialog
      title="修改文章分类"
      :visible.sync="editDialogVisible"
      width="35%"
      @closed="$refs.editFormRef.resetFields()"
    >
      <!-- 菜单区域 -->
      <el-form
        :model="editForm"
        :rules="addFormRules"
        ref="editFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="分类名称" prop="cate_name">
          <el-input v-model="editForm.cate_name"></el-input>
        </el-form-item>
        <el-form-item label="分类别名" prop="cate_alias">
          <el-input v-model="editForm.cate_alias"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editArtCate"> 确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'ArtCate',
  data () {
    return {
      ArtCate: [],
      dialogVisible: false,
      editDialogVisible: false,
      addForm: {
        cate_name: '',
        cate_alias: ''
      },
      editForm: {
        cate_name: '',
        cate_alias: ''
      },
      addFormRules: {
        cate_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          {
            pattern: /^\S{1,10}$/,
            message: '分类名必须是1-10位的非空字符',
            trigger: 'blur'
          }
        ],
        cate_alias: [
          { required: true, message: '请输入分类别名', trigger: 'blur' },
          {
            pattern: /^[a-zA-Z\d]{1,15}$/,
            message: '分类别名必须是1-15位的字母数字',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created () {
    this.initArtCateList()
  },
  methods: {
    //删除文章分类
    deleteArtCate (id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          //    确认
          const { data: res } = await this.$http.delete('/my/cate/del', {
            params: {
              id
            }
          })
          if (res.code !== 0) return this.$message.error(res.message)
          this.$message.success(res.message)
          await this.initArtCateList()
        })
        .catch(() => {
          //  取消
          this.$message.warning('速度优化')
        })
    },
    //修改文章分类
    editArtCate () {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          '/my/cate/info',
          this.editForm
        )
        if (res.code !== 0) return this.$message.error(res.message)
        this.$message.success(res.message)
        //  关闭对话框
        this.editDialogVisible = false
        //  重新获取数据
        await this.initArtCateList()
      })
    },
    //展示修改对话框
    async showEditDialog (id) {
      const { data: res } = await this.$http.get('/my/cate/info', {
        params: {
          id
        }
      })
      if (res.code === 0) {
        this.editForm = res.data
        this.editDialogVisible = true
      }
    },
    //获取数据
    async initArtCateList () {
      const { data: res } = await this.$http.get('/my/cate/list')
      if (res.code === 0) {
        this.ArtCate = res.data
        // console.log(res.data)
      }
    },
    //添加文章分类
    addArtCate () {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          '/my/cate/add',
          this.addForm
        )
        if (res.code !== 0) return this.$message.error(res.message)
        this.$message.success(res.message)
        this.dialogVisible = false
        await this.initArtCateList()
      })
    }
  }
}
</script>

<style lang="less" scoped>
.header-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
