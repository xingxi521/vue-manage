<template>
  <div class="leave-main">
    <!-- 头部查询功能区域 -->
    <div class="leave-top">
      <el-form :inline="true" :model="queryForm" ref="queryFormRef">
        <el-form-item label="审批状态" prop="applyState">
          <el-select v-model="queryForm.applyState" placeholder="请选择">
            <el-option label="所有" :value="0"></el-option>
            <el-option label="待审批" :value="1"></el-option>
            <el-option label="审批中" :value="2"></el-option>
            <el-option label="审批拒绝" :value="3"></el-option>
            <el-option label="审批通过" :value="4"></el-option>
            <el-option label="作废" :value="5"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearchHandler">查询</el-button>
          <el-button @click="onResetHandler('queryFormRef')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 表格区域 -->
    <div class="leave-bottom">
      <div class="leave-bottom-top">
        
      </div>
      <div class="leave-bottom-table">
        <el-table ref="leaveTable" :data="leaveData">
          <!-- 表字段遍历 -->
          <el-table-column
            v-for="item in columList"
            :key="item.userId"
            :prop="item.prop"
            :label="item.label"
            show-overflow-tooltip
            :formatter="item.formatter"
          >
          </el-table-column>
          <!-- 操作 -->
          <el-table-column label="操作" width="180" align="center">
            <template #default="scope">
              <el-button
                v-if="[1, 2].includes(scope.row.applyState)"
                size="mini"
                @click="handleAudit(scope.row)"
                v-permisson="'approve-audit'"
                >审核</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          layout="prev, pager, next"
          :page-size="pageData.pageSize"
          :total="pageData.total"
          class="pagination"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </div>
      <!-- 审核弹窗 -->
      <el-dialog
        title="审核"
        v-model="detailShow"
        width="40%"
      >
        <el-form ref="ruleForm" label-width="168px" label-suffix=":" :model="approveForm" :rules="rules">
          <el-form-item label="申请人">
            {{ detailData.applyUser }}
          </el-form-item>
          <el-form-item label="休假类型">
            {{ detailData.applyType }}
          </el-form-item>
          <el-form-item label="休假时间">
            {{ detailData.time }}
          </el-form-item>
          <el-form-item label="休假时长">
            {{ detailData.leaveTime }}
          </el-form-item>
          <el-form-item label="休假原因">
            {{ detailData.reasons }}
          </el-form-item>
          <el-form-item label="审核状态">
            {{ detailData.applyStateName }}
          </el-form-item>
          <el-form-item label="审核人">
            {{ detailData.curAuditUserName }}
          </el-form-item>
          <el-form-item label="审核意见" prop="remark">
            <el-input type="textarea" :rows="3" placeholder="请输入审核意见" v-model="approveForm.remark"></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button type="success" @click="auditHandler('pass')">通过</el-button>
            <el-button type="primary" @click="auditHandler('refuse')">驳回</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { onMounted, reactive, ref, getCurrentInstance } from "vue";
import publicFn from "../../utils/publicFn";
export default {
  name: "Leave",
  setup() {
    const { proxy } = getCurrentInstance();
    const queryForm = reactive({
      applyState: 1,
    }); //查询功能表单对象
    // 动态表格数据对象
    const leaveData = ref([]);
    //动态表格字段格式
    const columList = reactive([
      {
        prop: "orderNo",
        label: "单号",
      },
      {
        prop: "applyName",
        label: "申请人",
        formatter(row, col, value){
          return row.applyUser.userName
        }
      },
      {
        prop: "",
        label: "休假时间",
				formatter(row, col, value) {
					return publicFn.formateDate(new Date(row.startTime), 'yyyy-MM-dd') + '到' + publicFn.formateDate(new Date(row.endTime), 'yyyy-MM-dd')
				}
      },
      {
        prop: "leaveTime",
        label: "休假时间",
      },
      {
        prop: "applyType",
        label: "休假类型",
        formatter(row, col, value) {
          return {
            1: "事假",
            2: "调休",
            3: "年假"
          }[value];
        },
      },
      {
        prop: "reasons",
        label: "休假原因"
      },
      {
        prop: "createTime",
        label: "申请时间",
        formatter(row, col, value) {
          return publicFn.formateDate(new Date(value));
        },
      },
      {
        prop: "auditUsers",
        label: "审批人"
      },
			{
        prop: "curAuditUserName",
        label: "当前审批人"
      },
			{
        prop: "applyState",
        label: "审批状态",
        formatter(row, col, value) {
          return {
            1: "待审批",
            2: "审批中",
            3: "审批拒绝",
            4: "审批通过",
            5: "作废"
          }[value];
        }
      }
    ]);
    // 分页数据对象
    const pageData = reactive({
      pageNum: 1,
      pageSize: 10,
      total: 0,
    });
    // 审核显示开关
    const detailShow = ref(false)
    // 审核详情数据
    const detailData = reactive({})
    // 审核表单
    const approveForm = reactive({
      remark: ''
    })
    const rules = reactive({
      remark: [
        {
          required: true,
          messages: '请输入审核意见',
          trigger: 'blur'
        }
      ]
    })
    onMounted(() => {
      getLeaveListRequest();
    });
    //获取审批列表数据
    const getLeaveListRequest = async () => {
      const params = { ...queryForm, ...pageData, type: 'approve' };
      try {
        const res = await proxy.$api.getLeaveList(params);
        leaveData.value = res.list;
        pageData.total = res.page.total;
      } catch (error) {
        console.log(error);
      }
    };
    //查询事件
    const onSearchHandler = () => {
      getLeaveListRequest();
    };
    //重置事件
    const onResetHandler = (name) => {
      proxy.$refs[name].resetFields();
    };
    // 分页触发事件
    const handleCurrentChange = (current) => {
      pageData.pageNum = current;
      getLeaveListRequest();
    };
    // 表格每行查看按钮事件
    const handleAudit = (row) => {
      detailData.applyType = {
        1: "事假",
        2: "调休",
        3: "年假"
      }[row.applyType]
      detailData.time = publicFn.formateDate(new Date(row.startTime), 'yyyy-MM-dd') + '到' + publicFn.formateDate(new Date(row.endTime), 'yyyy-MM-dd')
      detailData.leaveTime = row.leaveTime
      detailData.reasons = row.reasons
      detailData.applyStateName = {
        1: "待审批",
        2: "审批中",
        3: "审批拒绝",
        4: "审批通过",
        5: "作废"
      }[row.applyState]
      detailData.applyState = row.applyState
      detailData.curAuditUserName = row.curAuditUserName
      detailData.applyUser = row.applyUser.userName
      detailData._id = row._id
      detailShow.value = true
    };
    // 审核事件
    const auditHandler = (type) => {
      proxy.$refs.ruleForm.validate(async valid => {
        if (valid) {
          try {
            await proxy.$api.postApprove({
              _id: detailData._id,
              action: type,
              remark: approveForm.remark
            })
            proxy.$message.success('审核成功！')
            getLeaveListRequest()
            onResetHandler('ruleForm')
            detailShow.value = false
            const count = await proxy.$api.getApproveCount();
            proxy.$store.commit('SET_NOTICE_COUNT', count)
          } catch (error) {
            proxy.$message.error(error.message)
          }
        } else {
          proxy.$message.error('请输入审核意见')
          return false
        }
      })
    }
    return {
      queryForm,
      leaveData,
      columList,
      pageData,
      detailShow, // 查看详情显示开关
      detailData, // 查看详情数据
      approveForm, // 审核表单
      rules, // 审核规则
      getLeaveListRequest, // 获取审批列表数据
      onSearchHandler, // 搜索事件
      onResetHandler, // 重置事件
      handleCurrentChange, // 页码改变事件
      handleAudit, // 表格每行查看按钮事件
      auditHandler // 审核事件
    };
  },
};
</script>
<style lang="less" scoped>
.leave-main {
  // background-color: #fff;
  height: 100%;
  .leave-top {
    padding: 20px;
    background-color: #fff;
    border-radius: 5px;
    :deep(.el-form-item) {
      margin-bottom: 0;
    }
  }
  .leave-bottom {
    background-color: #fff;
    border-radius: 5px 5px 0 0;
    margin-top: 10px;
    // .el-select {
    //   width: 100%;
    // }
    // :deep(.el-cascader) {
    //   width: 100%;
    // }
    .leave-bottom-top {
      padding: 20px;
      border-bottom: 1px solid #ececec;
    }
    .leave-bottom-table {
      .pagination {
        padding: 10px;
        text-align: right;
      }
    }
  }
}
</style>