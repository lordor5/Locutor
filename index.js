// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits } = require('discord.js');
const { tokentest } = require('./config.json');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });

// Create a map to store the last time a user was in a voice channel
const userLastVoiceChannelTimeMap = new Map();

// Create a map to store the messages sent to the text channel when users join a voice channel
const userTextChannelMessageMap = new Map();



// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

// Listen for the voiceStateUpdate event
client.on(Events.VoiceStateUpdate, (oldState, newState) => {

  // Find the voice channel by name
  const textChannel = client.channels.cache.find(channel => channel.name === 'conexiones');

  // If the user joined a voice channel
  if (!oldState.channelId && newState.channelId) {

    // If the voice channel is found
    if (textChannel) {

      const voiceChannel = client.channels.cache.get(newState.channelId);

      // Get the last time the user was in a voice channel
      const userLastVoiceChannelTime = userLastVoiceChannelTimeMap.get(newState.member.user.id);

      // If the user was last in a voice channel less than 1 hour ago, do not send a notification
      if (userLastVoiceChannelTime && Date.now() - userLastVoiceChannelTime < 3600000) { //milisegundos 3600000 1h
        return;
      }

      // Send a message to the voice channel
      const message = textChannel.send(`${newState.member.user.tag} se ha conectado al canal de voz ${voiceChannel.name}`);

      // Store the message in the map
      userTextChannelMessageMap.set(newState.member.user.id, message);

    
    } else {
      // If the voice channel is not found, log an error
      console.error(`Could not find voice channel with name 'Channel Name'`);
    }
  }
  else if (oldState.channelId && !newState.channelId) {

    // Update the user's last voice channel time
    userLastVoiceChannelTimeMap.set(newState.member.user.id, Date.now());

    // Get the message that was sent to the text channel when the user joined the voice channel
    const message = userTextChannelMessageMap.get(newState.member.user.id);

    // If the message exists, delete it
    if (message) {
      message.delete();
      userTextChannelMessageMap.delete(newState.member.user.id,message);
    }
  }
});

// Iniciamos el cliente
client.login(tokentest);