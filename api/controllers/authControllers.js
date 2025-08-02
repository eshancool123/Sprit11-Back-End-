const jwt = require('jsonwebtoken');
const Team = require('../modules/Team');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Register a new team
const register = async (req, res) => {
  try {
    const { UserName, Email, Password, Team_Name } = req.body;

    // Check if team exists
    const teamExists = await Team.findOne({ $or: [{ Email }, { UserName }] });

    if (teamExists) {
      return res.status(400).json({ 
        message: 'User already exists with that email or username' 
      });
    }

    // Create team
    const team = await Team.create({
      UserName,
      Email,
      Password,
      Team_Name
    });

    res.status(201).json({
      message: 'User registered successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Server error'
    });
  }
};

const login = async (req, res) => {
    try {
      const { UserName, Password } = req.body;
      
      // Check for team
      const team = await Team.findOne({ UserName }).select('+Password');
      
      if (!team) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      // Check if password matches
      const isMatch = await team.matchPassword(Password);
      
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      // Create token
      const token = generateToken(team._id);
      
      // Cookie options - secure in production, http only for security
      const cookieOptions = {
        expires: new Date(Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRE || '7') * 24 * 60 * 60 * 1000), // Convert days to milliseconds
        httpOnly: true,
        // secure: process.env.NODE_ENV === 'production', // Uncomment in production
      };
      
      // Set individual cookies for user data
      res.cookie('username', team.UserName, cookieOptions);
      res.cookie('teamname', team.Team_Name, cookieOptions);
      res.cookie('role', team.Role, cookieOptions);
      res.cookie('userid', team._id.toString(), cookieOptions);
      res.cookie('token', token, cookieOptions);
      
      res.status(200).json({
        token,
        team: {
          id: team._id,
          UserName: team.UserName,
          Email: team.Email,
          Team_Name: team.Team_Name,
          Role: team.Role,
          totalpoints: team.totalpoints,
          Spend_money: team.Spend_money,
          players: team.players
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'Server error'
      });
    }
  };

// Get current logged in team
const getTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.team.id);

    res.status(200).json({
      id: team._id,
      UserName: team.UserName,
      Email: team.Email,
      Team_Name: team.Team_Name,
      Role: team.Role,
      totalpoints: team.totalpoints,
      Spend_money: team.Spend_money,
      players: team.players
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Server error'
    });
  }
};

module.exports = {
  register,
  login,
  getTeam
};