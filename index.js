const botconfig = require("./botconfig.json");
const colours = require("./colours.json");
const Discord = require('discord.js');
const superagent = require("superagent");
const fs = require('fs');
const moment = require('moment');
var prefix = botconfig.prefix
let xp = require("./xp.json");
var purple = '#2a116f'

const bot = new Discord.Client({disableEveryone: true})
require("./util/enventHandler")(bot)


bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();

fs.readdir("./commands/", (err, files) => {

    if(err) console.log(err);
    let jsfile = files.filter(f => f.split(".").pop() === "js");
    if(jsfile.length <= 0){
      console.log("Couldn't find commands.");
      return;
    }
  
    jsfile.forEach((f, i) =>{
      let props = require(`./commands/${f}`);
      console.log(`${f} loaded!`);
      bot.commands.set(props.config.name, props);
    });
  });

  fs.readdir("./help/", (err, files) => {

    if(err) console.log(err);
    let jsfile = files.filter(f => f.split(".").pop() === "js");
    if(jsfile.length <= 0){
      console.log("Couldn't find commands.");
      return;
    }
  
    jsfile.forEach((f, i) =>{
      let props = require(`./help/${f}`);
      console.log(`${f} loaded!`);
      bot.commands.set(props.config.name, props);
    });
  });

  fs.readdir("./mod/", (err, files) => {

    if(err) console.log(err);
    let jsfile = files.filter(f => f.split(".").pop() === "js");
    if(jsfile.length <= 0){
      console.log("Couldn't find mod commandes.");
      return;
    }
  
    jsfile.forEach((f, i) =>{
      let props = require(`./mod/${f}`);
      console.log(`${f} loaded!`);
      bot.commands.set(props.config.name, props);
    });
  });

  fs.readdir("./statsetblagues/", (err, files) => {

    if(err) console.log(err);
    let jsfile = files.filter(f => f.split(".").pop() === "js");
    if(jsfile.length <= 0){
      console.log("Couldn't find stats et blagues commandes.");
      return;
    }
  
    jsfile.forEach((f, i) =>{
      let props = require(`./statsetblagues/${f}`);
      console.log(`${f} loaded!`);
      bot.commands.set(props.config.name, props);
    });
  });

bot.on("message", async message => {
    if(message.author.bot || message.channel.type === "dm") return;

    let prefix = botconfig.prefix;
    let messageArray = message.content.split(" ")
    let cmd = messageArray[0].toLowerCase();
    let args = messageArray[0];

    let commandfile = bot.commands.get(cmd.slice(prefix.lenght)) || bot.commands.get(bot.aliases.get(cmd.slice(prefix.lenght)))
    if(commandfile) commandfile.run(bot,message,args)

    if(cmd === prefix + "bjr"){
        message.channel.send(`Salut`)

    }
})

bot.on("message", async message => {

  if(message.author.bot) return;
  if(message.channel.type === "dm") return;

  let prefixes = JSON.parse(fs.readFileSync("./prefixes.json", "utf8"));
  if(!prefixes[message.guild.id]){
    prefixes[message.guild.id] = {
      prefixes: botconfig.prefix
    };
  }

  let xpAdd = Math.floor(Math.random() * 7) + 8;
  console.log(xpAdd);

  if(!xp[message.author.id]){
    xp[message.author.id] = {
      xp: 0,
      level: 1
    };
  }


  let curxp = xp[message.author.id].xp;
  let curlvl = xp[message.author.id].level;
  let nxtLvl = xp[message.author.id].level * 300;
  xp[message.author.id].xp =  curxp + xpAdd;
  if(nxtLvl <= xp[message.author.id].xp){
    xp[message.author.id].level = curlvl + 1;
    let lvlup = new Discord.RichEmbed()
    .setTitle("Level Up!")
    .setColor(purple)
    .addField("Nouveau Level", curlvl + 1);

    message.channel.send(lvlup).then(msg => {msg.delete(5000)});
  }
  fs.writeFile("./xp.json", JSON.stringify(xp), (err) => {
    if(err) console.log(err)
  });

  let prefix = prefixes[message.guild.id].prefixes;
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);

  let commandfile = bot.commands.get(cmd.slice(prefix.length));
  if(commandfile) commandfile.run(bot,message,args);

});


bot.on("guildMemberAdd", member => {
  if(member.guild.id === "634429803977769001")
  var bvnembed = new Discord.RichEmbed()
    .setColor(botconfig.color)
    .setTitle(`👋Bienvenue ${member.user.username} dans ${member.guild}. \n Passe du bon temps dans le serveur 😉 \n Nous espérons que ce serveur sera à tes attentes !!!`)
  member.guild.channels.find("name", "【👋】bienvenue").sendEmbed(bvnembed)
})

bot.on("guildCreate", guild => {
  var embed = new Discord.RichEmbed()
    .setTitle(`Bot ajouté`)
    .setColor(`#61FF33`)
    .addField(`:crown: Propriétaire :`, guild.owner)
    .addField(`:ticket: Nom du serveur :`, guild.name)
    .addField(`:clipboard: ID :`, guild.id)
    .addField(`:family_mmbb: Nombre de joueur :`, guild.memberCount)

  bot.guilds.get("634429803977769001").channels.get("642487473372397618").sendEmbed(embed)

}) 

bot.on("guildDelete", guild => {
  var embed = new Discord.RichEmbed()
    .setTitle(`Bot retiré`)
    .setColor(`#FF3333`)
    .addField(`:crown: Propriétaire :`, guild.owner)
    .addField(`:ticket: Nom du serveur :`, guild.name)
    .addField(`:clipboard: ID :`, guild.id)
    .addField(`:family_mmbb: Nombre de joueur :`, guild.memberCount)

  bot.guilds.get("634429803977769001").channels.get("642487473372397618").sendEmbed(embed)

}) 
bot.login(botconfig.token);