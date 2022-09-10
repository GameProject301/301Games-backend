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
            // let result = await axios.get(url);
            // const gamesArr = result.data.results.map(item => new Games(item));
            // res.send(gamesArr);
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



server.get("*", (req, res) => {
    res.send("Error 404:page not found ");
})


//post function ashar
server.post ("/games",addHandler);

async function addHandler(req,res) {
    const {name,image,plateforms,rate} = req.body; 
    await Game.create({
      name:name,
      image:image,
      plateforms:plateforms,
      rate:rate,
        
    });
  
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


  //delete function ashar
  server.delete('/games/:id',deleteHandler);
 
  function deleteHandler(req,res) { 
  const gameId = req.params.id;
 
  Game.deleteOne({_id:gameId},(err,result)=>{
      
    Game.find({_id:gameId},(err,result)=>{ 
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
  const id = req.params.id;
  const {name,image,plateforms,rate} = req.body;

  Game.findByIdAndUpdate(id, {name,image,plateforms,rate}, (err, result) => {
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




server.listen(PORT, () => console.log(`listening on ${PORT}`));
