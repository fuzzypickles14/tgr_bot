'use strict';

const cfg     = require('./config.js');
const pkg     = require('./package.json');
const Discord = require('discord.js');
const yt_command = require("./play_yt.js");
const soundboard = require("./soundboard.js")
const bot     = new Discord.Client();


bot.on('message', msg => {
    if (msg.content.startsWith(`${cfg.prefix}yt`)) {
        yt_command.playYT(msg);
    } else if (msg.content.startsWith(`${cfg.prefix}ugly`)) {
        soundboard.playUglyBarnacle(msg);
    }
});


bot.login(cfg.token).then(() => {
    console.log('Running!');
});