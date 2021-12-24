<template>
  <div class="app-container visualization" :style="{ background: 'url(' + require('@/assets/bg5.png') + ') no-repeat center center', backgroundSize: 'cover' }">
    <div class="header">
      <h1>订单大数据</h1>
      <svg width="1594" height="100">
        <polyline fill="transparent" stroke-width="3" points="0,20 286.92,20 318.8,40 398.5,40 430.38000000000005,60 1147.68,60 1195.5,40 1275.2,40 1307.08,20 1594,20" stroke="#00CED1">
          <animate attributeName="stroke-dasharray" attributeType="XML" from="0, 807.6382739015977, 0, 807.6382739015977" to="0, 0, 1615.2765478031954, 0" dur="3s" begin="0s" calcMode="spline" keyTimes="0;1" keySplines="0.4,1,0.49,0.98" repeatCount="indefinite"></animate>
        </polyline>
        <polyline fill="transparent" stroke-width="2" points="478.2,80 1115.8,80" stroke="#FAD400">
          <animate attributeName="stroke-dasharray" attributeType="XML" from="0, 318.79999999999995, 0, 318.79999999999995" to="0, 0, 637.5999999999999, 0" dur="3s" begin="0s" calcMode="spline" keyTimes="0;1" keySplines=".4,1,.49,.98" repeatCount="indefinite"></animate>
        </polyline>
      </svg>
    </div>
    <!-- 列表 -->
    <div class="content">
      <el-row :gutter="20">
        <!-- 左 -->
        <el-col class="row-content" :xs="24" :sm="7" :lg="7">
          <!-- 数量统计 -->
          <div class="block" :style="{ borderImageSource: 'url(' + require('@/assets/border1.png') + ')' }">
            <el-card class="box-card">
              <div class="row-left-1-text">
                <div class="t-i">
                  <h1>{{forTimeTotal.lastWeek.count}}</h1>
                  <p>上周订单</p>
                </div>
                <div class="t-i">
                  <h1>{{forTimeTotal.lastMonth.count}}</h1>
                  <p>上月订单</p>
                </div>
                <div class="t-i">
                  <h1>{{forTimeTotal.currentQuarter.count}}</h1>
                  <p>本季订单</p>
                </div>
                <div class="t-i">
                  <h1>{{forTimeTotal.currentMonth.count}}</h1>
                  <p>本月订单</p>
                </div>
              </div>
              <div class="row-left-slider">
                <el-progress :percentage="progressValue" :show-text="false" :stroke-width="2"></el-progress>
              </div>
              <div id="row-left-1"></div>
            </el-card>
          </div>
        </el-col>
        <!-- 中央大屏 -->
        <el-col class="row-content" :xs="24" :sm="10" :lg="10">
          <!-- 世界地图 -->
          <el-card class="box-card box-card-center" :style="{ border: 'none' }">
            <div id="important-content"></div>
          </el-card>
        </el-col>
        <!-- 右 -->
        <el-col class="row-content" :xs="24" :sm="7" :lg="7">
          <!-- 销量 -->
          <div class="row-content-r">
            <div class="block" :style="{ borderImageSource: 'url(' + require('@/assets/border1.png') + ')' }">
              <el-card class="box-card box-card-r">
                  <div id="row-right-1"></div>
              </el-card>
            </div>
            <div class="block box-card-r2" :style="{ borderImageSource: 'url(' + require('@/assets/border1.png') + ')' }">
              <el-card class="box-card box-card-r" :style="{ borderImageSource: 'url(' + require('@/assets/border1.png') + ')' }">
                  <div id="row-right-2"></div>
              </el-card>
            </div>
          </div>
        </el-col>
        <!-- 下 -->
        <el-col class="row-content row-content-bottom" :xs="24" :sm="24" :lg="24">
          <!-- 销售额 -->
          <div class="block" :style="{ borderImageSource: 'url(' + require('@/assets/border1.png') + ')' }">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <h3 style="margin-bottom: 0px;">实时订单数据(TOP10)</h3>
              </div>
              <div class="box-body-c">
                <el-table :data="saleList" style="width: 100%" row-class-name="el-table-row-tr">
                  <el-table-column prop="createdAt" label="日期" width="230" align="center"></el-table-column>
                  <el-table-column prop="productName" label="产品" align="center"></el-table-column>
                  <el-table-column prop="transactionPrice" label="价格(元)" width="180" align="center"></el-table-column>
                  <el-table-column prop="salePerson" label="销售" width="180" align="center"></el-table-column>
                </el-table>
              </div>
            </el-card>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { getSalePersonData, getSalesForProducts, getSalesForTimeSlot } from '@/api/statistics'

import { parseTime } from '@/utils/index'
import * as echarts from 'echarts';
import { world } from  "@/utils/world_new.js";

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
      progressValue: 10,
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }],
      saleList: [],
      forTimeTotal: {
        currentQuarter: {},
        currentWeek: {},
        currentYear: {},
        lastMonth: {},
        lastWeek: {},
        currentMonth: {}
      }
    }
  },
  created() {
    // 获取当前时间
    this.searchForm.endTime = parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}')
    this.searchForm.startTime = parseTime(new Date(), '{y}-{m}') + '-01 00:00:00'
    this.searchForm.date = [this.searchForm.startTime, this.searchForm.endTime]
    setInterval(() => {
      if(this.progressValue === 100){
        this.progressValue = 0
      }else{
        this.progressValue += 1
      }
      
    }, 100)
  },
  mounted() {
    this.getSalePersonData()
    this.getSalesForProducts()
    this.getSalesForTimeSlot()
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
        that.getLargeScreen()
      })
    },
    // 查询产品销售数据
    getSalesForProducts() {
      let that = this
      getSalesForProducts(this.searchForm).then((res) => {
        that.getDataRight1(res.data.salesTotal)
        that.getDataRight2(res.data.salesNum)
      })
    },
    // 查询时间段销量统计
    getSalesForTimeSlot(){
      let that = this
      getSalesForTimeSlot().then(res => {
        that.forTimeTotal = res.data
        that.saleList = res.data.saleList.rows
      })
    },

    // 中央大屏
    getLargeScreen(){
      let chartDom = document.getElementById('important-content');
      var myChart = echarts.init(chartDom);

      var geoCoordMap = {
				北京: [116.28, 39.54],
				杭州: [120.10, 30.15],
				南宁: [108.479, 23.1152],
				广州: [113.5107, 23.2196],
				重庆: [107.7539, 30.1904],
				上海: [121.4648, 31.2891],
				尼日利亚: [-4.388361, 11.186148],
				洛杉矶: [-118.24311, 34.052713],
				香港: [114.195466, 22.282751],
				芝加哥: [-87.801833, 41.870975],
				加纳库马西: [-4.62829, 7.72415],
				曼彻斯特: [-1.657222, 51.886863],
				汉堡: [10.01959, 54.38474],
				阿拉木图: [45.326912, 41.101891],
				伊尔库茨克: [89.116876, 67.757906],
				巴西: [-48.678945, -10.493623],
				埃及: [31.815593, 31.418032],
				巴塞罗纳: [2.175129, 41.385064],
				柬埔寨: [104.88659, 11.545469],
				米兰: [9.189948, 45.46623],
				蒙得维的亚: [-56.162231, -34.901113],
				莫桑比克: [32.608571, -25.893473],
				阿尔及尔: [3.054275, 36.753027],
				阿联酋迪拜: [55.269441, 25.204514],
				布达佩斯: [17.108519, 48.179162],
				悉尼: [150.993137, -33.675509],
				加州: [-121.910642, 41.38028],
				墨尔本: [144.999416, -37.781726],
				墨西哥: [-99.094092, 19.365711],
				温哥华: [-123.023921, 49.311753]
			};
			var BJData = [
				[{
					name: "北京",
					value: 12580
				}],
				[{
					name: "重庆",
					value: 10000000
				}],
				[{
					name: "上海",
					value: 9100
				}],
				[{
					name: "尼日利亚",
					value: 9100
				}],
				[{
					name: "洛杉矶",
					value: 2370
				}],
				[{
					name: "香港",
					value: 3130
				}],
				[{
					name: "芝加哥",
					value: 2350
				}],
				[{
					name: "加纳库马西",
					value: 5120
				}],
				[{
					name: "曼彻斯特",
					value: 3110
				}],
				[{
					name: "汉堡",
					value: 6280
				}],
				[{
					name: "阿拉木图",
					value: 7255
				}],
				[{
					name: "伊尔库茨克",
					value: 8125
				}],
				[{
					name: "巴西",
					value: 3590
				}],
				[{
					name: "埃及",
					value: 3590
				}],
				[{
					name: "巴塞罗纳",
					value: 3590
				}],
				[{
					name: "柬埔寨",
					value: 3590
				}],
				[{
					name: "米兰",
					value: 3590
				}],
				[{
					name: "蒙得维的亚",
					value: 3590
				}],
				[{
					name: "莫桑比克",
					value: 3590
				}],
				[{
					name: "阿尔及尔",
					value: 31590
				}],
				[{
					name: "阿联酋迪拜",
					value: 13590
				}],
				[{
					name: "布达佩斯",
					value: 23590
				}],
				[{
					name: "悉尼",
					value: 3590
				}],
				[{
					name: "加州",
					value: 3590
				}],
				[{
					name: "墨尔本",
					value: 3590
				}],
				[{
					name: "墨西哥",
					value: 3590
				}],
				[{
					name: "温哥华",
					value: 3590
				}]
			];

			var series = [];
			[
				[, BJData]
			].forEach(function(item, i) {
				series.push({
					type: "effectScatter",
					coordinateSystem: "geo",
					zlevel: 2,
					rippleEffect: {
						//涟漪特效
						period: 4, //动画时间，值越小速度越快
						brushType: "stroke", //波纹绘制方式 stroke, fill
						scale: 4
						//波纹圆环最大限制，值越大波纹越大
					},
					label: {
						normal: {
							show: true,
							position: "right", //显示位置
							offset: [5, 0], //偏移设置
							formatter: "{b}" //圆环显示文字
						},
						emphasis: {
							show: true
						}
					},
					symbol: "circle",
					symbolSize: function(val) {
						var level = 0;
						var state = Math.floor(val[2] / 5000);
						switch (state) {
							case 0:
								level = 0;
								break;
							case 1:
								level = 1;
								break;
							case 2:
								level = 2;
								break;
							case 3:
								level = 3;
								break;
							case 4:
								level = 4;
								break;
							case 5:
								level = 5;
								break;
							case 6:
								level = 6;
								break;
							case 7:
								level = 7;
								break;
							case 8:
								level = 8;
								break;
							case 9:
								level = 9;
								break;
							default:
								level = 10;
						}
						return 5 + level; //圆环大小
					},
					data: item[1].map(function(dataItem) {
						return {
							name: dataItem[0].name /*+"\n"+dataItem[0].value*/ ,
							value: geoCoordMap[dataItem[0].name]
								.concat([dataItem[0].value])
						};
					})
				});
			});


      var option;
      option = {
          //悬浮提示
          tooltip: {
            trigger: "item",
            backgroundColor: "#1540a1",
            borderColor: "#FFFFCC",
            showDelay: 0,
            hideDelay: 0,
            transitionDuration: 0,
            formatter: function(params, ticket, callback) {
              //根据业务自己拓展要显示的内容
              var res = "";
              var name = params.name;
              var value = params.value[params.seriesIndex + 1];
              res = "<span style='color:#fff;'>" + name.toString().split(' ')[0] +
                "</span><br/>爬虫：" + name.toString().split(' ')[1];
              return res;
            }
          },
          visualMap: {
            //图例值控制
            min: 0,
            max: 10000,
            text: ['High', 'Low'],
            show: false,
            calculable: true,
            //color: ["#0bc7f3"],
            color: ['orangered', 'yellow', 'lightskyblue']
          },
          geo: {
            map: "world",
            label: {
              emphasis: {
                show: false
              }
            },
            roam: true, //是否允许缩放
            layoutCenter: ["50%", "50%"], //地图位置
            layoutSize: "100%",
            itemStyle: {
              normal: {
                color: ["#04284e"], //地图背景色
                borderColor: "#5bc1c9" //省市边界线
              },
              emphasis: {
                color: "#132937" //悬浮背景
              }
            }
          },
          series: series
      };

      option && myChart.setOption(option);
    },
    // 左1 - 销售额
    getSalespersonSalesPrice(data){
      let chartDom = document.getElementById('row-left-1');
      let myChart = echarts.init(chartDom);
      let option;

      option = {
        title: {
          text: '销售额(元)',
          textStyle: {
            color: 'rgb(126, 170, 224)'
          }
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
        textStyle: {
          color: 'rgb(126, 170, 224)'
        },
        series: [
          {
            name: '销售额',
            type: 'bar',
            stack: 'Total',
            barWidth: 18,
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
              color: '#fff'
            },
            labelLine: {
              show: false,
            },
            data: data.data
          }
        ]
      };

      option && myChart.setOption(option);
    },
    //右1
    getDataRight1(data){
      let chartDom = document.getElementById('row-right-1');
      let myChart = echarts.init(chartDom);
      let option;

      let op_data = data.xAxis.map((x, i) => {
        return { value: data.data[i], name: x }
      })

      option = {
        title: {
          text: '热销商品(TOP10)',
          textStyle: {
            color: 'rgb(126, 170, 224)'
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
              color: '#fff',
              formatter: '{b|{b}：}{c}  {per|{d}%}  ',
              rich: {
                b: {
                  color: 'rgb(126, 170, 224)',
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
      };

      option && myChart.setOption(option);
    },
    //右2
    getDataRight2(data){
      let chartDom = document.getElementById('row-right-2');
      let myChart = echarts.init(chartDom);
      let option;

      option = {
        title: {
          // text: '区域客户',
          text: '销量(件)',
          textStyle: {
            color: 'rgb(126, 170, 224)'
          }
        },
        textStyle: {
          color: 'rgb(126, 170, 224)'
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
            barWidth: 18,
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
              color: '#fff'
            },
            labelLine: {
              show: false,
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

<style lang="scss" scoped>
::v-deep .navbar{
  display: none;
}
.visualization{
  width: 100%;
  height: calc(140vh);
  .header{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-bottom: -50px;
    h1{
      color: rgb(30, 144, 255);
      font-size: 60px;
      padding-top: 10px;
      margin: 0;
    }
    svg{
      margin-top: -30px;
      transform:scaleX(0.65);
    }
  }
  .block{
    border-image-slice: 10 16 15 10 fill;
    border-width: 10px 16px 15px 10px;
    border-style: solid;
    box-sizing: border-box;
  }
  .box-card{
    background: rgba(180, 181, 198, 0.1);
    border: none;
  }
  .box-card-center{
    background: none;
  }
  #important-content{
    width: 100%;
    height: 60vh;
  }
  .row-left-1-text{
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    height: 20vh;
  }
  .row-left-1-text .t-i{
    width: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: rgb(199, 205, 79);
  }
  .row-left-1-text .t-i p{
    margin: 0;
    color: #999;
  }
  .row-left-1-text .t-i h1{
    margin: 10px;
    font-size: 58px;
  }
  #row-left-1{
    width: 100%;
    height: 33vh;
  }
  .row-left-slider{
    height: 7vh;
    display: flex;
    align-items: center;
    .el-progress{
      flex: 1;
    }
  }

  #row-right-1, #row-right-2{
    width: 100%;
    height: calc(30vh - 40px);
  }
  .box-card-r2{
    margin-top: 20px;
  }

}

.row-content-bottom{
  margin-top: 20px;
  .el-table, .el-table__expanded-cell{
    background: none;
  }
}
::v-deep .row-content-bottom .el-card__header{
  border-bottom: none;
}
.row-content-bottom h3{
  color: rgb(126, 170, 224);
}
::v-deep .el-table-row-tr{
  background: none;
  color: #fff;
}
::v-deep .el-table td.el-table__cell{
  border-bottom: none;
}
::v-deep .el-table--enable-row-hover .el-table__body tr:hover>td.el-table__cell{
  background: #2cdbcd;
}
::v-deep .el-table tr{
  background: none;
}
::v-deep .el-table th.el-table__cell{
  background: none;
  color: #fff;
  border: 1px solid rgb(51, 65, 107);
  font-size: 16px;
}
::v-deep .el-table::before{
  height: 0;
}
</style>
