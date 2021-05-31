<template>
	<view class="my-container">
		<view class="cu-list menu margin-top">
			<view class="cu-item">
				<view class="content">
					<text class="padding-right">Phone number</text>
					<text class="text-grey">{{userInfo.phone}}</text>
				</view>
			</view>
			<view class="cu-item">
				<view class="content">
					<text class="padding-right">Immortal number</text>
					<text class="text-grey">{{userInfo.foreverid}}</text>
				</view>
			</view>
			<view class="cu-item">
				<view class="content">
					<text class="padding-right">Existing points</text>
					<text class="text-grey">{{userInfo.integral}}</text>
				</view>
			</view>
			<view class="cu-item">
				<view class="content">
					<text class="padding-right">Total space</text>
					<text class="text-grey">{{$common.sizeToStr(userInfo.totalspace)}}</text>
				</view>
			</view>
			<view class="cu-item">
				<view class="content">
					<text class="padding-right">Used space</text>
					<text class="text-grey">{{$common.sizeToStr(userInfo.totalstor)}}</text>
				</view>
			</view>
			<view class="cu-item">
				<view class="content flex align-center">
					<text class="padding-right w25">Used proportion</text>
					<view class="cu-progress round sm striped active" style="width: 60%; height: 36rpx;">
						<view class="bg-blue" :style="[{ width:true?Math.ceil(userInfo.totalstor / userInfo.totalspace *100) + '%':''}]"></view>
					</view>
					<text class="text-center" style="width: 20%;">
						{{ Math.ceil(userInfo.totalstor / userInfo.totalspace *100) + '%' }}
					</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {getUserInfo} from '../../static/js/request-api.js'
	export default {
		data() {
			return {
				userInfo: ''
			}
		},
		methods: {
			
		},
		onShow() {
			getUserInfo({
				token: this.$store.state.token,
				success: res=>{
					this.$store.dispatch('setUserInfo', res.data.data)
					this.userInfo = this.$store.state.userInfo
				},
				fail: err=>{
					console.log(err)
					this.userInfo = ''
				}
			})
		}
	}
</script>

<style>
	.my-container{
		
	}
</style>
