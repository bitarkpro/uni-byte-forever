import Vue from "vue"
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
	state:{
		token : '',
		openid: '',
		platform: '',
		fileDetails: '',
		userInfo: '',
		uploadList: [],
		downloadList: [],
		tempFileCidList: new Map()
	},
	mutations:{
		setFileDetails(state, data){
			state.fileDetails = data
		},
		setOpenid(state, data){
			state.openid = data
		},
		webGetToken(state, token){
			state.token = token
		},
		setUserInfo(state, data){
			state.userInfo = data
			console.log(state.userInfo)
		},
		setPlatform(state, data){
			state.platform = data
		},
		setTempFileCidList(state, data){
			state.tempFileCidList.set(data.cid, data.tempFilePath)
		},
		pushUploadList(state, data){
			state.uploadList.push(data)
		},
		updateUploadListByTimestramp(state, data){
			for(let i=0; i<state.uploadList.length; i++){
				if(state.uploadList[i].startTime == data.startTime){
					state.uploadList.splice(i, 1, data)
					return
				}
			}
		},
		removeUploadListByIndex(state, data){
			state.uploadList.splice(data, 1)
		},
		removeUploadListByTimestramp(state, data){
			for(let i=0; i<state.uploadList.length; i++){
				if(state.uploadList[i].startTime == data){
					state.uploadList.splice(i, 1)
					return
				}
			}
		},
		pushDownloadList(state, data){
			state.downloadList.push(data)
		},
		updateDownloadListByTimestramp(state, data){
			for(let i=0; i<state.downloadList.length; i++){
				if(state.downloadList[i].startTime == data.startTime){
					state.downloadList.splice(i, 1, data)
					return
				}
			}
		},
		removeDownloadListByIndex(state, data){
			state.downloadList.splice(data, 1)
		},
		removeDownloadListByTimestramp(state, data){
			for(let i=0; i<state.downloadList.length; i++){
				if(state.downloadList[i].startTime == data){
					state.downloadList.splice(i, 1)
					return
				}
			}
		}
	},
	actions:{
		setFileDetails(context, data){
			context.commit('setFileDetails', data)
		},
		setOpenid(context, data){
			context.commit('setOpenid', data)
		},
		webGetToken(context, data){
			context.commit('webGetToken', data)
		},
		setUserInfo(context, data){
			context.commit('setUserInfo', data)
		},
		setTempFileCidList(context, data){
			context.commit('setTempFileCidList', data)
		},
		pushUploadList(context, data){
			context.commit('pushUploadList', data)
		},
		removeUploadListByIndex(context, data){
			context.commit('removeUploadListByIndex', data)
		},
		removeUploadListByTimestramp(context, data){
			context.commit('removeUploadListByTimestramp', data)
		},
		updateUploadListByTimestramp(context, data){
			context.commit('updateUploadListByTimestramp', data)
		},
		pushDownloadList(context, data){
			context.commit('pushDownloadList', data)
		},
		removeDownloadListByIndex(context, data){
			context.commit('removeDownloadListByIndex', data)
		},
		removeDownloadListByTimestramp(context, data){
			context.commit('removeDownloadListByTimestramp', data)
		},
		updateDownloadListByTimestramp(context, data){
			context.commit('updateDownloadListByTimestramp', data)
		}
	}
})

export default store