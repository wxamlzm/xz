//引入框架模块
const express = require('express');
//引入路由器模块
const user = require('./routes/user');

//新建web服务器和端口
const app = express();

app.listen(8080, ()=>
{
    console.log("连接陈宫");
});

//设置post数据解析中间件
app.use(express.urlencoded
({
    extended:false
}));

//挂载路由器，添加前缀/v1/users
app.use('/v1/users', user);

//挂载错误处理中间件
app.use((err, req, res, next)=>
{
    console.log(err);
    res.status(500),send({code:500, msg:'服务器端错误'});
});