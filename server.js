'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const server = express();
server.use(express.json());
server.use(cors());
const axios=require("axios");

const PORT = process.env.PORT || 3001;
const mongoose = require('mongoose');



mongoose.connect('mongodb://abdallah:0000@ac-1odpauc-shard-00-00.acyygth.mongodb.net:27017,ac-1odpauc-shard-00-01.acyygth.mongodb.net:27017,ac-1odpauc-shard-00-02.acyygth.mongodb.net:27017/?ssl=true&replicaSet=atlas-mp85cf-shard-0&authSource=admin&retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});

// schema for Games
const GameSchema = new mongoose.Schema({
    name: String,
    description: String,
    rate: String,
    email: String,
    platform: String
});
const Game = mongoose.model('Game', GameSchema);


//Routes
//http://localhost:3000
server.get("/", (req, res) => {
    res.send("hello,you are in home route")
})
//GameRoute
//http://localhost:3000/games
server.get("/games", gamesHandler);
//  just  for test database
async function seedData() {
    const test = new Game({
        name: "GTA",
        description:
            "A literary sensation and runaway bestseller, this brilliant novel presents with seamless authenticity and exquisite lyricism the true confessions of one of Japan's most celebrated geisha.",
        rate: "4.7",
        email: "abdallsdkgdg",
        platform: "dsdsgs"
    });
    await test.save();
}



//function 
async function gamesHandler(req, res) {
    let url = "https://api.rawg.io/api/games?key=43fd5749eb674151bca70973fe88b05a";
    Game.find({}, (err, result) => {
        if (err) {
            console.log(err)
        }
        else {
   
            axios
                .get(url)
                .then((result) => {
                    let gamesArr = result.data.results.map((item) => {
                        new Games(item);
                        return new Games(item);
                    });
                    res.status(200).send(gamesArr);
                })
                .catch((error) => {
                    res.status(404).send(error);
                });
        }

        // seedData();
    }
    )
}



//classGames
class Games {
    constructor(item) {
        this.name = item.name;
        this.image = item.background_image;
        this.platforms = item.platforms.map(x => x.platform.name);
        this.rate = item.rating;
    }
}




// http://localhost:3000/games

//post function ashar
server.post ("/games",addHandler);

async function addHandler(req,res) {
    console.log("test Add")
    const {name,description,rate,email,platform} = req.body; 
    await Game.create({
    
      name:name,
         description:description,
      rate:rate,
      email:email,
      platform:platform
    });
  
    Game.find({},(err,result)=>{
        if(err)
        {
            console.log("false")
            console.log(err);
        }
        else
        {
          console.log(result)
            res.send(result);
        }
    })
  }


  //delete function ashar
  server.delete('/games/:id',deleteHandler);
 
  function deleteHandler(req,res) { 
    console.log("test delete ")
  const gameId = req.params.id;
 
  Game.deleteOne({_id:gameId},(err,result)=>{
      
    Game.find({},(err,result)=>{ 
          if(err)
          {
            console.log(err);
          }
          else
          {
             
            res.send(result);
          }
      })

  })
  
}


//put function ashar
server.put('/games/:id',updateHandler);

function updateHandler(req, res){
    console.log("test update")
  const id = req.params.id;
  const {name,description,rate,email,platform} = req.body; 


  Game.findByIdAndUpdate(id, {name,description,rate,email,platform}, (err, result) => {
    if(err){
      console.log(err);
    } else {
        Game.find({},(err,result)=>{ 
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.send(result);
        }
    })
    }
  })

}


server.get("*", (req, res) => {
    res.send("Error 404:page not found ");
})

server.listen(PORT, () => console.log(`listening on ${PORT}`));