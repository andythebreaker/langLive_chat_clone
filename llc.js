//============NPM============

//chrome
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
    ffmpeg_Path: "C:\\ProgramData\\chocolatey\\bin\\ffmpeg.exe" || null,
    // ffmpeg_Path: Os.homedir() + "\\ffmpeg\\ffmpeg.exe" || null,
    videoFrame: {
        width: screen_VP.width,
        height: screen_VP.height,
    },
    aspectRatio: '16:9',
};
const SavePath = './mp4video/' + sdf.formatWith("'screenREC'yyyy_MM_dd'T'HH_mm_ss_SSS'.mp4'", new Date(Date.now()));


//argc
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const argv = yargs(hideBin(process.argv)).argv;
//argv

//==========END NPM==========

var data_main = require('./models/data_main.js');

//global variables

var tmp_chat_list = [];
var bool_continue = true;
var output_srt_dir = "./outputsrt";
var roomIDinput = "3650590";

var bool_ui = false;
var bool_rec = true;


if (argv.room) {
    roomIDinput = String(argv.room);
}
if (argv.ui) {
    bool_ui = (String(argv.ui).toLowerCase === 'true') ? true : false;
}
if (argv.rec) {
    bool_rec = (String(argv.rec).toLowerCase === 'false') ? false : true;
}
console.log('roomID=' + roomIDinput);


data_main.dbInit();

//main

(async () => {
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
})();
