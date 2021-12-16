#!/usr/bin/env node
/*TODO[technical problem]
The writing method of direct execution may cause older windows computers to be unable to execute with node but with Microsoft's mechanism
Or need some kind of hyperlink (manual), for example: npm link*/

var term = require('terminal-kit').terminal;

var ttl = ['lang Live Rec', 'Unofficial Live Streaming Snippets Tool',
    'https://lang.live', 'https://github.com/andythebreaker/langLive_chat_clone'];

try {
    term.table([
        [ttl[0], ttl[1]], [ttl[2], ttl[3]]
    ], {
        hasBorder: true,
        contentHasMarkup: true,
        borderChars: 'lightRounded',
        borderAttr: { color: 'blue' },
        textAttr: { bgColor: 'default' },
        firstCellTextAttr: { bgColor: 'blue', color: 'yellow' },
        firstRowTextAttr: { bgColor: 'yellow', color: 'black' },
        firstColumnTextAttr: { bgColor: 'red', color: 'white' },
        width: 60,
        fit: true   // Activate all expand/shrink + wordWrap
    }
    );
} catch (error) {
    console.log()
}
