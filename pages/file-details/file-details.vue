<template>
	<view class="file-details">
		<view class="info-main-container padding">
			<view class="info-box w100 padding bg-white radius">
				<view class="info-item">
					<text class="item-title text-gray">Name</text>
					<text class="item-txt text-black text-nowarp-1">{{fileDetails.fileName}}</text>
				</view> 
				<view class="info-item">
					<text class="item-title text-gray">Type</text>
					<text class="item-txt text-black text-nowarp-1">{{fileDetails.ext}}</text>
				</view> 
				<view class="info-item">
					<text class="item-title text-gray">Size</text>
					<text class="item-txt text-black text-nowarp-1">{{$common.sizeToStr(fileDetails.fileSize)}}</text>
				</view>
			</view>
			
			<view class="info-box w100 padding bg-white radius">
				<view class="info-item">
					<text class="item-title text-gray">Time</text>
					<text class="item-txt text-black text-nowarp-1">{{$common.timestrapToDate(fileDetails.creatTime)}}</text>
				</view> 
				<view class="info-item">
					<text class="item-title text-gray">State</text>
					<text class="item-txt text-black text-nowarp-1">Success</text>
				</view>
				<view class="info-item">
					<text class="item-title text-gray">CID</text>
					<view class="item-txt2 text-black">
						<view class="txt-txt text-nowarp-1">
							<text class=" text-black ">{{fileDetails.cid}}</text>
						</view>
						<view v-if="platform != 'h5'" @tap="copyCid" class="txt-opt text-nowarp-1">
							<text class="cuIcon-copy text-gray"></text>
						</view>
					</view>
				</view> 
			</view>
			
		</view>
		
		<view class="bottom-opt bg-gradual-blue flex justify-around">
			<view @tap="goNFT" class="opt">
				<text class="opt-icon cuIcon-discover text-white"></text>
				<text class="text-white">NFT</text>
			</view>
		</view>
		
	</view>
</template>

<script>
	
	export default {
		data() {
			return {
				fileDetails: '',
				platform: '',
			}
		},
		methods: {
			copyCid(){
				uni.setClipboardData({
					data: this.fileDetails.cid,
					success:()=>{
						uni.showToast({
							title:"Copy succeeded",
							icon: "none"
						})
					}
				})
			},
			goNFT(){
				uni.showToast({
					title: 'NFT will open in the future',
					icon: 'none'
				})
			},
			hideModal(){
				this.modalName = ''
			}
		},
		onLoad(options) {
			this.platform = this.$store.state.platform
			this.fileDetails = JSON.parse(options.item)
			console.log(this.fileDetails)
		},
		onShow() {
			
		}
	}
</script>

<style lang="less">
	.file-details{
		box-sizing: border-box;
		*{ box-sizing: border-box; }
		.info-main-container{
			.info-box{
				margin-bottom: 30rpx;
				.info-item{
					display: flex;
					align-items: center;
					padding: 10rpx;
					.item-title{
						width: 25%;
					}
					.item-txt,.item-txt2{
						width: 75%;
						text-align: right;
						font-weight: 700;
					}
					.item-txt2{
						display: flex;
						flex-direction: row;
						align-items: center;
						.txt-txt{
							width: 85%;
						}
						.txt-opt{
							font-size: 34rpx;
							font-weight: 500;
							width: 15%;
						}
					}
				}
			}
		}
		.bottom-opt{
			position: fixed;
			bottom: 0;
			width: 100%;
			height: 150rpx;
			padding: 30rpx;
			.opt{
				width: 50%;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				.opt-icon {
					font-size: 40rpx;
				}
			}
		}
		
	}
</style>
