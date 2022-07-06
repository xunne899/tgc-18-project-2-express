const express = require("express");
const cors = require('cors');
require('dotenv').config();

// const ObjectId = require('mongodb').ObjectId;
const MongoUtil = require("./MongoUtil")
const MONGO_URI = process.env.MONGO_URI;
const app = express();

const { ObjectId } = require('mongodb')


app.use(cors())
app.use(express.json());

// collections defination 
const SOAP = "soaps";


// function Arr( a) {
//     let newArr = a || []; // if null, set as empty list
//     return Array.isArray(newArr) ? newArr : [newArr]; // if at least 1 element, make it into array
// }




async function main() {
    const db = await MongoUtil.connect(MONGO_URI, "tgc18_soap_collection");
    console.log("Database connected")

    app.get('/', function (req, res) {
        res.send("hello world")
    })


    app.post('/soap_listings', async function (req, res) {

        console.log(req.body.ingredients)



        // let oilIngredient = [];
        // if (Array.isArray(req.body.ingredients.oil_ingredient)) {
        //     oilIngredient = req.body.ingredients.oil_ingredient
        // } else if (req.body.ingredients.oil_ingredient) {
        //     oilIngredient  = [ req.body.ingredients.oil_ingredient ]
        // } 

        // let milkIngredient = [];
        // if (Array.isArray(req.body.ingredients.milk_ingredient)) {
        //     milkIngredient = req.body.ingredients.milk_ingredient
        // } else if (req.body.ingredients.milk_ingredient) {
        //     milkIngredient  = [ req.body.ingredients.milk_ingredient ]
        // } 
        // console.log(milkIngredient)

        try {

            let skinType = [];
            if (Array.isArray(req.body.skin_type)) {
                skinType = req.body.skin_type
            } else if (req.body.skin_type) {
                skinType = [req.body.skin_type]
            }

            let name = req.body.name
            let email = req.body.email
            let contactNo = req.body.contact_no
            let soapLabel = req.body.soap_label
            let imageUrl = req.body.image_url
            let color = req.body.color
            let countryOrigin = req.body.country_origin
            let cost = req.body.cost
            let estimateDelivery = req.body.estimate_delivery
            let skin_Type = skinType

            let oil_Ingredient = req.body.ingredients.oil_ingredient
            let baseIngredient = req.body.ingredients.base_ingredient.split(",")
            let milk_Ingredient = req.body.ingredients.milk_ingredient
            let ingredients = { oil_Ingredient, baseIngredient, milk_Ingredient }


            let treat = req.body.suitability.treat
            let recommended_use = req.body.suitability.recommended_use
            let datePosted = req.body.suitability.date_posted
            let suitability = { treat, recommended_use, datePosted }
    
            if(name.length < 3 || typeof(name) === "number"){
                res.status(400).send('Name error')
               
            }else{
                res.status(201)
                res.send("success")
            }
            
            if(email.length < 3 || typeof(name) === "number"){
                res.status(400).send('email error')
               
            }else{
                res.status(201)
                res.send("success")
            }

            if(contactNo.length < 9 || typeof(contactNo) === "string"){
                res.status(400).send('Name error')
               
            }else{
                res.status(201)
                res.send("success")
            }


            // if(name.length < 3){
            //     res.status(400).send('message error')
               
            // }else{
            //     res.status(201)
            //     res.send("success")
            // }



            // let result = await db.collection(SOAP).insertOne({
            //     "name": name,
            //     "email": email,
            //     "contact_no": contactNo,
            //     "soap_label": soapLabel,
            //     "image_url": imageUrl,
            //     "color": color,
            //     "country_origin": countryOrigin,
            //     "cost": cost,
            //     "estimate_delivery": estimateDelivery,
            //     "skin_type": skin_Type,
            //     "ingredients": ingredients,
            //     "suitability": suitability


            // })

        

        } catch (e) {
            res.status(500)
            res.send("Internal Server error")
        }
    })

    app.get('/soap_listings', async function (req, res) {
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
        //name
        if (req.query.name) {
            criteria['first_name'] = {
                '$regex': req.query.name, '$options': 'i'
            }
        }

        //email
        if (req.query.email) {
            criteria['email'] = {
                '$regex': req.query.email, '$options': 'i'
            }
        }

        //contact no
        if (req.query.contact_no) {
            criteria['contact_no'] = {
                '$regex': req.query.contact_no, '$options': 'i'
            }
                , {
                'projection': {
                    'contact_no': 1
                }
            }
        }
        //soap
        if (req.query.soap_label) {
            criteria['soap_label'] = {
                '$regex': req.query.soap_label, '$options': 'i'
            }
        }
        // image_url
        if (req.query.image_url) {
            criteria['image_url'] = {
                '$regex': req.query.image_url, '$options': 'i'
            }
        }
        //colour
        if (req.query.color) {
            criteria['color'] = {
                '$regex': req.query.color, '$options': 'i'
            }
        }
        //country_origin
        if (req.query.country_origin) {
            criteria['country_origin'] = {
                '$regex': req.query.country_origin, '$options': 'i'
            }
        }

        // cost
        if (req.query.cost) {
            if (req.query.cost == 10) {
                criteria['cost'] = {
                    '$lte': 10,

                }
            }
        }
        if (req.query.cost) {
            if (req.query.cost == 20) {
                criteria['cost'] = {
                    '$lte': 20,

                }
            }
        }
        if (req.query.cost) {
            if (req.query.cost == 30) {
                criteria['cost'] = {
                    '$lte': 30,

                }
            }
        }

        // estimated_delivery
        if (req.query.estimate_delivery) {
            if (req.query.estimate_delivery == 'less than 1 week') {
                criteria['estimate_delivery'] = {
                    '$lte': 1,
                    '$gte': 0
                }
            }
        }
        if (req.query.estimate_delivery) {
            if (req.query.estimate_delivery == 'less than 2 weeks') {
                criteria['estimate_delivery'] = {
                    '$lte': 2,
                    '$gte': 0
                }
            }
        }
        if (req.query.estimate_delivery) {
            if (req.query.estimate_delivery == 'less than 3 weeks') {
                criteria['estimate_delivery'] = {
                    '$lte': 3,
                    '$gte': 0
                }
            }
        }

        // skin type
        if (req.query.skin_type) {
            criteria['skin_type'] = {
                '$or': [
                    { 'skin_type': 'sensitive' },
                    { 'skin_type': 'dry' },
                    { 'skin_type': 'oily' },
                    { 'skin_type': 'cracked' },
                ]
            }, {
                'projection': {
                    'skin_type': 1
                }
            }
        }

        //ingredients
        // console.log(req.query.oil_ingredient)
        // console.log(req.query.stuff)
        //   console.log(req.query.ingredients.oil_ingredient)
        if (req.query.oil_ingredient) {
            criteria['oil_ingredient'] = {
                '$regex': req.query.oil_ingredient, '$options': 'i'
            }
        }
        if (req.query.base_ingredient) {
            criteria['base_ingredient'] = {
                '$regex': req.query.base_ingredient, '$options': 'i'
            }
        }

        if (req.query.milk_ingredient) {
            criteria['milk_ingredient'] = {
                '$regex': req.query.milk_ingredient, '$options': 'i'
            }
        }

        // suitability
        if (req.query.treat) {
            criteria['treat'] = {
                '$regex': req.query.treat, '$options': 'i'
            }
        }
        if (req.query.recommended_use) {
            criteria['treat'] = {
                '$regex': req.query.recommended_use, '$options': 'i'
            }
        }
        if (req.query.date_posted) {
            criteria['treat'] = {
                '$regex': req.query.date_posted, '$options': 'i'
            }

        }
        let results = await db.collection(SOAP).find(criteria)
        res.status(200)
        //toArray is async
        res.send(await results.toArray())
    })





    //update 
    // patch vs put 
    app.put('/soap_listings/:id', async function (req, res) {

        let skinType = [];
        if (Array.isArray(req.body.skin_type)) {
            skinType = req.body.skin_type
        } else if (req.body.skin_type) {
            skinType = [req.body.skin_type]
        }

        let name = req.body.name
        let email = req.body.email
        let contactNo = req.body.contact_no
        let soapLabel = req.body.soap_label
        let imageUrl = req.body.image_url
        let color = req.body.color
        let countryOrigin = req.body.country_origin
        let cost = req.body.cost
        let estimateDelivery = req.body.estimate_delivery
        let skin_Type = skinType

        let oil_Ingredient = req.body.ingredients.oil_ingredient
        let baseIngredient = req.body.ingredients.base_ingredient.split(",")
        let milk_Ingredient = req.body.ingredients.milk_ingredient
        let ingredients = { oil_Ingredient, baseIngredient, milk_Ingredient }


        let treat = req.body.suitability.treat
        let recommended_use = req.body.suitability.recommended_use
        let datePosted = req.body.suitability.date_posted ? new Date(req.body.suitability.date_posted) : new Date();
        let suitability = { treat, recommended_use, datePosted }


        let results = await db.collection(SOAP).updateOne({
            '_id': ObjectId(req.params.id)
        }, {
            '$set': {
                "name": name,
                "email": email,
                "contact_no": contactNo,
                "soap_label": soapLabel,
                "image_url": imageUrl,
                "color": color,
                "country_origin": countryOrigin,
                "cost": cost,
                "estimate_delivery": estimateDelivery,
                "skin_type": skin_Type,
                "ingredients": ingredients,
                "suitability": suitability
            }
        })
        res.status(200);
        res.json(results);
    })

    // delete
    app.delete('/soap_listings/:id', async function (req, res) {
        let results = await db.collection('sightings').deleteOne({
            '_id': ObjectId(req.params.id)
        })

        res.status(200);
        res.json({ 'status': 'ok' });
    })


}

main()

app.listen(3000, function () {
    console.log("Server has started")
})