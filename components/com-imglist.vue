<template>
	<view class="com-imglist-container">
		<view v-for="(item, index) in imgList" :key="index" class="img-item">
			<view @tap="showImg(item)" :style="'background-image:url('+item.minioUrl+');'" class="img-bg">
				<!-- tag -->
				<view class="w100 padding">
					<view v-for="(tag, tagIndex) in item.tags" :key="tagIndex" class="cu-tag bg-blue text-white margin-top-sm round">{{tag}}</view>
				</view>
				<view class="item-comment text-nowarp-multiple text-nowarp-3">
					<text class="item-comment-txt">{{item.comment || "(none)"}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"com-imglist",
		props:{
			imgList: { type: Array }
		},
		data() {
			return {
				
			};
		},
		methods:{
			showImg(item){
				this.$emit('showImg', item)
			}
		}
	}
</script>

<style lang="less">
	.com-imglist-container{
		.img-item {
			width: 100%;
			height: 480rpx;
			padding: 4rpx;
			margin-bottom: 30rpx;
			.img-bg{
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
					background-color: #000000;
					padding: 14rpx 12rpx 6rpx 12rpx;
					opacity: 0.55;
					.item-comment-txt{
						color: #ffffff;
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
