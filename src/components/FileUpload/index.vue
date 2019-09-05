<template>
  <el-dialog
    v-dialogDrag
    :visible.sync="dialogVisible"
    :title="'文件列表:'+this.fileNum"
  >
    <div id="global-uploader">
      <!-- 上传 -->
      <uploader
        ref="uploader"
        :options="options"
        :auto-start="false"
        class="uploader-app"
        @file-added="onFileAdded"
        @file-success="onFileSuccess"
        @file-progress="onFileProgress"
        @file-error="onFileError"
        @file-complete="fileComplete"
      >
        <uploader-unsupport />

        <uploader-btn id="global-uploader-btn" ref="uploadBtn" :attrs="attrs">选择文件</uploader-btn>

        <uploader-list v-show="true">
          <div slot-scope="props" class="file-panel" :class="{'collapse': collapse}">
            <div class="file-title">
              <span style="display:none">文件列表:{{ fileNum=props.fileList.length }}</span>
              <!--              <div class="operate">
                <el-button type="text" :title="collapse ? '展开':'折叠' " @click="fileListShow">
                  <svg-icon :icon-class="collapse ? 'zhankai': 'zhedie' " />
                </el-button>
                <el-button type="text" title="关闭" @click="close">
                  <svg-icon icon-class="close" />
                </el-button>
              </div>-->
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
  </el-dialog>

</template>

<script>
/**
 *   全局上传插件
 *   调用方法：Bus.$emit('openUploader', {}) 打开文件选择框，参数为需要传递的额外参数
 *   监听函数：Bus.$on('fileAdded', fn); 文件选择后的回调
 *            Bus.$on('fileSuccess', fn); 文件上传成功的回调
 */

import { ACCEPT_CONFIG } from '../../js/config'
import Bus from '../../js/bus'

// 这两个是我自己项目中用的，请忽略
/*
import { Ticket } from '@/assets/js/utils'
import api from '@/api'*/
import axios from 'axios'
import qs from 'qs'
export default {
  components: {},
  data() {
    return {
      dialogVisible: false,
      fileNum: 0,
      options: {
        target: '/dev-api/uploader/chunk',
        chunkSize: '2048000',
        maxChunkRetries: 3,
        testChunks: true, // 是否开启服务器分片校验
        // 服务器分片校验函数，秒传及断点续传基础
        checkChunkUploadedByResponse: function(chunk, message) {
          const objMessage = JSON.parse(message)
          if (objMessage.skipUpload) {
            return true
          }

          return (objMessage.uploaded || []).indexOf(chunk.offset + 1) >= 0
        },
        headers: {
          // Authorization: Ticket.get() && 'Bearer ' + Ticket.get().access_token
        },
        query() {}
      },
      attrs: {
        accept: ACCEPT_CONFIG.getAll()
      },
      panelShow: false, // 选择文件后，展示上传panel
      collapse: false
    }
  },
  computed: {
    // Uploader实例
    uploader() {
      return this.$refs.uploader.uploader
    }
  },
  watch: {
    fileNum: function(val, oldVal) {
      Bus.$emit('fileNumChange', {
        iCount: val // 传入的参数
      })
    }
  },
  mounted() {
    Bus.$on('openUploader', query => {
      this.params = query || {}

      if (this.$refs.uploadBtn) {
        $('#global-uploader-btn').click()
      }
    })
    Bus.$on('showUploadBoard', param => {
      this.params = param || {}
      if (this.dialogVisible) {
        this.dialogVisible = false
      } else {
        this.dialogVisible = true
      }
    })
    Bus.$on('uploadMyFile', param => {
      this.params = param || {}
      for (let i = 0; i < this.params.files.length; i++) {
        const file = this.params.files[i]
        const aFile = new File([file.file], file.name)
        this.$refs.uploader.uploader.addFile(aFile)
      }
    })
  },
  destroyed() {
    Bus.$off('openUploader')
  },
  methods: {
    onFileAdded(file) {
      this.dialogVisible = true
      Bus.$emit('fileAdded')
    },
    onFileProgress(rootFile, file, chunk) {
      console.log(`上传中 ${file.name}，chunk：${chunk.startByte / 1024 / 1024} ~ ${chunk.endByte / 1024 / 1024}`)
    },

    onFileSuccess(rootFile, file, response, chunk) {
      const res = JSON.parse(response)

      // 服务器自定义的错误（即虽返回200，但是是错误的情况），这种错误是Uploader无法拦截的
      if (!res.result) {
        this.$message({ message: res.message, type: 'error' })
        // 文件状态设为“失败”
        this.statusSet(file.id, 'failed')
        return
      }
      // 如果服务端返回需要合并
      if (res.needMerge) {
        // 文件状态设为“合并中”
        this.statusSet(file.id, 'merging')
        const fileName = rootFile.file.name
        const uniqueIdentifier = rootFile.uniqueIdentifier
        axios.post('/dev-api/uploader/mergeFile', qs.stringify({
          filename: fileName,
          identifier: uniqueIdentifier,
          totalSize: file.size,
          type: file.type
        })).then(res => {
          // 文件合并成功
          Bus.$emit('fileSuccess')
          this.statusRemove(file.id)
        }).catch(e => {})
        /*
        api.mergeSimpleUpload({
          tempName: res.tempName,
          fileName: file.name,
          ...this.params
        }).then(res => {
          // 文件合并成功
          Bus.$emit('fileSuccess')

          this.statusRemove(file.id)
        }).catch(e => {})*/

        // 不需要合并
      } else {
        Bus.$emit('fileSuccess')
        console.log('上传成功')
      }
    },
    fileComplete() {
      /*      console.log('file complete', arguments)
      const file = arguments[0].file

      axios.post('/dev-api/uploader/mergeFile', qs.stringify({
        filename: file.name,
        identifier: arguments[0].uniqueIdentifier,
        totalSize: file.size,
        type: file.type
      })).then(function(response) {
        console.log(response)
      }).catch(function(error) {
        console.log(error)
      })*/
    },
    onFileError(rootFile, file, response, chunk) {
      this.$message({
        message: response,
        type: 'error'
      })
    },
    fileListShow() {
      const $list = $('#global-uploader .file-list')

      if ($list.is(':visible')) {
        $list.slideUp()
        this.collapse = true
      } else {
        $list.slideDown()
        this.collapse = false
      }
    },
    close() {
      this.dialogVisible = false
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
    }
  }
}
</script>

<style scoped lang="scss">
  #global-uploader {
     z-index: 20;
    .uploader-app {
      //width: 1000px;
    }

    .file-panel {
      background-color: #fff;
      border: 1px solid #e2e2e2;
      border-radius: 7px 7px 0 0;
      //box-shadow: 0 0 10px rgba(0, 0, 0, .2);
      .file-title {
        //display: flex;
        //height: 40px;
        //line-height: 40px;
        //padding: 0 15px;
        //border-bottom: 1px solid #ddd;

/*        .operate {
          flex: 1;
          text-align: right;
        }*/
      }

      .file-list {
        position: relative;
        height: 400px;
        overflow-x: hidden;
        overflow-y: auto;
        background-color: #fff;
        > li {
          background-color: #fff;
        }
      }

      &.collapse {
        .file-title {
          background-color: #E7ECF2;
        }
      }
    }

    .no-file {
      position: absolute;
      top: 50%;
      left: 50%;
      font-size: 16px;
    }

    /deep/.uploader-file-icon {
      &:before {
        content: '' !important;
      }

      &[icon=image] {
        background: url(../../assets/images/image-icon.png);
      }
      &[icon=video] {
        background: url(../../assets/images/video-icon.png);
      }
      &[icon=document] {
        background: url(../../assets/images/text-icon.png);
      }
    }

    /deep/.uploader-file-actions > span {
      //margin-right: 6px;
    }
  }

  /* 隐藏上传按钮 */
  #global-uploader-btn {
    position: absolute;
    clip: rect(0, 0, 0, 0);
  }
</style>
