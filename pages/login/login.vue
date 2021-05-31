<template>
	<view class="login-main">
		<view class="login-container flex flex-direction align-center  bg-gradual-purple padding">
			<view style="font-weight: 700;" class="login-title w100 margin padding text-left flex flex-direction justify-center align-center">
				<view class="margin-tb-sm text-xxl">
					<text>Byte Forever</text>
				</view>
				<view class="text-xl">
					<text>IPFS keeps your precious memory forever</text>
				</view>
			</view>
			<!-- #ifdef MP-WEIXIN -->
			<view v-if="isWxLogin" class="bg-white shadow-blur padding-xl flex-direction text-gray text-center my-round">
				<view class="padding-sm">
					<text>To protect your valuable data</text>
				</view>
				<view class="padding-sm">
					<text>We will apply for your information</text>
				</view>
				<button class="cu-btn bg-red shadow-blur margin-tb-sm lg" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">One click login</button>
			</view>
			<view v-if="!isWxLogin" class="padding-xl flex-direction text-white text-center">
				<view class="cu-load load-cuIcon loading">{{loadingMsg}}</view>
			</view>
			<!-- #endif -->
			
			
			<!-- #ifdef H5 -->
			<view class="info-container bg-white shadow-blur margin w100">
				<!-- navTab -->
				<scroll-view scroll-x class="bg-white nav">
					<view class="flex text-center">
						<view class="cu-item flex-sub" :class="0==TabCur?'text-orange cur':''" @tap="tabSelect(0)">
							Login
						</view>
						<view class="cu-item flex-sub" :class="1==TabCur?'text-orange cur':''" @tap="tabSelect(1)">
							Register
						</view>
					</view>
				</scroll-view>
				<view class="padding" v-if="TabCur==0" >
					<form>
						<view class="cu-form-group">
							<view class="title">Phone Number</view>
							<input placeholder="Please input" v-model="loginPhone" name="input"></input>
						</view>
						<view class="cu-form-group">
							<view class="title">Password</view>
							<input type="password" placeholder="Please input" v-model="loginPass" name="input"></input>
						</view>
					</form>
					<view class="flex justify-center margin-top">
						<button @tap="loginSubmit" class='cu-btn bg-blue shadow'>Submit</button>
					</view>
				</view>
				
				<view v-if="TabCur==1"  class="padding">
					<form>
						<view class="cu-form-group">
							<view class="title">Phone Number</view>
							<input placeholder="Please input" v-model="regPhone" name="input"></input>
						</view>
						<view class="cu-form-group">
							<view class="title">Password</view>
							<input type="password" placeholder="Please input" v-model="regPass" name="input"></input>
						</view>
						<view class="cu-form-group">
							<view class="title">Repeat</view>
							<input type="password" placeholder="Please input" v-model="regReapeatPass" name="input"></input>
						</view>
						<view class="cu-form-group">
							<view class="title">Verification Code</view>
							<input placeholder="Please input" v-model="regCode" name="input"></input>
							<button :disabled="inviteBtnDisable" @tap="getPhoneCode" class='cu-btn bg-green shadow'>{{btnMsg}}</button>
						</view>
						<view class="cu-form-group">
							<view class="title">Invitation Code</view>
							<input placeholder="Please input" v-model="regInviteCode" name="input"></input>
						</view>
					</form>
					<view class="flex justify-center margin-top">
						<button @tap="regSubmit" class='cu-btn bg-blue shadow'>Submit</button>
					</view>
				</view>
				
			</view>
			<!-- #endif -->
			
			
		</view>
	</view>
</template>

<script>
	import {sendCode, regInvite, webLogin, wxCodePost, wxPhonePost} from '../../static/js/request-api.js'
	
	export default {
		data() {
			return {
				// wx
				isWxLogin: false,
				loadingMsg: 'Loading...',
				
				// h5
				TabCur: 0,
				regPhone: '',
				regPass: '',
				regReapeatPass: '',
				regCode: '',
				regInviteCode: '',
				inviteBtnDisable: true,
				intervalBtnFlag: '',
				btnMsg: 'Get it now',
				loginPhone: '',
				loginPass: '',
			}
		},
		methods: {
			wxLogin(){
				return new Promise((resovle, reject)=>{
					wx.login({
						success: res=>{
							if(res.code){
								resovle(res.code)
							} else {
								reject(res.errMsg)
							}
						},
						fail: err=>{
							reject(err)
						}
					})
				})
				.then(code=>{
					return new Promise((resovle, reject)=>{
						wxCodePost({
							code: code,
							success: res=>{
								if(res.data.code==200){
									resovle(res.data.data.openid)
								}else{
									reject(res)
								}
							},
							fail: err=>{
								console.log(err)
								uni.showToast({
									icon: 'none',
									title: 'Server busy, please try again later'
								})
								reject(err)
							},
						})
					})
				})
				.then(openid=>{
					this.$store.dispatch('setOpenid', openid)
					this.isWxLogin = true
				})
				.catch(err=>{
					console.log(err)
				})
			},
			getPhoneNumber (e) {
			  console.log(e.detail.errMsg)
			  console.log(e.detail.iv)
			  console.log(e.detail.encryptedData)
				if(!e.detail.encryptedData){
					uni.showToast({
						title: 'We need to verify your mobile phone number',
						icon: 'none',
						duration: 3000
					})
					return
				}
				return new Promise((resovle, reject)=>{
					wxPhonePost({
						openid: this.$store.state.openid, 
						encryptedData: e.detail.encryptedData, 
						iv: e.detail.iv, 
						success: res=>{
							if(res.data.code == 200){
								resovle(res.data.data.token)
							}else{
								reject(res)
							}
						}, 
						fail: err=>{
							console.log(err)
						}
					})
				})
				.then(token=>{
					this.$store.dispatch('webGetToken', token)
					uni.setStorageSync('token', token)
					uni.switchTab({
						url: '../index/index'
					})
				})
				.catch(err=>{
					console.log(err)
				})
			},
			
			// 【H5】
			tabSelect(index){
				this.TabCur = index
			},
			getPhoneCode(){
				if(this.regPhone.length == 11){
					this.inviteBtnDisable = true
					sendCode({
						username: this.regPhone,
						success: res=>{
							console.log(res)
							if(res.data.code==200){
								let time = new Date().getTime()
								uni.setStorageSync('codeSendTime', time)
								this.btnMsg = `Resend(60)`
								this.checkCodeTime()
							}
						},
						fail: err=>{
							this.inviteBtnDisable = false
							console.log(err)
						}
					})
				}else{
					uni.showToast({
						title: 'Please input the phone number correctly',
						icon: 'none'
					})
				}
			},
			checkCodeTime(){
				let time = uni.getStorageSync('codeSendTime')
				let time2 = new Date().getTime()
				let checkTime = 60 - Math.floor(((time2 - time)/1000))
				clearInterval(this.intervalBtnFlag)
				if(checkTime > 0){
					this.intervalBtnFlag = setInterval(()=>{
						let timeNow = new Date().getTime()
						let newTime = 60 - Math.floor(((timeNow - time)/1000))
						if(newTime < 1){
							this.btnMsg = `Get it now`
							clearInterval(this.intervalBtnFlag)
							this.inviteBtnDisable = false
						}else{
							this.inviteBtnDisable = true
							this.btnMsg = `Resend(${newTime})`
						}
					}, 1000)
				}else{
					this.btnMsg = `Get it now`
					this.inviteBtnDisable = false
				}
			},
			regFormVerify(){
				function showMsg(msg){
					uni.showToast({
						title: msg,
						icon: 'none'
					})
				}
				if(this.regPhone.length != 11){
					showMsg('Please input 11 digit mobile phone number')
					return false
				}else if(this.regPass.length < 6){
					showMsg('Please enter a password of at least 6 digits')
					return false
				}else if(this.regReapeatPass != this.regPass){
					showMsg('Two password input inconsistent')
					return false
				}else if(!this.regCode){
					showMsg('Please enter the verification code')
					return false
				}else if(!this.regInviteCode){
					showMsg('Please enter the invitation code')
					return false
				}else{
					return true
				}
			},
			regSubmit(){
				if(this.regFormVerify()){
					regInvite({
						username: this.regPhone,
						password: this.regPass,
						verifcode: this.regCode,
						code: this.regInviteCode,
						success: res=>{
							console.log(res)
							if(res.data.code ==200){
								uni.showToast({
									icon: 'none',
									title: res.data.msg
								})
								this.regPhone = ''
								this.regPass = ''
								this.regReapeatPass = ''
								this.regCode = ''
								this.regInviteCode = ''
							}
						},
						fail: err=>{
							console.log(err)
						}
					})
				}
			},
			loginFormVerify(){
				function showMsg(msg){
					uni.showToast({
						title: msg,
						icon: 'none'
					})
				}
				if(this.loginPhone.length != 11){
					showMsg('Please input 11 digit mobile phone number')
					return false
				}else if(this.loginPass.length < 6){
					showMsg('Please enter a password of at least 6 digits')
					return false
				}else{
					return true
				}
			},
			loginSubmit(){
				if(this.loginFormVerify()){
					webLogin({
						username: this.loginPhone,
						password: this.loginPass,
						success: res=>{
							console.log(res)
							if(res.data.code ==200){
								this.$store.dispatch('webGetToken', res.data.data.token)
								uni.setStorageSync('token', token)
								uni.reLaunch({
									url: '../index/index'
								})
							}
						},
						fail: err=>{
							console.log(err)
						}
					})
				}
			}
		},
		onShow() {
			// #ifdef H5
			this.checkCodeTime()
			// #endif
		},
		onLoad() {
			// #ifdef MP-WEIXIN
			this.wxLogin()
			// #endif
			
			// #ifdef H5
			// #endif
		}
	}
</script>

<style lang="less">
	.login-main{
		.login-container{
			width: 100%;
			height: 100vh;
			.my-round{
				border-radius: 5px;
			}
		}
		.cu-form-group .title {
			min-width: calc(4em + 15px);
		}
	}
</style>
