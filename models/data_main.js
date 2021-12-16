const { db } = require("./../persistence");
const { stringifySync } = require('subtitle');
var fs = require('fs');

var EventEmitter = require('events').EventEmitter;

var this_event = module.exports.event = new EventEmitter();

this_event.on('some_event', function() {
    console.log('this_event -> some_event 事件觸發');
});

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
    const chatCells_array = db.get("chat_history")
        .cloneDeep()
        .value();
    var srtTimestamp = 0;
    if (chatCells_array.length > 0) {
        srtTimestamp = Date.now() - chatCells_array[0].timestamp;
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
        .write();//TODO:why this wont work???

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
                start: chatCells[chatCell].srtTimestamp,//TODO:這是一個db物件，不是array屬性，下同，要修正
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

module.exports.pop = function () {
    db.set("roomID", roomID)
        .write();//TODO:why this wont work???

    db.set("chat_history", [])
        .write();

    return true;
};