/*jshint esversion: 6 */
/**
 * Created by zhangjihong on 2017/3/18.
 * Des: Common funcs.
 */
const fs = require('fs');
const path = require('path');
const request = require('request');
const spawn = require('child_process').spawn;
require("../conf/config");
const redis = require("../lib/redis").redis;

const LOCK_PATH = "../lock";

function isExists(file) {
  try {
    fs.accessSync(file);
    return true;
  } catch (e) {
    return false;
  }
}

function sleep(time, callback) {
  //只有存在并发锁的时候才循环等待
  if (isExists("./lock")) {
    //存在并发锁，等待
    let timer = setInterval(() => {
      console.log("Downloading...download on page once.");
    }, time);
  } else {
    callback();
  }
}

function mkLock() {
  if(!isExists(LOCK_PATH)){
    // add lock when lock is not exist
    try {
      console.log("Add lock");
      fs.writeFileSync(LOCK_PATH);
    }catch (e){
      console.error("Add lock failed:" + e);
    }
  }
}

function releaseLock() {
  if(isExists(LOCK_PATH)){
    // release lock when lock is exist
    try {
      console.log("Release lock.");
      fs.unlinkSync(LOCK_PATH);
    }catch (e){
      console.error("Release lock failed:" + e);
    }
  }
}

function mkdirs(dirpath, mode, callback) {
  if(isExists(dirpath)){
    mkdirs(path.dirname(dirpath),mode,() => {
      fs.mkdir(dirpath,mode,callback);
    });
  }else {
    callback(dirpath);
  }
}

function wget(url, options, cb) {
  const downloadDir = DOWN_LOAD_PRE + options.user.replace(/\s/, "_") + "/";
  if(!isExists(downloadDir)){
    mkdirs(downloadDir,() => {
      console.log("创建" + downloadDir);
    });
  }
  redis.smembers("downloadedUrls",function (err, reply) {
    if(err){
      console.error(err);
      return;
    }
    if(reply.indexOf(url) == -1){
      // url not exist in downloadedUrls
      redis.sadd("downloadedUrls",url);
      let cmd = "wget -P " + downloadDir + " -c " + url;
      console.log(cmd);
      let wget = spawn('wget', ["-P", downloadDir, "-c", url]);
      let ret = "";
      let cnt = 0;
      wget.stderr.on("data", data => {
        if(LOG_MODE){
          ret += data;
          if (cnt++ === 30) {
            console.log(ret);
            ret = "";
            cnt = 0;
          }
        }else {
          console.log("Don't show download progress.");
        }
      });
      wget.on("exit",code => {
        cb(code);
      });
    }else {
      console.log(url + " has been downloaded.");
    }
  });
}

function sendRequest(url, page, cb) {
  mkLock();
  request(url + "&offset=" + page, (e, r, b) => {
    if (e) {
      console.error(e);
    } else {
      let result = parseResult(b);
      let promiseArr = [];
      result.posts.map(post => {
        if (post.video_type === "tumblr") {
          let p = new Promise((resolve) => {
            wget(post.video_url, {user: USER}, resolve);
          });
          promiseArr.push(p);
          //Get reblogged users
          if(post.reblogged_from_name){
            redis.sadd("users",post.reblogged_from_name);
          }
        }
      });
      Promise.all(promiseArr).then(() => {
        //一轮完成释放并发锁
        releaseLock();
        cb();
      });
    }
  });
}

function parseResult(result) {
  const PER_PAGE = 20;
  let response = JSON.parse(result).response;
  let total = response.total_posts;
  let pages = Math.ceil(total / PER_PAGE);
  let posts = response.posts;
  return {
    total: total,
    pages: pages,
    posts: posts
  };
}

module.exports = {
  sleep: sleep,
  mkdirs: mkdirs,
  wget: wget,
  sendRequest: sendRequest,
  parseResult: parseResult,
  releaseLok: releaseLock
};
