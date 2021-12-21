<template>
  <div class="app-container">
    <!-- 筛选查询 -->
    <div class="header">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="时间范围">
          <el-date-picker v-model="searchForm.payTime" type="month" format="yyyy年MM月" value-format="yyyy-MM" :clearable="false"></el-date-picker>
        </el-form-item>
        <el-form-item label="对应销售">
          <el-input v-model="searchForm.salePerson" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="是否开票">
          <el-select v-model="searchForm.isInvoice" placeholder="请选择">
            <el-option label="全部" value=""></el-option>
            <el-option label="已开票" :value="1"></el-option>
            <el-option label="未开票" :value="2"></el-option>
          </el-select>
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
          <!-- 销售人员销售记录表 -->
          <el-card class="box-card">
            <div id="salePersonData"></div>
          </el-card>
        </el-col>
        <el-col class="row-content" :xs="24" :sm="24" :lg="24">
          <!-- 销售额 -->
          <el-card class="box-card">
            <div id="salePersonShapeData"></div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { getSaleList } from '@/api/saleOrder'
import { parseTime } from '@/utils/index'
import * as echarts from 'echarts';

export default {
  data() {
    return {
      // 搜索
      timeFrame: '',
      searchForm: {
        salePerson: '',
        isInvoice: '',
        payTime: '',
        pageNum: 1,
        pageSize: 10000
      },
      // 列表
      total: 0,
      list: [],
      listLoading: true,
      salePersonData: [],
    }
  },
  created() {
    // 获取当前时间
    this.searchForm.payTime = parseTime(new Date(), '{y}-{m}')
    this.getList()
  },
  methods: {
    /**
     * 网络请求
     * ----------------------------------------------------------------
     */
    getList() {
      this.listLoading = true
      getSaleList(this.searchForm).then((res) => {
        this.list = res.data.rows.map(x => {
          x.transactionPrice = (x.transactionPrice / 100).toFixed(2)
          x.transactionPriceForeign = (x.transactionPriceForeign / 100).toFixed(2)
          // x.collectionTime = parseTime(new Date(x.collectionTime), '{y}-{m}-{d}')
          return x
        })
        this.total = res.data.count
        this.listLoading = false

        let PersonData = []
        // 1.循环找出人； 2.找出销售产品（二次循环计算出现次数）;
        this.list.map(x => {
          let correspondingSalesIndex = PersonData.findIndex(e => e.name == x.salePerson)

          if(correspondingSalesIndex != -1){ //存在，则修改数据，添加data
            PersonData[correspondingSalesIndex].productArr.push(x.productName) //商品销售名称统计
            PersonData[correspondingSalesIndex].transactionPrice = (PersonData[correspondingSalesIndex].transactionPrice * 100 + x.transactionPrice * 100) / 100 //销售额
          }else{  //没有这条数据则push
            let item = {
              name: x.salePerson ? x.salePerson : '未知',
              productArr: [x.productName],
              salePrice: x.transactionPrice
            }
            PersonData.push(item)
          }

        })
        this.salePersonData = PersonData
        // console.log('合并数据', PersonData);

        this.getSalesperson()
        this.salePersonShapeData()
      })
    },
    // 头部 - 搜索
    search() {
      this.searchForm.pageNum = 1
      this.getList()
    },
    //销售人员销售记录表
    getSalesperson(){
      var SaleChart = echarts.init(document.getElementById('salePersonData'));

      let chartxAxis = [] //销售员
      let chartSeriesSaleNum = [] //销售量
      let chartSeriesSaleSell = [] //销售额
      this.salePersonData.map(x => {
        chartxAxis.push(x.name)
        chartSeriesSaleNum.push(x.productArr.length)
        chartSeriesSaleSell.push(x.salePrice)
      })

      // 绘制图表
      SaleChart.setOption({
        title: {
          text: '销量'
        },
        tooltip: {},
        xAxis: {
          data: chartxAxis
        },
        yAxis: {},
        series: [
          {
            name: '销量(件)',
            type: 'bar',
            label: {
              show: true,
              position: 'top',
              color: '#ff4400',
              fontSize: 14
            },
            data: chartSeriesSaleNum
          }
        ]
      });
    },
    //销售额
    salePersonShapeData(){
      var salePersonShapeData = echarts.init(document.getElementById('salePersonShapeData'));
      let chartDataTitle = []
      let chartData = this.salePersonData.map(x => {
        let item = { value: x.salePrice, name: x.name }
        chartDataTitle.push(x.name)
        return item
      })
      
      //数组排序 前三
      var compare = function (obj1, obj2) {
          var val1 = obj1.value;
          var val2 = obj2.value;
          if (val1 < val2) {
              return 1;
          } else if (val1 > val2) {
              return -1;
          } else {
              return 0;
          }            
      } 
      let chartDataThree = chartData.sort(compare).slice(0,3)
      // 绘制图表
      salePersonShapeData.setOption({
        title: {
          text: '销售额'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          data: chartDataTitle
        },
        series: [
          {
            name: '销售额/元(前三名)',
            type: 'pie',
            selectedMode: 'single',
            radius: [0, '30%'],
            label: {
              position: 'inner',
              fontSize: 14
            },
            labelLine: {
              show: false
            },
            data: chartDataThree
          },
          {
            name: '销售额(元)',
            type: 'pie',
            radius: ['45%', '60%'],
            labelLine: {
              length: 30
            },
            label: {
              formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
              backgroundColor: '#F6F8FC',
              borderColor: '#8C8D8E',
              borderWidth: 1,
              borderRadius: 4,
              rich: {
                a: {
                  color: '#6E7079',
                  lineHeight: 22,
                  align: 'center'
                },
                hr: {
                  borderColor: '#8C8D8E',
                  width: '100%',
                  borderWidth: 1,
                  height: 0
                },
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
            data: chartData
          }
        ]
      })
    },

  }
}
</script>

<style>
#salePersonData{
  width: 100%;
  height: 500px;
}
#salePersonShapeData{
  width: 100%;
  height: 500px;
}
.row-content{
  margin-bottom: 20px;
}
</style>
