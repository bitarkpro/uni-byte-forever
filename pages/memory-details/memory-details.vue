<template>
	<view class="memory-details-container">
		<view v-if="folderType!=0" class="top-h"></view>
		<view v-if="folderType!=0" class="opt-container-fixed flex align-center justify-around bg-gradual-blue w100">
			<view @tap="goUpload" class="flex flex-direction padding align-center">
				<view class="flex align-center">
					<text style="font-size: 20px;" class="cuIcon-pic margin-right-sm"></text>
					<text>Upload your memory</text>
				</view>
			</view>
		</view>
		<com-imglist :imgList="dataList.dataList"
		@showImg="showImg"></com-imglist>
		<com-img-details :imgItem="imgDetailsItem"
		v-if="imgDetailsFlag"
		@delItem="delItem"
		@setStar="setStar"
		@setComment="setComment"
		@setTags="setTags"
		@goFileDetails="goFileDetails"
		@hideImg="hideImg"></com-img-details>
	</view>
</template>

<script>
	import {getFolder} from '../../static/js/request-api.js'
	import {downloadImageHome, doFileStar, doFileDelete, doFileComment, doFileTags} from '../../static/js/business.js'
	import comImglist from '../../components/com-imglist.vue'
	import comImgDetails from '../../components/com-img-details.vue'
	export default {
		data() {
			return {
				folderType: 0,
				title: '',
				imgDetailsFlag: false,
				imgDetailsItem: {},
				dataList: {
					dataList: []
				}
			}
		},
		methods: {
			showImg(item){
				this.imgDetailsItem = item
				this.imgDetailsFlag = true
			},
			hideImg(){
				this.imgDetailsFlag = false
			},
			goUpload(){
				uni.navigateTo({
					url: `../upload-page/upload-page?folderType=${this.folderType}`
				})
			},
			goFileDetails(item){
				item = JSON.stringify(item)
				uni.navigateTo({
					url: `../file-details/file-details?item=${item}`
				})
			},
			setComment(obj){
				doFileComment(this.dataList, obj.id, obj.comment, this.$store, ()=>{
					this.imgDetailsItem.comment = obj.comment
					})
			},
			setTags(obj){
				doFileTags(this.dataList, obj.id, obj.tags, this.$store, ()=>{
					this.imgDetailsItem.tags = obj.tags
				})
			},
			setStar(obj){
				this.imgDetailsItem.star == 0?this.imgDetailsItem.star=1:this.imgDetailsItem.star=0
				doFileStar(this.dataList, obj.id, this.$store)
			},
			delItem(obj){
				doFileDelete(this.dataList, obj.id, this.$store, ()=>{
					this.hideImg()
					this.reloadHere()
				})
			},
			reloadHere(callback=Function){
				uni.showLoading({
					title: 'Loading'
				})
				getFolder({
					token: this.$store.state.token,
					folderType: this.folderType,
					success: res=>{
						console.log(res)
						let tempList = res.data.data
						downloadImageHome(tempList, this.$store, ()=>{
							this.dataList = JSON.parse(JSON.stringify(tempList))
							uni.hideLoading()
							callback()
						})
					},
					fail: err=>{
						console.log(err)
						uni.hideLoading()
						callback()
					}
				})
			}
		},
		onLoad(data) {
			console.log(data)
			this.folderType = data.folderType
			this.title = data.title
			uni.setNavigationBarTitle({
				title: this.title
			})
		},
		onPullDownRefresh(){
			this.reloadHere(()=>{
				uni.stopPullDownRefresh()
			})
		},
		onShow() {
			this.reloadHere()
		},
		components:{
			comImglist,
			comImgDetails
		}
	}
</script>

<style lang="less">
	.memory-details-container{
		height: 100vh;
		overflow: auto;
		// #ifdef H5
		.top-h{
			width: 100%;
			height: 44px;
		}
		// #endif
		// #ifdef MP-WEIXIN
		.top-h{
			width: 100%;
			height: 44px;
		}
		// #endif
		.opt-container-fixed{
			z-index: 98;
			position: fixed;
			// #ifdef H5
			top: 44px;
			// #endif
			// #ifdef MP-WEIXIN
			top: 0;
			// #endif
		}
	}
</style>
