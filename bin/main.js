const exec = require('child_process').exec;
const request = require('request');
const fs = require('fs');
const path = require('path');

//设置默认爬取起始点及爬取深度
const user = process.argv.slice(2)[0] || "seoul92-choi";
const depth = process.argv.slice(2)[1];

let url = API_URL_PRE + user + ".tumblr.com/posts/" + TYPE + "?api_key=" + API_KEY;
console.log("Starting url: " + url);

function main(){
  request(url,(e,r,b) => {
    if(e){
      console.error(e);
      return;
    }
    let response = JSON.parse(b).response;
    let total = response.total_posts;
    let pages = Math.ceil(total / 20);

    for(let page = 0;page <= pages;page ++){
      sleep(60 * 1000).then(() => {
        sendRequest(url,page);
      });
    }     
  });  
}

function mkLock(){
  fs.stat("./lock",(err,stats) => {
    if(err){
      fs.writeFile("./lock");
    }
  });
}

function releaseLock(){
  fs.stat("./lock",(err,stats) => {
    if(!err){
      fs.unlink("./lock");
    }
  });
}

function sleep(time){
    return new Promise((resolve,reject) => {
	fs.stat("./lock",(err,stats) => {
	  if(err){
	    resolve();
	  }else {
	    let timer = setInterval(() => {
	      fs.stat("./lock",(err,stats) => {
	        if(err){
		  clearInterval(timer);
		  resolve();
		}
	      });
	    },time);
	  }
	});
    });
}

function sendRequest(url, page, cb){
    //console.log("pageUrl: " + url);
    // 添加并发锁
    mkLock();
    request(url + "&offset=" + page, (e,r,b) => {
        if(e){
	    console.error(e);
	    return;
	}
	let response = JSON.parse(b).response;
	let posts = response.posts;
	let total = response.total_posts;
	let pages = Math.ceil(total / 20);
	posts.map(post => {
	    if(post.video_type === "tumblr"){
	        console.log(post.video_url);
	        wget(post.video_url,user);
	    }
        });
	// 下载完成，释放并发锁
	releaseLock();
    });
}

// 创建所有目录
function mkdirs(dirpath, mode, callback) {
    fs.stat(dirpath,(err,stats) => {
      if(!err){
        callback(dirpath);
      }else {
        mkdirs(path.dirname(dirpath),mode,() => {
	  fs.mkdir(dirpath,mode,callback);
	});
      }
    });
};


function wget(url,user){
    const downloadDir = process.cwd() + "/download/" + user + "/";
    fs.stat(downloadDir,(err,stats) => {
      if(err){
        mkdirs(downloadDir,() => {
	  console.log("创建" + downloadDir);
	});
      }
    });
    console.log("cmd: wget -P " + downloadDir + " -c " + url);
    let wget = exec("wget -P " + downloadDir + " -c " + url,function(err,stderr,stdout){
    	if(err)console.error(err);
	else {
	    console.log(stderr);
	    console.log(stdout);
	}
    });
}

main();
