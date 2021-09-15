const { db } = require("./../persistence");
const { stringifySync } = require('subtitle');
var fs = require('fs');

function defaultChatCell() {
    return {
        "timestamp": Date.now(),
        "userLV": -1,
        "username": "@llc@",
        "chatText": "start_history",
        "srtTimestamp": 0
    };
}

db.defaults({
    roomID: "12345",
    chat_history: [defaultChatCell()]
}).write();

module.exports.addNewChatCell = function (chatText) {
    const chatCells = db.get("chat_history");
    var srtTimestamp = 0;
    if (chatCells.length > 0) {//TODO:這是一個db物件，不是array屬性，下同，要修正
        srtTimestamp = Date.now() - chatCells[0].timestamp;
    }
    const res = chatCells
        .insert({
            "timestamp": Date.now(),
            "userLV": -2,
            "username": "@llc@",
            "chatText": chatText,
            "srtTimestamp": srtTimestamp
        })
        .write();

    return res;
};

module.exports.dbInit = function (roomID) {
    db.set("roomID", roomID)
        .write();

    db.set("chat_history", [])
        .write();

    return true;
};

module.exports.exportSRT = function (fileDir) {
    const list = [];
    const chatCells = db.get("chat_history");
    const roomID = db.get("roomID");

    for (let chatCell in chatCells) {
        list.push({
            type: 'cue',
            data: {
                start: chatCells[chatCell].srtTimestamp,
                end: (chatCell + 1 >= chatCells.length) ? chatCells[chatCell] + 1 : chatCells[chatCell + 1].srtTimestamp,
                text: chatCells[chatCell].chatText
            }
        });
    }
    return new Promise(function (resolve, reject) {
        fs.writeFile(fileDir + '/' + roomID, stringifySync(list), function (err) {
            if (err) reject(err);
            resolve();
        });
    });
};