const { db } = require("./../persistence");

function defaultChatCell() {
    return {
        "timestamp": Date.now(),
        "userLV": -1,
        "username": "@llc@",
        "chatText": "start_history"
    };
}

db.defaults({
    roomID: "12345",
    chat_history: [defaultChatCell()]
}).write();

module.exports.addNewChatCell = function () {
    const chatCells = db.get("chat_history");

    const res = chatCells
        .insert({
            "timestamp": Date.now(),
            "userLV": -2,
            "username": "@llc@",
            "chatText": "addNewChatCell"
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