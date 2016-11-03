#Box-Score

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
this web app. They'll have a list of friends (other users) and be able to make 'bets' (once again, there is no money
involved) on various aspects NBA game outcomes, like final score, individual player stats, etc. After the game 
has 
finished, users will be able to see the results of their bets and how they compare with their friends. These 
results will be saved for posterity or something, I don't know.
  
##Data Model

##Wireframes

##Site Map

##Use Casing
 
##Research
* **User Authentication - 6 points**
    * Obviously, having user accounts with saved info means we need authentication
    * I will use [Passport.js](http://passportjs.org/) to implement user authentication
    * Handling credentials internally is probably the easiest (local strategy), but OAuth may make more sense if this
     were a real app
     
* **CSS Framework - 2 points**
    * To provide an aesthetically pleasing and usable interface across form factors
    * Implement [Material Design](https://material.google.com/) visual elements and appropriate layouts for both 
    small and large screens
    * Possible frameworks: [Materialize](http://materializecss.com/), [MUI](https://www.muicss.com/), [MDL](https://getmdl.io/index.html)