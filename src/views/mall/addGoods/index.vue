<template>
  <div class="">
    <h2>基本信息</h2>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="商品名称" prop="name" class="input-w">
        <el-input v-model="ruleForm.name" ></el-input>
      </el-form-item>
      <el-form-item label="商品分类" prop="region">
        <el-select v-model="ruleForm.region" placeholder="请选择商品分类">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品价格" prop="price" class="input-w">
        <el-input v-model="ruleForm.price" ></el-input>
      </el-form-item>
      <el-form-item label="商品规格" required class="input-w">
        <el-row>
          <el-col :span="11"></el-col>
          <el-col class="line" :span="1">--</el-col>
          <el-col :span="11"></el-col>
        </el-row>
      </el-form-item>
      <!-- <el-form-item label="活动时间" required class="input-w">
        <el-col :span="11">
          <el-form-item prop="date1">
            <el-date-picker type="date" class="input-w" placeholder="选择日期" v-model="ruleForm.date1" style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col class="line" :span="1">--</el-col>
        <el-col :span="11">
          <el-form-item prop="date2">
            <el-time-picker type="fixed-time" placeholder="选择时间" v-model="ruleForm.date2" style="width: 100%;"></el-time-picker>
          </el-form-item>
        </el-col>
      </el-form-item> -->
      <el-form-item label="即时配送" prop="delivery">
        <el-switch v-model="ruleForm.delivery"></el-switch>
      </el-form-item>
      <el-form-item label="活动性质" prop="type">
        <el-checkbox-group v-model="ruleForm.type">
          <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
          <el-checkbox label="地推活动" name="type"></el-checkbox>
          <el-checkbox label="线下主题活动" name="type"></el-checkbox>
          <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="特殊资源" prop="resource">
        <el-radio-group v-model="ruleForm.resource">
          <el-radio label="线上品牌商赞助"></el-radio>
          <el-radio label="线下场地免费"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="活动形式" prop="desc">
        <el-input type="textarea" v-model="ruleForm.desc"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <h2>其他信息</h2>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ruleForm: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
      },
      rules: {
        name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
          { min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' },
        ],
        region: [
          { required: true, message: '请选择商品分类', trigger: 'change' },
        ],
        date1: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' },
        ],
        date2: [
          { type: 'date', required: true, message: '请选择时间', trigger: 'change' },
        ],
        type: [
          { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' },
        ],
        resource: [
          { required: true, message: '请选择活动资源', trigger: 'change' },
        ],
        desc: [
          { required: true, message: '请填写活动形式', trigger: 'blur' },
        ],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
        return false;
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>
<style lang="stylus" scoped>
h2
  margin-top 5px
  margin-bottom 5px
  margin-left 5px
  margin-right 5px
  padding-left 10px
  padding-top 10px
  padding-bottom 10px
  border-left 4px solid #409EFF
  background #fff
  // &.bottom
.input-w
  width 520px
</style>
