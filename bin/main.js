/*jshint esversion: 6 */
/**
 * Created by zhangjihong on 2017/3/17.
 * Des: Main function, the entry of the spider.
 */
let common = require('../lib/common');
let redis = require('../lib/redis').redis;
let request = require('request');

let torrent_url = API_URL_PRE + USER + ".tumblr.com/posts/" + TYPE + "?api_key=" + API_KEY + "&reblog_info=true";
console.log("Starting url: " + torrent_url);

function getTotalPage(url) {
  return new Promise((resolve,reject) => {
    console.log(url);
    request(url, (e, r, b) => {
      if (e) {
        reject(e);
      } else {
        let result = common.parseResult(b);
        resolve(result.pages);
      }
    });
  });
}

function doGet(user,url, page, totalPage) {
  common.sendRequest(user,url, page, () => {
    common.sleep(60 * 1000, () => {
      if (page++ <= totalPage) {
        doGet(user,url, page, totalPage);
      } else {
        console.log("One user download all done.");
        redis.spop("users",function (err, reply) {
          if(err){
            console.error(err);
            redis.quit();
            process.exit();
          }else {
            if(!reply){
              console.log("All users have been downloaded.");
              redis.quit();
              process.exit();
            }else {
              let url = API_URL_PRE + reply + ".tumblr.com/posts/" + TYPE + "?api_key=" + API_KEY + "&reblog_info=true";
              main(url,reply);
            }
          }
        });

      }
    });
  });
}

function main(url,user) {
  getTotalPage(url).then(totalPages => {
    console.log(totalPages);
    doGet(user,url,0,totalPages);
  }).catch(e => {
    console.log("Error:" + e);
  });
}

// Start from torrent url
main(torrent_url,USER);
