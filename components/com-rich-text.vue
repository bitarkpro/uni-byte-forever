<template>
	<view :style="'height:'+height+'; width:'+width+';'" class="rich-text-container">
		<textarea class="rich-text"
			:maxlength="maxLength" 
			@input="textareaInput"
			v-model="textareaValue"
			placeholder-style="color: #CACACA; "
			:placeholder="placeholderText">
		</textarea>
		<view class="count-tag">
			<text>{{contentInput.length}}/{{maxLength}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		name:"com-rich-text",
		props:{
			height: {default: "300rpx", type:String},
			width: {default: "300rpx", type:String},
			maxLength: {default: 50, type:Number},
			placeholderText: {default: 'Add a note to your memory', type:String}
		},
		data() {
			return {
				contentInput: "",
				textareaValue: "",
			};
		},
		methods:{
			textareaInput(e){
				this.contentInput = e.detail.value
				this.$emit('txtInput', this.contentInput)
			},
			clearRichText(){
				this.contentInput = ''
				this.textareaValue = ''
			}
		}
	}
</script>

<style lang="less">
	.rich-text-container {
		position: relative;
		width: 300rpx;
		height: 300rpx;
		.rich-text{
			width: 100%;
			height: 100%;
		}
		.count-tag{
			position: absolute;
			bottom: 20rpx;
			right: 20rpx;
			padding: 4rpx 12rpx;
			border-radius: 8px;
			background-color: #CACACA;
			color: #ffffff;
		}
	}
</style>
