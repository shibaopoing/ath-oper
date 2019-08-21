<template>
  <div class="home-container">
    <el-card class="box-card">
      <el-collapse v-model="activeName" accordion>
        <el-collapse-item name="1">
          <template slot="title">
            按条件搜索<i class="header-icon el-icon-info" />
          </template>
          <el-form ref="ruleForm" class="div-form" label-position="right" size="mini" :model="ruleForm" inline="true" :rules="rules" label-width="80px">
            <el-col>
              <el-form-item label="名称" prop="name">
                <el-input v-model="ruleForm.name" />
              </el-form-item>
              <el-form-item label="出版区域" prop="region">
                <el-select v-model="ruleForm.region" placeholder="请选择出版区域" style="width: 90%;">
                  <el-option label="欧美" value="oumei" />
                  <el-option label="大陆" value="dalu" />
                  <el-option label="香港" value="xg" />
                  <el-option label="台湾" value="tw" />
                  <el-option label="日韩" value="rh" />
                  <el-option label="泰国" value="tg" />
                  <el-option label="印度" value="yd" />
                  <el-option label="其他" value="ot" />
                </el-select>
              </el-form-item>
              <el-form-item label="上映时间" prop="date1">
                <el-date-picker v-model="ruleForm.date1" type="date" placeholder="选择日期" style="width: 90%;" />
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="导演" prop="name">
                <el-input v-model="ruleForm.name" />
              </el-form-item>
              <el-form-item label="主演" prop="name">
                <el-input v-model="ruleForm.name" />
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="类型" prop="type">
                <el-popover trigger="hover" placement="right">
                  <div style="width: 170px;height: 120px">
                    <el-checkbox-group v-model="ruleForm.type" size="mini" border="true" @change="handleCheckedCitiesChange">
                      <el-checkbox v-for="item in checkBoxData" :key="item.index" :label="item.label" name="type" />
                    </el-checkbox-group>
                  </div>
                  <div slot="reference" class="name-wrapper">
                    <el-button size="mini" style="width: 100%">请选择:{{ checkLabel }}</el-button>
                  </div>
                </el-popover>
              </el-form-item>
            </el-col>
          </el-form>
          <div class="div-center">
            <el-button size="mini" type="primary">查询</el-button>
          </div>
        </el-collapse-item>
      </el-collapse>
      <div class="">
        <el-table :data="tableData" style="width: 100%" size="mini" max-height="340px">
            <el-table-column label="日期" width="180">
              <template slot-scope="scope">
                <i class="el-icon-time" />
                <span style="margin-left: 10px">{{ scope.row.date }}</span>
              </template>
            </el-table-column>
            <el-table-column label="姓名" width="180">
              <template slot-scope="scope">
                <el-popover trigger="click" placement="top">
                  <p>姓名: {{ scope.row.name }}</p>
                  <p>住址: {{ scope.row.address }}</p>
                  <div slot="reference" class="name-wrapper">
                    <el-button size="mini">{{ scope.row.name }}</el-button>
                  </div>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column
              label="姓名"
              width="180"
            >
              <template slot-scope="scope">
                <el-popover trigger="hover" placement="top">
                  <p>姓名: {{ scope.row.name }}</p>
                  <p>住址: {{ scope.row.address }}</p>
                  <div slot="reference" class="name-wrapper">
                    <el-tag size="medium">{{ scope.row.name }}</el-tag>
                  </div>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
      </div>
    </el-card>
    <div class="pageCounter">
      <el-pagination  background layout="prev, pager, next" :total="1000"></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Index',
  data() {
    return {
      checkLabel: '',
      activeName: '1',
      ruleForm: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        mainRoles: [{ value: '', Disabled: true }],
        resource: '',
        desc: ''
      },
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      },
      {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      },
      {
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      },
      {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      },
      {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }],
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
        { index: 12, label: '其他', value: '12' }]
      /*      rules: {
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
        ]
      }*/
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
    handleCheckedCitiesChange(value) {
      // const checkedCount = value.length
      this.checkLabel = value
      /*      this.checkAll = checkedCount === this.cities.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length*/
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    handleEdit(index, row) {
      console.log(index, row)
    },
    handleDelete(index, row) {
      console.log(index, row)
    }
  }
}
</script>

<style lang="scss" scoped>
  .home-container {
    display: flex;
    justify-content: center;
    margin: auto;
    min-height: 100%;
    width: 100%;

  }
  .box-card{
    //transform: translate(10%,10%);
    //background-color: #1482f0;
    height: 90%;
    position: absolute;
    margin: 20px;
  }
  .div-center {
    display: flex;
    justify-content: center;
    margin: auto;
    width: 100%;
   // border: 3px solid green;
  }
  .pageCounter{
    display: flex;
    float: bottom;
    position: absolute;
    bottom: 10px;
    justify-content: center;
    margin: auto;
    width: 100%;
  }
</style>
