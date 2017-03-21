# node_tumblr_spider
一个Node.js编写的tumblr爬虫，可配置化抓取图片、视频、音频等tumblr资源

![](https://img.shields.io/badge/Node-%3E%3D%20V4-brightgreen.svg)
[![GPL Licence](https://badges.frapsoft.com/os/gpl/gpl.svg?v=103)](https://opensource.org/licenses/GPL-3.0/)  [![Open Source Love](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://github.com/ellerbrock/open-source-badge/)  [![Edit By zhangjh](https://img.shields.io/badge/EditBy-Zhangjh-brightgreen.svg?maxAge=2592000)](https://github.com/zhangjh/hello-blog)

# 概述
- `node_tumblr_spider`顾名思义是一个针对tumblr汤不热的爬虫项目
- 如果说[岛国丽人](https://github.com/zhangjh/islandBeauty)只是一个种子下载器，这个项目算是一个真正的爬虫了。它可以配置一个种子用户，程序会依照这个配置的用户依次爬取配置的待下载文件类型， 从配置的种子用户开始，再依次爬取该用户转发过的用户的符合类型的文件，直到所有的用户都已经被下载过。这是一个爬虫的基本特征。

# 社交
- [微博](http://login.sina.com.cn/sso/login.php?url=http%3A%2F%2Fweibo.com%2Fjhspider&_rand=1472023636.7234&gateway=1&service=miniblog&entry=miniblog&useticket=1&returntype=META&_client_version=0.6.23)

- [我的博客](http://5941740.cn)

- [藏经阁](http://favlink.me)

欢迎通过上述方式与我联系

# 用法
## 1. 环境&依赖

　1.1 环境
  
　本项目需要Node版本至少大于4.0，建议安装官网最新版。
　[安装Node](https://nodejs.org/en/)根据环境安装对应版本，Windows建议额外安装Win下的终端软件，推荐[babun](https://github.com/babun/babun)作为终端代替cmd。

　1.2 依赖
  
　项目依赖redis作为队列管理，需要安装redis服务
　[安装redis](http://www.redis.cn/download.html)

## 2. 下载

[zip](https://github.com/zhangjh/node_tumblr_spider/archive/master.zip)或者git clone项目源码

## 3. 安装项目依赖
```
    cd node_tumblr_spider
    npm install -d
```

## 4. 运行爬虫

如果需要修改默认配置文件，可以修改`./conf/config.js`文件，汤不热在大陆被封，不能直接访问，大陆用户需要科学上网

可以在终端下运行`ping www.tumblr.com`看下网络是否通畅
```
    npm start
```

如果有树莓派或者智能路由一类的设备就再好不过了，可以开着让它一直去爬。

如果是普通PC的话爬取一段时间后可以自行`Ctrl+C`终止，足够你鲁初雪了...

## 5. 关于配置文件

默认配置文件已经足够，作为老司机已经给你们指明了通往汤不热的路。

通常要修改的话，你也只需要修改`USER`-种子用户名，`DOWNLOAD_PRE`-下载路径前缀，如果你的redis不是部署在本地，那么你可以需要修改一下`REDIS_HOST`和`REDIS_PORT`.
`LOG_MODE`用来设置是否显示下载阶段的日志。

如果没有修改配置里的下载路径话，下载的文件将保存在`./download/${user}`下

# 示例
# 忠告

技术是一把双刃剑，tumblr上有很多很有用的资源，如果你拿来做羞羞的事情，在这么强有力的工具支撑下，小心营养跟不上了。。
请时刻牢记历史赋予我们的使命：
>  为中华民族之崛起而奋斗终生！ 
