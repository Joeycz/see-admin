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
        <el-form-item label="日期">
          <el-date-picker
            v-model="form.date"
            type="datetime"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="想对小小格哥说">
          <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 6}"
            placeholder="对小小格哥说点什么呢。。。"
            v-model="form.msg">
          </el-input>
        </el-form-item>
        <el-form-item label="拍一张">
          <el-upload
            class="upload-demo"
            :headers="uploadImage.headers"
            drag
            :show-file-list="false"
            :on-progress="progressUpload"
            :on-success="successUpload"
            action="https://api.daqiongzi.com/common/github/upload">
            <i class="el-icon-upload"></i>
            <div v-if="!progress" class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div v-else style="padding: 0 20px;">
              <el-progress :percentage="progress"></el-progress>
            </div>
          </el-upload>
          <div class="photo-box" v-if="form.photo" :style="{backgroundImage: `url(${form.photo})`}"></div>
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
import { getToken } from '@/utils/auth'

export default {
  name: 'GrowthEdit',
  data() {
    return {
      form: {
        weight: '',
        height: '',
        date: null,
        msg: '',
        photo: ''
      },
      today: '',
      uploadImage: {
        headers: {}
      },
      progress: 0
    }
  },
  mounted() {
    // this.getData()
    const Today = new Date()
    this.today = Today.getFullYear() + " 年 " + (Today.getMonth()+1) + " 月 " + Today.getDate() + " 日"
    this.form.weight = this.$route.query.w
    this.form.height = this.$route.query.h
    this.form.date = new Date()
    this.uploadImage = {
      headers: {
        Authorization: getToken()
      }
    }
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
    },
    progressUpload (e) {
      console.log(e)
      this.progress = e.percent
    },
    successUpload (res) {
      console.log(res)
      this.form.photo = res.data.content.download_url
      this.progress = 0
    }
  }
}
</script>

<style lang="scss" scoped>
.xxgg-growth-edit {
  &-container {
    margin: 30px;
    .photo-box {
      width: 200px;
      height: 200px;
      background-repeat: no-repeat;
      background-size: contain;
      background-position: center;
    }
  }
}
</style>
