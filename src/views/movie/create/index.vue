<template>
  <el-container>
    <el-page-header :content="currentStep" title="返回" @back="goBack" />
    <el-container>
      <el-main>
        <div>
          <el-row v-show="active === 0" class="active0">
            <div>
              <BaseInfo />
            </div>
          </el-row>
          <el-row v-show="active === 1" class="active1">
            <div>
              <Roles />
            </div>
          </el-row>
          <el-row v-show="active === 2" class="active2">
            <div>
              <Cover />
            </div>
          </el-row>
          <el-row v-show="active === 3" class="active3">
            <div class="div-center">
              <SrcFile />
            </div>
          </el-row>
          <el-row v-show="active === 4" class="active4">
            <div class="div-center-v">
              <el-progress :text-inside="true" :stroke-width="26" :percentage="70" />
              <el-alert
                title="文件上传成功"
                type="success"
                description="请等待审批结果"
                center
                show-icon
                :closable="false"
              />
            </div>
          </el-row>
        </div>
      </el-main>
      <el-aside style="width:200px">
        <div class="div-center">
          <el-steps direction="vertical" :active="active" finish-status="success" :space="80">
            <el-step v-for="item in stepData" :key="item.index" :title="item.title" :icon="item.icon" @click.native="stepClick(item.index)" />
          </el-steps>
          <el-button type="primary" plain size="medium" @click="nextClick()">{{ nextTile }}</el-button>
        </div>
      </el-aside>
    </el-container>
    <el-footer />
  </el-container>
</template>
<script>
// import Server from '../../request/api.js' // 注意路径
import baseInfo from './baseInfo.vue'
import cover from './cover.vue'
import srcFile from './srcFile.vue'
import roles from './roles.vue'
export default {
  name: 'Create',
  components: {
    'BaseInfo': baseInfo, // 将别名demo 变成 组件 Demo
    'Cover': cover,
    'SrcFile': srcFile,
    'Roles': roles
  },
  data() {
    return {
      active: 0, // 控制步骤条及填写条目的显示
      stepData: [{ index: 0, title: '基本信息', icon: 'el-icon-edit' },
        { index: 1, title: '导演与演员', icon: 'el-icon-edit' },
        { index: 2, title: '封面', icon: 'el-icon-edit' },
        { index: 3, title: '视频文件', icon: 'el-icon-edit' },
        { index: 4, title: '结束', icon: 'el-icon-edit' }],
      nextTile: '下一步',
      currentStep: '基本信息'
    }
  },
  methods: {
    stepClick(val) {
      var _that = this
      if (_that.active > val) {
        _that.active = val
        _that.currentStep = _that.stepData[_that.active].title
      }
    },
    nextClick() {
      var _that = this
      console.log(_that.active)
      if (_that.active < 4) {
        _that.active++
        _that.currentStep = _that.stepData[_that.active].title
        console.log(_that.active)
      } else {
        _that.active = 0
      }
    },
    goBack() {
      var _that = this
      console.log(_that.active)
      if (_that.active > 0) {
        _that.active--
        _that.currentStep = _that.stepData[_that.active].title
        console.log(_that.active)
      } else {
        _that.active = 0
      }
    },
    Submit(val) {
      var _that = this
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          _that.focusToError()
          console.log('error submit!!')
          return false
        }
      })
    },
    focusToError() {
      setTimeout(() => {
        var firstStep = document.getElementsByClassName('active0')
        var isFirstStepError = firstStep[0].getElementsByClassName('is-error')
        var secondStep = document.getElementsByClassName('active1')
        var isSecondStepError = secondStep[0].getElementsByClassName('is-error')
        var thirdStep = document.getElementsByClassName('active2')
        var isThirdStepError = thirdStep[0].getElementsByClassName('is-error')
        if (isFirstStepError.length > 0) {
          this.active = 0
          if (isFirstStepError[0].querySelector('textarea') != null) {
            isFirstStepError[0].querySelector('textarea').focus()
          } else {
            isFirstStepError[0].querySelector('input').focus()
          }
          return
        }
        if (isSecondStepError.length > 0) {
          this.active = 1
          if (isSecondStepError[0].querySelector('textarea') != null) {
            isSecondStepError[0].querySelector('textarea').focus()
          } else {
            isSecondStepError[0].querySelector('input').focus()
          }
          return
        }
        if (isThirdStepError.length > 0) {
          debugger
          this.active = 2
          if (isThirdStepError[0].querySelector('textarea') != null) {
            isThirdStepError[0].querySelector('textarea').focus()
          } else {
            isThirdStepError[0].querySelector('input').focus()
          }
        }
      }, 1)
      return false
    }
  }
}
</script>
<style lang="scss" scoped>
  .el-header{
    text-align: center;
    margin-top: 20px;
  }
  .el-footer {
    text-align: center;
  }
  .el-aside {
    //background-color: #2ba8a8;
    float: right;
    text-align: center;
  }
  .el-main {
   //background-color: #20a0ff;
    text-align: center;
  }
  .el-steps {
    cursor: pointer;
  }
  .div-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 0px 0px 100px;
    margin: 0 auto;
    overflow: hidden;
  }
  .div-center {
    margin: auto;
    width: 80%;
   // border: 3px solid green;
    padding: 20px;
  }
  .div-center-v {
    margin: auto;
    //height: 80%;
    //border: 3px solid green;
    padding: 40px;
  }
/*  body > .el-container {
    margin-bottom: 10px;
  }
  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }
  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }*/
</style>
