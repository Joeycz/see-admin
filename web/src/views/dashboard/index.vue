<template>
  <div class="dashboard-container">
    <div class="section-box">
      <a :href="item.link" class="news-card" v-for="(item, index) in onenewsList" :key="index">
        <div class="header" :style="{backgroundImage: `url(${item.image})`}"></div>
        <div class="footer">
          <div class="title-box">{{item.title}}</div>
          <div class="source-box">
            <small>{{item.source}}</small>
            <small>{{moment(item.created).format('YYYY-MM-DD')}}</small>
          </div>
        </div>
      </a>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getOnenews } from '@/api/media'
import moment from "moment"

export default {
  name: 'Dashboard',
  data () {
    return {
      moment,
      onenewsList: []
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created () {
    this.getOnenews()
  },
  methods: {
    async getOnenews () {
      const res = await getOnenews()
      this.onenewsList = res.data.data
      console.log(this.onenewsList)
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    padding: 20px 12px;
    box-sizing: border-box;
    .section-box {
      display: flex;
      flex-direction: column;
    }
    .news-card {
      display: block;
      border: 1px solid #eeeeee;
      border-radius: 8px;
      overflow: hidden;
      // box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
      transition: 0.3s;
      &:hover {
        box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
      }
      .header {
        width: 100%;
        height: 240px;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
      }
      .footer {
        padding: 20px 12px;
        line-height: 1.4;
        .title-box {
          color: #333333;
        }
        .source-box {
          color: #666666;
          font-size: 14px;
          text-align: right;
          margin-top: 10px;
        }
      }
    }
    .news-card + .news-card {
      margin-top: 10px;
    }
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
@media screen and (min-width: 545px) {
  .dashboard {
    &-container {
      .section-box {
        flex-direction: row;
        flex-wrap: wrap;
        .news-card {
          width: 30%;
          flex-shrink: 0;
          margin-top: 0;
          margin-bottom: 20px;
        }
        .news-card + .news-card {
          margin-left: 5%;
        }
        .news-card:nth-child(3n + 1) {
          margin-left: 0;
        }
      }
    }
  }
}
</style>
