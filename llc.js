//============NPM============

//chrome
const puppeteer = require('puppeteer'); //if no '"type": "module"' in package.json
//import { puppeteer } from 'puppeteer'

//argc
const yargs = require('yargs/yargs') //if no '"type": "module"' in package.json
//import { yargs } from 'yargs/yargs'
const { hideBin } = require('yargs/helpers') //if no '"type": "module"' in package.json
//import { hideBin } from 'yargs/helpers'
const argv = yargs(hideBin(process.argv)).argv
//argv

//==========END NPM==========

//global variables
var tmp_chat_list = [];
var bool_continue = true;

if(argv.room){
    console.log(argv.room);
}

/*main
(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.lang.live/room/3795137');
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
            }else{
                await browser.close();
            }
        } catch (error) {//kill app
            console.log(error);
            bool_continue=false;
            await browser.close();
        }
    }

})();
*/