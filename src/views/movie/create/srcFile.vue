<template>
  <div>
    <el-input
      v-model="srcPath"
      placeholder="请输入本地文件路径"
    >
      <template slot="prepend">视频文件路径</template>
      <el-button slot="append" icon="el-icon-upload2" type="primary" />
    </el-input>
    <div class="div-center-v">
      <el-progress type="circle" :percentage="0" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'SrcFile',
  data() {
    return {
      srcPath: ''
    }
  }
}
</script>

<style lang="scss" scoped>
  .div-center {
    //background-color: #97a8be;
    margin: auto;
    height: 50%;
    //border: 3px solid green;
    padding: 20px;
    margin-top: 160px;
  }
  .div-center-v {
    margin: auto;
    height: 40%;
    //border: 3px solid green;
    padding: 20px;
    margin-top: 60px;
  }
</style>
