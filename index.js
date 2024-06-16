const { GoogleGenerativeAI } = require("@google/generative-ai");
const { Client, GatewayIntentBits, SlashCommandBuilder, Routes } = require('discord.js');

const discordToken = process.env.DISCORD_TOKEN; 
const apiKey = process.env.GEMINI_API_KEY; 
const clientId = process.env.CLIENT_ID;

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

const generationConfig = {
  temperature: 0.5,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 128,
  responseMimeType: "text/plain",
};

async function getNicknameSeverity(nickname) {
  const prompt = `On a scale of 1 to 5, with 1 being completely harmless and 5 being extremely inappropriate, rate the following nickname ONLY with the corresponding number. Nickname: "${nickname}"`;
  try {
    const chatSession = model.startChat({ generationConfig });
    const result = await chatSession.sendMessage(prompt);
    const severityString = result.response.text().trim();
    const severityMatch = severityString.match(/\d/);
    const severity = severityMatch ? parseInt(severityMatch[0]) : 3;
    return Math.max(1, Math.min(5, severity)); 
  } catch (error) {
    console.error("Error getting nickname severity:", error);
    return 3;
  }
}

function generateRandomUsername(length = 8) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return 'User-' + result; 
}

const client = new Client({ intents: [
  GatewayIntentBits.Guilds, 
  GatewayIntentBits.GuildMembers, 
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent 
] });

const guildSeverityThresholds = new Map();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);

  const commands = [
    new SlashCommandBuilder()
      .setName('setseverity')
      .setDescription('Sets the nickname severity threshold for this server (1-5)')
      .addIntegerOption(option =>
        option.setName('severity')
          .setDescription('The severity threshold (1-5)')
          .setRequired(true)
          .setMinValue(1)
          .setMaxValue(5)
      ),
  ].map(command => command.toJSON());

  const rest = client.rest; 
  (async () => {
    try {
      console.log('Started refreshing application (/) commands.');
      await rest.put(Routes.applicationCommands(clientId), { body: commands });
      console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
      console.error(error);
    }
  })();
});

client.on('guildMemberUpdate', async (oldMember, newMember) => {
  if (oldMember.nickname === newMember.nickname) return;

  const newNickname = newMember.nickname;
  const guildId = newMember.guild.id;

  const severityThreshold = guildSeverityThresholds.get(guildId) || 3; 

  const severity = await getNicknameSeverity(newNickname);

  if (severity >= severityThreshold && !newNickname.startsWith("User-")) {
    console.log(`Potentially inappropriate nickname detected (severity: ${severity}): ${newNickname}`);
    const randomUsername = generateRandomUsername();
    try {
      await newMember.setNickname(randomUsername);
    } catch (error) {
      console.error("Error setting random nickname:", error);
    }
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName, options } = interaction;

  if (commandName === 'setseverity') {
    const newSeverity = options.getInteger('severity');
    guildSeverityThresholds.set(interaction.guild.id, newSeverity);
    interaction.reply(`Nickname severity threshold set to ${newSeverity} for this server.`);
  }
});

client.login(discordToken);
