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
      <div class="more-btn" @click="getOnenews" v-if="isLoadmore">加载更多</div>
      <div class="more-btn" v-else>没有更多了</div>
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
      size: 12,
      lastId: '',
      isLoadmore: true,
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
      const res = await getOnenews({
        size: this.size,
        lastId: this.lastId
      })
      const l = res.data.data.length
      this.isLoadmore = this.size === l
      this.lastId = res.data.data[l - 1]._id
      
      this.onenewsList = [...this.onenewsList, ...res.data.data]
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
    .more-btn {
      width: 100%;
      cursor: pointer;
      flex-shrink: 0;
      text-align: center;
      font-size: 12px;
      color: #666666;
      padding: 20px 0;
    }
    .news-card {
      display: block;
      border: 1px solid #eeeeee;
      border-radius: 8px;
      overflow: hidden;
      // box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
      background-color: #ffffff;
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
        background-color: #cccccc;
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
