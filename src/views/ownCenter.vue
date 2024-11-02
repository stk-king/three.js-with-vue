<script setup>
import {onMounted, ref} from "vue";

const scrollToSection = (id) => {
    const dom = document.getElementById(id)
    dom.scrollIntoView({behavior: 'smooth'});
};

onMounted(()=>{

})
</script>

<template>
  <div>
      个人中心
  </div>
</template>

<style scoped>

</style>
