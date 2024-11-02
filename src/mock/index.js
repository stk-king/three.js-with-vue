import chartData from "@/mock/json/chartData";

const Mock = require('mockjs');
//格式： Mock.mock( url, post/get , 返回的数据)；
Mock.mock('/user/list', 'get', require('./json/users'));
Mock.mock('/mastCity/leftTop/list', 'get', chartData.leftTop);
Mock.mock('/mastCity/leftCenter/list', 'get', chartData.leftCenter);
Mock.mock('/mastCity/leftBottom/list', 'get', chartData.leftBottom);
Mock.mock('/province/china', 'get', require('./json/china.json'));
Mock.mock('/province/jiangxi', 'get', require('./json/jiangxi.json'));
Mock.mock('/province/fujian', 'get', require('./json/fujian.json'));
