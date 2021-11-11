const jwt = require("jsonwebtoken");
const pool = require('../config/database');
module.exports = {
  checkToken: (req, res, next) => {
    let authHeader = req.headers['authorization'];
    let token = authHeader && authHeader.split(' ')[1];
    if (token) {
      jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err) {
          return res.json({
            success: false,
            message: "Invalid Token..."
          });
        } else {
          req.decoded = decoded;
          if (decoded.result.username.toLowerCase() === 'admin') {
            next()
            return
          }

          const query = 'select token,suspended,usertype,password_changed,username,balance,exposure from users where username=?'
          pool.query(query, [decoded.result.username], (error, results, fields) => {
            if (error)
              return res.json({
                success: false,
                message: "Database Error"
              });
            if (results.length && (results[0].token === token || results[0].usertype !== '5') && !results[0].suspended && (1 || !results[0].password_changed || req.body.pass_me)) {
              next();
            } else if (results.length && results[0].password_changed) {

              return res.json({
                success: false,
                password_changed: true,
                username: results[0].username,
                usertype: results[0].usertype,
                balance: results[0].balance,
                exposure: results[0].exposure
              })
            }
            else {
              return res.json({
                success: false,
                message: "Invalid Token..."
              });
            }

          })
        }
      });
    } else {
      return res.json({
        success: false,
        message: "Access Denied! Unauthorized User"
      });
    }
  },
  checkTokenSuperAdmin: (req, res, next) => {
    let authHeader = req.headers['authorization'];
    let token = authHeader && authHeader.split(' ')[1];
    if (token) {
      jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err) {
          return res.json({
            success: false,
            message: "Invalid Token..."
          });
        } else {
          req.decoded = decoded;
          next();
        }
      });
    } else {
      return res.json({
        success: false,
        message: "Access Denied! Unauthorized User"
      });
    }
  }
};