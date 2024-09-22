//this command will DM a user the access token if user with role 'Disc Gorilla' approves a token request message in a server voice channel. The bot will also give the user the role 'Disc Monkey'
//review AI code

const { SlashCommandBuilder } = require("discord.js");
//const {token,} = require("C:UsersRohanDocumentsCoding ProjectsHarambeBotconfig.json");
const fs = require("node:fs");
const path = require("node:path");

const absoluteFilePath = path.join(path.dirname(path.dirname(__dirname)), 'config.json');
const configData = fs.readFileSync(absoluteFilePath, 'utf8');
const config = JSON.parse(configData);
const token = config.token;


module.exports = {
  data: new SlashCommandBuilder()
    .setName("token")
    .setDescription(
      "Request an access token with approval from a Disc Gorilla."
    ),
  async execute(interaction) {
    const member = interaction.member;
    const guild = interaction.guild;

    // Send the access token request message
    const message = await interaction.reply({
      content:
        "Requesting an access token. A @Disc Gorilla needs to approve this.",
      fetchReply: true,
    });

    // Create a reaction collector
    const filter = (reaction, user) => {
      // Check if the user who reacted has the 'Disc Gorilla' role
      const hasRole = guild.members.cache
        .get(user.id)
        .roles.cache.some((role) => role.name === "Disc Gorilla");
      return hasRole; // Collect reactions only if the user has the 'Disc Gorilla' role
    };

    const collector = message.createReactionCollector({
      filter,
      max: 1,
      time: 60000,
    });

    collector.on("collect", async (reaction, user) => {
      // Send the access token as a DM to the user who ran the /token command
      try {
        const accessToken = token; // Generate or define your access token
        await member.send(`Your access token is: ${accessToken}`);

        // Find or create the 'Disc Monkey' role and assign it to the user
        let role = guild.roles.cache.find(
          (role) => role.name === "Disc Monkey"
        );
        if (!role) {
          role = await guild.roles.create({
            name: "Disc Monkey",
            color: "BLUE",
          });
        }

        await member.roles.add(role); // Assign the role to the user
        await interaction.followUp(
          `You have been granted the Disc Monkey role, and an access token has been sent to you!`
        );
      } catch (error) {
        console.error("Error sending DM or adding role:", error);
        await interaction.followUp(
          "There was an error sending the token or assigning the role."
        );
      }
    });

    collector.on("end", (collected) => {
      if (collected.size === 0) {
        interaction.followUp("No Disc Gorilla approved the token request.");
      }
    });
  },
};
