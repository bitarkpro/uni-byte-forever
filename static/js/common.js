import {getUserInfo} from './request-api.js'

export default {
	timestrapToDate(timestamp){
		if(typeof(timestamp)=='string'){
			timestamp = parseInt(timestamp)
		}
		if((timestamp+'').length == 10){
			timestamp = timestamp*1000
		}
		var date = new Date(timestamp)
		var Y = date.getFullYear() + '-';
		var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
		var D = date.getDate() + ' ';
		
		if(date.getHours()<10){
			var h = '0' + date.getHours() + ':';
		}else{
			var h = date.getHours() + ':';
		}
		
		if(date.getMinutes()<10){
			var m = '0' + date.getMinutes() + ':';
		}else{
			var m = date.getMinutes() + ':';
		}
		
		if(date.getSeconds()<10){
			var s = '0' + date.getSeconds();
		}else{
			var s = date.getSeconds();
		}
		return Y+M+D+h+m+s;
	},
	dateToTimestrap(d){
		var date = new Date(d);
			var time1 = date.getTime();
			return time1
	},
	removeHTML(str){
		var temp = str.replace(/<\/?.+?>/g, "")
		var result = temp.replace(/ /g, "")
		return result
	},
	fileNameIsImage(fileName){
		var index= fileName.lastIndexOf(".");
		var ext = fileName.substr(index+1);
		return ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'psd', 'svg', 'tiff'].indexOf(ext.toLowerCase()) !== -1
	},
	sizeToStr(size) {
		var data = "";
		if (size < 0.1 * 1024) {
			data = size.toFixed(2) + " B";
		} else if (size < 0.1 * 1024 * 1024) {
			data = (size / 1024).toFixed(2) + " KB";
		} else if (size < 0.9 * 1024 * 1024 * 1024) {
			data = (size / (1024 * 1024)).toFixed(2) + " MB";
		} else { 
			data = (size / (1024 * 1024 * 1024)).toFixed(2) + " GB";
		}
		var sizestr = data + "";
		var len = sizestr.indexOf("\.");
		var dec = sizestr.substr(len + 1, 2);
		if (dec == "00") {
			return sizestr.substring(0, len) + sizestr.substr(len + 3, 2);
		}
		return sizestr;
	},
	showIcon(fileName, type){
		let regImage = /(\.jpg$|\.png$|\.jpeg$)/i
		let regExe = /(\.exe$)/i
		let regWord = /(\.doc$|\.docx$)/i
		let regExcel = /(\.xls$|\.xlsx$)/i
		let regMusic = /(\.cda$|\.wav$|\.mp3$|\.wav$|\.aif$|\.aiff$|\.mid$|wma$|ra$|vqf$|ape$)/i
		let regVideo = /(\.avi$|\.mov$|\.rmvb$|\.rm$|\.flv$|\.mp4$|\.3gp$)/i
		let regPpt = /(\.ppt$|\.pptx$|\.pps$|\.ppsx$)/i
		let regPdf = /(\.pdf$)/i
		let regZip = /(\.rar$|\.zip$|\.7z$|\.cab$|\.tar$|\.jar$|\.iso$|\.gz$)/i
		let text = /(\.txt$|\.md$)/i
		if(type == '.folder'){
			return 'bgi-folder'
		}else if(regExe.test(fileName)){
			return 'bgi-exe'
		}else if(regWord.test(fileName)){
			return 'bgi-doc'
		}else if(regExcel.test(fileName)){
			return 'bgi-xls'
		}else if(regMusic.test(fileName)){
			return 'bgi-mp3'
		}else if(regVideo.test(fileName)){
			return 'bgi-mp4'
		}else if(regImage.test(fileName)){
			return 'bgi-jpg'
		}else if(regPpt.test(fileName)){
			return 'bgi-ppt'
		}else if(regPdf.test(fileName)){
			return 'bgi-pdf'
		}else if(regZip.test(fileName)){
			return 'bgi-zip'
		}else if(text.test(fileName)){
			return 'bgi-txt'
		}else {
			return 'bgi-unknown'
		}
	},
	fileListSeticonClass(fileList){
		for(let i=0; i<fileList.length; i++){
			fileList[i].iconClass = this.showIcon(fileList[i].filename, fileList[i].type)
		}
	},
	arrSwap(arr, a, b){
		let objA = arr.splice(a, 1, arr[b])
		arr.splice(b, 1, objA[0])
	},
	sortList(temp, sortStyle='date', sortMode = 'desc'){
		let _this = this
		if(sortStyle == 'date'){
			sortByDate(sortMode)
		}else if(sortStyle == 'type'){
			sortByType(sortMode)
		}else if(sortStyle == 'name'){
			sortByName(sortMode)
		}
		folderInFront()
		
		function sortByDate(mode){
			for(let i=0; i<temp.length; i++){
				for(let j=i+1; j<temp.length; j++){
					let timeI = _this.dateToTimestrap(temp[i].createdAt)
					let timeJ = _this.dateToTimestrap(temp[j].createdAt)
					if(mode == 'desc'){
						if(timeJ > timeI){
							_this.arrSwap(temp, i, j)
						}
					}else{
						if(timeJ < timeI){
							_this.arrSwap(temp, i, j)
						}
					}
				}
			}
		}
		function sortByName(mode){
			for(let i=0; i<temp.length; i++){
				for(let j=i+1; j<temp.length; j++){
					let nameI = temp[i].filename.substr(0,1)
					let nameJ = temp[j].filename.substr(0,1)
					if(mode == 'desc'){
						if(nameJ > nameI){
							_this.arrSwap(temp, i, j)
						}
					}else{
						if(nameJ < nameI){
							_this.arrSwap(temp, i, j)
						}
					}
				}
			}
		}
		function sortByType(mode){
			for(let i=0; i<temp.length; i++){
				for(let j=i+1; j<temp.length; j++){
					if(mode == 'desc'){
						if(temp[j].type > temp[i].type){
							_this.arrSwap(temp, i, j)
						}
					}else{
						if(temp[j].type < temp[i].type){
							_this.arrSwap(temp, i, j)
						}
					}
				}
			}
		}
		function folderInFront(){
			let folderList = []
			for(let i=0; i<temp.length; i++){
				if(temp[i].type == '.folder'){
					folderList.push(temp.splice(i, 1)[0])
					i--
				}
			}
			for(let i=folderList.length-1; i>=0; i--){
				temp.unshift(folderList[i])
			}
		}
	},
	
	showMsg(msg){
		uni.showToast({
			title: msg,
			icon: 'none'
		})
	},
	tokenIsOk(token, callback){
		getUserInfo({
			token: token,
			success: res=>{
				console.log(res)
				if(res.data.data){
					callback(true)
				}else{
					console.log(res)
					callback(false)
				}
			},
			fail: err=>{
				console.log(err)
				callback(false)
			}
		})
	}

}