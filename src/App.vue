<template>
    <router-view/>
</template>

<style>
body{
    margin: 0;
    user-select: none;
}
.container{
    width: 100%;
    height: calc(100vh - 62px);
    background: black;
}
::-webkit-scrollbar{
    display: none;
}
</style>
