var Discord = require('discord.io');
var logger  = require('winston');
var auth    = require('./auth.json');
//var SC      = require('node-soundcloud');

logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

var bot = new Discord.Client(
{
    token: auth.token,
    autorun: true
});

/*
SC.init({
    id: '',
    secret: '',
    uri:
});
*/

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
            case 'roll':
                app_roll(args[1]);
                break;
        }
    }
});

function app_roll(arg)
{
    var nums = arg.split('d', 1);
    if (nums[0] = "") nums[0] = 1;
    var array;
    var sum = 0;
    for (h = 0; h < nums[0]; h++)
    {
        sum += array[h] = Math.round(Math.random() * nums[1]);
    }
    bot.sendMessage(
    {
        to: channelID,
        message: sum
    }
    );
}
