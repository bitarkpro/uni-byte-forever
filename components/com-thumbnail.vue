<template>
	<view class="thumbnail-com">
		<view v-for="(item, index) in imgList" :key="index" class="tb-item">
			<view class="item-bg" :style="'background-image:url('+item.minioUrl+');'" @tap="showImg(item)">
				<view v-if="item.comment" class="item-comment text-nowarp-1">
					<text class="item-comment-txt">{{item.comment}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"com-thumbnail",
		props:{
			imgList: { type: Array }
		},
		data() {
			return {
				
			};
		},
		methods:{
			showImg(item){
				console.log(item)
				this.$emit('showImg', item)
			}
		},
		mounted() {
			console.log("com-thumbnail: ", this.imgList)
		}
	}
</script>

<style lang="less">
	.thumbnail-com{
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-bottom: 15rpx;
		.tb-item {
			width: 210rpx;
			height: 210rpx;
			padding: 4rpx;
			.item-bg{
				width: 100%;
				height: 100%;
				background-repeat: no-repeat;
				background-position: center;
				background-size:cover;
				display: flex;
				flex-direction: column;
				justify-content: flex-end;
				
				.item-comment{
					width: 100%;
					background-color: #ffffff;
					padding: 8rpx 2rpx;
					opacity: 0.7;
					.item-comment-txt{
						color: #000000;
					}
				}
			}
			.item-text{
				width: 100%;
				height: 100%;
				display: flex;
				justify-content: center;
				align-items: center;
				background-color: #e3e3e3;
				font-size: 34rpx;
				font-weight: 700;
				color: #7f7f7f;
			}
		}
	}
</style>
