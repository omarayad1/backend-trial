var express = require('express');
var path = require('path')
var sqlite3 = require("sqlite3").verbose();
var sql_queries = require('./helpers/sql_gen_ltv.js');

var dbPath = path.resolve(__dirname, '../assignment1/db/assignment1.db')
var db = new sqlite3.Database(dbPath);

var router = express.Router();

var allowed_months = ['3','9','18']

router.get('/', function(req, res, next) {
  if (req.query.months && req.query.commission && allowed_months.indexOf(req.query.months)+1){
    db.all(sql_queries.fmt_sql(req.query.months), function(err, rows){
      res.render('report/report', { data: rows, commission: req.query.commission, months: req.query.months});
    });
  } else {
    res.render('report/report')
  }

});

module.exports = router;
