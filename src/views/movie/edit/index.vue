<!-- 一个上传事例文件 -->
<template>
  <div>
    <el-button @click="upload">上传</el-button>
    <global-uploader />
  </div>
</template>

<script>
import Bus from '../../../js/bus'
import globalUploader from '@/components/FileUpload/index.vue'
export default {
  components: { globalUploader },
  data() {
    return {}
  },
  computed: {},
  mounted() {
    // 文件选择后的回调
    Bus.$on('fileAdded', () => {
      console.log('文件已选择')
    })

    // 文件上传成功的回调
    Bus.$on('fileSuccess', () => {
      console.log('文件上传成功')
    })
  },
  destroyed() {
    Bus.$off('fileAdded')
    Bus.$off('fileSuccess')
  },
  methods: {
    upload() {
      // 打开文件选择框
      alert('aasdadsada')
      Bus.$emit('openUploader', {
        id: '1111' // 传入的参数
      })
    }
  }
}
</script>

<style scoped lang="scss">

</style>
