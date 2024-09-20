/*this command will instruct the user to install Kenku FM, with a link to install, and run /token to play songs.
review AI code*/

const { SlashCommandBuilder, joinVoiceChannel } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kenku")
    .setDescription(
      "Install Kenku FM and or join your voice channel if you have the Disc Monkey role."
    ),
  async execute(interaction) {
    const member = interaction.member;
    const guild = interaction.guild;

    // Provide the installation link and instructions
    await interaction.reply({
      content:
        "To install Kenku FM, please visit this link: [Kenku FM Installation](https://kenku.fm). After installing, run `/token` to start playing songs!",
      ephemeral: true, // Only visible to the user who executed the command
    });

    //if the user has the role 'Disc Monkey' then HarambeBot should join that user's channel
    // Check if the user has the 'Disc Monkey' role
    const hasDiscMonkeyRole = member.roles.cache.some(
      (role) => role.name === "Disc Monkey"
    );

    if (hasDiscMonkeyRole) {
      // Check if the user is in a voice channel
      if (member.voice.channel) {
        // Join the user's voice channel
        const voiceChannel = member.voice.channel;
        const connection = joinVoiceChannel({
          channelId: voiceChannel.id,
          guildId: guild.id,
          adapterCreator: guild.voiceAdapterCreator,
        });
        await interaction.followUp(
          `HarambeBot has joined your voice channel: ${voiceChannel.name}.`
        );
      } else {
        await interaction.followUp(
          "You are not in a voice channel, please join one first!"
        );
      }
    } else {
      await interaction.followUp(
        "1. Please install [Kenku FM](https://kenku.fm). \n 2. Use `/token` to get access. \n 3. Rerun this command start playing songs!"
      );
    }
  },
};
