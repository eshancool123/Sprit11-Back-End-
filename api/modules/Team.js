// models/Team.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Schema } = mongoose;

const teamSchema = new Schema(
  {
    UserName: { 
      type: String, 
      required: [true, 'Username is required'],
      unique: true,
      trim: true 
    },
    Team_Name: { 
      type: String, 
      required: [true, 'Team name is required'],
      trim: true 
    },
    Role: { 
      type: String, 
      enum: ['User', 'Admin'],
      default: "User" 
    },
    players: [{ 
      type: Schema.Types.ObjectId, 
      ref: 'Player' 
    }],
    totalpoints: { 
      type: Number, 
      default: 0 
    },
    Email: { 
      type: String, 
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    Password: { 
      type: String, 
      required: [true, 'Password is required'],
      minlength: 6,
      select: false
    },
    Spend_money: { 
      type: Number, 
      default: 0 
    },
    createdAt: { 
      type: Date, 
      default: Date.now 
    }
  },
  { collection: "team" }
);

// Encrypt password before saving
teamSchema.pre('save', async function(next) {
  if (!this.isModified('Password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.Password = await bcrypt.hash(this.Password, salt);
});

// Match user entered password to hashed password in database
teamSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.Password);
};

const Team = mongoose.model("Team", teamSchema);
module.exports = Team;