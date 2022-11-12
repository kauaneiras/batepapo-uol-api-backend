import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import joi from 'joi';
import dayjs from 'dayjs';


const app = express();

app.use(express.json());
app.use(cors());

dotenv.config();
const mongoClient = new MongoClient(process.env.MONGO_URL);
let mongoData = null;
mongoClient.connect().then(() => {
    mongoData = mongoClient.db('batepapo');
});

// /// /data validation
// // //{name: 'João', lastStatus: 12313123} // O conteúdo do lastStatus será explicado nos próximos requisitos
 const schemaName = joi.object({name: joi.string().min(2).max(30).required(),});

 const schemaMessage = joi.object({
    from: joi.string().min(1).max(30).required(),
    to: joi.string().min(1).max(30).required(),
    text: joi.string().min(1).max(1000).required(),
    type: joi.string().valid("message", "private_message").required(),
    time: joi.string(),
  });


//POST /participants
app.post("/participants", async (req, res )=>{
    const {name} = req.body;
    const validation = schemaName.validate({name});

    if(validation.error){
        res.status(422).send("nome inválido");
        return;
    }
    //{name: 'xxx', lastStatus: Date.now()}
    let participant = {name: name, lastStatus: Date.now()};
    // Date.now() gera um timestamp, que é o número de milissegundos passados desde 01/01/1970 00:00:00 até o exato momento.

    //Object Message:
    //{from: 'xxx', to: 'Todos', text: 'entra na sala...', type: 'status', time: 'HH:MM:SS'}
    let message = {from: name, to: 'Todos', text: 'entra na sala...', type: 'status', time: dayjs().format('HH:mm:ss')};

    try{ //try insert participant in mongoDB if it doesn't exist;
        if (await mongoData.collection("participants").findOne({name: name})){
            res.status(409).send("Já existe um usuário com esse nome");
            return;
        }
        await mongoData.collection("participants").insertOne(participant);
        await mongoData.collection("messages").insertOne(message);
        res.status(201).send("OK");
    }catch(err){
        res.status(500).send("Erro no servidor");
    }

});

app.get("/participants", async (req, res) =>{
    try{
        const participants = await mongoData.collection("participants").find().toArray();
        res.status(200).send(participants);
    }catch(err){
        res.status(500).send("Erro no servidor: ", err);
    }
});

app.listen(5000, () => {console.log("Server is running on port 5000")});


