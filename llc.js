const puppeteer = require('puppeteer');

var tmp_chat_list = [];
var bool_continue = true;

(async () => {
    const browser = await puppeteer.launch(
        {
            //headless: false
        }
    );
    const page = await browser.newPage();
    async function main_load_loop() {
        await page.goto('https://www.lang.live/room/3650741');
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
                            }
                        }
                        tmp_chat_list = targets;
                    } else {
                        await browser.close();
                    }
                } catch (error) {//kill app
                    console.log(error);
                    bool_continue = false;
                    await browser.close();
                }
            }
        }
    }
    main_load_loop();
})();
