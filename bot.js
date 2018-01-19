var Discord = require('discord.js');
var logger  = require('winston');
var auth    = require('./auth.json');
//var SC      = require('node-soundcloud');

logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

var bot = new Discord.Client(); 
/*
SC.init({
    id: '',
    secret: '',
    uri:
});
*/

const token = auth.token;

bot.on('ready',  () =>
{
    logger.info('I have taken Command! Hahahaha');
    logger.info('Logged in as: ');
});

bot.on('message', async message =>
{
    if (message.author.bot) return;
    if (message.substring(0, 1) == '$')
    {
        const args = message.content.slice(/ $/g);
        logger.info(args);
        const cmd  = args.shift();
        switch(cmd)
        {
            case 'echo':
                app_echo(message);
                break;
            case 'help':
                app_help(args, message);
                break;
            case 'hello':
                message.reply('Yo!');
                break;
            case 'roll':
                app_roll(message);
                break;
        }
    }
/*
    if (message.content.startsWith('$hello'))
    {
        message.reply("Hello!");
    }
    else if (message.content.startsWith('$help'))
    {
        app_help(message);
    }
    else if (message.content.startsWith('$roll'))
    {
        app_roll(message);
    }
*/
});

function app_roll(message)
{
    var args = message.substring(1).split(' ');
    logger.info(args);
    if (args.length < 2)
    {
        let val = Math.ceil(Math.random() * 6);
        message.reply( "Roll = " + val);
    }
    else
    {
        var dice = args[1];
        var nums = dice.split('d', 2);
        if (nums[0] == "") nums[0] = 1;
        var array = [];
        var sum = 0;
        nums[0] = parseInt(nums[0]);
        nums[1] = parseInt(nums[1]);
        logger.info("nums[0] = " + nums[0]);
        logger.info("nums[1] = " + nums[1]);
        for (h = 0; h < nums[0]; h++)
        {
            let r = Math.ceil(Math.random() * nums[1]);
            sum += r;
            logger.info("r = " + r);
        }
        message.reply( "Roll = " + sum);
    }
}

function app_echo(args, channelID)
{
    var str = "";
    for (f = 1; f < args.length; f++)
    {
        str =  str + args[f] + " ";
    }
    message.reply(str);
}

function app_help(message)
{
    const embed = new Discord.RichEmbed()
        .setAuthor("Commands", client.user.avatarURL)
        .setDescription("Help")
        .setColor(0x00ff00)
        .setTimestamp()
        .addField('$roll [dice]', 'Rolls that given type of dice')
        .addField('$echo [...]', 'Echoes to output')
        ;
    message.channel.send({embed});
}

bot.login(token);
