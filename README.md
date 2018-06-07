# node_tumblr_spider 
##  A spider written to crawl tumblr resources by Node.js

[以中文阅读](https://github.com/zhangjh/node_tumblr_spider/blob/master/README_CN.md)

![](https://img.shields.io/badge/Node-%3E%3D%20V4-brightgreen.svg)
[![GPL Licence](https://badges.frapsoft.com/os/gpl/gpl.svg?v=103)](https://opensource.org/licenses/GPL-3.0/)  [![Open Source Love](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://github.com/ellerbrock/open-source-badge/)  [![Edit By zhangjh](https://img.shields.io/badge/EditBy-Zhangjh-brightgreen.svg?maxAge=2592000)](http://www.5941740.cn)

# Description

- `node_tumblr_spider` is a spider project to crawl tumblr resources
- You can configure the torrent user or resource type such as video to crawl.The spider will crawl start from the torrent user and then crawl the user which reblogged by the torrent user and go on until all the users have been downloaded.

# Social links

- [Weibo](http://weibo.com/jhspider)

- [My Blog -- Dante notes](http://zhangjh.me)

- [favLinks](http://favlink.me)

Welcome to cantact me.

# Usage
## 1. Install 

　Visit Node.js official website to install the latest node enviroment. 

　It's better to install babun, a better terminal replacement of cmd on Windows system.

## 2. Dependence

　It uses redis as queue. So you must [install redis](https://redis.io/) first.

## 3. Download Project

　[zip](https://github.com/zhangjh/node_tumblr_spider/archive/master.zip) OR `git clone https://github.com/zhangjh/node_tumblr_spider.git`

## 4. Install dependence
```
    cd node_tumblr_spider
    npm install -d
```

## 5. Start to crawl
```
   npm run start
```

## 6. About configuration

　You can modify the configuration at `./conf/config.js`.
```
    USER - the torrent user's name
    DOWNLOAD_PRE - the download dir prefix,default as `./download/${user}`
    REDIS_HOST - redis server's host
    REDIS_PORT - redis server's port
    LOG_MODE - if set false, the spider will not show the doawload progress info
```

# Demo
