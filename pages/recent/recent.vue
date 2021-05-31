<template>
	<view class="recent-container">
		<com-imglist :imgList="dataList.dataList"
		@showImg="showImg"></com-imglist>
		<com-img-details :imgItem="imgDetailsItem"
		v-if="imgDetailsFlag"
		:isHome="true"
		@delItem="delItem"
		@setStar="setStar"
		@setComment="setComment"
		@setTags="setTags"
		@goFileDetails="goFileDetails"
		@hideImg="hideImg"></com-img-details>
	</view>
</template>

<script>
	import {getRecent} from '../../static/js/request-api.js'
	import {downloadImageHome, doFileStar, doFileDelete, doFileComment, doFileTags} from '../../static/js/business.js'
	import comImglist from '../../components/com-imglist.vue'
	import comImgDetails from '../../components/com-img-details.vue'
	export default {
		data() {
			return {
				imgDetailsFlag: false,
				imgDetailsItem: {},
				dataList: {
					dataList:[]
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
				getRecent({
					token: this.$store.state.token,
					success: res=>{
						console.log(res)
						let tempList = res.data.data
						downloadImageHome(tempList, this.$store, ()=>{
							this.dataList = JSON.parse(JSON.stringify(tempList))
							setTimeout(()=>{
								this.dataList = JSON.parse(JSON.stringify(tempList))
								uni.hideLoading()
								callback()
							},150)
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
		onPullDownRefresh(){
			this.reloadHere(()=>{
				uni.stopPullDownRefresh()
			})
		},
		onShow() {
			console.log('recent onshow')
			this.imgDetailsFlag = false
			this.reloadHere()
		},
		components:{
			comImglist,
			comImgDetails
		}
	}
</script>

<style lang="less">
	.recent-container{
		height: 100vh;
		overflow: auto;
	}
</style>
