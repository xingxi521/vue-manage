/**
 * 环境变量配置
 */
const env = import.meta.env.MODE;
const EnvConfig = {
    development:{
        // baseUrl:'https://www.fastmock.site/mock/756303ac8aae70f35d0436f5f51b7ac6/api',
        baseUrl:'/api',
    },
    test:{
        baseUrl:'https://www.fastmock.site/mock/756303ac8aae70f35d0436f5f51b7ac6/api',
    },
    prod:{
        baseUrl:'https://www.fastmock.site/mock/756303ac8aae70f35d0436f5f51b7ac6/api',
    }
}
export default {
    env,
    mock:true,
    stroageSpace:'manger',//本地存储的命名空间
    ...EnvConfig[env]//根据不同的环境变量解构出对应的地址参数
}