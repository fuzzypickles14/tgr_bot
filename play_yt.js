const ytdl = require('ytdl-core')

module.exports = {
    playYT: async (msg) => {
        const args = msg.content.split(' ');
        if (msg.member.voice.channel && args.length === 2) {
            const connection = await msg.member.voice.channel.join();
            const stream = ytdl(args[1], { filter: 'audioonly' });

            const dispatcher = connection.play(stream);

            dispatcher.on('start', () => {
                console.log(`Started playing ${args[1]}`);
            });

            dispatcher.on('finish', () => {
                console.log(`Finished playing ${args[1]}`);
                connection.disconnect();
            });
        }
    }
}