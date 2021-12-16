var EventEmitter = require('events').EventEmitter;

var this_event = module.exports.event = new EventEmitter();

var loc_const_room = "3650590";

module.exports.set_const_room = function (roomID) {
    loc_const_room = roomID;
};

module.exports.get_const_room = function () {
    return loc_const_room;
};

var loc_main_callback = null;

module.exports.set_main_callback = function (OBJcallback) {
    loc_main_callback = OBJcallback;
};

var tmp_counter = 0;

this_event.on('some_event', function () {
    tmp_counter++;
    console.log('this_event -> some_event 事件觸發');
    loc_main_callback(tmp_counter);
});


module.exports.main_async = async () => {
    const browser = await puppeteer.launch((bool_rec) ?
        {
            ignoreDefaultArgs: ["--enable-automation"],
            /*headless: false,*/
            executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
        } : {

        }
    );
    const page = await browser.newPage();
    await page.setViewport({ width: screen_VP.width, height: screen_VP.height });
    const recorder = (bool_rec) ? new PuppeteerScreenRecorder(page, Config) : null; // Config is optional
    if (bool_rec) await recorder.start(SavePath);

    async function main_load_loop() {
        await page.goto(`https://www.lang.live/room/${roomIDinput}`);
        var err404a = await page.$$eval("h1", err404 => err404.map(err404e => err404e.textContent));
        if (err404a.includes("404")) {
            console.log("Reloading due to an error on the live broadcast platform...");
            main_load_loop();
        } else {
            while (bool_continue) {
                try {
                    var bool_continue_array = await page.$$eval("p[color='#FFFFFF']", els_if_finish => els_if_finish.map(el_if_finish => el_if_finish.textContent));
                    if (bool_continue_array) {
                        if (bool_continue_array.includes("直播已結束")) {
                            bool_continue = false;
                        } else {
                            bool_continue = true;
                        }
                    } else {
                        bool_continue = true;
                    }
                    if (bool_continue) {
                        const targets = await page.$$eval('.message-history > *', els => els.map(el => el.textContent));
                        for (let targetTEXT in targets) {
                            var chat_cell = targets[targetTEXT];
                            if (!tmp_chat_list.includes(chat_cell)) {
                                console.log(chat_cell);
                                data_main.event.emit('some_event');
                                data_main.addNewChatCell(chat_cell);
                            }
                        }
                        tmp_chat_list = targets;
                    } else {
                        data_main.exportSRT(output_srt_dir);
                        if (bool_rec) await recorder.stop();
                        await browser.close();
                    }
                } catch (error) {//kill app
                    console.log(error);
                    bool_continue = false;
                    if (bool_rec) await recorder.stop();

                    await browser.close();
                }
            }
        }
    }
    main_load_loop();
}