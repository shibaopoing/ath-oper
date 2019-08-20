<!-- 一个上传事例文件 -->
<template>
  <div>
    <el-upload
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
    >
      <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
      <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>
  </div>
</template>

<script>
import Bus from '../../../js/bus'
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
    },
    submitUpload() {
      // 打开文件选择框
      Bus.$emit('uploadMyFile', {
        file: this.files // 传入的参数
      })
    },
    handleRemove(file, fileList) {
      const num = this.tabIndex(file, this.files)
      alert(num)
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
    }
  }
}
</script>

<style scoped lang="scss">

</style>
