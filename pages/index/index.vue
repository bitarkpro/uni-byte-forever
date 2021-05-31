<template>
	<view class="index-container">
		<swiper style="min-height: 150rpx; height: 150rpx;" class="screen-swiper square-dot" :indicator-dots="true" :circular="true"
		 :autoplay="true" interval="5000" duration="500">
			<swiper-item>
				<view class="cu-bar bg-img shadow-blur padding banner-imgurl radius solid-bottom">
					<view class="w100 h100 banner-titile">
						<text class="bt-txt text-white">Byte Forever</text>
						<text class="bt-txt2 text-white">IPFS keeps your precious memory forever</text>
					</view>
				</view>
			</swiper-item>
			<swiper-item>
				<view class="cu-bar bg-img shadow-blur padding banner-imgurl radius solid-bottom">
					<view class="w100 h100 banner-titile">
						<text class="bt-txt text-white">Byte Forever</text>
						<text class="bt-txt2 text-white">IPFS keeps your precious memory forever</text>
					</view>
				</view>
			</swiper-item>
		</swiper>
		
		<view class="padding w100">
			<view v-if="[0,1,'0','1'].indexOf(item.folderType) != -1" v-for="(item, index) in dataList" :key="index">
				<view class="w100 action list-title flex align-center justify-between">
					<view class="flex align-center">
						<text class="cuIcon-title text-blue"></text>
						<text class="margin-right-sm text-lg">{{item.title}}</text>
						<view class="cu-capsule round">
							<view class='cu-tag bg-blue sm'>
								Count
							</view>
							<view class="cu-tag line-blue sm">
								{{item.total}}
							</view>
						</view>
						<button v-if="item.folderType!=0" @tap="goUpload(item)" class="cu-btn bg-green margin-sm sm round">Add</button>
					</view>
					<view class="flex">
						<button @tap="goMore(item)" class="cu-btn bg-blue margin-sm sm round">Go</button>
					</view>
				</view>
				<com-thumbnail :imgList="item.dataList"
				@showImg="showImg"></com-thumbnail>
				
				<view class="diving-line"></view>
				
			</view>
			
			<view class="list-title flex align-center margin-top">
				<text class="cuIcon-title text-blue"></text>
				<text class="margin-right-sm text-lg">My Memory</text>
			</view>
			<view v-if="[0,1,'0','1'].indexOf(item.folderType) == -1" v-for="(item, index) in dataList" :key="index" class="padding-left margin-bottom">
				<view class="w100 action list-title flex align-center justify-between">
					<view class="flex align-center">
						<text class="cuIcon-title text-green"></text>
						<text class="margin-right-sm">{{item.title}}</text>
						<view class="cu-capsule round">
							<view class='cu-tag bg-blue sm'>
								Count
							</view>
							<view class="cu-tag line-blue sm">
								{{item.total}}
							</view>
						</view>
						<button v-if="item.folderType!=0" @tap="goUpload(item)" class="cu-btn bg-green margin-sm sm round">Add</button>
					</view>
					<view class="flex">
						<button @tap="goMore(item)" class="cu-btn bg-blue margin-sm sm round">Go</button>
					</view>
				</view>
				<com-thumbnail :imgList="item.dataList"
				@showImg="showImg"></com-thumbnail>
			</view>
		</view>
		
		<com-img-details :imgItem="imgDetailsItem"
		v-if="imgDetailsFlag"
		:isHome="true"
		@delItem="delItem"
		@setStar="setStar"
		@goFileDetails="goFileDetails"
		@setComment="setComment"
		@setTags="setTags"
		@hideImg="hideImg"></com-img-details>
	</view>
</template>

<script>
	import { downloadImageHome, findItemById, doFileStar, doFileDelete, doFileComment, doFileTags } from '../../static/js/business.js'
	import { getHomePage } from '../../static/js/request-api.js'
	import comThumbnail from '../../components/com-thumbnail.vue'
	import comImgDetails from '../../components/com-img-details.vue'
	export default {
		data() {
			return {
				imgDetailsFlag: false,
				imgDetailsItem: {},
				dataList: []
			}
		},
		methods: {
			goMore(item){
				uni.navigateTo({
					url: `../memory-details/memory-details?folderType=${item.folderType}&title=${item.title}`
				})
			},
			goUpload(item){
				console.log(item)
				uni.navigateTo({
					url: `../upload-page/upload-page?folderType=${item.folderType}`
				})
			},
			showImg(item){
				this.imgDetailsItem = item
				this.imgDetailsFlag = true
			},
			hideImg(){
				this.imgDetailsFlag = false
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
				getHomePage({
					token: this.$store.state.token,
					success: res=>{
						console.log(res)
						
						let tempList = res.data.data
						downloadImageHome(tempList, this.$store, ()=>{
							this.dataList = [].concat(tempList)
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
		onLoad() {
			
		},
		onPullDownRefresh(){
			this.reloadHere(()=>{
				uni.stopPullDownRefresh()
			})
		},
		onShow() {
			console.log('index onshow')
			this.imgDetailsFlag = false
			this.reloadHere()
		},
		components:{
			comThumbnail,
			comImgDetails
		}
	}
</script>

<style lang="less">
	.index-container{
		height: 100vh;
		overflow: auto;
		.banner-imgurl{
			height: 100%;
			background-image:url(../../static/img/bannerBG.jpg);
			display: flex;
			flex-direction: column;
		}
		.banner-titile {
			height: 100%;
			padding: 30rpx 0 50rpx 0;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			.bt-txt {
				font-size: 40rpx;
				font-weight: 700;
				margin-bottom: 25rpx;
			}
			.bt-txt2 {
				font-size: 30rpx;
				font-weight: 700;
			}
		}
		.list-title{
			font-weight: 700;
		}
		.diving-line{
			width: 100%;
			height: 1px;
			padding: 0 7%;
			background-color: #d1d1d1;
		}
		
		
	}
</style>
