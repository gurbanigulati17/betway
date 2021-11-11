const redis = require('redis');
const keys = require('../keys')
let client

if (keys.NODE_ENV === 'production') {
    
    client = redis.createClient({
        user: keys.CACHE_USER,
        password: keys.CACHE_PASSWORD,
        host: keys.CACHE_HOST ,
        port: keys.CACHE_PORT,
        retry_strategy: () => 1000,
    });
}

client = redis.createClient({
    host: keys.CACHE_HOST ,
    port: keys.CACHE_PORT,
    retry_strategy: () => 1000,
  });

//client.flushall()
module.exports = client;