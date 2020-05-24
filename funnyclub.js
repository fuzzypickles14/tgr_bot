'use strict';
const fs = require("fs");

module.exports = {
    handleFunnyCommand: (msg) => {
        const args = msg.content.split(" ");
        if (args.length === 2) {
            if (args[1].toUpperCase() === "RANK") {
                module.exports.printRank(msg);
            }
        } else if (args.length === 3) {

        } else {
            msg.channel.send(`You didn't provide enough arguments ${msg.author}, that isn't very funny.`)
        }
    },

    printRank: (msg) => {
        fs.readFile("funnyclub.json", ((err, data) => {
            if (err) {
                console.log(err);
            } else {
                const json = JSON.parse(data);
                let isInFunnyClub = false;
                for (let i = 0; i < json.users.length; i++) {
                    if (json.users[i].username.toUpperCase() === msg.author.username.toUpperCase()) {
                        isInFunnyClub = true;
                        msg.channel.send(`${msg.author}!, Your rank is "${module.exports.getRankFromPoints(json.users[i].points)}".`)
                    }
                }
                if (!isInFunnyClub) {
                    msg.channel.send(`Oops! Looks like you are not in the funny club ${msg.author}! Let me add you!`);
                    json.users.push({username: msg.author.username, points: 0, karma: 20});
                    const jsonString  = JSON.stringify(json);
                    fs.writeFile("funnyclub.json", jsonString, (err) => {
                        console.log(err);
                    });
                }
            }
        }));
    },

    getRankFromPoints: (points) => {
        if (points <= -1000) {
            return "Just plain disappointing"
        } else if (points <= -900) {
            return "Ben Shapiro"
        } else if (points <= -800) {
            return "Stinky poopy booby baby"
        } else if (points <= -700) {
            return "Simp"
        } else if (points <= -600) {
            return "Drying Paint"
        } else if (points <= -500) {
            return "I spilled my drink"
        } else if (points <= -400) {
            return "Potato"
        } else if (points <= -300) {
            return "Dreadfully Unfunny"
        } else if (points <= -200) {
            return "Boring"
        } else if (points <= -100) {
            return "Unamusing"
        } else if (-100 < points < 100) {
            return "Not funny but not Unfunny"
        } else if (100 <= points) {
            return "Kinda Funny"
        } else if (200 <= points) {
            return "Quite Amusing"
        } else if (300 <= points) {
            return "Micheal 'Goob' Yagoobion"
        } else if (400 <= points) {
            return "Crushin on Traps"
        } else if (500 <= points) {
            return "President"
        } else if (600 <= points) {
            return "Liz for the Sliz"
        } else if (700 <= points) {
            return "Pays for his Girlfriend"
        } else if (800 <= points) {
            return "X Æ A-12"
        } else if (900 <= points) {
            return "Bonk"
        } else if (1000 <= points) {
            return "Pickle Rick, Funniest Shit Ever"
        }
    }
    ,

}