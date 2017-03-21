/**
 * Created by jihong.zjh on 2017/3/20.
 */
const redis = require("../lib/redis").redis;

// let url = "http://www.baidu.com";
// redis.sadd("test",url);
redis.smembers("test",function (err, reply) {
  console.log(reply);
  redis.sadd("test","http://www.xxxxoo.com");
});

// redis.smembers("test",function (err, reply) {
//   console.log(reply);
//   if(reply.indexOf(url) !== -1){
//     console.log("already downloaded");
//   }else {
//     console.log("to download");
//     redis.sadd("bigset",1);
//   }
// });

// redis.quit();