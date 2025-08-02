const express = require('express');
const Team = require('../modules/Team');
const Player = require('../modules/Player');
const mongoose = require('mongoose');



//POST ADD TEAM
const addTeam = async (req, res) => {
    try {
        const { UserName ,Role , Team_Name, players = [], totalpoints, Email, Password, Spend_money } = req.body;

        // Validation: Check required fields
        if (!Team_Name) {
            return res.status(400).json({ message: "Team name is required." });
        }

        // Check if the team already exists
        const existingTeam = await Team.findOne({ Team_Name });
        if (existingTeam) {
            return res.status(400).json({ message: "Team with this name already exists." });
        }

        // Create new team
        const newTeam = new Team({
            UserName,
            Role,
            Team_Name,
            players,
            totalpoints: totalpoints || 0,  // Fix: Use logical OR for default value
            Email,
            Password,
            Spend_money: Spend_money || 0   // Fix: Use logical OR for default value
        });

        await newTeam.save();
        res.status(201).json({ message: "Team added successfully", team: newTeam });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};





// POST ADD TEAM MEMBERS
const addTeamMembers = async (req, res) => {
    try {
        const { teamName, playerIds } = req.body;

        // Validate input
        if (!teamName || !Array.isArray(playerIds) || playerIds.length === 0) {
            return res.status(400).json({ message: "Team name and an array of player IDs are required." });
        }

        // Find the team by its name
        const team = await Team.findOne({ Team_Name: teamName });
        if (!team) {
            return res.status(404).json({ message: `Team with name '${teamName}' not found.` });
        }

        let totalPoints = 0;
        let totalSpendMoney = 0;

        // Process each player ID
        for (const playerId of playerIds) {
            // Check if the player exists
            const player = await Player.findById(playerId);
            if (!player) {
                return res.status(404).json({ message: `Player with ID '${playerId}' not found.` });
            }

            // Check if the player is already in the team
            if (team.players.includes(playerId)) {
                return res.status(400).json({ message: `Player with ID '${playerId}' is already in the team.` });
            }

            // Check budget limit
            if (team.Spend_money + player.Value_In_Rupee >= 9000000) {
                return res.status(400).json({ message: `Cannot buy player with ID '${playerId}'. Budget exceeded.` });
            }

            // Add player to the team
            team.players.push(playerId);
            totalPoints += player.Points || 0;
            totalSpendMoney += player.Value_In_Rupee || 0;

            // Update the player's Team_Name
            await Player.findByIdAndUpdate(playerId, { Team_Name: teamName });
        }

        // Update team details
        team.totalpoints += totalPoints;
        team.Spend_money += totalSpendMoney;

        await team.save();

        res.status(200).json({
            message: "Players added to the team successfully",
            team
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



//DELETE PLAYER REMOVE IN TEAM
const removeTeamPlayer = async (req, res) => {
    try {
        const { teamName } = req.body;
        const playerId = req.params.id;

        // Validate input
        if (!teamName || !playerId) {
            return res.status(400).json({ message: "Team name and player ID are required." });
        }

        // Find the team by its name
        const team = await Team.findOne({ Team_Name: teamName });
        if (!team) {
            return res.status(404).json({ message: `Team with name '${teamName}' not found.` });
        }

        // Check if the player exists
        const player = await Player.findById(playerId);
        if (!player) {
            return res.status(404).json({ message: `Player with ID '${playerId}' not found.` });
        }

        // Check if the player is in the team
        if (!team.players.includes(playerId)) {
            return res.status(400).json({ message: "Player not found in the team." });
        }

        // Remove player ID from the team
        team.players = team.players.filter(playerIdInTeam => playerIdInTeam.toString() !== playerId.toString());
        team.totalpoints -= player.Points || 0;
        team.Spend_money -= player.Value_In_Rupee || 0;

        // ✅ Update the player's Team field to "None"
        await Player.findByIdAndUpdate(playerId, { Team_Name: "None" });

        // Save the updated team
        await team.save();

        res.status(200).json({
            message: "Player removed from the team successfully",
            team
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Get all details of a team by its ID
const getTeamDetailsById = async (req, res) => {
    try {
      const teamId = req.params.id;
  
      if (!teamId) {
        return res.status(400).json({ message: "Team ID is required." });
      }
  
      // Find the team by its ID
      const team = await Team.findById(teamId).populate("players");
      
      if (!team) {
        return res.status(404).json({ message: `Team with ID '${teamId}' not found.` });
      }
  
      // Return the team details
      res.status(200).json({
        message: "Team details retrieved successfully.",
        team
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


  const getTeamSortedByPoint = async (req, res) => {
    try {
      // Query all teams, select only the Team_Name and totalpoints, and sort by totalpoints in descending order
      const teams = await Team.find({}, { Team_Name: 1, totalpoints: 1 }).sort({ totalpoints: -1 });
  
      // If no teams are found
      if (teams.length === 0) {
        return res.status(404).json({ message: "No teams found." });
      }
  
      // Return the team details
      res.status(200).json({
        message: "Teams sorted by points.",
        teams
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


// Get all players whose Team_Name is "None"
const getNonePlyers =  async (req, res) => {
    try {
      // Find all players whose Team_Name is "None"
      const players = await Player.find({ Team_Name: "None" });
  
      if (players.length === 0) {
        return res.status(404).json({ message: "No players found with a team." });
      }
  
      // Return the player details
      res.status(200).json({
        message: "Players found successfully.",
        players
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  



module.exports = { 
    addTeamMembers,
    addTeam,
    removeTeamPlayer,
    getTeamDetailsById,
    getTeamSortedByPoint,
    getNonePlyers
 
 };
