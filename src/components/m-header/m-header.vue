<template>
	<div class="m-header">
		<img src="./logo.jpg" class="icon">
		<h1 class="text">艾大胆用心做音乐</h1>
	</div>
</template>

<script>
	export default{}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
	@import "./../../common/stylus/variable.styl"

	.m-header
	  position: relative
	  height: 44px
	  text-align: center
	  color: $color-theme
	  font-size: 0
	.icon
	  display: inline-block
	  vertical-align: top
	  margin-top: 6px
	  width: 30px
	  height: 32px
	  margin-right: 9px
	  border-radius: 50%
	  background-size: 30px 32px
	.text
	  display: inline-block
	  vertical-align: top
	  line-height: 44px
	  font-size: $font-size-large
</style>