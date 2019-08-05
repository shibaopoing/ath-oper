<template>
  <div>
    <el-steps :active="active" direction="vertical">
      <el-step v-for="item in stepData" :key="item.index" :title="item.title" :icon="item.icon" @click.native="stepClick(item.index)" />
    </el-steps>
    <el-row v-show="active === 0" class="active0">
      <div align="center">
        <el-input v-model="phoneNumber" placeholder="请输入内容" class="input-with-select" style="width: 350px">
          <el-select slot="prepend" v-model="select" placeholder="86+" style="width: 80px">
            <el-option label="86+" value="1" />
          </el-select>
        </el-input>
        <el-button type="success" style="width:100px;height:35px;font-size:10px;text-align:center" class="bt" @click="nextBtn('loginInfo')">下一步</el-button>
      </div>
    </el-row>
    <el-row v-show="active === 1" class="active1">
      <div align="center">
        <el-input v-model="phoneNumber" placeholder="请输1111" class="input-with-select" style="width: 350px">
          <el-select slot="prepend" v-model="select" placeholder="86+" style="width: 80px">
            <el-option label="86+" value="1" />
          </el-select>
        </el-input>
        <el-button type="success" style="width:100px;height:35px;font-size:10px;text-align:center" class="bt" @click="nextBtn('loginInfo')">下一步</el-button>
      </div>
    </el-row>
    <el-row v-show="active === 2" class="active2">
      <div align="center">
        <el-input v-model="phoneNumber" placeholder="请输入3333" class="input-with-select" style="width: 350px">
          <el-select slot="prepend" v-model="select" placeholder="86+" style="width: 80px">
            <el-option label="86+" value="1" />
          </el-select>
        </el-input>
        <el-button type="success" style="width:100px;height:35px;font-size:10px;text-align:center" class="bt" @click="nextBtn('loginInfo')">下一步</el-button>
      </div>
    </el-row>
    <el-button
      type="primary"
      plain
      size="medium"
      @click="nextClick()"
    >{{ nextTile }}
    </el-button>
  </div>

</template>

<script>

export default {
  name: 'Page404',
  data() {
    return {
      active: 0, // 控制步骤条及填写条目的显示
      stepData: [{ index: 0, title: '步骤1', icon: 'el-icon-edit' },
        { index: 1, title: '步骤2', icon: 'el-icon-edit' },
        { index: 2, title: '步骤3', icon: 'el-icon-edit' }],
      nextTile: '下一步'
    }
  },
  computed: {
    message() {
      return 'The webmaster said that you can not enter this page...'
    }
  },
  methods: {
    stepClick(val) {
      var _that = this
      _that.active = val
    },
    nextClick() {
      var _that = this
      console.log(_that.active)
      if (_that.active < 3) {
        _that.active++
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
  .el-steps--simple {
    cursor: pointer;
  }
</style>
