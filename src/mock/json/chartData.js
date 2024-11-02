import Mock from "mockjs";

const chartData={}
const leftTop={
    "result": "success",
    "data": {
        "city": Mock.mock({
            'array|10': ['@city']
        }).array,
        "num": Mock.mock({
            'array|10': ['@integer(1, 100)']
        }).array,
    },
    "code":200
}

const leftCenter={
    "result": "success",
    "data": Mock.mock({
        'array|10': [{
            "name": '@city',
            "value": '@integer(30, 100)'
        }]
    }).array,
    "code":200
}

const leftBottom={
    "result": "success",
    "data": {
        "dateTime": [2015,2016,2017,2018,2019,2020,2022,2023,2024,2025],
        "temperature1": Mock.mock({
            'array|10': ['@integer(20, 45)']
        }).array,
        "temperature2": Mock.mock({
            'array|10': ['@integer(20, 45)']
        }).array,
    },
    "code":200
}

chartData.leftTop=leftTop
chartData.leftCenter=leftCenter
chartData.leftBottom=leftBottom
export default chartData
