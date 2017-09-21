/*-----------------------------------------------------------------------------
A simple echo bot for the Microsoft Bot Framework. 
-----------------------------------------------------------------------------*/

var restify = require('restify');
var builder = require('botbuilder');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword,
    stateEndpoint: process.env.BotStateEndpoint,
    openIdMetadata: process.env.BotOpenIdMetadata 
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

/*----------------------------------------------------------------------------------------
* Bot Storage: This is a great spot to register the private state storage for your bot. 
* We provide adapters for Azure Table, CosmosDb, SQL Azure, or you can implement your own!
* For samples and documentation, see: https://github.com/Microsoft/BotBuilder-Azure
* ---------------------------------------------------------------------------------------- */

// Create your bot with a function to receive messages from the user
var bot = new builder.UniversalBot(connector);

// Make sure you add code to validate these fields
var luisAppId = process.env.LuisAppId;
var luisAPIKey = process.env.LuisAPIKey;
var luisAPIHostName = process.env.LuisAPIHostName || 'westus.api.cognitive.microsoft.com';

//const LuisModelUrl = 'https://' + luisAPIHostName + '/luis/v1/application?id=' + luisAppId + '&subscription-key=' + luisAPIKey;
const LuisModelUrl = "https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/65dec98c-cd30-46c8-afc9-4677cb2fbdbf?subscription-key=b946f4e53a21474eb9b68a53b1759576"

// Main dialog with LUIS
var recognizer = new builder.LuisRecognizer(LuisModelUrl);
var intents = new builder.IntentDialog({ recognizers: [recognizer] })
/*
.matches('<yourIntent>')... See details at http://docs.botframework.com/builder/node/guides/understanding-natural-language/
*/
.matches('Restaurants',(session, args)=>{
    
    console.log(args);
    
    //put yelp code here

var Yelp = require('yelp-api-v3');
 
var yelp = new Yelp({
  app_id: 'cjtN2Z8yhToA5s6fgkRQUA',
  app_secret: 'c6UBpZaKvaPLpvT6ig5FE44TqM0hFsuNPmm9JHmnPXVlH1KoQPIEBup9vAYono2t'
});

var searchResults;
var name;
var rating;
var price;
var address;
var distance;
var output = [];

// https://github.com/Yelp/yelp-api-v3/blob/master/docs/api-references/businesses-search.md 
yelp.search({latitude: '43.4729790', longitude: '-80.5401030', limit: 5})
.then(function (data) {
    searchResults = JSON.parse(data);
    session.send("Here are my recommendations:\n\n");
    for (var i = 0; i < 5; i++) {
        name = "Name: " + searchResults.businesses[i].name;
        rating = "Rating: " + searchResults.businesses[i].rating + "/5";
        price = "Price Range ($-$$$): " + searchResults.businesses[i].price;
        address = "Address " + searchResults.businesses[i].location.address1;
        distance = "Distance: " + Math.round(searchResults.businesses[i].distance/100) / 10 + " km";
        session.send(name + "\n\n" + rating + "\n\n" + price + "\n\n" + "\n\n" + address + "\n\n" + distance + "\n\n\n\n");
    }
    
})
.catch(function (err) {
    console.error(err);
});
})


.onDefault((session, args) => {
    console.log(args);
    
    JSON.parse(args);
    
    
    
    session.send('Sorry, I did not understand \'%s\'.', session.message.text);
});

bot.dialog('/', intents);    

