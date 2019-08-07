<template>
  <div class="div-container">
    <el-form ref="ruleForm" class="div-form" :model="roles" :rules="rules" label-width="100px">
      <el-form-item label="导演" prop="director">
        <el-input v-model="roles.director" />
      </el-form-item>
      <el-form-item
        v-for="(item, index) in roles.actors"
        :key="item.key"
        :label="'主演' + index"
        :prop="'actors.' + index + '.value'"
        :rules="{required: true, message: '主演'+index+'不能为空', trigger: 'blur'}"
      >
        <el-input v-model="item.value" style="width: 350px" /><el-button :disabled="item.Disabled" @click.prevent="removeDomain(item)">删除</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="addDomain">新增主演</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'Director',
  data() {
    return {
      roles: {
        director: '',
        actors: [{ value: '', Disabled: true }]
      },
      rules: {
        director: [
          { required: true, message: '请输入导演', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    removeDomain(item) {
      var index = this.roles.actors.indexOf(item)
      if (index !== -1) {
        this.roles.actors.splice(index, 1)
      }
    },
    addDomain() {
      if (this.roles.actors.length < 5) {
        this.roles.actors.push({
          value: '',
          key: Date.now()
        })
      }
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
