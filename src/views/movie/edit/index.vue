!-- 一个上传事例文件 -->
<template>
  <div>
    <el-upload
      id="upload"
      ref="upload"
      class="upload-demo"
      action=""
      multiple
      :limit="3"
      :on-exceed="handleExceed"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :on-change="fileChange"
      :file-list="fileList"
      :auto-upload="false"
      list-type="picture"
    >
      <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
      <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>
  </div>
</template>

<script>
import Bus from '../../../js/bus'
import SparkMD5 from 'spark-md5'
export default {
  data() {
    return {
      files: [],
      fileList: []
    }
  },
  methods: {
    fileChange(file, fileList) {
      this.files.push(file)
      this.computeMD5(file)
    },
    submitUpload() {
      // 打开文件选择框
      var fileDom = $('#upload')
      // 获取到的files为一个File对象数组，如果允许多选的时候，文件为多个
      const files = fileDom.files
      alert(files[0].name)
      Bus.$emit('uploadMyFile', {
        file: files // 传入的参数
      })
    },
    handleRemove(file, fileList) {
      const num = this.tabIndex(file, this.files)
      this.files.splice(num, 1)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    tabIndex(target, nodeList) {
      for (let i = 0; i < nodeList.length; i++) {
        if (target === nodeList[i]) {
          return i
        }
      }
    },
    computeMD5(file) {
      const fileReader = new FileReader()
      const time = new Date().getTime()
      const blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice
      let currentChunk = 0
      const chunkSize = 10 * 1024 * 1000
      const chunks = Math.ceil(file.size / chunkSize)
      const spark = new SparkMD5.ArrayBuffer()
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
        alert('1121212')
        fileReader.readAsArrayBuffer(blobSlice.call(file.file, start, end))
        alert('猜猜猜')
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .div-center {
    //background-color: #97a8be;
    margin: auto;
    //border: 3px solid green;
    padding: 20px;
    margin-top: 160px;
  }
</style>
