<template>
  <div class="div-container">
    <el-form class="div-form" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
      <el-form-item label="电影名称" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="出版区域" prop="region">
        <el-select v-model="ruleForm.region" placeholder="请选择出版区域">
          <el-option label="欧美" value="oumei"></el-option>
          <el-option label="大陆" value="dalu"></el-option>
          <el-option label="香港" value="xg"></el-option>
          <el-option label="台湾" value="tw"></el-option>
          <el-option label="日韩" value="rh"></el-option>
          <el-option label="泰国" value="tg"></el-option>
          <el-option label="印度" value="yd"></el-option>
          <el-option label="其他" value="ot"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="出版时间" required>
        <el-col :span="11">
          <el-form-item prop="date1">
            <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.date1" style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="视频性质" prop="type">
        <el-checkbox-group v-model="ruleForm.type">
          <el-checkbox v-for="item in checkBoxData" :key="item.index" :label="item.label" name="type"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="导演" prop="resource">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item
        v-for="(domain, index) in dynamicValidateForm.domains"
        :label="'主演' + index"
        :key="domain.key"
        :prop="'domains.' + index + '.value'"
      >
        <el-input v-model="ruleForm.mainRoles" style="width: 350px"></el-input><el-button @click.prevent="removeDomain(domain)">删除</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="addDomain">新增主演</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'Baseinfo',
  data() {
    return {
      ruleForm: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        mainRoles: [],
        resource: '',
        desc: ''
      },
      checkBoxData: [{ index: 0, label: '科幻', value: '1' },
        { index: 1, label: '动作', value: '2' },
        { index: 2, label: '冒险', value: '3' },
        { index: 4, label: '爱情', value: '4' },
        { index: 5, label: '励志', value: '5' },
        { index: 6, label: '魔幻', value: '6' },
        { index: 7, label: '恐怖', value: '7' },
        { index: 8, label: '战争', value: '8' },
        { index: 9, label: '体育', value: '9' },
        { index: 10, label: '儿童', value: '10' },
        { index: 11, label: '动漫', value: '11' },
        { index: 12, label: '其他', value: '12' }],
      dynamicValidateForm: {
        domains: [{
          value: ''
        }]
      },
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        region: [
          { required: true, message: '请选择活动区域', trigger: 'change' }
        ],
        date1: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ],
        date2: [
          { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
        ],
        type: [
          { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
        ],
        resource: [
          { required: true, message: '请选择活动资源', trigger: 'change' }
        ],
        mainRole: [
          { type: 'array', required: true, message: '域名不能为空', trigger: 'change' }
        ],
        desc: [
          { required: true, message: '请填写活动形式', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    removeDomain(item) {
      var index = this.dynamicValidateForm.domains.indexOf(item)
      if (index !== -1) {
        this.dynamicValidateForm.domains.splice(index, 1)
      }
    },
    addDomain() {
      this.dynamicValidateForm.domains.push({
        value: '',
        key: Date.now()
      })
    }
  }
}
</script>

<style scoped>
  .div-container {
    min-height: 100%;
    width: 100%;
  }
  .div-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 0px 0px 100px;
    margin: 0 auto;
    overflow: hidden;
  }
</style>
