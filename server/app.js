require('dotenv').config();
const apis = require('./config/api-config');
PORT= process.env.PORT||4000;

apis.app.listen(PORT,()=>{
    console.log(`Server running at port ${PORT}`);
});

// 2021/04/12 06:52:33 [error] 28476#28476: *3215 connect() failed (111: Connection refused) while connecting to upstream, client: 127.0.0.1, server: localhost, request: "GET / HTTP/1.0", upstream: "http://127.0.0.1:8080/"
// location / {
//     try_files $uri /index.html;
//  }
