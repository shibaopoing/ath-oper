<template>
  <div id="global-uploader-m">
    <!-- 上传 -->
    <uploader
      ref="uploader"
      :auto-start="false"
      class="uploader-app-m"
      @file-added="onFileAdded"
      @file-removed="onFileRemoved"
    >
      <uploader-unsupport />

      <uploader-btn id="global-uploader-btn" ref="uploadBtn" :attrs="attrs">选择文件</uploader-btn>
      <el-button size="medium" type="primary" @click="readyToUpload">提交上传</el-button>
      <uploader-list>
        <div slot-scope="props" class="file-panel">
          <div class="file-title">
            <span style="font-weight:bold">已选文件:{{ fileNum=props.fileList.length }}</span>
            <div class="operate">
              <el-button type="text" title="全部清除" @click="clearAll">
                <svg-icon icon-class="close" />
              </el-button>
            </div>
          </div>
          <ul class="file-list">
            <li v-for="file in props.fileList" :key="file.id">
              <uploader-file ref="files" :class="'file_' + file.id" :file="file" :list="true" />
            </li>
            <div v-if="!props.fileList.length" class="no-file"><i class="iconfont icon-empty-file" /> 暂无待上传文件</div>
          </ul>
        </div>
      </uploader-list>

    </uploader>

  </div>
</template>

<script>
import { ACCEPT_CONFIG } from '../../../js/config'
import Bus from '../../../js/bus'
import SparkMD5 from 'spark-md5'
// 这两个是我自己项目中用的，请忽略
/*
      import { Ticket } from '@/assets/js/utils'
      import api from '@/api'*/
export default {
  components: {},
  data() {
    return {
      fileNum: 0,
      files: [],
      attrs: {
        accept: ACCEPT_CONFIG.getAll()
      },
      panelShow: true // 选择文件后，展示上传panel
    }
  },
  computed: {
    // Uploader实例
    uploader() {
      return this.$refs.uploader.uploader
    }
  },
  watch: {
  },
  mounted() {

  },
  destroyed() {
    Bus.$off('openUploader')
  },
  methods: {
    readyToUpload() {
      const fList = this.createNewFile(this.files)
      Bus.$emit('uploadMyFile', {
        files: fList// 传入的参数
      })
      this.files = []
    },
    clearAll() {
      this.uploader.cancel()
    },
    onFileAdded(file) {
      // this.computeMD5(file)
      this.files.push(file)
    },
    onFileRemoved(file) {
      const num = this.tabIndex(file, this.files)
      this.files.splice(num, 1)
    },
    statusRemove(id) {
      this.$nextTick(() => {
        $(`.myStatus_${id}`).remove()
      })
    },
    error(msg) {
      this.$notify({
        title: '错误',
        message: msg,
        type: 'error',
        duration: 2000
      })
    },
    tabIndex(target, nodeList) {
      for (let i = 0; i < nodeList.length; i++) {
        if (target === nodeList[i]) {
          return i
        }
      }
    },
    createNewFile(fList) {
      const newFile = []
      for (let i = 0; i < fList.length; i++) {
        var aafile = new File([fList[i].file], fList[i].name)
        newFile.push(aafile)
      }
      return newFile
    },
    /**
       * 新增的自定义的状态: 'md5'、'transcoding'、'failed'
       * @param id
       * @param status
       */
    statusSet(id, status) {
      const statusMap = {
        md5: {
          text: '校验MD5',
          bgc: '#fff'
        },
        merging: {
          text: '合并中',
          bgc: '#e2eeff'
        },
        transcoding: {
          text: '转码中',
          bgc: '#e2eeff'
        },
        failed: {
          text: '上传失败',
          bgc: '#e2eeff'
        }
      }

      this.$nextTick(() => {
        $(`<p class="myStatus_${id}"></p>`).appendTo(`.file_${id} .uploader-file-status`).css({
          'position': 'absolute',
          'top': '0',
          'left': '0',
          'right': '0',
          'bottom': '0',
          'zIndex': '1',
          'backgroundColor': statusMap[status].bgc
        }).text(statusMap[status].text)
      })
    },
    /**
       * 计算md5，实现断点续传及秒传
       * @param file
       */
    computeMD5(file) {
      const fileReader = new FileReader()
      const time = new Date().getTime()
      const blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice
      let currentChunk = 0
      const chunkSize = 10 * 1024 * 1000
      const chunks = Math.ceil(file.size / chunkSize)
      const spark = new SparkMD5.ArrayBuffer()
      // 文件状态设为"计算MD5"
      this.statusSet(file.id, 'md5')
      file.pause()

      loadNext()

      fileReader.onload = e => {
        spark.append(e.target.result)

        if (currentChunk < chunks) {
          currentChunk++
          loadNext()
          // 实时展示MD5的计算进度
          this.$nextTick(() => {
            $(`.myStatus_${file.id}`).text('校验MD5 ' + ((currentChunk / chunks) * 100).toFixed(0) + '%')
          })
        } else {
          const md5 = spark.end()
          this.computeMD5Success(md5, file)
          console.log(`MD5计算完毕：${file.name} \nMD5：${md5} \n分片：${chunks} 大小:${file.size} 用时：${new Date().getTime() - time} ms`)
        }
      }

      fileReader.onerror = function() {
        this.error(`文件${file.name}读取出错，请检查该文件`)
        file.cancel()
      }

      function loadNext() {
        const start = currentChunk * chunkSize
        const end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize
        fileReader.readAsArrayBuffer(blobSlice.call(file.file, start, end))
      }
    },
    computeMD5Success(md5, file) {
      // 将自定义参数直接加载uploader实例的opts上
      Object.assign(this.uploader.opts, {
        query: {
          ...this.params
        }
      })
      file.uniqueIdentifier = md5
      file.pause
      this.statusRemove(file.id)
    }
  }

}
</script>

<style scoped lang="scss">
  #global-uploader-m {
    position: fixed;
    width: 80%;
    z-index: 20;
    .uploader-app-m {
      width: 80%;
    }
    .file-panel {
      background-color: #fff;
      border: 1px solid #e2e2e2;
      border-radius: 7px 7px 0 0;
      box-shadow: 0 0 10px rgba(0, 0, 0, .2);
      .file-title {
        display: flex;
        height: 40px;
        line-height: 40px;
        padding: 0 15px;
        border-bottom: 1px solid #ddd;
        .operate {
          flex: 1;
          text-align: right;
        }
      }
      .file-list {
        position: relative;
        height: 600px;
        overflow-x: hidden;
        overflow-y: auto;
        background-color: #fff;

        > li {
          background-color: #fff;
        }
      }
    }

    .no-file {
      position: absolute;
      //transform: translate(-50%, -50%);
      font-size: 16px;
    }

    /deep/.uploader-file-icon {
      &:before {
        content: '' !important;
      }
      &[icon=image] {
        background: url(../../../assets/images/image-icon.png);
      }
      &[icon=video] {
        background: url(../../../assets/images/video-icon.png);
      }
      &[icon=document] {
        background: url(../../../assets/images/text-icon.png);
      }
    }
    /deep/.uploader-file-actions > span {
      margin-right: 6px;
    }
  }
</style>
