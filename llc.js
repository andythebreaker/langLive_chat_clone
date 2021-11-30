const puppeteer = require('puppeteer');
const { PuppeteerScreenRecorder } = require('puppeteer-screen-recorder');
const Os = require('os');
const SimpleDateFormat = require('@riversun/simple-date-format');
const sdf = new SimpleDateFormat();

const screen_VP = { width: 1920, height: 1080 };
var tmp_chat_list = [];
var bool_continue = true;
const Config = {
    followNewTab: true,
    fps: 25,
    ffmpeg_Path: Os.homedir() + "\\ffmpeg\\ffmpeg.exe" || null,
    videoFrame: {
        width: screen_VP.width,
        height: screen_VP.height,
    },
    aspectRatio: '16:9',
};
const SavePath = './' + sdf.formatWith("'screenREC'yyyy_MM_dd'T'HH_mm_ss_SSS'.mov'", new Date(Date.now()));

(async () => {
    const browser = await puppeteer.launch(
        {
            //headless: false
        }
    );
    const page = await browser.newPage();
    await page.setViewport({ width: screen_VP.width, height: screen_VP.height });
    const recorder = new PuppeteerScreenRecorder(page, Config); // Config is optional
    await recorder.start(SavePath);
    async function main_load_loop() {
        await page.goto('https://www.lang.live/room/3686713',{waitUntil:"load"});
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
                                if (chat_cell.includes('藍熊')) {
                                    await recorder.stop();
                                    await browser.close();
                                }
                            }
                        }
                        tmp_chat_list = targets;
                    } else {
                        await recorder.stop();
                        await browser.close();
                    }
                } catch (error) {//kill app
                    console.log(error);
                    bool_continue = false;
                    await recorder.stop();
                    await browser.close();
                }
            }
        }
    }
    main_load_loop();
})();
