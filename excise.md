###练习1：
- ~~在`app.js`下创建服务器，并设置端口~~
- ~~在`user.js`下创建路由器对象，添加用户注册路由(post /reg),响应"注册成功“； 导出路由器对象~~
- ~~在`app.js`下引入路由器user.js(./routes/user.js),挂载到web服务器，添加前缀/v1/users~~
- ~~`login.js`，添加用户登录接口(post, /login)，获取post请求的数据验证数据是否为空，是到数据库中查询用户名和密码同时匹配的数据（条件查询），如果有响应登录成功，否则登录失败~~
- ~~`alter.js` (put, /),以body方式传递(uid, email, phone, user_name, gender)，判断各项数据是否为空;执行SQL命令~~
- 用户列表（get /), 传递当前的页码和每页的数据量，进行分页查询,获取传递的数据（req.ruery()）,最后响应{code:200, msg:'查询成功',data:[]};
    - http://127.0.0.1:8080/v1/users?pno=1&count=5

- 删除用户(delete /编号)
    - http://127.0.0.1:8080/v1/users/5
- 检测用户名是否可用 /check/uname?uname=xxx
- 检测邮箱是否可用   /check/mail?email=xxx
- 检测手机号号码是否可用 /check/phone?phone=xxx

## `git`准备
- 安装软件
- 码云
- github
