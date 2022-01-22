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
        <el-col class="row-content" :xs="12" :sm="12" :lg="12">
          <el-card class="box-card">
            <div class="sale-count">
              <el-image style="width: 100px; height: 100px" :src="require('@/assets/icons/total-icon.png')"></el-image>
              <div class="sale-count__content">
                <div class="sale-count__label">销售总额</div>
                <div class="sale-count__value">
                  {{total}}<span>元</span>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col class="row-content" :xs="12" :sm="12" :lg="12">
          <el-card class="box-card">
            <div class="sale-count">
              <el-image style="width: 100px; height: 100px" :src="require('@/assets/icons/volume-icon.png')"></el-image>
              <div class="sale-count__content">
                <div class="sale-count__label">总销量</div>
                <div class="sale-count__value">
                  {{volume}}<span>件</span>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
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
      total: 0,
      volume: 0,
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
        // 统计数据
        let total = 0
        let volume = 0
        res.data.salesPrice.data.forEach((x, i) => {
          total += parseFloat(x) * 100
          volume += parseInt(res.data.salesVolume.data[i])
        })
        that.total = total / 100
        that.volume = volume

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
    // 数据统计1 - 销售额
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
            barWidth: 28,
            itemStyle: {
              borderRadius: [9],
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#14c8d4' },
                { offset: 1, color: '#43eec6' }
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
    // 数据统计2 - 销量
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
            barWidth: 28,
            itemStyle: {
              borderRadius: [9],
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#009688' },
                { offset: 1, color: '#4caf50' }
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

<style scoped>
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


.sale-count{
  padding: 30px;
  display: flex;
  align-items: center;
}
.sale-count__content{
  margin-left: 18px;
}
.sale-count__label{
  font-size: 18px;
  font-weight: bold;
  color: #019161;
  padding-bottom: 14px;
}
.sale-count__value{
  font-size: 40px;
  font-weight: bold;
  color: #333;
}
.sale-count__value span{
  font-size: 20px;
  font-weight: bold;
  padding-left: 6px;
}
</style>
