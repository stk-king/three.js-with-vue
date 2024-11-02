<script setup>
const props=defineProps({
    data:{
        type:Object,
        default:{
            id:'tag',
            title:'楼栋一',
            isInhabitant:'已出售',
            publishDate:'2024-12-22'
        }
    }
})

</script>

<template>
  <div :id="props.data.id" style="display: none">
      <div class="box" style="position:relative;box-shadow: 0 0 10px 0 red;width: 100px;border-radius: 10px;border: 4px solid #fd0000;background: black;color: #fff;padding: 5px">
          <div style="display: flex;align-items: center">
              <div style="font-weight: bold;font-size: 20px;flex: 1">{{props.data.title}}</div>
              <div style="font-size: 12px;color: red">{{props.data.isInhabitant}}</div>
          </div>
          <div v-if="props.data.publishDate" style="font-size: 14px;text-align: right;padding-top: 10px">
              {{props.data.publishDate}}
          </div>
          <div style="display: block;
                position: absolute;
                left: 50%;
                transform: translateX(-50%);
                height: 20px;
                bottom: -20px;
                width: 3px;
                background: red;
                box-shadow: 0 0 10px 0 red;"></div>
          <div style="
                display: block;
                position: absolute;
                left: 50%;
                transform: translateX(-50%);
                height: 10px;
                width: 10px;
                bottom: -20px;
                border-radius: 50%;
                background: red;
                box-shadow: 0 0 10px 0 red;"></div>
      </div>
  </div>
</template>

<style scoped>


</style>
