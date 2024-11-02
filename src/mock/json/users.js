import Mock from 'mockjs'
const data={
    "result": "success",
    "data":Mock.mock({
        'list|100-100':[
            {
                "username": Mock.mock('@cname'),
                "password": Mock.mock('@id'),
                "email":Mock.mock('@email'),
                "age": Mock.mock({"number|1-100": 100}).number,
                "imgUrl": "https://cdn.acwing.com/media/user/profile/photo/451956_lg_ad42f11f37.jpg"
            }
        ]
    }),
    "code":200
}
export default data
