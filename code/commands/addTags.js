//show how the database section works in discordjs , not apart of the task
const { SlashCommandBuilder } = require("discord.js");

//this part is required..
const Sequelize = require("sequelize");
const sequelize = new Sequelize("database", "username", "password", {
  host: "localhost",
  dialect: "sqlite",
  logging: false,
  // SQLite only
  storage: "database.sqlite",
});

/**
 * equivalent to: CREATE TABLE tags(
 * name VARCHAR(255),
 * description TEXT,
 * username VARCHAR(255),
 * usage_count INT NOT NULL DEFAULT 0
 * );
 */
const Tags = sequelize.define("tags", {
  name: {
    type: Sequelize.STRING,
    unique: true,
  },
  description: Sequelize.TEXT,
  username: Sequelize.STRING,
  usage_count: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
});

module.exports = {
  data: new SlashCommandBuilder()
    .setName("adder")
    .setDescription("Fire an event")
    .addStringOption((option) =>
      option
        .setName("name")
        .setDescription("add a name to your tag")
        .setRequired(true)
    ),
  async execute(interaction) {
    const tag = await Tags.create({
      name: interaction.options.getString("name"),
      //   description: tagDescription,
      //   username: interaction.author.username,
    });
    await interaction.reply(`Tag ${tag.name} added.`);
  },
};
