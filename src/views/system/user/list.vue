<template>
  <div class="app-container">
    <el-card class="box-card">
      <!-- 筛选查询 -->
      <div class="header">
        <el-form :inline="true" :model="searchForm" class="demo-form-inline">
          <el-form-item>
            <el-button type="primary" icon="el-icon-plus" @click="creatItem">添加用户</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 列表 -->
      <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row>
        <el-table-column label="编号" prop="id" align="center" width="100"></el-table-column>
        <el-table-column label="用户名" prop="username" width="160" align="center"></el-table-column>
        <el-table-column label="部门" prop="roleDetail.comment" width="160" align="center"></el-table-column>
        <el-table-column label="职位" prop="roleDetail.roleName" width="160" align="center"></el-table-column>
        <el-table-column label="注册IP" prop="registerIp" width="160" align="center"></el-table-column>
        <el-table-column label="状态" width="120" align="center">
          <template slot-scope="scope">
            {{ scope.row.status == 1 ? '已启用' : '禁用' }}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createdAt" align="center"></el-table-column>
        <el-table-column label="修改时间" prop="updatedAt" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="180" fixed="right">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="editItem(scope.row)" v-if="scope.row.roles != 'admin'">修改</el-button>
            <el-button type="danger" size="mini" @click="deleteItem(scope.row)" v-if="scope.row.roles != 'admin'">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="footer">
        <el-pagination
          background
          :current-page="searchForm.pageNum"
          :page-sizes="[10, 50, 100, 200, 300, total]"
          :page-size="searchForm.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <!-- 表单 -->
    <el-dialog :title="formType == 'creat' ? '添加' : '编辑'" :visible.sync="formShow">
      <el-form ref="creatForm" :model="form" :rules="rules" label-position="top" label-width="160">
        <el-form-item label="部门/角色" prop="roles">
          <el-cascader-panel v-model="form.rolesArr" :options="roles" :props="rolesProps" @change="rolesSelectChange"></el-cascader-panel>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" show-password placeholder="请输入" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio-button :label="0">禁用</el-radio-button>
            <el-radio-button :label="1">启用</el-radio-button>
          </el-radio-group>
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
import { getUserList, creatUser, editUser, deleteUser } from '@/api/user'
import { getRolesList } from '@/api/permission'
import { parseTime } from '@/utils/index'
import { Loading } from 'element-ui'

export default {
  data() {
    return {
      // 搜索
      searchForm: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      // 列表
      list: [],
      listLoading: true,
      // 表单
      roles: [],
      rolesValue: [],
      rolesProps: {
        value: 'roleId',
        label: 'roleName'
      },
      formType: 'creat',
      formShow: false,
      form: {
        roles: '',
        rolesArr: [],
        username: '',
        password: '',
        status: 0,
      },
      rules: {
        roles: [
          { required: true, message: '请选择部门', trigger: 'blur' }
        ],
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      },
    }
  },
  created() {
    this.getList()
    // console.log( getSohuIp() );
  },
  methods: {
    /**
     * 网络请求
     * *******************************************
     */
    // 查询 - 角色/部门列表
    getRolesList() {
      getRolesList().then((res) => {
        this.roles = res.data
      })
    },
    // 查询 - 用户列表
    getList() {
      this.listLoading = true
      getUserList(this.searchForm).then((res) => {
        this.list = res.data.rows
        this.total = res.data.count
        this.listLoading = false
      })
    },
    // 添加
    creat() {
      const that = this
      const form = that.form

      creatUser(form).then(res => {
        that.$message({
          message: '创建成功',
          type: 'success'
        })
        that.formShow = false
        that.getList()
      })
    },
    // 编辑
    edit() {
      const that = this
      const form = that.form

      editUser(form).then(res => {
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
        deleteUser(row.id).then(res => {
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
    // 添加
    creatItem() {
      this.formType = 'creat'
      this.formShow = true
      this.form = {
        roles: [],
        rolesArr: [],
        username: '',
        password: '',
        status: 0,
      }

      this.getRolesList()
    },
    // 修改
    editItem(row) {
      this.formType = 'edit'
      this.formShow = true

      const form = {
        id: row.id,
        roles: row.roles,
        rolesArr: row.rolesArr,
        username: row.username,
        password: row.password,
        status: row.status,
      }
      this.form = form
      this.getRolesList()
    },
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
    },
    // 角色/部门选择
    rolesSelectChange(value){
      console.log(value);
      this.form.roles = value[value.length - 1]
    },
    // 分页
    handleSizeChange(val) {
      this.searchForm.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.searchForm.pageNum = val
      this.getList()
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
