import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import joi from 'joi';


const app = express();

app.use(express.json());
app.use(cors());

dotenv.config();
const mongoClient = new MongoClient(process.env.MONGO_URL);
let mongoData = mongoClient.db("bate-papo");

//data validation
//{name: 'João', lastStatus: 12313123} // O conteúdo do lastStatus será explicado nos próximos requisitos
const schemaName = joi.object({ name: joi.string().min(2).max(30).required()});
//{from: 'João', to: 'Todos', text: 'oi galera', type: 'message', time: '20:04:37'}
const schemaMessage = joi.object({ 
    from: joi.string().min(2).max(30).required(),
    to: joi.string().min(2).max(30).required(),
    text: joi.string().min(1).max(1000).required(),
    type: joi.string().required(),
    time: joi,
});

//POST /participants
app.post("/participants", (req, req )=>{
    const {name} = req.body;
    const validation = schemaName.validate({name});

    if(validation.error){
        res.status(422).send("nome inválido");
        return;
    }

});


app.listen(5000, () => {console.log("Server is running on port 5000")});


