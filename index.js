'use strict';

const cfg     = require('./config.js');
const pkg     = require('./package.json');
const Discord = require('discord.js');
const yt_command = require("./play_yt.js");
const soundboard = require("./soundboard.js")
const funnyClub = require("./funnyclub.js")
const bot     = new Discord.Client();


bot.on('message', msg => {
    if (msg.author.bot) {
        return;
    }

    let found = false;
    if (msg.content.startsWith(`${cfg.prefix}yt`)) {
        yt_command.playYT(msg).then(r => console.log(r));
        found = true;
    } else if (msg.content.startsWith(`${cfg.prefix}ugly`)) {
        soundboard.playUglyBarnacle(msg).then(r => console.log(r));
        found = true;
    } else if (msg.content.startsWith(`${cfg.prefix}crazy`)) {
        soundboard.playCrazy(msg).then(r => console.log(r));
        found = true;
    } else if (msg.content.startsWith(`${cfg.prefix}simp`)) {
        soundboard.playSimp(msg).then(r => console.log(r));
        found = true;
    } else if (msg.content.startsWith(`${cfg.prefix}help`)) {
        let helpMessage = soundboard.help + funnyClub.help;
        msg.channel.send(helpMessage);
        found = true;
    } else if (msg.content.startsWith(`${cfg.prefix}fc`)) {
        funnyClub.handleFunnyCommand(msg);
    } else if (funnyClub.isVoting) {
        funnyClub.registerVote(msg);
    }

    if (found && cfg.deleteAfterReply.enabled) {
        console.log(`"${msg.author.username}" typed "${msg.content}"`)
        msg.delete({timeout: cfg.deleteAfterReply.time});
    }
});


bot.login(cfg.token).then(() => {
    console.log('Running!');
});