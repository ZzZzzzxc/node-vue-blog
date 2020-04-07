<template>
  <div class="echarts-box">
    <a-card title="七牛云域名流量">
      <div id="flow" ref="flow"></div>
    </a-card>
    <a-card title="七牛云域名带宽">
      <div id="bandwidth" ref="bandwidth"></div>
    </a-card>
  </div>
</template>
<script>
import { qiniuModel } from "../../service/qiniuModel";
const qiniu = new qiniuModel();
export default {
  name: "home",
  components: {},
  props: {},
  data() {
    return {
      loading: true,
      flowData: {
        toolbox: {
          feature: {
            saveAsImage: {} //下载工具
          }
        },
        legend: {
          data: ["国内", "海外"]
        },
        xAxis: {
          type: "category",
          name: "日期",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        },
        yAxis: {
          type: "value",
          name: "byte"
        },
        tooltip: {
          trigger: "axis"
        },
        series: [
          {
            name: "国内",
            data: [],
            type: "line"
          },
          {
            name: "海外",
            data: [],
            type: "line"
          }
        ]
      },
      bandwidthData: {
        toolbox: {
          feature: {
            saveAsImage: {} //下载工具
          }
        },
        legend: {
          data: ["国内", "海外"]
        },
        xAxis: {
          type: "category",
          name: "日期",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        },
        yAxis: {
          type: "value",
          name: "byte"
        },
        tooltip: {
          trigger: "axis"
        },
        series: [
          {
            name: "国内",
            data: [],
            type: "line"
          },
          {
            name: "海外",
            data: [],
            type: "line"
          }
        ]
      },
      flowDays: 10,
      bandWidthDays: 10,
      flow: {},
      bandwidth: {}
    };
  },
  computed: {},
  watch: {
    flow(val) {
      this.flowData.series[0].data = val.fluxChina;
      this.flowData.series[1].data = val.fluxOversea;
      this.renderFlowEcharts();
    },
    bandwidth(val) {
      this.bandwidthData.series[0].data = val.bandwidthChina;
      this.bandwidthData.series[1].data = val.bandwidthOversea;
      this.renderBandwidthEcharts();
    }
  },
  methods: {
    getDays(day) {
      if (day < 5) {
        day = 5;
      }
      if (day > 15) {
        day = 15;
      }
      let now = new Date();
      now.setTime(now.getTime());
      let ago = new Date();
      ago.setTime(ago.getTime() - day * 24 * 60 * 60 * 1000);
      now = this.$moment(now).format("YYYY-MM-DD");
      ago = this.$moment(ago).format("YYYY-MM-DD");
      return { startDate: ago, endDate: now };
    },
    setDays(day) {
      let res = [],
        now = new Date();
      for (let i = 0; i < day; i++) {
        res.unshift(
          this.$moment(now.getTime() - i * 24 * 60 * 60 * 1000).format("MM-DD")
        );
      }
      return res;
    },
    fetchFlowData(day) {
      //fluxChina
      //fluxOversea
      this.loading = true;
      this.flowData.xAxis.data = this.setDays(day);
      qiniu
        .getQiniuDomainFlow(this.getDays(day))
        .then(res => {
          this.flow = res;
        })
        .catch(err => {
          this.$message.error(err);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    fetchBandwidthData(day) {
      //bandwidthChina
      //bandwidthOversea
      this.loading = true;
      this.bandwidthData.xAxis.data = this.setDays(day);
      qiniu
        .getQiniuDomainBandwidth(this.getDays(day))
        .then(res => {
          this.bandwidth = res;
        })
        .catch(err => {
          this.$message.error(err);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    renderFlowEcharts() {
      this.$echarts.init(this.$refs.flow).setOption(this.flowData);
    },
    renderBandwidthEcharts() {
      this.$echarts.init(this.$refs.bandwidth).setOption(this.bandwidthData);
    }
  },
  created() {
    this.fetchFlowData(this.flowDays);
    this.fetchBandwidthData(this.bandWidthDays);
  },
  mounted() {}
};
</script>
<style scoped>
.echarts-box {
  /* display: flex;
  justify-content: space-around; */
}
#flow {
  width: 100%;
  height: 400px;
}
#bandwidth {
  width: 100%;
  height: 400px;
}
</style>
