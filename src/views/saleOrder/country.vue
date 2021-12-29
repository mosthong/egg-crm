<template>
  <div class="app-container">
    <el-card class="box-card">
      <!-- 筛选查询 -->
      <div class="header">
        <el-form :inline="true" :model="searchForm" class="demo-form-inline">
          <el-form-item>
            <el-button type="primary" icon="el-icon-plus" @click="creatItem">添加</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 列表 -->
      <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" fit border>
        <el-table-column label="国家" prop="country"></el-table-column>
        <el-table-column label="操作" align="center" width="180" fixed="right">
          <template slot-scope="scope">
            <el-button v-if="scope.row.country != '地区'" type="primary" size="mini" @click="editItem(scope.row)">修改</el-button>
            <el-button v-if="scope.row.country != '地区'" type="danger" size="mini" @click="deleteItem(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 表单 -->
    <el-dialog :title="formType == 'creat' ? '添加' : '编辑'" :visible.sync="formShow">
      <el-form ref="creatForm" :model="form" :rules="rules" label-position="top" label-width="160">
        <el-form-item label="国家" prop="country">
          <el-input v-model="form.country" placeholder="请输入" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="formShow = false">取 消</el-button>
        <el-button type="primary" @click="submit()">立即提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getCountrylist,
  creatCountryItem,
  editCountryItem,
  deleteCountryItem
} from '@/api/saleOrder'
// import { Loading } from 'element-ui'

export default {
  data() {
    return {
      searchForm: {},
      total: 0,
      // 列表
      list: [],
      listLoading: true,
      // 表单
      formType: 'creat',
      formShow: false,
      form: {
        id: 0,
        continent: '',
        country: ''
      },
      rules: {
        continent: [{ required: true, message: '请选择', trigger: 'blur' }],
        country: [{ required: true, message: '请输入', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /**
     * 网络请求
     * *******************************************
     */
    // 查询
    getList() {
      this.listLoading = true
      getCountrylist().then((res) => {
        this.list = res.data.map((x) => {
          let item = {
            id: x.id,
            continent: x.continent,
            country: x.country,
            children: x.country_list
          }
          return item
        })
        this.listLoading = false
      })
    },
    // 添加
    creat() {
      const that = this
      creatCountryItem(that.form).then((res) => {
        that.$message({
          message: '创建成功',
          type: 'success'
        })
        that.formShow = false
        that.getList()
      })
    },
    edit() {
      const that = this
      editCountryItem(that.form).then((res) => {
        that.$message({
          message: '修改成功',
          type: 'success'
        })
        that.formShow = false
        that.getList()
      })
    },
    // 添加
    creatItem() {
      this.formType = 'creat'
      this.formShow = true
      this.form = {
        continent: '',
        country: ''
      }
    },
    // 修改
    editItem(row) {
      this.formType = 'edit'
      this.formShow = true
      this.form = {
        id: row.id,
        continent: row.continent,
        country: row.country
      }
    },
    // 删除
    deleteItem(row) {
      const that = this
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteCountryItem({ id: row.id }).then((res) => {
          that.$message({
            message: '删除成功',
            type: 'success'
          })
          that.getList()
        })
      })
    },
    /**
     * 事件
     * *******************************************
     */
    // 表单提交
    submit() {
      const that = this
      this.$refs['creatForm'].validate((valid) => {
        if (valid) {
          if (that.formType === 'edit') {
            that.edit()
          } else {
            that.creat()
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style>
.footer {
  margin: 20px 0;
  display: flex;
  justify-content: flex-end;
}
.link {
  margin: 20px;
  display: flex;
  justify-content: flex-end;
}
.dialog-footer {
  margin: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
