//模拟创建一个服务器，了解nodejs作为服务器环境时的用法
//此教程仅为了帮助了解nodejs后端用法，没有实际去连接数据库，其中数据库使用user的json数据代替

import { createServer } from 'http'
import { parse } from 'url'
import { parse as _parse } from 'querystring'
import { readFile } from 'fs'

console.log("我启动了")
//用一个json代替用户数据库
let user={
    admin:123456,
    xiao:888
}

//笔记：
//1 url模块解析get请求的url得到参数
//2 querystring模块解析post请求的buffer数组组成的字符串，得到参数
//3 req.url req.method,req.on都是不同获取参数的方式
//4 res.end用来响应返回值，若错误err=1否则=0，和返回值msg(提示信息)
//5 fs模块用来读取静态文件，若错误err=1否则=0，和返回值data（文件内容）
createServer((req,res)=>{
    console.log("发送了请求")
    //获取数据
    let path,get,post
    if(req.method=='GET'){
        let {pathname,query} =parse(req.url,true)
        path=pathname
        get=query//得到json参数
    complete()
    }else if(req.method=='POST'){
        let arr=[]
        path=req.url
        req.on('data',buffer=>{
            arr.push(buffer)
        })
        req.on('end',()=>{
            post=_parse(Buffer.concat(arr).toString())//得到擦书
            complete()
        })  
    }

    function complete(){
        if(path=='\login'){
            res.writeHead(200,{
                "Content-Type":"text/plain;charset=utf-8"
            })
            let{username,password}=get //获取各个参数
            if(!user[username]){//如果没有这个用户名
                res.end(JSON.stringify({
                    err:1,
                    msg:"用户名不存在"
                }))
                }else if(user[username!=password]){
                    res.end(JSON.stringify({
                        err:1,
                        msg:"密码错误"
                    }))
                }else {
                    res.end(JSON.stringify({
                       err:0,
                       msg:"登陆成功" 
                    }))
                }
        } else if(path=='\reg'){
            res.writeHead(200,{
                "Content-Type":"text/plain;charset=utf-8"
            })
            let{username,password}=post
            if(user[username]){
                res.end(JSON.stringify({
                    err:1,
                    msg:"用户名已存在"
                }))
            }else{
                user[username]=password
                res.end(JSON.stringify({
                    err:0,
                    msg:"注册成功"
                }))
            }
        }else{
            readFile('www${path}',(err,data)=>{
                if(err){
                    res.end('404')
                }else{
                    res.end(data)
                }
            })
        }
    }
}).listen(8888)


//写接口之前要定义好接口的①名称②参数③返回值
// 这里写了两个接口
// 第一个接口名称：login
// 参数：username password
// 返回值{err:0/1  msg:"提示信息"}
// 第二个接口名称：reg
// 参数：username password
// 返回值

//运行方法：node app.js  即启动起来了服务器
//在所监听端口处调用接口即可运行函数，例如浏览器端访问locahost:8888，调用get请求或post请求