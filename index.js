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
            let baseIngredient = req.body.ingredients.base_ingredient
            let milk_Ingredient = req.body.ingredients.milk_ingredient
            let ingredients = { oil_Ingredient, baseIngredient, milk_Ingredient }


            let treat = req.body.suitability.treat
            let recommended_use = req.body.suitability.recommended_use
            let datePosted = req.body.suitability.date_posted
            let suitability = { treat, recommended_use, datePosted }

            let errorMsg = [];

            if (name && name.length < 3 || typeof (name) === "number") {
                errorMsg.push({ "name": name + " is invalid" });
            }

            if (email && email.length < 3 || typeof (email) !== "string") {
                errorMsg.push({ "email": email + " is invalid" })
            }
            else if (email && !email.includes('@')) {
                errorMsg.push({ "email": email + " is invalid" })
            }

            if (soapLabel && typeof (soapLabel) !== "string") {
                errorMsg.push({ "soap_label": soapLabel + " is invalid" })
            }

            // if (imageUrl !== null || typeof (imageUrl) !== "string") {
            //     errorMsg.push({ "image_url": imageUrl + " is invalid" })
            // }

            if (color && typeof (color) !== "object") {
                errorMsg.push({ "color": color + " is invalid" })
            }

            if (countryOrigin && typeof (countryOrigin) !== "string") {
                errorMsg.push({ "color": color + " is invalid" })
            }
            if (estimateDelivery && typeof (estimateDelivery) !== "string") {
                errorMsg.push({ "estimate_delivery": estimateDelivery + " is invalid" })
            }

            if (skin_Type && typeof (skin_Type) !== "object") {
                errorMsg.push({ "skin_type": skin_Type + " is invalid" })
            }
            

            if (oil_Ingredient && typeof (oil_Ingredient) !== "object") {
                errorMsg.push({ "oil_Ingredient": oil_Ingredient + " is invalid" })
            }

            if ( baseIngredient && typeof (baseIngredient) !== "object") {
                errorMsg.push({ "baseIngredient": baseIngredient + " is invalid" })
            }
            
            if (milk_Ingredient && typeof (milk_Ingredient) !== "string") {
                errorMsg.push({ "milk_Ingredient": milk_Ingredient + " is invalid" })
            }

            if ((treat && typeof (treat) !== "object")){
                errorMsg.push({ "treat": treat + " is invalid" })
            }

            if (recommended_use && typeof (recommended_use) !== "string"){
                errorMsg.push({ "recommended_use": recommended_use + " is invalid" })
            }
            
            if (datePosted && typeof (datePosted) !== "string"){
                errorMsg.push({ "datePosted": datePosted + " is invalid" })
            }
            
            


            if (errorMsg && errorMsg.length > 0) {
                res.status(406).json({ "Errors": errorMsg });
            } else {


                let result = await db.collection(SOAP).insertOne({
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
    
    
                })

                   res.status(201);
                   res.json(result);
                // db insert
                // success
            }

            // if(name.length < 3 || typeof(name) === "number"){
            //     res.status(400).send('Name error')
            // } 

            // // if(email.length < 3 || typeof(email) !== "string"){
            // //     res.status(400).send('email error')
            // // }

            // // if (email && !email.includes('@')) {
            // //     res.status(400).send('email error')
            // // }
            // else if( contactNo && typeof(contactNo) !== "string"){
            //     res.status(400).send('Contact_no error')

            // } 



            // else{
            //     res.status(201)
            //     res.send("success")
            // }


            // if(name.length < 3){
            //     res.status(400).send('message error')

            // }else{
            //     res.status(201)
            //     res.send("success")
            // }



        } catch (e){
            res.status(500)
            res.json("Internal Server error")
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
            criteria['name'] = {
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
            //     , {
            //     'projection': {
            //         'contact_no': 1
            //     }
            // }
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
        // min cost
        // max cost
        if (req.query.min_cost) {
            criteria['cost'] = {
                '$gte': req.query.min_cost,
            }
        }
        if (req.query.max_cost) {
            criteria['cost'] = {
                '$lte': req.query.max_cost,
            }
        }
        // if (req.query.cost) {
        //     if (req.query.cost == 30) {
        //         criteria['cost'] = {
        //             '$lte': 30,

        //         }
        //     }
        // }

        // estimated_delivery
        if (req.query.estimate_delivery) {
            if (req.query.estimate_delivery == 'less than 1 week') {
                criteria['estimate_delivery'] = {
                    '$lte': 1
                }
            }
        }
        if (req.query.estimate_delivery) {
            if (req.query.estimate_delivery == 'less than 2 weeks') {
                criteria['estimate_delivery'] = {
                    '$lte': 2,

                }
            }
        }
        if (req.query.estimate_delivery) {
            if (req.query.estimate_delivery == 'less than 3 weeks') {
                criteria['estimate_delivery'] = {
                    '$lte': 3,

                }
            }
        }

        // skin type
        if (req.query.skin_type) {
            criteria["$and"] = req.query.skin_type.map(type =>{ return {"skin_type" : { "$in": [type] }}})
            criteria['skin_type'] = {
                '$in': ['sensitive', 'dry', 'oily', 'cracked']
            }



            // criteria['skin_type'] = {
            //     '$or': [
            //         { 'skin_type': 'sensitive' },
            //         { 'skin_type': 'dry' },
            //         { 'skin_type': 'oily' },
            //         { 'skin_type': 'cracked' },
            //     ]
            // }
            // , {
            //     'projection': {
            //         'skin_type': 1
            //     }
            // }
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
                '$in': [req.query.treat]
            }
        }
        if (req.query.recommended_use) {
            criteria['recommended_use'] = {
                '$regex': req.query.recommended_use, '$options': 'i'
            }
        }
        if (req.query.date_posted) {
            criteria['date_posted'] = {
                '$regex': req.query.date_posted, '$options': 'i'
            }

        }
        let results = await db.collection(SOAP).find(criteria,
            {
                'projection': {
                    'name': 1,
                    "email": 1,
                    "contact_no": 1,
                    "soap_label": 1,
                    "image_url": 1,
                    "color": 1,
                    "country_origin": 1,
                    "cost": 1,
                    "estimate_delivery": 1,
                    "skin_type":1,
                    "ingredients": 1,
                    "suitability": 1
                }
            })
        res.status(200)
        //toArray is async
        res.send(await results.toArray())
    })





    //update 
    // patch vs put 
    app.put('/soap_listings/:id', async function (req,res) {

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
        let baseIngredient = req.body.ingredients.base_ingredient
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