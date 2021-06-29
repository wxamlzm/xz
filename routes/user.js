// 引入模块
const express= require('express');
// 引入数据库公共模块
const pool = require('../pool');
// 创建路由器对象
const userRouter = express.Router();

//1.注册模块(post /reg)
//  地址：http://127.0.0.1:8080/v1/users/reg
userRouter.post('/reg', (req, res)=>
{
    // 1.1获取post请求的数据
    let reqObj = req.body;
    // 1.2遍历检验是否有值为空，如果有进行响应
    for(let k in reqObj)
    {
        if (!reqObj[k])
        {
            res.send({code:401, msg: `${k}为空`})
            return;
        }
    }
    // 验证手机号码格式
    if(!/^1[3-9]\d{9}$/.test(reqObj.phone))
    {
        res.send({code: 405, msg: '手机号码格式不正确'});
        return;
    }

    // 1.3 执行SQL命令
    let strSql = 'INSERT INTO xz_user SET ? '
    pool.query(strSql, [reqObj], (err, result, next)=>
    {
        if(err)
        {
            //如果有错误，那就抛给下一个错误处理中间件
            next(err);
            return;
        }
        console.log(result);
        res.send({code: 200, msg: '注册成功'});
    });
});

//2.登录模块(post /login)
//  地址：http://127.0.0.1:8080/v1/users/login
userRouter.post('/login', (req, res)=>
{
    //获取Post传递的数据
    //验证各项是否为空
    let uname = req.body.uname;
    let upwd = req.body.upwd;
    if(!uname)
    {
        res.send({code:401, msg:'请填写用户名'});
        return;
    }
    if(!upwd)
    {
        res.send({code:401, msg:'请填写密码'});
        return;
    }

    // 执行SQL
    let strSql = "SELECT * FROM xz_user WHERE uname=? AND upwd=?";
    pool.query( strSql, [uname,upwd], (err, result, next)=>
    {
        if(err)
        {
            next(err);
            return;
        }
        if(0 === result.length)//对象判断属性affectrows，数组判断长度
        {
            res.send({code:200, msg:"登录成功"})
        }
        else
        {
            res.send({code:200, msg:"登录失败"});
        }
    });
});

//3.修改模块(put /)
//  地址：http://127.0.0.1:8080/v1/users
userRouter.put('/', (req, res, next)=>
{
    let reqObj = req.body;//post取值
    let uid = reqObj.uid;

    // 遍历对象得到属性值，检查修改的值不为空
    for (let k in reqObj)
    {
        if(!reqObj[k])
        {
            res.send({code: 401, msg: `${k}不能为空`})
            return;
        }
    }

    // 准备并执行SQL语句
    let strSql = 'UPDATE xz_user SET ? WHERE uid=?';
    pool.query(strSql, [reqObj,uid], (err, result)=>
    {
        if(err)
        {
            next(err);
            return;
        }
        //根据执行结果，给到对应的响应给到前端
        if(0 === result.affectedRows)
        {
            res.send({code:201, msg:"修改失败"});
        }
        else
        {
            res.send({code:200, mag:"修改成功"});
        }
    });
});

//4.用户列表（get /)
//  地址：http://127.0.0.1:8080/v1/users?pno=1&count=5
userRouter.get('/', (req, res, next)=>
{
    // 4.1 获取get传递数据
    let obj = req.query;//URL取值
    
    // 4.2 如果页码和每页数据量为空，那设置默认值
    if(!obj.pno)
    {
        obj.pno = 1;
    }
    if(!obj.count)
    {
        obj.count = 5;
    }
    
    // 4.3 计算开始查询的值
    let start = (obj.pno - 1)*obj.count;
    // 4.4 将每页的数据量转为数值型
    let size = parseInt(obj.count);
    // 4.5 执行SQL命令
    let strsql = 'SELECT uid,uname,email,phone FROM xz_user LIMIT ?,?';

    pool.query(strsql, [start, size], (err,result)=>
    {
        if(err)
        {
            next(err);
            return;
        }
        console.log(result);
        res.send({conde:200, msg:'查询成功', data:result});
    });
});

//5.删除用户(delete /编号)
//  地址：http://127.0.0.1:8080/v1/users/5
userRouter.delete('/:uid', (req, res, next)=>
{
    // 5.1获取数据
    let obj = req.params;//路由传参取值
    // 5.2验证是否为空
    
    // 5.3执行SQL命令
    let strsql = 'DELETE FROM xz_user WHERE uid=?';
    pool.query(strsql, [obj.uid], (err, result)=>
    {
        if(err)
        {
            next(err);
            return;
        }

        //对象判断属性affectedRows，数组判断长度
        if(0=== result.affactedRows)
        {
            res.send({code:200, msg:"删除失败"});
        }
        else
        {
            res.send({code:200, msg:"删除成功"});
        }
    });
});

//6.查询模块
//  地址：http://127.0.0.1:8080/v1/users/:uid;
userRouter.get('/:uid', (req, res, next)=>
{
    // 6.1获取数据
    // 6.1.1路由传参用params，post用body和中间件配合，url传参用query解析的数据
    let reqobj = req.params;

    // 6.2验证数据有效性

    // 6.3执行SQL语句
    let strsql = "SELECT* FROM xz_user WHERE uid=?";
    pool.query(strsql, [reqobj.uid], (err,result)=>
    {
        if(err)
        {
            next(err);
            return;
        }
        //结构为数组，如果数组长度为0，说明该用户不存在，否则查询成功
        if(result.length === 0)
        {
            res.send({code:201, msg:"该用户不存在"});
        }
        else
        {
            res.send({code:200, msg:"查询成功", data:result});
        }
    });
});

module.exports = userRouter;