<template>
	<view class="com-img-details-container" :class="isHome?'com-img-details-container-home':''" >
		<view :style="'background-image: url('+imgItem.minioUrl+');'" class="bg-img">
			<!-- close -->
			<view @tap="hideImg" class="close-btn">
				<view class="cu-tag bg-red text-white text-lg margin-top-sm round"><text class="cuIcon-close"></text></view>
			</view>
			<!-- tag -->
			<view class="w75 padding flex flex-wrap align-center">
				<!-- taglist -->
				<view v-for="(tag, tagIndex) in imgItem.tags" :key="tagIndex" class="cu-tag bg-blue text-white margin-top-sm round">{{tag}}</view>
				<!-- add（edit） -->
				<view @tap="openAddTagDlg" class="cu-tag bg-green text-white text-lg margin-top-sm round"><text class="cuIcon-post"></text></view>
			</view>
			<view class="item-comment">
				<text class="item-comment-txt text-nowarp-multiple text-nowarp-3">{{imgItem.comment || '(none)'}}</text>
			</view>
			<view @tap="bgiTap" class="bg-img-tap">
			</view>
		</view>
		<view @tap="showMenu" :class="menuFlag?'opacity10':'opacity6'" class="opt-show bg-gradual-blue">
			<text :class="menuFlag?'cuIcon-unfold':'cuIcon-right'"></text>
		</view>
		<view v-if="menuFlag" :class="menuClass" class="opt-container flex align-center justify-around bg-gradual-blue w100">
			<view @tap="goFileDetails" class="flex flex-direction padding align-center">
				<text style="font-size: 20px;" class="cuIcon-info"></text>
				<text>Details</text>
			</view>
			<view @tap="openCommentDlg" class="flex flex-direction padding align-center">
				<text style="font-size: 20px;" class="cuIcon-text"></text>
				<text>Comment</text>
			</view>
			<view @tap="setStar" class="flex flex-direction padding align-center">
				<text style="font-size: 20px;" :class="imgItem.star==0?'cuIcon-favor':'cuIcon-favorfill'"></text>
				<text>Star</text>
			</view>
			<view @tap="donwloadItem" class="flex flex-direction padding align-center">
				<text style="font-size: 20px;" class="cuIcon-down"></text>
				<text>Download</text>
			</view>
			<view @tap="openDelDlg" class="flex flex-direction padding align-center">
				<text style="font-size: 20px;" class="cuIcon-delete"></text>
				<text>Delete</text>
			</view>
		</view>
		
		<view v-show="modalName == 'setCommentDlg'" class="cu-modal" :class="modalName=='setCommentDlg'?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">Comment</view>
					<view class="action" @tap="hideModal">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="padding-xl bg-white">
					<com-rich-text ref="crt" @txtInput="commentInput($event)" 
					:width="'100%'" :height="'200rpx'">
					</com-rich-text>
				</view>
				<view class="cu-bar bg-white justify-end">
					<view class="action">
						<button class="cu-btn line-blue text-blue" @tap="hideModal">Cancel</button>
						<button class="cu-btn bg-blue margin-left" @tap="setCommentSubmit">Submit</button>
					</view>
				</view>
			</view>
		</view>
		
		<view v-show="modalName == 'delDlg'" class="cu-modal" :class="modalName=='delDlg'?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">Warning</view>
					<view class="action" @tap="hideModal">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="padding-xl">
					After deletion, it will not be restored. Do you want to delete it?
				</view>
				<view class="cu-bar bg-white justify-end">
					<view class="action">
						<button class="cu-btn line-blue text-blue" @tap="hideModal">Cancel</button>
						<button class="cu-btn bg-blue margin-left" @tap="delItem">Submit</button>
		
					</view>
				</view>
			</view>
		</view>
		
		<view v-show="modalName == 'addTagDlg'" class="cu-modal" :class="modalName=='addTagDlg'?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">Tags</view>
					<view class="action" @tap="hideModal">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="padding-xl">
					<!-- dlg editTag -->
					<view class="w100 flex flex-wrap align-center margin-bottom">
						<view v-for="(tag, tagIndex) in readyAddTagList" :key="tagIndex" @tap="delReadyTags(tagIndex)"  class="cu-tag bg-blue text-white margin-top-sm round">{{tag}}<text class="cuIcon-close padding-left-sm"></text></view>
					</view>
					<!-- dlg add -->
					<view v-if="readyAddTagList.length<6" class="flex align-center">
						<input class="w50 bg-blue round text-white" maxlength="6" placeholder-style="color:#98bcff;" placeholder="Within 6 words" type="text" @input="tagInputEvent" v-model="readyAddTagText" />
						<view @tap="addReadyTags(readyAddTagText)" class="cu-tag bg-green text-white text-lg margin-left-sm round"><text class="cuIcon-add"></text></view>
					</view>
					<!-- dlg optionsTagsList -->
					<view v-if="readyAddTagList.length<6" style="max-height: 170rpx; overflow: auto;" class="w100 flex flex-wrap align-center margin-top">
						<view @tap="addReadyTags(tag)" v-for="(tag, tagIndex) in optionsTagsList" :key="tagIndex" class="cu-tag bg-green text-white margin-top-sm round">{{tag}}</view>
					</view>
				</view>
				<view class="cu-bar bg-white justify-end">
					<view class="action">
						<button class="cu-btn line-blue text-blue" @tap="hideModal">Cancel</button>
						<button class="cu-btn bg-blue margin-left" @tap="editTagsSubmit">Submit</button>
		
					</view>
				</view>
			</view>
		</view>
		
		<view v-if="videoFlag" class="video-play-container">
			<!-- video close -->
			<view @tap="hideVideo" class="video-close-btn">
				<view class="cu-tag bg-red text-white text-lg margin-top-sm round"><text class="cuIcon-close"></text></view>
			</view>
			<video :src="imgItem.fileType=='video'?imgItem.videoUrl:''" controls></video>
		</view>
		
	</view>
</template>

<script>
	import comRichText from './com-rich-text.vue'
	export default {
		name:"com-img-details",
		props:{
			isHome: {default: false, type: Boolean},
			imgItem: { type: Object }
		},
		data() {
			return {
				videoFlag: false,
				menuFlag: false,
				optShowEnable: true,
				menuClass: '',
				modalName: '',
				setCommentText: '',
				readyAddTagList: [],
				readyAddTagText: '',
				optionsTagsList: ["Happy","Sad"],
			};
		},
		methods:{
			hideImg(){
				this.$emit('hideImg')
			},
			hideVideo(){
				this.videoFlag = false
			},
			bgiTap(){
				if(this.imgItem.fileType == 'img'){
					
				}else if(this.imgItem.fileType == 'video'){
					this.videoFlag = true
				}
			},
			goFileDetails(){
				this.$emit('goFileDetails', this.imgItem)
			},
			setStar(){
				if(this.imgItem.star == 1){
					this.hideImg()
				}
				this.$emit('setStar', {id: this.imgItem.id})
			},
			donwloadItem(){
				if(this.imgItem.fileType == 'img'){
					uni.saveImageToPhotosAlbum({
						filePath: this.imgItem.url,
						success: (res)=>{
							console.log(res)
						},
						fail: err=>{
							console.log(err)
						}
					})
				}else if(this.imgItem.fileType == 'video'){
					uni.saveVideoToPhotosAlbum({
						filePath: this.imgItem.url,
						success: (res)=>{
							console.log(res)
						},
						fail: err=>{
							console.log(err)
						}
					})
				}
			},
			openDelDlg(){
				this.modalName = 'delDlg'
			},
			delItem(){
				this.$emit('delItem', {id: this.imgItem.id})
				this.hideModal()
			},
			setCommentSubmit(){
				this.$emit('setComment', {
					id: this.imgItem.id,
					comment: this.setCommentText
				})
				this.hideModal()
				this.showMenu()
			},
			openCommentDlg(){
				this.modalName = 'setCommentDlg'
				this.clearRichText()
				this.setCommentText = this.imgItem.comment
				this.$refs.crt.contentInput = this.imgItem.comment
				this.$refs.crt.textareaValue = this.imgItem.comment
			},
			commentInput(comment){
				this.setCommentText = comment
			},
			clearRichText(){
				this.$refs.crt.clearRichText()
			},
			openAddTagDlg(){
				this.modalName = 'addTagDlg'
				this.readyAddTagList = [].concat(this.imgItem.tags || [])
			},
			addReadyTags(taStr){
				if(taStr){
					this.readyAddTagList.push(taStr)
					this.readyAddTagText = ''
				}else{
					this.$common.showMsg('Cannot be empty')
				}
			},
			tagInputEvent(event){
				var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
				if(this.readyAddTagText.match(pattern)){
					console.log(event)
					this.readyAddTagText = ""
					this.$common.showMsg("Input symbol not allowed")
				}
			},
			delReadyTags(index){
				this.readyAddTagList.splice(index, 1)
			},
			editTagsSubmit(){
				if(this.imgItem.tags.length>0){
					this.$emit('setTags', {
						id: this.imgItem.id, 
						tags: [].concat(this.readyAddTagList)
					})
					this.readyAddTagList = []
					this.hideModal()
				}else{
					if(this.readyAddTagList.length>0){
						this.$emit('setTags', {
							id: this.imgItem.id, 
							tags: [].concat(this.readyAddTagList)
						})
						this.readyAddTagList = []
						this.hideModal()
					}else{
						this.hideModal()
					}
				}
			},
			hideModal(){ 
				this.modalName = ''
			},
			showMenu(){
				if(!this.optShowEnable){
					return
				}
				if(this.menuFlag){
					this.menuFlag = false
				}else{
					this.optShowEnable = false
					this.menuFlag = true
					this.menuClass = 'animation-slide-right'
					setTimeout(()=>{
						this.menuClass = ''
						this.optShowEnable = true
					}, 1000)
				}
			}
		},
		components:{
			comRichText
		}
	}
</script>

<style lang="less">
	@import "/colorui/animation.css";
	
	.com-img-details-container{
		z-index: 99;
		width: 750rpx;
		height: 100vh;
		position: fixed;
		top: 0;
		background-color: #000;
		.bg-img {
			position: relative;
			width: 100%;
			height: 100vh;
			background-repeat: no-repeat;
			background-position: center;
			background-size: 100% auto;
			display: flex;
			flex-direction: column;
			justify-content: flex-end;
			.bg-img-tap{
				z-index: 2;
				position: absolute;
				width: 100%;
				height: 50%;
				top: 25%;
				// background-color: #ffffff;
				opacity: 0;
			}
			.item-comment{
				width: 100%;
				background-color: #000;
				padding: 20rpx;
				opacity: 0.75;
				.item-comment-txt{
					color: #fff;
				}
			}
		}
		.close-btn{
			z-index: 102;
			position: fixed;
			// #ifdef MP-WEIXIN
			top: 20rpx;
			// #endif
			// #ifdef H5
			top: 108rpx;
			// #endif
			right: 20rpx;
		}
		.opt-show{
			z-index: 100;
			position: fixed;
			bottom: 200rpx;
			right: 50rpx;
			width: 110rpx;
			height: 110rpx;
			border-radius: 50%;
			display: flex;
			justify-content: center;
			align-items: center;
			color: #fff;
			font-size: 40rpx;
			font-weight: 700;
		}
		.opacity6{
			opacity: 0.6;
		}
		.opacity10{
			opacity: 1;
		}
		.opt-container{
			z-index: 100;
			position: fixed;
			bottom: 0;
		}
	
		.video-play-container{
			z-index: 150;
			position: fixed;
			top: 0;
			width: 100%;
			height: 100vh;
			background-color: #000;
			video{
				position: fixed;
				top: 10%;
				width: 100%;
				height: 80%;
			}
			.video-close-btn{
				z-index: 151;
				position: fixed;
				// #ifdef MP-WEIXIN
				top: 20rpx;
				// #endif
				// #ifdef H5
				top: 108rpx;
				// #endif
				right: 20rpx;
			}
		}
	}
	.com-img-details-container-home {
		// #ifdef H5
		height: calc(100vh - 50px);
		// #endif
		.bg-img{
			// #ifdef H5
			height: calc(100vh - 50px);
			// #endif
		}
		.opt-show {
			// #ifdef H5
			bottom: calc(200rpx + 50px);
			// #endif
		}
		.opt-container {
			// #ifdef H5
			bottom: 50px;
			// #endif
		}
	}
</style>
