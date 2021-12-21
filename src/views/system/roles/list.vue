<template>
  <div class="app-container">
    <el-card class="box-card">
      <!-- 列表 -->
      <div class="content">
        <el-row :gutter="10">
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <div class="grid-content">
              <el-tree
                :data="list"
                node-key="id"
                default-expand-all
                :expand-on-click-node="false">
                <div class="custom-tree-node" slot-scope="{ data }">
                  <div class="label">
                    <span>{{ data.roleName }}</span>
                  </div>
                  <!-- <div class="option">
                    <el-button type="text" size="mini" v-if="data.parentId === 1">添加子部门</el-button>
                    <el-button type="text" size="mini" v-if="data.parentId !== 0 && data.parentId !== 1">编辑</el-button>
                  </div> -->
                </div>
              </el-tree>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getRolesList } from '@/api/permission'

export default {
  data() {
    return {
      list: [],
      listLoading: true,
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
    // 查询 - 角色/部门列表
    getList() {
      this.listLoading = true
      getRolesList().then((res) => {
        this.list = res.data
        this.listLoading = false
      })
    }
  }
}
</script>

<style scoped>
.content{
  
}
.custom-tree-node{
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
