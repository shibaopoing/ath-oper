<template>
  <div>
    <el-input
      v-model="url"
      placeholder="请输入本地封面图片路径或网址"
    >
      <template slot="prepend">封面</template>
      <el-button slot="append" icon="el-icon-search" type="primary" />
    </el-input>
    <div class="div-center">
      <div class="block">
        <span class="demonstration">预览</span>
        <div>
          <el-image :src="url" fit="cover">
            <div slot="error" class="div-center">
              <i class="el-icon-picture-outline" />
            </div>
            <div slot="placeholder">
              加载中<span class="dot">...</span>
            </div>
          </el-image>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Cover',
  data() {
    return {
      fits: ['fill', 'contain', 'cover', 'none', 'scale-down'],
      url: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg'
    }
  }
}
</script>

<style lang="scss" scoped>
  .div-center {
    //background-color: #97a8be;
    margin: auto;
    width: 50%;
  // border: 3px solid green;
    padding: 20px;
  }
</style>
