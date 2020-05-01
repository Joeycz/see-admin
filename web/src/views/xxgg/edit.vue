<template>
  <div class="xxgg-growth-edit-container">
    <div class="header">
      <h4>今天是 {{today}}</h4>
    </div>
    <el-card class="box-card">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="体重(KG)">
          <el-input-number style="width: 100%; max-width: 360px;" :min="3.24" :step="0.1" v-model="form.weight"></el-input-number>
        </el-form-item>
        <el-form-item label="身高(CM)">
          <el-input-number style="width: 100%; max-width: 360px;" :min="50" v-model="form.height"></el-input-number>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker
            v-model="form.date"
            type="datetime"
            style="width: 100%; max-width: 360px;"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="想对小小格哥说">
          <el-input
            type="textarea"
            style="max-width: 360px;"
            :autosize="{ minRows: 4, maxRows: 6}"
            placeholder="对小小格哥说点什么呢。。。"
            v-model="form.msg">
          </el-input>
        </el-form-item>
        <!-- <el-form-item label="拍一张">
          <el-upload
            class="upload-demo"
            :headers="uploadImage.headers"
            drag
            :show-file-list="false"
            :on-progress="progressUpload"
            :on-success="successUpload"
            :on-error="errorUpload"
            action="https://api.daqiongzi.com/common/github/upload">
            <i class="el-icon-upload"></i>
            <div v-if="!progress" class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div v-else style="padding: 0 20px;">
              <el-progress :percentage="progress"></el-progress>
            </div>
          </el-upload>
          <div class="photo-box" v-if="form.photo" :style="{backgroundImage: `url(${form.photo})`}"></div>
        </el-form-item> -->
        <el-form-item label="拍一张">
          <el-upload
            class="upload-demo"
            drag
            :show-file-list="false"
            :on-progress="progressUpload"
            :on-success="successUpload"
            :on-error="errorUpload"
            :http-request="uploadFile"
            v-bind="$attrs"
            action="">
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
import { isXXGG } from '@/utils/index'
import { getUploadToken } from '@/api/common'
import * as qiniu from 'qiniu-js'
import commonConfig from '../../config/common.json'

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
      progress: 0,
      token: '',
      putextra: {
        fname: '',
        params: {},
        mimeType: null
      },
      qiniuConfig: {
        useCdnDomain: true,
        disableStatisticsReport: false,
        retryCount: 6,
        region: qiniu.region.z2
      }
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
    this.getToken()
  },
  methods: {
    async getToken() {
      const res = await getUploadToken()
      this.token = res.token
    },
    uploadFile(option) {
      const fileName = this.changeFileName(option.file.name)
      const observable = qiniu.upload(
        option.file,
        fileName,
        this.token,
        this.putextra,
        this.qiniuConfig
      )
      observable.subscribe({
        next: option.onProgress,
        error: option.onError,
        complete: option.onSuccess
      })
    },
    // 修改原文件名，给文件名添加一个时间戳
    changeFileName(filename) {
      return filename.replace(/.[a-zA-Z0-9]+$/, (match) => {
        return `-${Date.now()}${match}`
      })
    },
    onSubmit() {
      updateData(this.form).then((res) => {
        console.log(res)
        if (res.code === 100000) {
          this.$message({
            message: '哈哈，录入成功啦，小小格哥又长了！',
            type: 'success'
          });
          if (isXXGG()) {
            window.xxgg.close()
          } else {
            this.$router.push('/xxgg/growth');
          }
        } else {
          this.$message.error('哈哈，录入失败，再试一下，还是不行的话就去找爸爸！');
        }
      }).catch((err) => {
        console.error(err)
        this.$message.error('哈哈，录入失败，再试一下，还是不行的话就去找爸爸！');
      })
    },
    goBack() {
      this.$router.push('/xxgg/growth')
    },
    progressUpload (e, file, fileList) {
      this.progress = Math.trunc(e.total.percent)
    },
    successUpload (res) {
      this.form.photo = commonConfig.cdnHost + res.key
      this.progress = 0
      this.$message({
        message: '小小格哥谢谢你又给他添加了一张新图片',
        type: 'success'
      });
    },
    errorUpload (error) {
      console.log(error)
      this.progress = 0
      this.$message.error('好可惜，上传失败了，快去找爸爸来修一下啊！');
    }
  }
}
</script>

<style lang="scss" scoped>
.xxgg-growth-edit {
  &-container {
    .photo-box {
      width: 200px;
      height: 200px;
      background-repeat: no-repeat;
      background-size: contain;
      background-position: center;
    }
  }
}
@media screen and (max-width: 545px) {
  .xxgg-growth-edit {
    &-container {
      margin: 0px;
      .header {
        padding: 0 10px;
        box-sizing: boder-box;
      }
      /deep/ .el-form-item {
        display: flex;
        flex-direction: column;
      }
      /deep/ .el-form-item__content {
        margin-left: 0 !important;
      }
      /deep/ .el-form-item__label {
        width: 100% !important;
        text-align: left;
      }
      .upload-demo {
        /deep/ .el-upload {
          width: 100%;
        }
        /deep/ .el-upload-dragger {
          width: 100%;
        }
      }
    }
  }
}
</style>
