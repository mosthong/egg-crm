<template>
  <div class="app-container">
    <!-- 筛选查询 -->
    <div class="header">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="时间范围">
          <el-date-picker v-model="searchForm.date" value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']" type="datetimerange" :picker-options="pickerOptions" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right" @change="datetimeChange"></el-date-picker>
        </el-form-item>
        <el-form-item label="销售员">
          <el-input v-model="searchForm.salePerson" clearable placeholder="销售员"></el-input>
        </el-form-item>
        <el-form-item label="产品">
          <el-input v-model="searchForm.productName" clearable placeholder="产品"></el-input>
        </el-form-item>
        <el-form-item label="部门">
          <el-input v-model="searchForm.saleDepartment" clearable placeholder="部门"></el-input>
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input v-model="searchForm.payContactInfo" clearable placeholder="联系方式"></el-input>
        </el-form-item>
        <el-form-item label="是否开票">
          <el-select v-model="searchForm.isInvoice" placeholder="请选择">
            <el-option label="全部" value=""></el-option>
            <el-option label="已开票" :value="1"></el-option>
            <el-option label="未开票" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查 询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-plus" @click="creatItem">添加销售记录</el-button>
          <el-button type="primary" icon="el-icon-download" @click="exportExcel">导出EXCEL</el-button>
          <el-button type="primary" icon="el-icon-download" @click="exportExcelAll">导出全部数据</el-button>
          <!-- <el-button type="success" icon="el-icon-upload" @click="uploadDialogShow = true">导入EXCEL</el-button> -->
        </el-form-item>
      </el-form>
    </div>
    <!-- 列表 -->
    <el-card class="box-card">
      <div class="footer">
        <el-pagination background :current-page="searchForm.pageNum" :page-sizes="[10, 50, 100, 200, 300, total]" :page-size="searchForm.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
      <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" stripe fit show-summary highlight-current-row>
        <el-table-column label="编号" prop="id" width="100"></el-table-column>
        <el-table-column label="客户名称" prop="customerName" sortable width="160"></el-table-column>
        <el-table-column label="客户编号" sortable width="120">
          <template slot-scope="scope">
            {{ scope.row.customerCode }}
          </template>
        </el-table-column>
        <el-table-column prop="productName" label="产品名称" width="280" sortable>
          <template slot-scope="scope">
            <div v-for="(item, index) in scope.row.productArr" :key="index" class="product-item">
              <el-tag>{{ item }}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="国家" width="110">
          <template slot-scope="scope">
            {{ scope.row.country }}
          </template>
        </el-table-column>
        <el-table-column prop="payTime" label="收款时间" sortable width="130"></el-table-column>
        <el-table-column prop="userInfo.username" label="销售" sortable width="130"></el-table-column>
        <el-table-column prop="saleDepartment" label="部门" sortable width="130"></el-table-column>
        <el-table-column prop="transactionPrice" label="成交价格(元)" sortable width="130"></el-table-column>
        <el-table-column prop="transactionPriceForeign" label="成交价格(外币)" sortable width="140"></el-table-column>
        <el-table-column prop="transactionCount" label="数量" width="140"></el-table-column>
        <el-table-column label="打款人信息" width="140">
          <template slot-scope="scope">
            {{ scope.row.payName }}
          </template>
        </el-table-column>
        <el-table-column label="联系方式" width="120">
          <template slot-scope="scope">
            {{ scope.row.payContactInfo }}
          </template>
        </el-table-column>
        <el-table-column label="收款方式" width="100">
          <template slot-scope="scope">
            {{ scope.row.payMethods == 1 ? '对公支付' : '对私支付' }}
          </template>
        </el-table-column>
        <el-table-column label="是否开票" width="120">
          <template slot-scope="scope">
            {{ scope.row.isInvoice == 2 ? '未开票' : '已开票' }}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createdAt" width="160"></el-table-column>
        <el-table-column label="修改时间" prop="updatedAt" width="160"></el-table-column>
        <el-table-column label="操作" width="180" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="editItem(scope.row)">修改</el-button>
            <el-button type="danger" size="mini" @click="deleteItem(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="footer">
        <el-pagination background :current-page="searchForm.pageNum" :page-sizes="[10, 50, 100, 200, 300, total]" :page-size="searchForm.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </el-card>
    <!-- 表单 -->
    <el-dialog :title="formType == 'creat' ? '添加' : '编辑'" :visible.sync="formShow">
      <el-form ref="creatForm" :model="form" :rules="rules" label-position="top" label-width="160">
        <el-row :gutter="10">
          <el-col :xs="24" :sm="24" :md="24" :lg="24">
            <el-form-item label="产品选择" prop="productId">
              {{ form.productName }}
              <el-cascader-panel v-model="form.productId" :options="productlist" :props="productlistProps" :show-all-levels="false" @change="productSelectChange"></el-cascader-panel>
            </el-form-item>
          </el-col>
          <el-col v-if="countryShow" :xs="24" :sm="24" :md="12" :lg="12">
            <el-form-item label="国家" prop="country">
              <el-input v-model="form.country" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="12">
            <el-form-item label="客户编号">
              <el-input v-model="form.customerCode" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="12">
            <el-form-item label="客户名称" prop="customerName">
              <el-input v-model="form.customerName" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="12">
            <el-form-item label="销售人员" prop="salePerson">
              <el-input v-model="form.salePerson" disabled placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="12">
            <el-form-item label="销售部门">
              <el-input v-model="form.saleDepartment" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="12">
            <el-form-item label="成交价格(元)">
              <el-input-number v-model="form.transactionPrice" :precision="2" :step="0.1" :max="1000000" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="12">
            <el-form-item label="成交价格(外币)">
              <el-input-number v-model="form.transactionPriceForeign" :precision="2" :step="0.1" :max="1000000" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="12">
            <el-form-item label="数量">
              <el-input-number v-model="form.transactionCount" :precision="0" :step="1" :max="200" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="12">
            <el-form-item label="收款时间" prop="payTime">
              <el-date-picker v-model="form.payTime" type="date" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="12">
            <el-form-item label="打款人">
              <el-input v-model="form.payName" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="12">
            <el-form-item label="联系方式">
              <el-input v-model="form.payContactInfo" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24">
            <el-form-item label="是否开票">
              <el-radio-group v-model="form.isInvoice" size="small">
                <el-radio :label="2" border>未开票</el-radio>
                <el-radio :label="1" border>已开票</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24">
            <el-form-item label="收款方式">
              <el-radio-group v-model="form.payMethods" size="small">
                <el-radio :label="1" border>对公支付</el-radio>
                <el-radio :label="2" border>对私支付</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24">
            <el-form-item label="备注">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入备注信息" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="formShow = false">取 消</el-button>
        <el-button type="primary" @click="submit()">立即提交</el-button>
      </div>
    </el-dialog>
    <!-- 上传文件 -->
    <el-dialog title="导入销售单" :visible.sync="uploadDialogShow" width="60%">
      <el-row :gutter="20">
        <el-col :span="24">
          <div class="grid-content bg-purple">
            <h3>1. 请按照数据模板的格式准备要导入的数据。<el-link href="/customerManagement/salesmodule.xlsx" type="primary" target="_blank" :underline="false" style="font-size: 1.1em;">点击下载(销售数据模板)</el-link>
            </h3>
            <p>导入文件请勿超过1MB（约4,000条数据）。</p>
          </div>
          <div class="grid-content bg-purple">
            <h3>2. 收款时间格式必须为时间格式。</h3>
            <p>例：2020-02-02格式。</p>
          </div>
          <div class="grid-content bg-purple">
            <h3>3. 成交价格和外币价格后面不可跟元或者英镑之类的字符，只能是数字。</h3>
            <p>例：1999</p>
          </div>
          <div class="grid-content bg-purple">
            <h3>4. 支付方式只能对公支付或者对私支付。</h3>
          </div>
        </el-col>
        <el-col :span="24" style="margin-bottom: 20px;">
          <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" />
        </el-col>
      </el-row>
      <div v-if="tableData.length !== 0" class="dialog-footer">
        <el-button @click="uploadDialogShow = false">取 消</el-button>
        <el-button type="primary" @click="comfirmUploadExcel">立即导入</el-button>
      </div>
      <el-table :data="tableData" element-loading-text="Loading" border fit highlight-current-row>
        <el-table-column label="序号" type="index" align="center" width="60" />
        <el-table-column label="客户名称" prop="customerName" width="240" align="center"></el-table-column>
        <el-table-column label="客户编号" prop="customerCode" width="120" align="center"></el-table-column>
        <el-table-column label="产品名称" prop="productName" width="120" align="center"></el-table-column>
        <el-table-column label="国家" prop="country" width="120" align="center"></el-table-column>
        <el-table-column label="收款时间" prop="payTime" width="160" align="center"></el-table-column>
        <el-table-column label="销售员" prop="salePerson" width="100" align="center"></el-table-column>
        <el-table-column label="部门" prop="saleDepartment" width="100" align="center"></el-table-column>
        <el-table-column label="成交价格(元)" width="120" align="center">
          <template slot-scope="scope">
            {{ parseFloat((scope.row.transactionPrice / 100).toFixed(2)) }}
          </template>
        </el-table-column>
        <el-table-column label="成交价格(外币)" width="120" align="center">
          <template slot-scope="scope">
            {{ parseFloat((scope.row.transactionPriceForeign / 100).toFixed(2)) }}
          </template>
        </el-table-column>
        <el-table-column label="打款人" prop="payName" width="120" align="center"></el-table-column>
        <el-table-column label="联系方式" prop="payContactInfo" width="120" align="center"></el-table-column>
        <el-table-column label="收款方式" width="100" align="center">
          <template slot-scope="scope">
            {{ scope.row.payMethods == 1 ? '对公支付' : '对私支付' }}
          </template>
        </el-table-column>
        <el-table-column label="是否开票" width="120" align="center">
          <template slot-scope="scope">
            {{ scope.row.isInvoice == 2 ? '否' : '是' }}
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="remark" align="center"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import {
  getProductList,
  getCountrylist,
  getSaleList,
  creatSaleItem,
  editSaleItem,
  deleteSaleItem,
  batchAdd
} from '@/api/saleOrder'
import { parseTime } from '@/utils/index'
import { Loading } from 'element-ui'

export default {
  name: 'UploadExcel',
  components: { UploadExcelComponent },
  data() {
    return {
      // 搜索
      timeFrame: '',
      searchForm: {
        isInvoice: '',
        date: '',
        startTime: '',
        endTime: '',
        salePerson: '',
        productName: '',
        saleDepartment: '',
        payContactInfo: '',
        pageNum: 1,
        pageSize: 10
      },
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      total: 0,
      // 列表
      ActiveList: [],
      list: [],
      listLoading: true,
      // 产品选择props
      productlistProps: {
        // value: 'id',
        value: 'categoryName',
        label: 'categoryName',
        multiple: true
      },
      // 表单
      formType: 'creat',
      formShow: false,
      form: {
        productId: [],
        productName: '',
        customerName: '',
        customerCode: '',
        transactionPrice: 0,
        transactionPriceForeign: 0,
        transactionCount: 1,
        salePerson: '',
        saleDepartment: '',
        isInvoice: 1,
        payMethods: 1,
        payTime: '',
        payName: '',
        payContactInfo: '',
        country: '',
        remark: ''
      },
      rules: {
        payTime: [{ required: true, message: '请填写', trigger: 'blur' }],
        productId: [{ required: true, message: '请选择产品', trigger: 'blur' }],
        productName: [{ required: true, message: '请填写', trigger: 'blur' }],
        customerName: [{ required: true, message: '请填写', trigger: 'blur' }],
        customerCode: [{ required: true, message: '请填写', trigger: 'blur' }],
        salePerson: [{ required: true, message: '请填写', trigger: 'blur' }]
      },
      uploadDialogShow: false,
      tableData: [],
      // 新增公共参数查询
      productlist: [],
      countrylist: [],
      countryShow: false
    }
  },
  created() {
    // 获取当前时间
    this.searchForm.endTime = parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}')
    this.searchForm.startTime = parseTime(new Date(), '{y}-{m}') + '-01 00:00:00'
    this.searchForm.date = [this.searchForm.startTime, this.searchForm.endTime]

    this.getList()
    // 预加载
    this.getProductList()
  },
  methods: {
    /**
     * 网络请求
     * *******************************************
     */
    // 查询 - 产品列表
    getProductList() {
      const that = this
      getProductList().then((res) => {
        that.productlist = res.data
      })
    },
    // 查询 - 国家地区 - 弃用
    getCountrylist() {
      const that = this
      getCountrylist().then((res) => {
        that.countrylist = res.data
      })
    },
    // 查询 - 销售记录
    getList() {
      this.listLoading = true
      getSaleList(this.searchForm).then((res) => {
        this.list = res.data.rows.map((x) => {
          x.productArr = x.productName.split(';')
          return x
        })
        this.total = res.data.count
        setTimeout(() => {
          this.listLoading = false
        }, 500)
      })
    },
    // 添加
    creat() {
      const that = this
      const form = that.form
      form.productId = JSON.stringify(form.productId)

      creatSaleItem(form).then((res) => {
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
      form.productId = JSON.stringify(form.productId)

      editSaleItem(form).then((res) => {
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
        deleteSaleItem({ id: row.id }).then((res) => {
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
      let state = this.$store.state.user
      this.form = {
        productId: [],
        productName: '',
        customerName: '',
        customerCode: '',
        transactionPrice: 0,
        transactionPriceForeign: 0,
        transactionCount: 1,
        salePersonId: state.id,
        salePerson: state.name,
        saleDepartment: state.role_name,
        isInvoice: 1,
        payMethods: 1,
        payTime: '',
        payName: '',
        payContactInfo: '',
        country: '',
        remark: ''
      }
    },
    // 修改
    editItem(row) {
      this.formType = 'edit'
      this.formShow = true
      const form = {
        id: row.id,
        productId: row.productId ? JSON.parse(row.productId) : [],
        productName: row.productName,
        customerName: row.customerName,
        customerCode: row.customerCode,
        transactionPrice: parseFloat(row.transactionPrice),
        transactionPriceForeign: parseFloat(row.transactionPriceForeign),
        transactionCount: row.transactionCount
          ? parseFloat(row.transactionCount)
          : 1,
        salePersonId: row.salePersonId,
        salePerson: row.salePerson,
        saleDepartment: row.saleDepartment,
        isInvoice: row.isInvoice,
        payMethods: row.payMethods,
        payTime: row.payTime,
        payName: row.payName,
        payContactInfo: row.payContactInfo,
        country: row.country,
        remark: row.remark
      }

      this.form = form
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
    // 搜索 - 时间选择
    datetimeChange(val) {
      this.searchForm.startTime = val[0]
      this.searchForm.endTime = val[1]
    },
    // 头部 - 搜索
    search() {
      this.searchForm.pageNum = 1
      this.getList()
    },
    // 产品选择
    productSelectChange(value) {
      // console.log('选中', value)
      this.form.productId = value
      let productName = []
      let pText = ''
      value.map((x) => {
        pText = x.join('/')
        productName.push(pText)
      })
      this.form.productName = productName.join(';')
      this.form.transactionCount = value.length
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

    /**
     * 导出为excel
     * *************************************
     */
    // 导出excel
    exportExcel() {
      const that = this
      const filterVal = [
        'customerName',
        'customerCode',
        'productName',
        'country',
        'payTime',
        'salePerson',
        'saleDepartment',
        'transactionPrice',
        'transactionPriceForeign',
        'payName',
        'payContactInfo',
        'payMethods',
        'isInvoice',
        'remark',
        'createdAt'
      ]
      const list = that.list
      const data = this.formatJson(filterVal, list)

      import('@/vendor/Export2Excel').then((excel) => {
        const tHeader = [
          '客户名称',
          '客户编号',
          '产品名称',
          '国家',
          '收款时间',
          '销售员',
          '销售部门',
          '成交价格(元)',
          '成交价格(外币)',
          '打款人信息',
          '联系方式',
          '收款方式: 1公对公,2对私',
          '开票:1是，2否',
          '备注',
          '创建时间'
        ]
        excel.export_json_to_excel({
          header: tHeader, // 表头 必填
          data, // 具体数据 必填
          filename:
            'sales-data-forOrder-count' +
            that.searchForm.pageSize +
            '-time' +
            new Date().getTime(), // 文件名
          autoWidth: true, // 是否数据宽度自适应
          bookType: 'xlsx' // 文件格式
        })
      })
    },
    // 导出全部数据
    exportExcelAll() {
      const that = this
      const loadingInstance = Loading.service({
        background: 'rgba(0, 0, 0, 0.8)',
        text: '表格生成中...'
      })
      // 改变页数
      this.searchForm.pageSize = this.total
      this.getList()

      setTimeout(() => {
        const filterVal = [
          'customerName',
          'customerCode',
          'productName',
          'country',
          'payTime',
          'salePerson',
          'saleDepartment',
          'transactionPrice',
          'transactionPriceForeign',
          'payName',
          'payContactInfo',
          'payMethods',
          'isInvoice',
          'remark',
          'createdAt'
        ]
        const list = that.list
        // console.log(list);
        const data = this.formatJson(filterVal, list)

        import('@/vendor/Export2Excel').then((excel) => {
          const tHeader = [
            '客户名称',
            '客户编号',
            '产品名称',
            '国家',
            '收款时间',
            '销售员',
            '销售部门',
            '成交价格(元)',
            '成交价格(外币)',
            '打款人信息',
            '联系方式',
            '收款方式: 1公对公,2对私',
            '开票:1是，2否',
            '备注',
            '创建时间'
          ]
          excel.export_json_to_excel({
            header: tHeader, // 表头 必填
            data, // 具体数据 必填
            filename:
              'sales-data-forOrder-all' + '-time' + new Date().getTime(), // 文件名
            autoWidth: true, // 是否数据宽度自适应
            bookType: 'xlsx' // 文件格式
          })
        })

        this.$nextTick(() => {
          loadingInstance.close()
        })
      }, 1500)
    },
    // 导出excel 数据一条条进
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]))
    },

    /**
     * 导入文件
     * ******************************************
     */
    // 文件大小不得大于1M
    beforeUpload(file) {
      const isLt3M = file.size / 1024 / 1024 < 1
      if (isLt3M) {
        return true
      }
      this.$message({
        message: 'Please do not upload files larger than 3M in size.',
        type: 'warning'
      })
      return false
    },
    // 数组拼接
    handleSuccess({ results, header }) {
      let dataArr = results.map((value) => {
        // 付款方式
        let payMethods = value.收款方式
        if (payMethods) {
          payMethods.indexOf('对公') !== -1
            ? (payMethods = 1)
            : (payMethods = 2)
        }
        // 收款时间判断
        let payTime =
          typeof value.收款时间 === 'string'
            ? value.收款时间
            : this.formatExcelDate(new Date(value.收款时间), '-')
        // 开票判断
        let isInvoice = ''
        if (value.是否开票) {
          isInvoice = value.是否开票 === '是' ? 1 : 2
        } else {
          isInvoice = NaN
        }

        let dataItem = {
          isInvoice: isInvoice,
          payMethods: payMethods,
          payTime: payTime,
          payContactInfo: value.联系方式,
          salePerson: value.对应销售,
          saleDepartment: value.部门,
          customerName: value.客户名称,
          customerCode: value.客户编号,
          productName: value.产品名称,
          country: value.国家,
          payName: value.打款人信息,
          transactionPrice: value.成交价格 * 100,
          transactionPriceForeign: value.外币价格 * 100,
          remark: value.备注
        }
        return dataItem
      })

      this.tableData = dataArr
    },
    // 提交excel
    comfirmUploadExcel() {
      console.log(this.tableData)
      batchAdd(this.tableData).then((res) => {
        console.log('uploadExcel', res)
        if (res.code !== 200) {
          return this.$message.error('导入文件失败！')
        }
        this.$message.success('导入文件成功！')
        this.uploadDialogShow = false
        this.getList()
      })
    },
    // excel时间格式转年月日
    // excel读取2020/04/03 14:01这种时间格式是会将它装换成数字类似于3924.584027778 numb是传过来的整数数字，format是之间间隔的符号
    formatExcelDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      time.setHours(time.getHours() - 8)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      // const hours = time.getHours().toLocaleString()
      // const minutes = time.getMinutes()
      if (format && format.length === 1) {
        // return year + format + month + format + date + ' ' + hours + ':' + minutes;
        return (
          year +
          format +
          (month < 10 ? '0' + month : month) +
          format +
          (date < 10 ? '0' + date : date)
        )
      }
      return (
        year +
        (month < 10 ? '0' + month : month) +
        (date < 10 ? '0' + date : date)
      )
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
