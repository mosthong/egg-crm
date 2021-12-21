<template>
  <div class="app-container">
    <el-card class="box-card">
      <!-- 筛选查询 -->
      <div class="header">
        <el-form :inline="true" :model="searchForm" class="demo-form-inline">
          <el-form-item>
            <el-button type="primary" icon="el-icon-plus" @click="creatItem">添加一级分类</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 列表 -->
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        fit
        border
        :default-expand-all="false"
        row-key="id"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      >
        <el-table-column label="产品名" prop="categoryName"></el-table-column>
        <el-table-column label="创建时间" prop="createdAt" width="360"></el-table-column>
        <el-table-column label="操作" align="center" width="280" fixed="right">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="addItem(scope.row)">添加子分类</el-button>
            <el-button type="primary" size="mini" @click="editItem(scope.row)">修改</el-button>
            <el-button type="danger" size="mini" @click="deleteItem(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 表单 -->
    <el-dialog :title="formType == 'creat' ? '添加' : '编辑'" :visible.sync="formShow">
      <el-form ref="creatForm" :model="form" :rules="rules" label-position="top" label-width="160">
        <el-form-item v-if="formType === 'creat'" label="父分类" prop="parentId">
          <el-input v-model="form.parentName" disabled />
        </el-form-item>
        <el-form-item label="分类名" prop="categoryName">
          <el-input v-model="form.categoryName" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="form.sort" placeholder="请输入" />
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
import { getProductList, creatProductItem, updateProductItem, deleteProductItem } from '@/api/saleOrder'
import { Loading } from 'element-ui';

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
        "parentName": '无',
        "parentId": 0,
        "categoryName": "",
        "sort": 1
      },
      rules: {
        categoryName: [
          { required: true, message: '请输入', trigger: 'blur' }
        ]
      },
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
      getProductList().then((res) => {
        this.list = res.data
        this.listLoading = false
      })
    },
    // 添加
    creat() {
      const that = this
      creatProductItem(that.form).then(res => {
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
      updateProductItem(that.form).then(res => {
        that.$message({
          message: '修改成功',
          type: 'success'
        })
        that.formShow = false
        that.getList()
      })
    },
    // 删除
    deleteItem(row) {
      const that = this
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteProductItem({id: row.id}).then(res => {
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
          if (that.formType == 'edit') {
            that.edit()
          } else {
            that.creat()
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 添加
    creatItem() {
      this.formType = 'creat'
      this.formShow = true
      this.form = {
        "parentName": '无',
        "parentId": 0,
        "categoryName": "",
        "sort": 1
      }
    },
    // 修改
    editItem(row) {
      this.formType = 'edit'
      this.formShow = true
      this.form = {
        'id': row.id,
        "parentId": row.parentId,
        "categoryName": row.categoryName,
        "sort": row.sort,
      }
    },
    // 添加子分类
    addItem(row){
      this.formType = 'creat'
      this.formShow = true
      this.form = {
        "parentName": row.categoryName,
        "parentId": row.id,
        "categoryName": "",
        "sort": 1
      }
    },
  }
}
</script>

<style>
.footer{
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
