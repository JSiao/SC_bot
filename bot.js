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

const token = auth.token;

var global_array = [];
var result = false;;

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
    result = commander(message, args);
});

function commander(message, args)
{
    let ret_val;
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
            ret_val = result;
            break;
        case '$display':
            ret_val = app_display(message, args);
            break;
        case '$echo':
            app_echo(message, args);
            ret_val = result;
            break;
        case '$help':
            app_help(message, args);
            ret_val = result;
            break;
        case '$hello':
            message.reply('Yo!');
            ret_val = result;
            break;
        case '$push':
            app_push(message, args);
            ret_val = result;
            break;
        case '$rem':
            ret_val = app_rem(message, args);
            break;
        case '$roll':
            ret_val = app_roll(message, args);
            break;
    }
    return ret_val;
}

function app_roll(message, args)
{
    let ret_val;
    logger.info(args);
    if (args.length < 1)
    {
        ret_val = Math.ceil(Math.random() * 6);
        message.channel.send( "Roll = " + ret_val);
    }
    else
    {
        var dice = args.shift();
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
        ret_val = sum;
    }
    return ret_val;
}

function app_echo(message, args)
{
    logger.info(args);
    for (x = 0; x < args.length; x++)
    {
        if (args[x].startsWith('%'))
        {
            logger.info(args[x] + " is a variable");
            for (y = 0; y < global_array.length; y++)
            {
                if (("%" + global_array[y].name) == args[x])
                {
                    args[x] = global_array[y].value;
                    break;
                }
            }
        }
    }
    const Msg = args.join(" ");
    message.channel.send(Msg);
}

function app_help(message, args)
{
    message.channel.send( "Command List \n$roll [dice] - Rolls that given type of dice\n$echo [...] - Echoes to output");
}

function app_rem(message, args)
{
    //const args = message.content.slice('$').trim().split(/ +/g);
    if (args.length < 2) 
    {
        message.channel.send("Wow, you tottaly got that wrong, dude.");
        return;
    }
    variable = args.shift();
    value    = args.shift();
    if (!isNaN(variable))
    {
        value = Number(value);
    }
    if (value.startsWith('"'))
    {
        let str = value.slice(1, value.length);
        while (!value.endsWith('"'))
        {
            value = args.shift();
            str = str + " " + value;
            logger.info(str);
        }
        value = str.slice(0, str.length - 1);
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

function app_display(message, args)
{
    msg = "";
    if (global_array.length == 0)
    {
        msg = "<No Variables>";
        return;
    }
    else
    {
        logger.info(global_array);
        for (x = 0; x < global_array.length; x++)
        {
            msg = msg + global_array[x].name + ": " + global_array[x].value + "\n";
        }
    }
    message.channel.send(msg);
}

function app_push(message, args)
{
    //const args = message.content.slice('$').trim().split(/ +/g);
    if (args.length < 1)
    {
        return;
    }
    variable = args.shift();
    value    = result;
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


bot.login(token);
