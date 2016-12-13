#Box-Score

By Dexter Tong

##Overview

Ever get into basketball arguments with your friends? Are you one of the people that dared to suggest Russell 
Westbrook wouldn't average a triple-double this season? Do you think James Harden will score over 40 next game? Have 
an opinion on whether or not Joel Embiid will be Rookie of the Year?

Well if you've answered "yes" to at least one of the questions, then Box Score is designed just for you (yes, you, 
`$NAME`). Box Score is a web app that allows you to try predicting the near future in the NBA: Will this player make 
over 50% of his free throws this week? Will this team beat that team? And so on. If you're right, you get some 
points, and if you're not, you don't get any. You'll be able to see how well your friends on Box Score are doing, and
see how each other's predictions went. It's like sports betting, kind of, except there's no money or risk involved. 
Never again will your friends be able to wave off your gloating with "I don't remember you saying that;" You can 
just wave this web app in their face!
 
Now that you've survived the sales pitch, here's the basics: Users will need to create and log into accounts to use 
this web app. They'll ~~have a list of friends (other users) and~~ be able to make 'bets' (once again, there is no money
involved) on which team will win the game. They can see basic information about the games and teams as well, and see 
the predictions others have made. 
~~various aspects NBA game outcomes, like final score, individual player 
stats, etc. After the game has finished, users will be able to see the results of their bets and how they compare with their friends. These 
results will be saved for posterity or something, I don't know.~~
  
##Data Model

```javascript
var User = new Schema({
    firstName: {type: String, default: ""},
    lastName: {type: String, default: ""},
    favoriteTeam: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', default: null },
    //predictions made by this user
    predictions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Prediction' }],
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    score : { type: Number, default: 0},
    isAdmin : {type: Boolean, default: false}
});

//Represents a team and its players
var Team = new Schema({
        //team ID used by NBA API
        teamId: {type: Number, required: true},
        abbreviation: {type: String, required: true},
        name: {type: String, required: true},
        city: {type: String, required: true},
        players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player', default: [] }]
});


//Represents a single basketball game, or at least the parts we care about
var Game = new mongoose.Schema({
    //game ID used by NBA API
    gameId: {type: Number},
    homeTeam: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
    awayTeam: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
    season: {type: Number},
    title: String,
    date: Date,
    time: String,
    status: String,
    //List of user-made predictions for this game
    predictions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Prediction', default: [] }]
});
    

//A single prediction or 'bet', will need generalization later, probably
var Prediction = new mongoose.Schema({
    //User who made prediction
    user: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    //Which game is it for?
    game: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Game' }],
    //Who does user predict won?
    winner: [{type: String, enum: ['home', 'away']}]
});
```

Models may be added, removed, or modified as necessary.

##Wireframes

![Wireframes](/documentation/Wireframes.jpg?raw=true "Wireframes")

I will probably need more pages and elements than the wireframes suggest.

##Site Map
```
Index
├── admin: site administrator tools
├── game: list of all of today's basketball games
│   └── <specific game>: information about this game
├── login
├── register
├── settings
├── team: list of all basketball teams
│   └── <specific team>: information about this team
└── user: search by username
    └── <specific user>: information about this user

```
Made with the `tree` utility and creating empty directories.

##Use Casing

First, all users must log in. Then, they can:

a. Select an upcoming game and make a prediction on the outcome of the game

b. View the profiles of themselves and other users, and the predictions that they have made

c. Update their settings to reflect their name and favorite team (last name visible only to self)

d. The site admin can update and clear the database through an admin-only page
 
##Research

* **User Authentication: 6 points**
    * Obviously, having user accounts with saved info means we need authentication
    * I will use [Passport.js](http://passportjs.org/) to implement user authentication
    * Handle credentials internally (local strategy)
    
* **Server-Side Javascript: 3 points**
    * To get NBA box scores, player stats, and other necessary data from the NBA website
    * There is a Node.js package that wraps the NBA API, so I will use that
    * It is simply called [nba](https://www.npmjs.com/package/nba)
    * The NBA API is public (and keyless), but not officially documented and subject to change, so I hope these 
    people take care of it for me
    * Instead of using the (unofficial) NBA API, I used this package, which wraps said API
    