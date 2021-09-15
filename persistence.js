const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const lodashId = require('lodash-id');

const dataAdapter = new FileSync("./data_loc/data_file.json");
let db = low(dataAdapter);

db._.mixin(lodashId);

module.exports = {
    db
};

/*
For the following reasons, please do not use the latest version of the database
https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c
*/