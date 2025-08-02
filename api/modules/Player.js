const mongoose = require('mongoose');
const { Schema } = mongoose;

// Create schema object for Player
const playerSchema = new Schema(
    {
      Name: { type: String, required: true },
      University: { type: String, required: true },
      Wickets: { type: Number, default: 0 },
      Category: { type: String, enum: ['Batsman', 'Bowler', 'All-rounder'], required: true },
      Total_Runs: { type: Number, default: 0 },
      Balls_Faced: { type: Number, default: 0 },
      Innings_Played: { type: Number, default: 0 },
      Overs_Bowled: { type: Number, default: 0 },
      Runs_Conceded: { type: Number, default: 0 },
      Team_Name: { type: String, default: "None" },
      Batting_Strike_Rate: { type: Number, default: 0 },
      Batting_Average: { type: Number, default: 0 },
      Balling_Strike_Rate: { type: Number, default: 0 },
      Economy_Rate: { type: Number, default: 0 },
      Points: { type: Number, default: 0 },
      Value_In_Rupee: { type: Number, default: 0 },
      createdAt: { type: Date, default: Date.now }
    },
    { collection: "player" } // <-- This ensures it doesn't pluralize
  );

// Create model
const Player = mongoose.model("Player", playerSchema);
module.exports = Player;
