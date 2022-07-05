const express = require("express");
const cors = require('cors');
require('dotenv').config();

// const ObjectId = require('mongodb').ObjectId;
const MongoUtil = require("./MongoUtil")
const MONGO_URI = process.env.MONGO_URI;
const app = express();

const {ObjectId} = require('mongodb')


app.use(cors())
app.use(express.json());

// collections defination 
const SOAP = "soaps";


// function Arr( a) {
//     let newArr = a || []; // if null, set as empty list
//     return Array.isArray(newArr) ? newArr : [newArr]; // if at least 1 element, make it into array
// }




async function main(){
const db = await MongoUtil.connect(MONGO_URI,"tgc18_soap_collection"); 
console.log("Database connected")
app.get('/',function(req,res){
    res.send("hello world")
})

app.post('/soap_listings',async function(req,res){
console.log(req.body.ingredients)
    let skinType = [];
if (Array.isArray(req.body.skin_type)) {
    skinType = req.body.skin_type
} else if (req.body.skin_type) {
    skinType  = [ req.body.skin_type ]
} 

let oilIngredient = [];
if (Array.isArray(req.body.ingredients.oil_ingredient)) {
    oilIngredient = req.body.ingredients.oil_ingredient
} else if (req.body.ingredients.oil_ingredient) {
    oilIngredient  = [ req.body.ingredients.oil_ingredient ]
} 

let milkIngredient = [];
if (Array.isArray(req.body.ingredients.milk_ingredient)) {
    milkIngredient = req.body.ingredients.milk_ingredient
} else if (req.body.ingredients.milk_ingredient) {
    milkIngredient  = [ req.body.ingredients.milk_ingredient ]
} 
console.log(milkIngredient)
    
    let firstName = req.body.first_name
    let lastName = req.body.last_name
    let email = req.body.email
    let contactNo = req.body.contact_no
    let soapLabel = req.body.soap_label
    let color = req.body.color
    let countryOrigin = req.body.country_origin
    let cost = req.body.cost
    let estimateDelivery = req.body.estimate_delivery
    let skin_Type = skinType 
    
    let oil_Ingredient = req.body.ingredients.oil_ingredient
    let baseIngredient  = req.body.ingredients.base_ingredient.split(",")
    let milk_Ingredient = req.body.ingredients.milk_ingredient
    let ingredients = {oil_Ingredient,baseIngredient,milk_Ingredient}

    

    let result = await db.collection(SOAP).insertOne({
        "first_name" : firstName,
        "last_name": lastName,
        "email":email,
        "contact_no":contactNo,
        "soap_label" :soapLabel,
        "color":color,
        "country_origin": countryOrigin,
        "cost":cost,
        "estimate_delivery":estimateDelivery,
        "skin_type": skin_Type,
        "ingredients": ingredients,
   

    })

    res.status(201)
    res.send(result)
})


app.get('/soap_listings',async function(req,res){
    // console.log(req.body.ingredients)
    // let skinType = [];
    // if (Array.isArray(req.query.skin_type)) {
    //     skinType = req.query.skin_type
    // } else if (req.query.skin_type) {
    //     skinType  = [ req.query.skin_type ]
    // } 
    
    // let oilIngredient = [];
    // if (Array.isArray(req.query.ingredients.oil_ingredient)) {
    //     oilIngredient = req.query.ingredients.oil_ingredient
    // } else if (req.query.ingredients.oil_ingredient) {
    //     oilIngredient  = [ req.query.ingredients.oil_ingredient]
    // } 
    
    // let milkIngredient = [];
    // if (Array.isArray(req.query.ingredients.milk_ingredient)) {
    //     milkIngredient = req.query.ingredients.milk_ingredient
    // } else if (req.query.ingredients.milk_ingredient) {
    //     milkIngredient  = [ req.query.ingredients.milk_ingredient ]
    // } 



    let criteria = {};
    if(req.query.first_name){
        criteria['first_name']={
            '$regex':req.query.first_name,'$options':'i'
        }
    }
    if(req.query.last_name){
        criteria['last_name']={
            '$regex':req.query.last_name,'$options':'i'
        }
    }
    if(req.query.email){
        criteria['email']={
            '$regex':req.query.email,'$options':'i'
        }
    }
    if(req.query.contact_no){
        criteria['contact_no']={
            '$regex':req.query.contact_no,'$options':'i'
        }
        ,{
            'projection':{
                'contact_no': 1
            }
        }
    }
    if(req.query.soap_label){
        criteria['soap_label']={
            '$regex':req.query.soap_label,'$options':'i'
        }
    }
    if(req.query.color){
        criteria['color']={
            '$regex':req.query.color,'$options':'i'
        }
    }

    if(req.query.country_origin){
        criteria['country_origin']={
            '$regex':req.query.country_origin,'$options':'i'
        }
    }
    if(req.query.cost){
        if(req.query.cost == '10 dollars per piece'){
        criteria['cost']={
            '$lte': 10,
          
        }
    }
    }
    if(req.query.cost){
        if(req.query.cost == '20 dollars per piece'){
        criteria['cost']={
            '$lte': 20,
            
        }
    }
    }
    if(req.query.cost){
        if(req.query.cost == '30 dollars per piece'){
        criteria['cost']={
            '$lte': 30,
            
        }
    }
    }
    if(req.query.estimate_delivery){
        if(req.query.estimate_delivery == 'less than 1 week'){
        criteria['estimate_delivery']={
            '$lte': 1,
            '$gte': 0
        }
    }
    }
    if(req.query.estimate_delivery){
        if(req.query.estimate_delivery == 'less than 2 weeks'){
        criteria['estimate_delivery']={
            '$lte': 2,
            '$gte': 0
        }
    }
    }
    if(req.query.estimate_delivery){
        if(req.query.estimate_delivery == 'less than 3 weeks'){
        criteria['estimate_delivery']={
            '$lte': 3,
            '$gte': 0
        }
    }
    }
  
      
    if(req.query.skin_type){
        criteria['skin_type']={
            '$or':[
                {'skin_type':'sensitive'},
                {'skin_type':'dry'} ,
                {'skin_type':'oily'},
                {'skin_type':'cracked'},
              ]       
        },{
            'projection':{
                'skin_type': 1
            }
        }
    }

//   console.log(req.query.ingredients.oil_ingredient)
    if (req.query.ingredients.oil_ingredient) {
        criteria['oil_ingredient'] = {
            '$regex':req.query.ingredients.oil_ingredient,'$options':'i'
        }
    }
    if(req.query.ingredients.base_ingredient){
        criteria['base_ingredient']={
            '$regex':req.query.ingredients.base_ingredient,'$options':'i'
        }
    }

    if (req.query.ingredients.milk_ingredient) {
        criteria['milk_ingredient'] = {
            '$regex':req.query.ingredients.milk_ingredient,'$options':'i'
        }
    }

    let results = await db.collection(SOAP).find(criteria)
    res.status(200)
    //toArray is async
    res.send( await results.toArray())
})

}

main()

app.listen(3000,function(){
    console.log("Server has started")
})