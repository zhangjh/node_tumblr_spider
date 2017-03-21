/*jshint esversion: 6 */
let common = require('../lib/common');
let redis = require('../lib/redis').redis;
let request = require('request');

//设置默认爬取起始点及爬取深度
const user = process.argv.slice(2)[0] || USER;
const depth = process.argv.slice(2)[1];

let torrent_url = API_URL_PRE + user + ".tumblr.com/posts/" + TYPE + "?api_key=" + API_KEY + "&reblog_info=true";
console.log("Starting url: " + torrent_url);

function getTotalPage(url) {
  const p = new Promise((resolve,reject) => {
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
  return p;
}

function doGet(url, page, totalPage) {
  common.sendRequest(url, page, () => {
    common.sleep(60 * 1000, () => {
      if (page++ <= totalPage) {
        doGet(url, page, totalPage);
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
              main(url);
            }
          }
        });

      }
    });
  });
}

function main(url) {
  getTotalPage(url).then(totalPages => {
    console.log(totalPages);
    doGet(url,0,totalPages);
  }).catch(e => {
    console.log("Error:" + e);
  });
}

// Start from torrent url
main(torrent_url);