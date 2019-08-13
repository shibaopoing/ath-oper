<template>
  <div class="avatar-container" trigger="click">
    <div class="avatar-wrapper">
      <el-icon :src=url class="user-avatar upload-img"/>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      url: '../../assets/images/file-upload.png'
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
  .avatar-container {
    height: 50px;
    overflow: hidden;
    position: relative;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0,21,41,.08);
    margin-right: 30px;
    height: 100%;
    line-height: 50px;
    &:focus {
      outline: none;
    }
    .avatar-wrapper {
      margin-top: 5px;
      position: relative;
      .user-avatar {
        cursor: pointer;
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }
      .upload-img {
        background-image: url('');
      }
    }
  }
</style>
