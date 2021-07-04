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
        <el-button
          type="primary"
					@click="applyHandler"
          v-permisson="'leave-create'"
          >申请休假</el-button
        >
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
                size="mini"
                @click="handleEdit(scope.row)"
                v-permisson="'user-edit'"
                >查看</el-button
              >
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.row, 'del')"
                v-permisson="'user-delete'"
                >作废</el-button
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
			<!-- 新增用户弹窗 -->
			<el-dialog
			title="申请休假"
			v-model="isShow"
			width="40%"
			>
				<el-form :model="applyForm" :rules="rules" ref="applyRuleForm" label-width="100px">
					<el-form-item label="休假类型" prop="applyType">
						<el-select v-model="applyForm.applyType" placeholder="请选择休假类型">
							<el-option label="事假" :value="1"></el-option>
							<el-option label="调休" :value="2"></el-option>
							<el-option label="年假" :value="3"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="休假时间" prop="date">
						<el-date-picker
							v-model="applyForm.date"
							@change="leaveTimeChange"
							type="daterange"
							range-separator="至"
							start-placeholder="开始日期"
							end-placeholder="结束日期">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="休假时长" prop="leaveTime">
						{{applyForm.leaveTime}}
					</el-form-item>
					<el-form-item label="休假原因" prop="reasons">
						<el-input type="textarea" v-model="applyForm.reasons"></el-input>
					</el-form-item>
				</el-form>
				<template #footer>
					<span class="dialog-footer">
						<el-button @click="dialogCancelHandler">取 消</el-button>
						<el-button type="primary" @click="dialogSubmitHandler">确 定</el-button>
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
      applyState: 0,
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
            3: "年假",
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
            5: "作废",
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
		// 申请弹出显示开关
		const isShow = ref(false);
		// 申请请假表单
		const applyForm = reactive({
			applyType: 1,
			date: '',
			leaveTime: '',
			reasons: ''
		});
    //表单验证规则
    const rules = reactive({
      applyType: [
        {
          required: true,
          message: "请选择请假类型",
          trigger: "blur",
        },
      ],
      date: [{ required: true, message: "请选择请假时间", trigger: "blur" }],
      reasons: [{ required: true, message: "请输入请假原因", trigger: "blur" }],
    });
    //操作类型
    const action = ref("create");
    onMounted(() => {
      getLeaveListRequest();
    });
    //获取审批列表数据
    const getLeaveListRequest = async () => {
      const params = { ...queryForm, ...pageData };
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
		// 申请请假按钮事假
		const applyHandler = () => {
			isShow.value = true
		};
		// 弹窗取消按钮事件
		const dialogCancelHandler = () => {
			isShow.value = false
		};
		// 弹窗确定按钮事件
		const dialogSubmitHandler = () => {
			proxy.$refs['applyRuleForm'].validate(async (valid) => {
				if (valid) {
					let params = {...applyForm, startTime: applyForm.date[0], endTime: applyForm.date[1]};
					params.action = action.value;
					await proxy.$api.postLeave_C(params);
					if(params.action === 'create'){
							proxy.$message.success('申请休假成功');
					}
					isShow.value = false;
					getLeaveListRequest();
				} else {
					proxy.$message.error('您填写的信息不符合规则，请重新输入');
					return false;
				}
			});
		};
		// 休假时间下拉选中事件
		const leaveTimeChange = (val) => {
			const [startTime, endTime] = [val[0], val[1]]
			applyForm.leaveTime = (endTime - startTime) / (24 * 60 * 60 * 1000) + 1
		};
    return {
      queryForm,
      leaveData,
      columList,
      pageData,
      rules,
      action,
			isShow, // 申请请假弹出显示开关
			applyForm, // 申请请假表单
      getLeaveListRequest, // 获取审批列表数据
      onSearchHandler, // 搜索事件
      onResetHandler, // 重置事件
      handleCurrentChange, // 页码改变事件
			applyHandler, // 申请请假事件
			dialogCancelHandler, // 弹窗取消按钮事件
			dialogSubmitHandler, // 弹窗确定按钮事件
			leaveTimeChange, // 休假时间下拉选中事件
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