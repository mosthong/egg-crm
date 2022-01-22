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
            <div id="data-column-1"></div>
          </el-card>
        </el-col>
        <el-col class="row-content" :xs="24" :sm="24" :lg="24">
          <!-- 销量 -->
          <el-card class="box-card">
            <div id="data-column-2"></div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { getSalesForProducts } from '@/api/statistics'
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
      }
    }
  },
  created() {
    // 获取当前时间
    this.searchForm.endTime = parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}')
    this.searchForm.startTime = parseTime(new Date(), '{y}-{m}') + '-01 00:00:00'
    this.searchForm.date = [this.searchForm.startTime, this.searchForm.endTime]
    
  },
  mounted() {
    this.getSalesForProducts()
  },
  methods: {
    /**
     * 网络请求
     * ----------------------------------------------------------------
     */
    // 头部 - 搜索
    search() {
      this.searchForm.pageNum = 1
      this.getSalesForProducts()
    },
    // 搜索 - 时间选择
    datetimeChange(val){
      this.searchForm.startTime = val[0]
      this.searchForm.endTime = val[1]
    },
    
    // 查询产品销售数据
    getSalesForProducts() {
      let that = this
      getSalesForProducts(this.searchForm).then((res) => {
        that.getDataRight1(res.data.salesTotal)
        that.getDataRight2(res.data.salesNum)
      })
    },
    // 右1
    getDataRight1(data) {
      let chartDom = document.getElementById('data-column-1')
      let myChart = echarts.init(chartDom)
      let option

      let op_data = data.xAxis.map((x, i) => {
        return { value: data.data[i], name: x }
      })

      option = {
        title: {
          text: '热销商品',
          textStyle: {
            color: 'rgb(0, 0, 0)'
          }
        },
        tooltip: {
          trigger: 'item'
        },
        series: [
          {
            name: '商品',
            type: 'pie',
            radius: ['50%', '70%'],
            label: {
              color: '#333',
              formatter: '{b|{b}：}{c}  {per|{d}%}  ',
              rich: {
                b: {
                  color: '#4C5058',
                  fontSize: 14,
                  fontWeight: 'bold',
                  lineHeight: 33
                },
                per: {
                  color: '#fff',
                  backgroundColor: '#4C5058',
                  padding: [3, 4],
                  borderRadius: 4
                }
              }
            },
            data: op_data
          }
        ]
      }

      option && myChart.setOption(option)
    },
    // 右2
    getDataRight2(data) {
      let chartDom = document.getElementById('data-column-2')
      let myChart = echarts.init(chartDom)
      let option

      option = {
        title: {
          text: '销量(件)',
          textStyle: {
            color: 'rgb(0, 0, 0)'
          }
        },
        textStyle: {
          color: 'rgb(0, 0, 0)'
        },
        xAxis: {
          type: 'category',
          data: data.xAxis
        },
        yAxis: {
          type: 'value',
          splitLine: {
            show: false
          }
        },
        series: [
          {
            name: '销售额',
            type: 'bar',
            stack: 'Total',
            barWidth: 38,
            itemStyle: {
              borderRadius: [9],
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#14c8d4' },
                { offset: 1, color: '#43eec6' }
              ])
            },
            label: {
              show: true,
              position: 'top',
              color: '#000'
            },
            labelLine: {
              show: false
            },
            data: data.data
          }
        ]
      }

      option && myChart.setOption(option)
    }
  }
}
</script>

<style>
#data-column-1{
  width: 100%;
  height: 500px;
}
#data-column-2{
  width: 100%;
  height: 500px;
}
.row-content{
  margin-bottom: 20px;
}
</style>
