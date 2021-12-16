var EventEmitter = require('events').EventEmitter;

var this_event = module.exports.event = new EventEmitter();

this_event.on('some_event', function() {
    console.log('this_event -> some_event 事件觸發');
});