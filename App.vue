<script>
	import {getUserInfo} from 'static/js/request-api.js'
	export default {
		onLaunch: function() {
			console.log('App Launch')
			// #ifdef MP-WEIXIN
			console.log('mp-weixin')
			this.$store.commit('setPlatform', 'mp-weixin')
			// #endif
			// #ifdef H5
			console.log('h5')
			this.$store.commit('setPlatform', 'h5')
			// #endif
			let token = uni.getStorageSync("token")
			if(token){
				this.$store.dispatch('webGetToken', token)
			}
		},
		onShow: function() {
			console.log('App Show')
			if(this.$store.state.token == ''){
				uni.navigateTo({
					url: '/pages/login/login'
				})
			} else {
				this.$common.tokenIsOk(this.$store.state.token, (flag)=>{
					if(flag){
					}else{
						uni.navigateTo({
							url: '/pages/login/login'
						})
					}
				})
			}
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	@import "colorui/main.css";
	@import "colorui/icon.css";
	@import "static/css/common.css";
</style>
