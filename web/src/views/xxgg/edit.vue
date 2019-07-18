<template>
  <div class="xxgg-growth-edit-container">
    <h3>今天是 {{today}}</h3>
    <el-card class="box-card">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="体重(KG)">
          <el-input-number :min="3.24" :step="0.01" v-model="form.weight"></el-input-number>
        </el-form-item>
        <el-form-item label="身高(CM)">
          <el-input-number :min="50" v-model="form.height"></el-input-number>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">长大啦</el-button>
          <el-button @click="goBack">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { updateData } from '@/api/xxgg'
import moment from 'moment'

export default {
  name: 'GrowthEdit',
  data() {
    return {
      form: {
        weight: '',
        height: ''
      },
      today: ''
    }
  },
  mounted() {
    // this.getData()
    const Today = new Date()
    this.today = Today.getFullYear() + " 年 " + (Today.getMonth()+1) + " 月 " + Today.getDate() + " 日"
    this.form.weight = this.$route.query.w
    this.form.height = this.$route.query.h
  },
  methods: {
    onSubmit() {
      console.log('submit!');
      updateData(this.form).then((res) => {
        console.log(res)
        if (res.code === 100000) {
          this.$message({
            message: '哈哈，录入成功啦，小小格哥又长了！',
            type: 'success'
          });
          this.$router.push('/xxgg/growth');
        } else {
          this.$message.error('哈哈，录入失败，再试一下，还是不行的话就去找爸爸！');
        }
      }).catch((err) => {
        this.$message.error('哈哈，录入失败，再试一下，还是不行的话就去找爸爸！');
      })
    },
    goBack() {
      this.$router.push('/xxgg/growth')
    }
  }
}
</script>

<style lang="scss" scoped>
.xxgg-growth-edit {
  &-container {
    margin: 30px;
  }
}
</style>
