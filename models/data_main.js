await import { join, dirname } from 'path'
await import { Low, JSONFile } from 'lowdb'
await import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url));

// Use JSON file for storage
const file = join(__dirname, 'db.json')
const adapter = new JSONFile(file)
const db = new Low(adapter)

// Read data from JSON file, this will set db.data content
await db.read()

// If file.json doesn't exist, db.data will be null
// Set default data
db.data ||= { posts: [] }
// db.data = db.data || { posts: [] } // for node < v15.x

// Create and query items using plain JS
db.data.posts.push('hello world')
db.data.posts[0]

// You can also use this syntax if you prefer
const { posts } = db.data
posts.push('hello world')

// Write db.data content to db.json
await db.write()

/*
function defaultChatCell() {
    return {
        "timestamp": Date.now(),
        "lv": "history_start",
        "username": "history_start",
        "chatText": "history_start"
    };
}

db.defaults({
    roomID: "default",
    chatHistory: [defaultChatCell()]
}).write();

module.exports.addNewBoard = function () {
    const chatHistory = db.get("chatHistory");
    const res = chatHistory
        .insert({
            "timestamp": Date.now(),
            "lv": "addNewBoard",
            "username": "addNewBoard",
            "chatText": "addNewBoard"
        })
        .write();

    return res;
};
*/

module.exports.test = function () {
    // Read data from JSON file, this will set db.data content
    await db.read()

    // If file.json doesn't exist, db.data will be null
    // Set default data
    db.data ||= { posts: [] }
    // db.data = db.data || { posts: [] } // for node < v15.x

    // Create and query items using plain JS
    db.data.posts.push('hello world')
    db.data.posts[0]

    // You can also use this syntax if you prefer
    const { posts } = db.data
    posts.push('hello world')

    // Write db.data content to db.json
    await db.write()
};