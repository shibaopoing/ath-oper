<template>
  <div class="registerBox" wi>
    <div slot="header" align="center">
      <h2>电影上传</h2>
    </div>
    <el-container>
      <el-aside width="200px">
        <div finish-status="success" simple style="margin-top: 20px;height: 600px;">
          <el-steps direction="vertical" :active="active" finish-status="success">
            <el-step title="电影基本信息" />
            <el-step title="电影文件路径" />
            <el-step title="开始上传" description="请等待" :status="lastStep" />
          </el-steps>
        </div>
      </el-aside>
      <el-main>
        <el-collapse v-model="activeName" accordion>
          <el-collapse-item v-show="collapseItem1" name="1">
            <template slot="title">电影基本信息<i class="header-icon el-icon-info" /></template>
            <div align="center">
              <el-input v-model="phoneNumber" placeholder="请输入内容" class="input-with-select" style="width: 350px">
                <el-select slot="prepend" v-model="select" placeholder="86+" style="width: 80px">
                  <el-option label="86+" value="1" />
                </el-select>
              </el-input>
              <el-button type="success" style="width:100px;height:35px;font-size:10px;text-align:center" class="bt" @click="nextBtn('loginInfo')">下一步</el-button>
            </div>
          </el-collapse-item>
          <el-collapse-item v-show="collapseItem2" name="2">
            <template slot="title">账号信息<i class="header-icon el-icon-info" /></template>
            <el-form ref="registerForm" :model="registerForm" :rules="registerRules" label-width="100px" class="demo-ruleForm">
              <el-form-item label="账号" prop="uName">
                <el-input v-model="registerForm.uName" />
              </el-form-item>
              <el-form-item label="坑型" prop="region">
                <el-select v-model="registerForm.region" placeholder="请选择坑型">
                  <el-option label="我是电商" value="shanghai" />
                  <el-option label="其他" value="beijing" />
                </el-select>
              </el-form-item>
              <el-form-item prop="email" label="邮箱">
                <el-input v-model="registerForm.email" />
              </el-form-item>
              <el-form-item label="密码" prop="pass">
                <el-input v-model="registerForm.pass" type="password" auto-complete="off" />
              </el-form-item>
              <el-form-item label="确认密码" prop="checkPass">
                <el-input v-model="registerForm.checkPass" type="password" auto-complete="off" />
              </el-form-item>
              <el-form-item label="活动名称" prop="name">
                <el-input v-model="registerForm.name" />
              </el-form-item>
              <el-form-item label="活动区域" prop="region">
                <el-select v-model="registerForm.region" placeholder="请选择活动区域">
                  <el-option label="区域一" value="shanghai" />
                  <el-option label="区域二" value="beijing" />
                </el-select>
              </el-form-item>
              <el-form-item label="即时配送" prop="delivery">
                <el-switch v-model="registerForm.delivery" />
              </el-form-item>
              <el-form-item label="活动性质" prop="type">
                <el-checkbox-group v-model="registerForm.type">
                  <el-checkbox label="美食/餐厅线上活动" name="type" />
                  <el-checkbox label="地推活动" name="type" />
                  <el-checkbox label="线下主题活动" name="type" />
                  <el-checkbox label="单纯品牌曝光" name="type" />
                </el-checkbox-group>
              </el-form-item>
              <el-form-item label="特殊资源" prop="resource">
                <el-radio-group v-model="registerForm.resource">
                  <el-radio label="线上品牌商赞助" />
                  <el-radio label="线下场地免费" />
                </el-radio-group>
              </el-form-item>
              <el-form-item label="活动形式" prop="desc">
                <el-input v-model="registerForm.desc" type="textarea" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" style="width:300px;height:50px;font-size:20px" @click="submitForm('registerForm')">立即创建</el-button>
                <el-button @click="resetForm('registerForm')">重置</el-button>
              </el-form-item>
            </el-form>
          </el-collapse-item>
          <el-collapse-item v-show="collapseItem3" name="3">
            <template slot="title">注册成功<i class="header-icon el-icon-info" /></template>
            <div align="right">
              <el-alert
                type="success"
                :description="description+count"
                show-icon
                :closable="false"
              />
              <el-button type="text" class="js_enter__register" @click="gotoHomePage()">立即跳转</el-button>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-main>
    </el-container>
  </div>

</template>
<script>
// import Server from '../../request/api.js' // 注意路径
export default {
  name: 'Register',
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.registerForm.checkPass !== '') {
          this.$refs.registerForm.validateField('checkPass')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.registerForm.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      activeName: '1',
      phoneNumber: '',
      active: 0,
      collapseItem1: true,
      collapseItem2: false,
      collapseItem3: false,
      lastStep: 'wait',
      description: '恭喜您注册成功，即将跳转至主页!    ',
      count: 3,
      registerForm: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        email: '',
        pass: '',
        checkPass: '',
        desc: ''
      },
      registerRules: {
        uName: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        name: [
          { required: false, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        region: [
          { required: false, message: '请选择活动区域', trigger: 'change' }
        ],
        date1: [
          { type: 'date', required: false, message: '请选择日期', trigger: 'change' }
        ],
        date2: [
          { type: 'date', required: false, message: '请选择时间', trigger: 'change' }
        ],
        type: [
          { type: 'array', required: false, message: '请至少选择一个活动性质', trigger: 'change' }
        ],
        resource: [
          { required: false, message: '请选择活动资源', trigger: 'change' }
        ],
        desc: [
          { required: false, message: '请填写活动形式', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        pass: [
          { validator: validatePass, trigger: 'blur', required: true }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur', required: true }
        ]
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          /*          const data = {
            userName: this.registerForm.uName,
            userPassword: this.registerForm.pass,
            userEmail: this.registerForm.email,
            userPhone: this.phoneNumber
          }
          const user = Server.sendRequestBySSO('userRegister.mvc', data)
          user.then(this.success, this.fail)*/
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    success: function(data) {
      this.activeName = '3'
      this.collapseItem2 = false
      this.collapseItem3 = true
      this.lastStep = 'success'
      if (this.active++ > 3) this.active = 0
      const doc = setInterval(() => {
        this.count--
        if (this.count === 0) {
          this.$router.push({ path: '/home' })
          clearInterval(doc)
        }
      }, 1000)
    },
    fail: function(error) {
      this.$message.error(error.message)
    },
    resetForm: function(formName) {
      this.$refs[formName].resetFields()
    },
    nextBtn: function(loginInfo) {
      this.activeName = '2'
      this.collapseItem2 = true
      this.collapseItem1 = false
      if (this.active++ > 3) this.active = 0
    },
    gotoHomePage: function() {
      this.$router.push({ name: 'home', params: { loginUserName: this.registerForm.uName, isLogin: true }})
    }
  }
}
</script>
<style scoped>
  .registerBox{
    background-color: #fff;
    border-radius: 20px;
    width: 800px;
    height: 350px;
    position: absolute;
    left: 50%;
    top: 20%;
    transform: translate(-50%,-50%);
  }
  .registerTitle{
    background-color: #545c64;
  }
</style>
