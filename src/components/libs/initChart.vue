<script setup>
import * as echart from 'echarts';
import { onMounted, onBeforeUnmount, watch, ref } from 'vue';

const props = defineProps({
    option: {
        type: Object,
        required: true
    }
});

const chartRef = ref(null);
let myChart = null;

onMounted(() => {
    myChart = echart.init(chartRef.value);
    myChart.setOption(props.option);

    window.addEventListener('resize', resizeChart);
});

onBeforeUnmount(() => {
    if (myChart) {
        myChart.dispose();
        window.removeEventListener('resize', resizeChart);
    }
});

watch(() => props.option,
    (newOption) => {
        if (myChart) {
            myChart.setOption(newOption);
        }
    },
    { deep: true }
);

const resizeChart = () => {
    if (myChart) {
        myChart.resize();
    }
};
</script>

<template>
    <div ref="chartRef" id="chart"></div>
</template>

<style scoped>
#chart {
    width: 90%;
    height: 90%;
}
</style>
