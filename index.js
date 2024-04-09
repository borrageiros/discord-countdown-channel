const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds
    ],
    disableMentions: 'everyone',	
});
require('dotenv').config();


const requiredEnvVariables = ['TOKEN', 'CHANNEL_ID', 'COUNTDOWN', 'TIMEZONE', 'FORMAT'];
const missingEnvVariables = requiredEnvVariables.filter(variable => !process.env[variable]);

if (missingEnvVariables.length > 0) {
  console.error(`Missing ENV variables: ${missingEnvVariables.join(', ')}`);
  process.exit(1);
}
const token = process.env.TOKEN;
const channelId = process.env.CHANNEL_ID;
const countdown = process.env.COUNTDOWN;
const timeZone = parseInt(process.env.TIMEZONE);
const format = process.env.FORMAT;


function updateChannelName() {
  let now = Math.floor(Date.now() / 1000);
  let newTime = now + timeZone * 3600;
  let difference = countdown - newTime;

  let years = Math.floor(difference / (60 * 60 * 24 * 365));
  difference -= years * (60 * 60 * 24 * 365);

  let days = Math.floor(difference / (60 * 60 * 24));
  difference -= days * (60 * 60 * 24);

  let hours = Math.floor(difference / (60 * 60));
  difference -= hours * (60 * 60);

  let min = Math.floor(difference / 60);
  difference -= min * 60;

  let seg = difference;

  let formattedName = format
  .replace('${Y}', years)
  .replace('${D}', days)
  .replace('${H}', hours)
  .replace('${M}', min)
  .replace('${S}', seg);

  client.channels.fetch(channelId)
    .then(channel => {
      channel.setName(formattedName)
        .catch(console.error);
    })
    .catch(console.error);
}


client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  updateChannelName();
  setInterval(updateChannelName, 5 * 60 * 1000 + 2 * 1000);
});


client.login(token);