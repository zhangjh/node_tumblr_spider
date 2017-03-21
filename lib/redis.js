/**
 * Created by zhangjihong on 2017/3/20.
 * Des: credis client util.
 */
require("../conf/config");
const PORT = REDIS_PORT;
const SERVER = REDIS_HOST;

const redis = require("redis");

const client = redis.createClient(
  PORT,SERVER
);

client.on("error", function (err) {
  console.log("Error " + err);
});

module.exports = {
  redis: client
};