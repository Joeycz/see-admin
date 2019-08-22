<template>
  <div class="xxgg-growth-container">
    <h3>小小格哥 {{fromNow()}} 啦🚀🚀🚀（{{dayFromBirth}}天）</h3>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-button style="float: right;" type="primary" @click="gotoEdit">小小格哥又长了，快去更新</el-button>
      </div>
      <div>
        <div id="chart"></div>
        <el-table
          :data="data"
          height="600"
          border
          stripe
          style="width: 100%">
          <el-table-column
            type="index"
            width="50">
          </el-table-column>
          <el-table-column
            prop="date"
            sortable
            label="日期">
          </el-table-column>
          <el-table-column
            prop="weight"
            label="体重(KG)">
          </el-table-column>
          <el-table-column
            prop="height"
            label="身高(CM)">
          </el-table-column>
          <el-table-column
            prop="msg"
            label="对小小格哥说的">
          </el-table-column>
          <el-table-column
            prop="photo"
            label="照片">
            <template slot-scope="scope">
              <div @click="viewPhoto(scope.row.photo)" v-if="scope.row.photo" class="image-square" :style="{backgroundImage: `url(${scope.row.photo})`}"></div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      
    </el-card>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import { getData } from '@/api/xxgg'
import echarts from 'echarts'
import moment from 'moment'
import cloneDeep from 'lodash.clonedeep'

export default {
  name: 'Growth',
  data() {
    return {
      data: [],
      dayFromBirth: 0,
      chartData: [],
      dialogVisible: false,
      dialogImageUrl: ''
    }
  },
  mounted() {
    this.fromNow()
    this.getData()
  },
  methods: {
    getData() {
      getData().then((res) => {
        console.log(res)
        this.data = res.data.data.sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        })
        this.chartData = cloneDeep(this.data).sort((a, b) => {
          return new Date(a.date).getTime() - new Date(b.date).getTime()
        })
        this.drawChart()
      })
    },
    drawChart() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('chart'));
      // 绘制图表
      myChart.setOption({
        // title: {
        //     text: 'ECharts 入门示例'
        // },
        tooltip: {},
        xAxis: {
          data: this.chartData.map((item) => item.date)
        },
        yAxis: {},
        series: [{
          name: '体重(KG)',
          type: 'bar',
          data: this.chartData.map((item) => item.weight)
        }]
      });
    },
    gotoEdit() {
      this.$router.push({ path: '/xxgg/edit', query: {
        w: this.data[0].weight,
        h: this.data[0].height
      }})
    },
    fromNow() {
      const start = moment('20190420')
      const end = moment()
      this.dayFromBirth = end.diff(start, 'days')
      const years = end.diff(start, 'years')
      const startWithoutYear = start.add(years, 'years')
      const months = end.diff(startWithoutYear, 'months')
      const startWithoutMonths = start.add(months, 'months')
      const days = end.diff(startWithoutMonths, 'days')
      return `${years} 岁 ${months} 个月零 ${days} 天`
    },
    viewPhoto (p) {
      this.dialogVisible = true
      this.dialogImageUrl = p
    }
  }
}
</script>

<style lang="scss" scoped>
.xxgg-growth {
  &-container {
    margin: 30px;
    .image-square {
      width: 100px;
      height: 100px;
      border-radius: 4px;
      overflow: hidden;
      background-repeat: no-repeat;
      background-size: contain;
      background-position: center;
      cursor: pointer;
    }
  }
}
#chart {
  width: 100%;
  height: 400px;
}
</style>
