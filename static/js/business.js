import {fileDownload, starFile, cancelStar, fileDelete, fileUpdate} from "./request-api.js"

import imgBase64 from './base64.js'

let videoUrl = imgBase64.videoUrl
 
export function	downloadImageHome(dataList, store, callback){

	startTags()
	
	function startTags(){
		if(dataList instanceof Array){
			for(let i=0; i<dataList.length; i++){
				for(let n=0; n<dataList[i].dataList.length; n++){
					let tempItem = dataList[i].dataList[n]
					if(tempItem.tags){
						if(!(tempItem.tags instanceof Array)){
							console.log(tempItem.tags)
							tempItem.tags = tempItem.tags.split(',')
						}
					}
				}
			}
			callback()
		}else{
			for(let i=0; i<dataList.dataList.length; i++){
				let tempItem = dataList.dataList[i]
				if(tempItem.tags){
					tempItem.tags = tempItem.tags.split(',')
				}
			}
			callback()
		}
	}
}

export function findItemById(dataList, id){
	let tempList = []
	if(dataList instanceof Array){
		for(let i=0; i<dataList.length; i++){
			for(let n=0; n<dataList[i].dataList.length; n++){
				if(dataList[i].dataList[n].id == id){
					tempList.push({index: i, index2: n})
				}
			}
		}
	}else{
		for(let i=0; i<dataList.dataList.length; i++){
			if(dataList.dataList[i].id == id){
				tempList.push({index: i})
			}
		}
	}
	if(tempList.length == 0){
		return false
	}else{
		return tempList
	}
}

export function doFileStar(dataList, id, store){
	let listPosition = findItemById(dataList, id)
	let delFlag = false
	for(let m=0; m<listPosition.length; m++){
		if(dataList instanceof Array){
			if(dataList[listPosition[m].index].dataList[listPosition[m].index2].star == 0){
				dataList[0].dataList.unshift(dataList[listPosition[m].index].dataList[listPosition[m].index2])
				dataList[0].total ++
				dataList[listPosition[m].index].dataList[listPosition[m].index2].star = 1
				starFile({
					token: store.state.token,
					id: id,
					success: res=>{ console.log(res) },
					fail: err=>{ console.log(err) }
				})
			}else{
				if(listPosition[m].index==0){
					dataList[listPosition[m].index].dataList.splice(listPosition[m].index2, 1)
					dataList[listPosition[m].index].total --
				}else{
					dataList[listPosition[m].index].dataList[listPosition[m].index2].star = 0
				}
				if(!delFlag){
					delFlag = true
					cancelStar({
						token: store.state.token,
						id: id,
						success: res=>{ console.log(res) },
						fail: err=>{ console.log(err) }
					})
				}
			}
		}else{
			if(dataList.dataList[listPosition[m].index].star == 0){
				dataList.dataList[listPosition[m].index].star = 1
				starFile({
					token: store.state.token,
					id: id,
					success: res=>{ console.log(res) },
					fail: err=>{ console.log(err) }
				})
			}else{
				dataList.dataList[listPosition[m].index].star = 0
				cancelStar({
					token: store.state.token,
					id: id,
					success: res=>{ console.log(res) },
					fail: err=>{ console.log(err) }
				})
			}
		}
		
	}
	
}

export function doFileDelete(dataList, id, store, callback=Function){
	fileDelete({
		token: store.state.token,
		id: id,
		success: res=>{ console.log(res) },
		fail: err=>{ console.log(err) },
		complete: res=>{callback()}
	})
}

export function doFileComment(dataList, id, comment, store, callback=Function){
	fileUpdate({
		token: store.state.token,
		id,
		comment,
		success: res=>{
			console.log(res)
			let listPosition = findItemById(dataList, id)
			for(let m=0; m<listPosition.length; m++){
				if(dataList instanceof Array){
					dataList[listPosition[m].index].dataList[listPosition[m].index2].comment = comment
					callback()
				}else{
					dataList.dataList[listPosition[m].index].comment = comment
					callback()
				}
			}
		},
		fail: err=>{
			console.log(err)
		}
	})
}

export function doFileTags(dataList, id, tags, store, callback=Function){
	let postTags = tags.join(',')
	fileUpdate({
		token: store.state.token,
		id,
		tags:postTags,
		success: res=>{
			console.log(res)
			let listPosition = findItemById(dataList, id)
			for(let m=0; m<listPosition.length; m++){
				if(dataList instanceof Array){
					dataList[listPosition[m].index].dataList[listPosition[m].index2].tags = tags
					callback()
				}else{
					dataList.dataList[listPosition[m].index].tags = tags
					callback()
				}
			}
		},
		fail: err=>{
			console.log(err)
		}
	})
}
