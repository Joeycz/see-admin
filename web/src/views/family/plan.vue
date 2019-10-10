<template>
	<div class="family-plan">
		<div class="header">
			<div @click="createPlan">添加新的计划</div>
			<div @click="toggleList">{{`${curStatus === 'doing' ? '已经完成' : '进行中'}的计划`}}</div>
		</div>
		<div class="plan-box">
			<div class="plan-card" v-for="(item, index) in planListShow" :key="index">
				<div class="info">
					<div class="checkbox" :class="item.status" @click="togglePlanDone(item)"></div>
					<div class="name">
						<div :class="item.status">{{item.name}}</div>
						<div class="footer">
							<el-avatar :size="20" :src="require(`../../assets/images/avatar/${item.assigned}.jpg`)"></el-avatar>
							<small>{{moment(item.created).format('YYYY-MM-DD HH:mm:ss')}}</small>
						</div>
					</div>
				</div>
				<div class="action">
					<div class="action-btn edit" v-if="item.status !== 'done'" @click="edit(item)">
						<svg aria-hidden="true">
							<use xlink:href="#icon-edit" />
						</svg>
					</div>
					<div class="action-btn delete" @click="deletePlan(item)">
						<svg aria-hidden="true">
							<use xlink:href="#icon-trash" />
						</svg>
					</div>
				</div>
			</div>
			<div class="empty" v-if="planListShow.length == 0">还没有计划哦~</div>
		</div>
		<el-dialog width="100%" title="创建计划" :visible.sync="dialogFormVisible">
			<el-form ref="ruleForm" :rules="rules" :model="form" label-position="top">
				<el-form-item label="计划内容" prop="name">
					<el-input type="textarea" :rows="2" v-model="form.name" autocomplete="off" placeholder="描述一下计划内容"></el-input>
				</el-form-item>
				<el-form-item label="指派给" prop="assigned">
					<el-select style="width: 100%;" v-model="form.assigned" placeholder="计划指派给谁呢">
						<el-option label="小哥哥" value="xgg"></el-option>
						<el-option label="大琼子" value="dqz"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="newPlan">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import { getPlanList, createPlan } from '@/api/plan'
	import moment from 'moment'
	export default {
		name: 'familyPlan',
		data() {
			return {
				moment,
				dialogTableVisible: false,
        dialogFormVisible: false,
        form: {
					name: '',
					assigned: '',
					status: 'doing'
        },
				formLabelWidth: '25%',
				rules: {
          name: [
            { required: true, message: '描述一下计划内容哦~', trigger: 'blur' },
					],
					assigned: [
            { required: true, message: '总得指派个人来完成啊~', trigger: 'change' },
					]
				},
				planListShow: [],
				planList: [
					// {
					// 	id: 2,
					// 	name: '任务一的市规划局但是感觉大使馆几乎都是见多识广',
					// 	created: '2019-10-09 00:00:00',
					// 	assigned: 'xgg',
					// 	status: 'doing', // doing / done / undone / closed / overdue
					// },
					// {
					// 	id: 1,
					// 	name: '任务二',
					// 	created: '2019-10-09 00:00:00',
					// 	assigned: 'dqz',
					// 	status: 'doing',
					// }
				],
				curStatus: 'doing',
			}
		},
		created () {
			this.getPlanList()
		},
		methods: {
			toggleList () {
				if (this.curStatus === 'doing') {
					this.curStatus = 'done'
				} else {
					this.curStatus = 'doing'
				}
				this.getFilterList(this.curStatus)
			},
			getFilterList (status) {
				this.planListShow = this.planList.filter((item) => (item.status === status)).sort((a, b) => {
					return new Date(b.created).getTime() - new Date(a.created).getTime()
				})
			},
			getPlanList() {
				getPlanList().then((res) => {
					console.log(res)
					this.planList = res.data.data
					this.getFilterList(this.curStatus)
				})
			},
			togglePlanDone (item) {
				if (item.status === 'doing') {
					item.status = 'done'
				} else {
					item.status = 'doing'
				}
				this.submitPlan(item, { success: item.status === 'done' ? '计划完成了' : '计划进行中' }, true)
			},
			deletePlan (item) {
				item.status = 'deleted'
				this.submitPlan(item, { success: '计划已经被移除' }, true)
			},
			createPlan () {
				this.form = {
					name: '',
					assigned: '',
					status: 'doing'
        }
				this.dialogFormVisible = true
			},
			edit (item) {
				this.form = item
				this.dialogFormVisible = true
			},
			newPlan () {
				console.log(this.form)
				this.$refs.ruleForm.validate((valid) => {
          if (valid) {
						this.dialogFormVisible = false
            this.submitPlan(this.form, { success: '计划创建成功啦~' }, true)
          } else {
            console.log('error submit!!');
            return false;
          }
        });
			},
			submitPlan (data, msg, refresh = false) {
				createPlan(data).then((res) => {
					console.log(res)
					if (res.code === 100000) {
						this.$message({
							message: msg.success,
							type: 'success'
						});
						refresh && this.getPlanList()
					} else {
						this.$message.error('添加计划失败了，快去找爸爸修一下吧~');
					}
				}).catch((err) => {
					this.$message.error('添加计划失败了，快去找爸爸修一下吧~');
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.family-plan {
		box-sizing: border-box;
		padding: 20px 12px 70px;
		/deep/ .el-form-item__label {
			line-height: 1.4;
		}
		.header {
			display: flex;
			font-size: 12px;
			color: #666666;
			position: fixed;
			bottom: 0px;
			left: 0;
			width: 100%;
			height: 50px;
			background-color: white;
			align-items: center;
			justify-content: flex-end;
			box-sizing: border-box;
			z-index: 10;
			padding: 0 12px;
			border-top: 1px solid #eeeeee;
			div {
				cursor: pointer;
			}
			div:first-child {
				color: rgba(224,170,27,1);
			}
			div + div {
				margin-left: 10px;
			}
		}
	}
	.plan-card {
		width: 100%;
		min-height: 50px;
		background: linear-gradient(90deg, rgba(224,170,27,1) 0%, rgba(234,238,9,1) 58%, rgba(208,223,3,1) 100%);
		border-radius: 10px;
		padding: 10px 16px;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
		.info {
			margin-right: 10px;
			display: flex;
			align-items: center;
			.checkbox {
				flex-shrink: 0;
				display: flex;
				justify-content: center;
				align-items: center;
				margin-right: 8px;
				width: 20px;
				height: 20px;
				background: transparent;
				border: 2px solid #9E9E9E;
				border-radius: 2px;
				cursor: pointer;  
				transition: all 250ms cubic-bezier(.4,.0,.23,1);
			}
			.checkbox.done {
				border: 10px solid #FFEB3B;
  			animation: shrink-bounce 200ms cubic-bezier(.4,.0,.23,1);
				position: relative;
				&:before {
					content: "";
					display: block;
					position: absolute;
					top: -7px;
					left: -8px;
					border-right: 3px solid transparent;
					border-bottom: 3px solid transparent;
					transform: rotate(45deg);
					transform-origin: 0% 100%;
					animation: checkbox-check 125ms 250ms cubic-bezier(.4,.0,.23,1) forwards;
				}
			}
			.footer {
				display: flex;
				align-items: center;
				margin-top: 10px;
				small {
					margin-left: 8px;
				}
			}
			.name {
				font-size: 14px;
				color: #333333;
				line-height: 1.4;
				.done {
					text-decoration: line-through;
				}
			}
		}
		.action {
			display: flex;
			align-items: center;
			svg {
				width: 100%;
				height: 100%;
				position: absolute;
				left: 0;
				top: 0;
			}
			.action-btn {
				width: 15px;
				height: 15px;
				position: relative;
				cursor: pointer;
			}
			.action-btn + .action-btn {
				margin-left: 16px;
			}
		}
	}
	.plan-card + .plan-card {
		margin-top: 10px;
	}
	.empty {
		font-size: 10px;
		color: #cccccc;
		text-align: center;
	}
	@keyframes checkbox-check{
		0%{
			width: 0;
			height: 0;
			border-color: #212121;
			transform: translate3d(0,0,0) rotate(45deg);
		}
		33%{
			width: 8px;
			height: 0;
			transform: translate3d(0,0,0) rotate(45deg);
		}
		100%{    
			width: 8px;
			height: 16px;
			border-color: #212121;
			transform: translate3d(0,-.5em,0) rotate(45deg);
		}
	}
	@keyframes shrink-bounce{
		0%{
			transform: scale(1);
		}
		33%{    
			transform: scale(.85);
		}
		100%{
			transform: scale(1);    
		}
	}
</style>