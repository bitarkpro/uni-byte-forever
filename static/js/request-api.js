import Qs from 'qs'

let wxBaseURL = 'http://yourserver.com'

function requestFunc(reqJson){
	uni.request({
		url: reqJson.url,
		method: reqJson.method,
		header: reqJson.header,
		data: reqJson.data,
		success: res=>{
			if(res.data.code == -1){
				uni.showToast({
					title: 'Login status invalid, please login again',
					icon: 'none'
				})
			} else if(res.data.code != 200){
				let msg = res.data.msg || 'server system error。'
				uni.showToast({
					title: msg,
					icon: 'none'
				})
				if(reqJson.fail){
					reqJson.fail(res)
				}
			} else{
				reqJson.success(res)
			}
		},
		fail: err=>{
			console.log(err)
			reqJson.fail(err)
		},
		complete: res=>{
			if(reqJson.complete){
				reqJson.complete(res)
			}
		}
	})
}

export function wxCodePost(reqJson) {
	const data = {
		code: reqJson.code,
	}
	let reqJson2 = {
    url: wxBaseURL + '/wxuser/code',
    method: 'POST',
		header: {
			"content-type": "application/x-www-form-urlencoded"
		},
		data: Qs.stringify(data),
		success: reqJson.success,
		fail: reqJson.fail,
		complete: reqJson.complete
  }
	requestFunc(reqJson2)
}

export function wxPhonePost(reqJson) {
	const data = {
		openid: reqJson.openid, 
		encryptedData: reqJson.encryptedData, 
		iv: reqJson.iv
	}
	let reqJson2 = {
    url: wxBaseURL + '/wxuser/login',
    method: 'POST',
		header: {
			"content-type": "application/x-www-form-urlencoded"
		},
		data: Qs.stringify(data),
		success: reqJson.success,
		fail: reqJson.fail,
		complete: reqJson.complete
  }
	requestFunc(reqJson2)
}

export function fileUpload(reqJson) {
	console.log(reqJson)
  const uploadTask = uni.uploadFile({
    url: wxBaseURL + '/file/upload',
    method: 'POST',
		header: {
			"token": reqJson.token
		},
		name: 'file',
		filePath: reqJson.filePath,
		formData:{ 
			folderType: reqJson.folderType,
			fileType: reqJson.fileType,
			comment: reqJson.comment,
		},
		success: reqJson.success,
		fail: reqJson.fail,
		complete: reqJson.complete
  })
	return uploadTask
}

export function fileDownload(reqJson) {
  const uploadTask = uni.downloadFile({
    url: wxBaseURL + '/file/download',
		header: {
			"token": reqJson.token,
			"cid": reqJson.cid
		},
		success: reqJson.success,
		fail: reqJson.fail,
		complete: reqJson.complete
  })
	return uploadTask
}

export function getUserInfo(reqJson) {
	let data = {
		"token": reqJson.token
	}
  let reqJson2 = {
		url: wxBaseURL + '/user/info',
		method: 'POST',
		header: {
			"content-type": "application/x-www-form-urlencoded"
		},
		data:Qs.stringify(data),
		success: reqJson.success,
		fail: reqJson.fail,
		complete: reqJson.complete
	}
	requestFunc(reqJson2)
}

export function getHomePage(reqJson) {
  let reqJson2 = {
		url: wxBaseURL + '/file/homepage',
		method: 'POST',
		header: {
			"token": reqJson.token
		},
		success: reqJson.success,
		fail: reqJson.fail,
		complete: reqJson.complete
	}
	requestFunc(reqJson2)
}

export function getRecent(reqJson) {
  let reqJson2 = {
		url: wxBaseURL + '/file/recent',
		method: 'POST',
		header: {
			"token": reqJson.token
		},
		success: reqJson.success,
		fail: reqJson.fail,
		complete: reqJson.complete
	}
	requestFunc(reqJson2)
}

export function getFolder(reqJson) {
	let data = {
		"folderType": reqJson.folderType
	}
  let reqJson2 = {
		url: wxBaseURL + '/file/folder',
		method: 'POST',
		header: {
			"token": reqJson.token,
			"content-type": "application/x-www-form-urlencoded"
		},
		data:Qs.stringify(data),
		success: reqJson.success,
		fail: reqJson.fail,
		complete: reqJson.complete
	}
	requestFunc(reqJson2)
}

export function starFile(reqJson) {
	let data = {
		"id": reqJson.id
	}
  let reqJson2 = {
		url: wxBaseURL + '/file/starfile',
		method: 'POST',
		header: {
			"content-type": "application/x-www-form-urlencoded",
			"token": reqJson.token
		},
		data:Qs.stringify(data),
		success: reqJson.success,
		fail: reqJson.fail,
		complete: reqJson.complete
	}
	requestFunc(reqJson2)
}

export function cancelStar(reqJson) {
	let data = {
		"id": reqJson.id
	}
  let reqJson2 = {
		url: wxBaseURL + '/file/cancelstar',
		method: 'POST',
		header: {
			"content-type": "application/x-www-form-urlencoded",
			"token": reqJson.token
		},
		data:Qs.stringify(data),
		success: reqJson.success,
		fail: reqJson.fail,
		complete: reqJson.complete
	}
	requestFunc(reqJson2)
}

export function fileDelete(reqJson) {
	let data = {
		"id": reqJson.id
	}
  let reqJson2 = {
		url: wxBaseURL + '/file/delete',
		method: 'POST',
		header: {
			"content-type": "application/x-www-form-urlencoded",
			"token": reqJson.token
		},
		data:Qs.stringify(data),
		success: reqJson.success,
		fail: reqJson.fail,
		complete: reqJson.complete
	}
	requestFunc(reqJson2)
}

export function fileUpdate(reqJson) {
	let data = {
		"id": reqJson.id
	}
	if(reqJson.comment !== undefined){
		data.comment = reqJson.comment
	}
	if(reqJson.tags !== undefined){
		data.tags = reqJson.tags
	}
	console.log(data)
  let reqJson2 = {
		url: wxBaseURL + '/file/update',
		method: 'POST',
		header: {
			"content-type": "application/x-www-form-urlencoded",
			"token": reqJson.token
		},
		data:Qs.stringify(data),
		success: reqJson.success,
		fail: reqJson.fail,
		complete: reqJson.complete
	}
	requestFunc(reqJson2)
}

