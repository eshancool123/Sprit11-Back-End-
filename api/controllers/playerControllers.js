const express = require('express');
const Player = require('../modules/Player');
const mongoose = require('mongoose');



//GET
const getallPlayers = async (req, res) => {
  try {
    const player = await Player.find();
    res.status(200).json(player);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


//POST
const addPlayer = async (req, res) => {
  try {
    const playerData = req.body;

    // Check if a player with the same name already exists
    const existingPlayer = await Player.findOne({ Name: playerData.Name });
    if (existingPlayer) {
      return res.status(400).json({ message: "Player with the same name already exists" });
    }

    const BattingStrikeRate =
      playerData.Balls_Faced !== 0
        ? (playerData.Total_Runs / playerData.Balls_Faced) * 100
        : 0;

    const BattingAverage =
      playerData.Innings_Played !== 0
        ? playerData.Total_Runs / playerData.Innings_Played
        : 0;

    const BallingStrikeRate =
      playerData.Wickets !== 0
        ? (playerData.Overs_Bowled * 6) / playerData.Wickets
        : 0;

    const EconomyRate =
      playerData.Overs_Bowled !== 0
        ? (playerData.Runs_Conceded / (playerData.Overs_Bowled * 6)) * 6
        : 0;

    const Points =
      BattingStrikeRate / 5 +
      BattingAverage * 0.8 +
      (BallingStrikeRate !== 0 ? 500 / BallingStrikeRate : 0) +
      (EconomyRate !== 0 ? 140 / EconomyRate : 0);

    const ValueInRupee = (9 + Points + 100) * 1000;

    const newPlayer = new Player({
      ...playerData,
      Batting_Strike_Rate: BattingStrikeRate,
      Batting_Average: BattingAverage,
      Balling_Strike_Rate: BallingStrikeRate,
      Economy_Rate: EconomyRate,
      Points: Points,
      Value_In_Rupee: ValueInRupee,
    });

    await newPlayer.save();
    res
      .status(201)
      .json({ message: "Player added successfully", player: newPlayer });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}



//PUT
const updatePlayer = async (req, res) => {
  try {
    const playerId = req.params.id; // Extract ID from URL params
    const playerData = req.body;

    // Search for player by ID
    const existingPlayer = await Player.findOne({ _id: new mongoose.Types.ObjectId(playerId) });
    if (!existingPlayer) {
      return res.status(404).json({ message: "Player not found" });
    }

    // Update player data
    existingPlayer.Name = playerData.Name;
    existingPlayer.Total_Runs = playerData.Total_Runs;
    existingPlayer.Balls_Faced = playerData.Balls_Faced;
    existingPlayer.Innings_Played = playerData.Innings_Played;
    existingPlayer.Overs_Bowled = playerData.Overs_Bowled;
    existingPlayer.Runs_Conceded = playerData.Runs_Conceded;
    existingPlayer.Wickets = playerData.Wickets;
    existingPlayer.Category = playerData.Category;
    existingPlayer.Team_Name = playerData.Team_Name;

    // Recalculate the stats
    const BattingStrikeRate =
      playerData.Balls_Faced !== 0
        ? (playerData.Total_Runs / playerData.Balls_Faced) * 100
        : 0;

    const BattingAverage =
      playerData.Innings_Played !== 0
        ? playerData.Total_Runs / playerData.Innings_Played
        : 0;

    const BallingStrikeRate =
      playerData.Wickets !== 0
        ? (playerData.Overs_Bowled * 6) / playerData.Wickets
        : 0;

    const EconomyRate =
      playerData.Overs_Bowled !== 0
        ? (playerData.Runs_Conceded / (playerData.Overs_Bowled * 6)) * 6
        : 0;

    const Points =
      BattingStrikeRate / 5 +
      BattingAverage * 0.8 +
      (BallingStrikeRate !== 0 ? 500 / BallingStrikeRate : 0) +
      (EconomyRate !== 0 ? 140 / EconomyRate : 0);

    const ValueInRupee = (9 + Points + 100) * 1000;

    // Update the calculated fields
    existingPlayer.Batting_Strike_Rate = BattingStrikeRate;
    existingPlayer.Batting_Average = BattingAverage;
    existingPlayer.Balling_Strike_Rate = BallingStrikeRate;
    existingPlayer.Economy_Rate = EconomyRate;
    existingPlayer.Points = Points;
    existingPlayer.Value_In_Rupee = ValueInRupee;

    // Save the updated player document
    await existingPlayer.save();

    res.status(200).json({ message: "Player updated successfully", player: existingPlayer });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};




//DELETE
const deletePlayer = async (req, res) => {
  try {
    const playerId = req.params.id; // Extract ID from URL params

    // Search for player by name
    const player = await Player.findOne({ _id: new mongoose.Types.ObjectId(playerId) });
    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    // Delete the player
    await Player.deleteOne({ _id: new mongoose.Types.ObjectId(playerId) });

    res.status(200).json({ message: "Player deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};



module.exports = {
  getallPlayers,
  addPlayer,
  updatePlayer,
  deletePlayer,
};