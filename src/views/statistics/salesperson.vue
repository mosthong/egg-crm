<template>
  <div class="app-container">
    <!-- 筛选查询 -->
    <div class="header">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="时间范围">
          <el-date-picker v-model="searchForm.date" @change="datetimeChange" value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']" type="datetimerange" :picker-options="pickerOptions" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 列表 -->
    <div class="content">
      <el-row :gutter="10">
        <el-col class="row-content" :xs="24" :sm="24" :lg="24">
          <!-- 销售额 -->
          <el-card class="box-card">
            <div id="salespersonSalesPrice"></div>
          </el-card>
        </el-col>
        <el-col class="row-content" :xs="24" :sm="24" :lg="24">
          <!-- 销量 -->
          <el-card class="box-card">
            <div id="salePersonSalesVolume"></div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { getSalePersonData } from '@/api/statistics'
import { parseTime } from '@/utils/index'
import * as echarts from 'echarts';

export default {
  data() {
    return {
      // 搜索
      timeFrame: '',
      searchForm: {
        roles: '',
        date: '',
        startTime: '',
        endTime: ''
      },
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
    }
  },
  created() {
    // 获取当前时间
    this.searchForm.endTime = parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}')
    this.searchForm.startTime = parseTime(new Date(), '{y}-{m}') + '-01 00:00:00'
    this.searchForm.date = [this.searchForm.startTime, this.searchForm.endTime]
    
  },
  mounted() {
    this.getSalePersonData()
  },
  methods: {
    /**
     * 网络请求
     * ----------------------------------------------------------------
     */
    // 查询销售数据
    getSalePersonData() {
      let that = this
      getSalePersonData(this.searchForm).then((res) => {
        that.getSalespersonSalesPrice(res.data.salesPrice)
        that.getSalePersonSalesVolume(res.data.salesVolume)
      })
    },
    // 头部 - 搜索
    search() {
      this.searchForm.pageNum = 1
      this.getSalePersonData()
    },
    // 搜索 - 时间选择
    datetimeChange(val){
      this.searchForm.startTime = val[0]
      this.searchForm.endTime = val[1]
    },
    //销售额
    getSalespersonSalesPrice(data){
      let chartDom = document.getElementById('salespersonSalesPrice');
      let myChart = echarts.init(chartDom);
      let option;

      option = {
        title: {
          text: '销售额(元)'
        },
        xAxis: {
          type: 'category',
          data: data.xAxis
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '销售额',
            type: 'bar',
            stack: 'Total',
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#83bff6' },
                { offset: 0.5, color: '#188df0' },
                { offset: 1, color: '#188df0' }
              ])
            },
            label: {
              show: true,
              position: 'top'
            },
            data: data.data
          }
        ]
      };

      option && myChart.setOption(option);
    },
    //销量
    getSalePersonSalesVolume(data){
      let chartDom = document.getElementById('salePersonSalesVolume');
      let myChart = echarts.init(chartDom);
      let option;

      option = {
        title: {
          text: '销量(件)'
        },
        xAxis: {
          type: 'category',
          data: data.xAxis
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '销售额',
            type: 'bar',
            stack: 'Total',
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#83bff6' },
                { offset: 0.5, color: '#188df0' },
                { offset: 1, color: '#188df0' }
              ])
            },
            label: {
              show: true,
              position: 'top'
            },
            data: data.data
          }
        ]
      };

      option && myChart.setOption(option);
    },
  }
}
</script>

<style>
#salespersonSalesPrice{
  width: 100%;
  height: 500px;
}
#salePersonSalesVolume{
  width: 100%;
  height: 500px;
}
.row-content{
  margin-bottom: 20px;
}
</style>
