const fs = require('fs');

module.exports = {
    playUglyBarnacle: async (msg) => {
        if (msg.member.voice.channel) {
            const connection = await msg.member.voice.channel.join();
            await module.exports.playAudioFile('UglyBarnacle.mp3', connection);
        }

    },

    playAudioFile: async (fileName, connection) => {
        const dispatcher = connection.play(fs.createReadStream('./SoundboardAudio/' + fileName), {
            volume: 1.2
        });
        dispatcher.on('start', () => {
           console.log(`Started playing ${fileName}`);
        });

        dispatcher.on('finish', () => {
            console.log(`Finished playing ${fileName}`);
            connection.disconnect();
        });
    }
}