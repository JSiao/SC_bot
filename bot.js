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

var global_array = [];

class BigVar
{
    constructor(name, value)
    {
        this.name = name;
        this.value = value;
    }
}

bot.on('ready',  () =>
{
    logger.info('I have taken Command! Hahahaha');
});

bot.on('message', async message =>
{
    if (message.author.bot) return;
    const args = message.content.slice('$').trim().split(/ +/g);
    logger.info(args);
    const cmd  = args.shift();
    switch(cmd)
    {
        case '$clear':
            if (global_array.length > 0)
            {
                global_array = [];
                message.channel.send("All Variables cleared");
            }
            else
            {
                message.channel.send("No Variables to clear");
            }
            break;
        case '$display':
            app_display(message);
            break;
        case '$echo':
            app_echo(message);
            break;
        case '$help':
            app_help(message);
            break;
        case '$hello':
            message.reply('Yo!');
            break;
        case '$rem':
            app_rem(message);
            break;
        case '$roll':
            app_roll(message);
            break;
    }
});

function app_roll(message)
{
    const args = message.content.slice('$').trim().split(/ +/g);
    logger.info(args);
    if (args.length < 2)
    {
        let val = Math.ceil(Math.random() * 6);
        message.channel.send( "Roll = " + val);
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
        message.channel.send( "Roll = " + sum);
    }
}

function app_echo(message)
{
    const args = message.content.slice('$').trim().split(/ +/g);
    args.shift();
    logger.info(args);
    for (x = 0; x < args.length; x++)
    {
        if (args[x].startsWith('%'))
        {
            logger.info(args[x] + " is a variable");
            for (y = 0; y < global_array.length; y++)
            {
                if (("%" + global_array[y].name) == args[y])
                {
                    args[x] = global_array[y].value;
                    break;
                }
            }
        }
    }
    const Msg  = args.join(" ");
    message.channel.send(Msg);
}

function app_help(message)
{
    message.channel.send( "Command List \n$roll [dice] - Rolls that given type of dice\n$echo [...] - Echoes to output");
}

function app_rem(message)
{
    const args = message.content.slice('$').trim().split(/ +/g);
    if (args.length < 3) 
    {
        message.channel.send("Wow, you tottaly got that wrong, dude.");
        return;
    }
    cmd = args.shift();
    variable = args.shift();
    value    = args.shift();
    if (!isNaN(variable))
    {
        value = Number(value);
    }
    var flag = false;
    for (x = 0; x < global_array.length; x++)
    {
        if (global_array[x].name == variable)
        {
            global_array[x].value = value;
            flag = true;
            break;
        }
    }
    if (flag == false)
    {
        let Var = new BigVar(variable, value);
        global_array.splice(global_array.length, 0, Var);
    }
}

function app_display(message)
{
    logger.info(global_array);
    let msg = "";
    for (x = 0; x < global_array.length; x++)
    {
        msg = msg + global_array[x].name + ": " + global_array[x].value + "\n";
    }
    message.channel.send(msg);
}

bot.login(token);
