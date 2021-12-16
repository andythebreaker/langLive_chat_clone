const langLiveRec = require('./index.js');

langLiveRec.set_const_room("3619520");

langLiveRec.set_main_callback((ans) => { console.log(ans); });

console.log(langLiveRec.get_const_room());

function lop() {
    langLiveRec.event.emit('some_event');
    setTimeout(() => {
        lop();
    }, 1000);
}

lop();