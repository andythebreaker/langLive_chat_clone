const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const lodashId = require('lodash-id');

const dataAdapter = new FileSync("./data_loc/data_file.json");
let db = low(dataAdapter);

db._.mixin(lodashId);

module.exports = {
  db
};