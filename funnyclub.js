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
            if (args[1].toUpperCase() === "NOM") {
                module.exports.nom(msg);
            } else if (args[1].toUpperCase() === "DENOM") {
                module.exports.denom(msg);
            }
        } else {
            msg.channel.send(`You didn't provide enough arguments ${msg.author}, that isn't very funny.`)
        }
    },

    isVoting: false,
    voteResultMap: {},
    voteTime: 30 * 1000,
    numYes: 0,
    numNo: 0,
    registerVote: (msg) => {
        if (msg.content.toUpperCase() === "YES" || msg.content.toUpperCase() === "NO") {
            if (!(msg.author in module.exports.voteResultMap)) {
                if (msg.content.toUpperCase() === "YES") {
                    module.exports.numYes++;
                    module.exports.voteResultMap[msg.author] = "YES";
                    msg.channel.send(`${msg.author} voted with "YES".`);
                } else if (msg.content.toUpperCase() === "NO") {
                    module.exports.numNo++;
                    module.exports.voteResultMap[msg.author] = "NO";
                    msg.channel.send(`${msg.author} voted with "NO".`);
                }
            } else {
                msg.channel.send(`${msg.author} you have already voted".`);
            }
        }
    },


    nom: (msg) => {
        const nominee = msg.content.split(" ")[2];
        msg.channel.send(`Nominating ${nominee} to move higher in the funny club. Vote with "yes" or "no".`);
        module.exports.isVoting = true;
        setTimeout(function () {
            module.exports.handleVote(msg, 25);
        }, module.exports.voteTime);

    },

    denom: (msg) => {
        const nominee = msg.content.split(" ")[2];
        msg.channel.send(`Nominating ${nominee} to move lover in the funny club. Vote with "yes" or "no".`);
        module.exports.isVoting = true;
        setTimeout(function () {
            module.exports.handleVote(msg,-1 * 25);
        }, module.exports.voteTime);
    },

    handleVote: (msg, karma) => {
        console.log(module.exports.voteResultMap);
        const nominee = msg.content.split(" ")[2];
        const username = msg.mentions.users.first().username.toUpperCase();
        module.exports.isVoting = false;
        msg.channel.send(`Voting for ${nominee} has ended, calculating results.`);
        if (module.exports.numNo === 0 && module.exports.numYes === 0) {
            msg.channel.send(`Voting FAILED for ${nominee}, nobody voted.`);
            module.exports.clearData();
            return;
        }

        const totalVotes = module.exports.numNo + module.exports.numYes;
        if (totalVotes <= 2) {
            msg.channel.send(`Voting FAILED for ${nominee}, not enough people. At least 3 different votes must be cast.`);
            module.exports.clearData();
            return;
        }

        const rate = parseFloat((module.exports.numYes /  totalVotes).toFixed(3));
        if (rate <= parseFloat((2/3).toFixed(5))) {
            msg.channel.send(`Voting FAILED for ${nominee}!, the vote was YES: ${module.exports.numYes} to NO: ${module.exports.numNo}`);
            module.exports.clearData();
            return;
        }

        msg.channel.send(`Voting PASSED for ${nominee}!, the vote was YES: ${module.exports.numYes} to NO: ${module.exports.numNo}`);
        fs.readFile("funnyclub.json", ((err, data) => {
            if (err) {
                console.log(err);
            } else {
                const json = JSON.parse(data);
                let isInFunnyClub = false;
                let points = 0;
                for (let i = 0; i < json.users.length; i++) {
                    if (json.users[i].username.toUpperCase() === username) {
                        isInFunnyClub = true;
                        json.users[i].points += karma;
                        points = json.users[i].points;
                    }
                }
                if (!isInFunnyClub) {
                    points = 0 + karma
                    json.users.push({username: username, points: points, karma: 20});
                }

                const jsonString  = JSON.stringify(json);
                fs.writeFile("funnyclub.json", jsonString, (err) => {
                    if (err) {
                        console.log(err);
                    }
                });
                msg.channel.send(`${nominee}!, Your rank is now "${module.exports.getRankFromPoints(points)}" with point value "${points}".`);
            }
        }));
        module.exports.clearData();
    },

    clearData: () => {
        module.exports.numYes = 0;
        module.exports.numNo = 0;
        module.exports.voteResultMap = {};
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
                        msg.channel.send(`${msg.author}!, Your rank is "${module.exports.getRankFromPoints(json.users[i].points)}" with point value "${json.users[i].points}".`)
                    }
                }
                if (!isInFunnyClub) {
                    msg.channel.send(`Oops! Looks like you are not in the funny club ${msg.author}! Let me add you!`);
                    json.users.push({username: msg.author.username, points: 0, karma: 20});
                    const jsonString  = JSON.stringify(json);
                    fs.writeFile("funnyclub.json", jsonString, (err) => {
                        if (err) {
                            console.log(err);
                        }
                    });
                }
            }
        }));
    },

    getRankFromPoints: (points) => {
        if (points <= -1000) {
            return "........."
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
    },

    help: `===============================Funny Club================================
$fc rank:     Prints your rank         
$fc nom @MENTION: Nominates the mentioned user to go UP in the funny club
$fc denom @MENTION: Nominates the mentioned user to go DOWN in the funny club
=========================================================================\n`

}