<template>
	<view class="upload-page-container">
		
		<view v-for="(item, index) in imageSelectList" :key="index" class="content-contianer w100 padding">
			<view class="file-container">
				<image v-if="item.fileType === 'img'" class="img-item" :src="item.url" mode="aspectFill"></image>
				<view v-if="item.fileType === 'video'" class="bgi-mp4 bgimg-set"></view>
				<view @tap="delFile(index)" class="delete-btn bg-red">
					<text class="cuIcon-close text-white"></text>
				</view>
			</view>
			<com-rich-text @txtInput="txtInput($event,item)"></com-rich-text>
		</view>
		<view v-if="imageSelectList.length>=3" class="padding">
			<text class="text-red">*Submit up to 3 at a time</text>
		</view>
		
		<view class="w100 padding-left padding-right flex flex-direction">
			<view class="w100 flex justify-around align-center">
				<button v-if="imageSelectList.length<3" @tap="addImage" class="cu-btn bg-blue margin-tb-sm lg"><text class="cuIcon-add"></text>Picture<text class="cuIcon-pic margin-left-sm"></text></button>
				<button v-if="imageSelectList.length<3" @tap="addVideo" class="cu-btn bg-blue margin-tb-sm lg"><text class="cuIcon-add"></text>Video<text class="cuIcon-record margin-left-sm"></text></button>
				<button v-if="imageSelectList.length>0" @tap="submitUpload" class="cu-btn bg-red margin-tb-sm lg">Submit</button>
			</view>
			
		</view>
	</view>
</template>

<script>
	import {fileUpload} from '../../static/js/request-api.js'
	import comRichText from '../../components/com-rich-text.vue'
	export default {
		data() {
			return {
				imageSelectList: [],
				folderType: ''
			}
		},
		methods: {
			addImage(){
				if(this.imageSelectList.length >=3){
					return
				}
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					success: res=>{
						this.imageSelectList.push({
							url: res.tempFilePaths[0],
							fileType: 'img',
							comment: ''
						}) 
					},
					fail: err=>{
						console.log(err)
					}
				})
			},
			addVideo(){
				if(this.imageSelectList.length >=3){
					return
				}
				uni.chooseVideo({
					success: res=>{
						// console.log(res)
						this.imageSelectList.push({
							url: res.tempFilePath,
							fileType: 'video',
							comment: ''
						})
					},
					fail: err=>{ console.log(err) }
				})
			},
			delFile(index){
				this.imageSelectList.splice(index, 1)
			},
			txtInput(comment, item){
				item.comment = comment
			},
			submitUpload(){
				console.log(this.imageSelectList)
				uni.showLoading({
					title: 'Transmitting...',
				})
				let uploadCount = 0
				let successCount = 0
				let failCount = 0
				let count = this.imageSelectList.length
				for(let i=0; i<this.imageSelectList.length; i++){
					let uploadTask = fileUpload({
						token: this.$store.state.token,
						filePath: this.imageSelectList[i].url,
						fileType: this.imageSelectList[i].fileType,
						comment: this.imageSelectList[i].comment,
						folderType: this.folderType,
						success: res=>{
							console.log(res.data)
							if(res.data.code == 200){
								successCount ++
							}else{
								failCount ++
							}
						},
						fail: err=>{
							console.log(err)
							failCount ++
						},
						complete: res=>{
							uploadCount ++
							if(uploadCount == count){
								uni.hideLoading()
								if(successCount == count){
									uni.navigateBack()
								}
							}
						}
					})
					uploadTask.onProgressUpdate(res=>{
						console.log(res)
					})
				}
				this.imageSelectList = []
			},
		},
		onLoad(options) {
			console.log(options)
			this.folderType = options.folderType
		},
		components:{
			comRichText
		}
	}
</script>

<style lang="less">
	.upload-page-container{
		background-color: #fff;
		height: 100vh;
		overflow: auto;
		
		.content-contianer{
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			.file-container{
				position: relative;
				width: 300rpx;
				height: 300rpx;
				.img-item {
					width: 300rpx;
					height: 300rpx;
				}
				.bgimg-set{
					width: 300rpx;
					height: 300rpx;
					border: solid 1px #eeeeee;
					background-repeat: no-repeat;
					background-position: center;
					background-size: auto;
				}
				.delete-btn{
					position: absolute;
					top: -18rpx;
					right: -18rpx;
					padding: 8rpx 10rpx;
					border-radius: 50%;
				}
			}
		}
		
		
	}
</style>
