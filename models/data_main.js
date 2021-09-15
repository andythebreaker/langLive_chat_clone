const { db } = require("./../persistence");

function defaultBoard() {
    return {
        "test": "123"
    };
}

db.defaults({
    activeBoard: "default",
    boards: [defaultBoard()]
}).write();

module.exports.addNewBoard = function () {
    const boards = db.get("boards");

    const res = boards
        .insert({
            "test": "321"
        })
        .write();

    return res;
};
