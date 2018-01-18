var Discord = require('discord.io');
var logger  = require('winston');
var auth    = require('./auth.json');

logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

var bot = new Discord.Client();
const token = process.env.TOKEN;

bot.on('ready', function (evt)
{
    logger.info('I am taken Command! Hahahaha');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});

bot.on('message', function (user, userID, channelID, message, evt)
{
    if (message.substring(0, 1) == '$')
    {
        var args = message.substring(1).split(' ');
        cmd = args[0];
        args = args.splice(1);
        switch(cmd)
        {
            case 'hello':
              bot.sendMessage(
              {
                  to: channelID,
                  message: 'Yo!'
              }
              );
              break;
        }
    }
});

bot.login(token);
