<template>
	<div class="tools-pic-composing-box">
		<div class="box">
			<h4>1. 选择打印纸尺寸</h4>
			<el-select v-model="printSize" placeholder="请选择">
				<el-option
					v-for="item in printSizes"
					:key="item.value"
					:label="item.label"
					:value="item.value">
				</el-option>
			</el-select>
		</div>
		<div class="box">
			<h4>2. 选择证件照尺寸</h4>
			<el-select v-model="idSize" placeholder="请选择" @change="handleIdSizeChange">
				<el-option
					v-for="item in idSizes"
					:key="item.value"
					:label="item.label"
					:value="item.value">
				</el-option>
			</el-select>
		</div>
		<div class="box">
			<h4>3. 上传证件照</h4>
			<input type="file" @change="handleImageChange" />
			<el-button type="primary" @click="cropImage">裁剪</el-button>
			<div class="image-croper-box">
				<vue-cropper
					v-if="idImage"
					:aspect-ratio="cropAspect"
					ref="cropper"
					:autoCropArea="1"
					:src="idImage.src">
				</vue-cropper>
				<img id="cropImage" v-if="cropImg" :src="cropImg" />
			</div>
		</div>
		<div class="box">
			<h4>4. 选择设备PPI(PPI就是每英寸像素)</h4>
			<el-select v-model="ppi" placeholder="请选择">
				<el-option
					v-for="item in ppis"
					:key="item.value"
					:label="item.label"
					:value="item.value">
				</el-option>
			</el-select>
		</div>
		<div class="box">
			<h4>5. 选择底色</h4>
			<photoshop-picker v-model="colors" />
		</div>
		<div class="box btn-box">
			<el-button type="primary" @click="draw">生成</el-button>
			<a target="_blank" download="pic.jpg" v-if="downloadUrl" :href="downloadUrl">下载</a>
		</div>
		<div class="box">
			<canvas id="canvas"></canvas>
		</div>
	</div>
</template>

<script>
	import VueCropper from 'vue-cropperjs';
	import { Photoshop } from 'vue-color'
	import 'cropperjs/dist/cropper.css';
	export default {
		name: 'familyPlan',
		data() {
			return {
				printSize: '148*100',
				printSizes: [
					{
						value: '148*100',
						label: '148mm*100mm'
					}
				],
				idSize: '25*35',
				idSizes: [
					{
						value: '22*32',
						label: '小1寸(22mm*32mm)'
					},
					{
						value: '25*35',
						label: '1寸(25mm*35mm)'
					},
					{
						value: '35*49',
						label: '2寸(35mm*49mm)'
					},
					{
						value: '51*51',
						label: '美国签证(51mm*51mm)'
					},
					{
						value: '26*32',
						label: '身份证(26mm*32mm)'
					},
					{
						value: '33*48',
						label: '大一寸(33mm*48mm)'
					},
				],
				ppi: 166,
				ppis: [
					{
						value: 166,
						label: '166ppi'
					},
					{
						value: 72,
						label: '72ppi'
					},
					{
						value: 96,
						label: '96ppi'
					}
				],
				idImage: null,
				cropAspect: (25 / 35),
				cropImg: '',
				downloadUrl: '',
				colors: '#194d33'
			}
		},
		components: {
			VueCropper,
			'photoshop-picker': Photoshop
		},
		mounted () {
			// this.draw()
		},
		methods: {
			reset() {
				this.$refs.cropper && this.$refs.cropper.reset();
			},
			handleIdSizeChange (e) {
				const size = e.split('*')
				this.cropAspect = (Number(size[0]) / Number(size[1]))
				// this.$refs.cropper && this.$refs.cropper.destroy()
				// this.$refs.cropper && this.$refs.cropper.replace(this.idImage.src)
				this.idImage = null
			},
			cropImage() {
				// get image data for post processing, e.g. upload or setting image src
				this.cropImg = this.$refs.cropper.getCroppedCanvas().toDataURL();
			},
			handleImageChange (e) {
				// this.reset()
				const self = this
				console.log(e.target.files[0])
				const reader = new FileReader()
				reader.onload = function(event) {
					const img = new Image()
					img.onload = function() {
						self.idImage = img
						console.log(self.idImage, self.$refs.cropper)
						self.$refs.cropper && self.$refs.cropper.replace(self.idImage.src);
					}
					img.src = event.target.result
				}
				reader.readAsDataURL(e.target.files[0])
			},
			mm2px (mm, ppi) {
				return ppi * mm / 25.4
			},
			draw () {
				const cropImage = document.getElementById('cropImage')
				const canvas = document.getElementById('canvas')
				const ctx = canvas.getContext('2d')
				const printSize = this.printSize.split('*').map(item => this.mm2px(Number(item), this.ppi))
				const idSize = this.idSize.split('*').map(item => this.mm2px(Number(item), this.ppi))
				canvas.width = printSize[0]
				canvas.height = printSize[1]
				const column = ~~(printSize[0] / idSize[0])
				const row = ~~(printSize[1] / idSize[1])
				const hSpan = (printSize[0] - idSize[0] * column) / (column + 1)
				const vSpan = (printSize[1] - idSize[1] * row) / (row + 1)
				console.log(canvas, cropImage, this.colors)
				ctx.fillStyle = this.colors.hex || this.colors
				ctx.fillRect(0, 0, canvas.width, canvas.height)
				console.log(~~(printSize[0] / idSize[0]), ~~(printSize[1] / idSize[1]))
				for(let c = 0; c < column; c++) {
					for(let r = 0; r < row; r++) {
						ctx.drawImage(cropImage, c * idSize[0] + ((c + 1) * hSpan), r * idSize[1] + ((r + 1) * vSpan), idSize[0], idSize[1])
					}
				}
				// ctx.drawImage(cropImage, 0, 0, idSize[0], idSize[1])
				this.downloadUrl = canvas.toDataURL('image/jpg')
			},
			downloadFile(fileName = 'file', blob) {
				const url = window.URL.createObjectURL(blob)
				const link = document.createElement('a')
				link.href = url
				link.setAttribute('download', fileName)
				document.body.appendChild(link)
				link.click()
				window.URL.revokeObjectURL(url)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.tools-pic-composing-box {
		.box + .box {
			margin-top: 10px;
		}
		.box.btn-box {
			margin-top: 30px;
		}
		.box {
			.image-croper-box {
				display: flex;
				justify-content: space-between;
				& > div {
					width: 50%;
				}
				& > img {
					flex-shrink: 0;
					height: 350px;
				}
			}
		}
	}
</style>