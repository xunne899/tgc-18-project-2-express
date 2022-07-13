const express = require("express");
const cors = require('cors');
require('dotenv').config();
const validator = require("./validator")
const MongoUtil = require("./MongoUtil")
const MONGO_URI = process.env.MONGO_URI;
const app = express();

const { ObjectId } = require('mongodb')


app.use(cors())
app.use(express.json());

// collections defination 
const SOAP = "soaps";







async function main() {


    const db = await MongoUtil.connect(MONGO_URI, "tgc18_soap_collection");
    console.log("Database connected")

    app.get('/', function (req, res) {
        res.send("hello world")
    })


    app.post('/soap_listings/comments/:id', async (req, res) => {



        let _id = new ObjectId()
        let datePosted = new Date()
        let username = req.body.username;
        let comment = req.body.comment;

        let msgError = [];

        if (typeof (username) !== "string") {
            msgError.push({ "userName": username + " is invalid" });
        }

        if (typeof (comment) !== "string") {
            msgError.push({ "comment": comment + " is invalid" });
        }


        if (msgError && msgError.length > 0) {
            res.status(406).json({ "Errors": msgError });
        } else {
            let result = await db.collection(SOAP).updateOne({
                _id: ObjectId(req.params.id)
            }, {

                '$push': {
                    comments: {
                        _id, datePosted, username, comment
                    }
                }

            })
            res.status(201)
            res.json(result)
        }

    })





    app.post('/soap_listings', async function (req, res) {

        console.log(req.body.ingredients)


        try {

            let skinType = [];
            if (Array.isArray(req.body.skin_type)) {
                skinType = req.body.skin_type
            } else if (req.body.skin_type) {
                skinType = [req.body.skin_type]
            }

            let name = req.body.name
            let email = req.body.email
            let contact_no = req.body.contact_no
            let soap_label = req.body.soap_label
            let image_url = req.body.image_url
            let color = req.body.color
            let country_origin = req.body.country_origin
            let cost = req.body.cost
            // let estimateDelivery = req.body.estimate_delivery
            let skin_type = skinType

            let oil_ingredient = req.body.ingredients.oil_ingredient
            let base_ingredient = req.body.ingredients.base_ingredient
            let milk_ingredient = req.body.ingredients.milk_ingredient
            let ingredients = { oil_ingredient, base_ingredient, milk_ingredient }


            let treat = req.body.suitability.treat
            let recommended_use = req.body.suitability.recommended_use
            let date_posted = req.body.suitability.date_posted
            let suitability = { treat, recommended_use, date_posted }

            let msgError = [];

            //name
            if (name && name.length < 3 || typeof (name) === "number") {
                msgError.push({ "name": name + " is invalid" });
            }
            //email
            validator.validate(email, msgError)

            //soap
            if (soap_label && typeof (soap_label) !== "string") {
                msgError.push({ "soap_label": soap_label + " is invalid" })
            }


            //image
            if (typeof (image_url) !== "string"
                // !image_url.match(/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/)
            ) {
                msgError.push({ image_url: `${image_url} is an invalid url` });
            }


            //color
            if (color && typeof (color) !== "string") {
                msgError.push({ "color": color + " is invalid" })
            }


            //country
            if (country_origin && typeof (country_origin) !== "string") {
                msgError.push({ "country_origin": country_origin + " is invalid" })
            }



            //skin
            if (skin_type && typeof (skin_type) !== "object") {
                msgError.push({ "skin_type": skin_type + " is invalid" })
            }

            //oil
            if (oil_ingredient && typeof (oil_ingredient) !== "object") {
                msgError.push({ "oil_ingredient": oil_ingredient + " is invalid" })
            }
            //base
            if (base_ingredient && typeof (base_ingredient) !== "object") {
                msgError.push({ "base_ingredient": base_ingredient + " is invalid" })
            }
            //milk
            if (milk_ingredient && typeof (milk_ingredient) !== "object") {
                msgError.push({ "milk_ingredient": milk_ingredient + " is invalid" })
            }
            //treat
            if ((treat && typeof (treat) !== "object")) {
                msgError.push({ "treat": treat + " is invalid" })
            }
            //recommend
            if (recommended_use && typeof (recommended_use) !== "string") {
                msgError.push({ "recommended_use": recommended_use + " is invalid" })
            }
            //date
            if (date_posted && typeof (date_posted) !== "number") {
                msgError.push({ "date_posted": date_posted + " is invalid" })
            }



            if (msgError && msgError.length > 0) {
                res.status(406).json({ "Errors": msgError });
            } else {


                let result = await db.collection(SOAP).insertOne({
                    "name": name,
                    "email": email,
                    "contact_no": contact_no,
                    "soap_label": soap_label,
                    "image_url": image_url,
                    "color": color,
                    "country_origin": country_origin,
                    "cost": cost,
                    // "estimate_delivery": estimateDelivery,
                    "skin_type": skin_type,
                    "ingredients": ingredients,
                    "suitability": suitability


                })

                res.status(201);
                res.json(result);
                // db insert
                // success
            }




        } catch (e) {
            res.status(500)
            res.json("Internal Server error")
        }
    })

    app.get('/soap_listings', async function (req, res) {



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

        if (req.query.min_cost && req.query.max_cost) {
            criteria['cost'] = {
                '$gte': parseInt(req.query.min_cost),
                '$lte': parseInt(req.query.max_cost),
            }
        } else if (req.query.min_cost) {
            criteria['cost'] = {
                '$gte': parseInt(req.query.min_cost),
            }
        } else if (req.query.max_cost) {
            criteria['cost'] = {
                '$lte': parseInt(req.query.max_cost),
            }
        }

        // skin type
        if (req.query.skin_type) {
            criteria["$and"] = req.query.skin_type.map(type => { return { "skin_type": { "$in": [type] } } })
            // criteria['skin_type'] = {
            //     '$in': ['sensitive', 'dry', 'oily', 'cracked']
            // }



        }

        //ingredients
        // console.log(req.query.oil_ingredient)
        // console.log(req.query.stuff)
        //   console.log(req.query.ingredients.oil_ingredient)
        if (req.query.oil_ingredient) {
            criteria['ingredients.oil_ingredient'] = {
                '$in': [req.query.oil_ingredient]
            }
        }
        if (req.query.base_ingredient) {
            criteria['ingredients.base_ingredient'] = {
                '$in': [req.query.base_ingredient]
            }
        }

        if (req.query.milk_ingredient) {
            criteria['ingredients.milk_ingredient'] = {
                '$in': [req.query.milk_ingredient]
            }
        }

        // suitability
        if (req.query.treat) {
            criteria['suitability.treat'] = {
                '$in': [req.query.treat]
            }
        }
        if (req.query.recommended_use) {
            criteria['suitability.recommended_use'] = {
                '$regex': req.query.recommended_use, '$options': 'i'
            }
        }
        if (req.query.date_posted) {
            criteria['suitability.date_posted'] = {
                '$regex': req.query.date_posted, '$options': 'i'
            }

        }
        //comments
        if (req.query.username) {
            criteria['comments.username'] = {
                '$regex': req.query.username, '$options': 'i'
            }

        }
        if (req.query.comment) {
            criteria['comments.comment'] = {
                '$regex': req.query.comment, '$options': 'i'
            }

        }


        if (req.query.search) {
            criteria['$or'] = [

                {
                    'name': {
                        '$regex': `${req.query.search}`,
                        '$options': 'i'
                    }
                },
                {
                    'email': {
                        '$regex': `${req.query.search}`,
                        '$options': 'i'
                    }
                },
                {
                    'country_origin': {
                        '$regex': `${req.query.search}`,
                        '$options': 'i'
                    }
                },
                {
                    'color': {
                        '$regex': `${req.query.search}`,
                        '$options': 'i'
                    }
                },
                {
                    'skin_type': {
                        '$regex': `${req.query.search}`,
                        '$options': 'i'
                    }
                },
                {
                    'suitability.treat': {
                        '$regex': `${req.query.search}`,
                        '$options': 'i'
                    }
                },
                {
                    'suitability.recommended_use': {
                        '$regex': `${req.query.search}`,
                        '$options': 'i'
                    }
                },
                {
                    'suitability.date_posted': {
                        '$regex': `${req.query.search}`,
                        '$options': 'i'
                    }
                },

                {
                    'ingredients.oil_ingredient': {
                        '$regex': `${req.query.search}`,
                        '$options': 'i'
                    }
                },
                {
                    'ingredients.base_ingredient': {
                        '$regex': `${req.query.search}`,
                        '$options': 'i'
                    }
                },
                {
                    'ingredients.milk_ingredient': {
                        '$regex': `${req.query.search}`,
                        '$options': 'i'
                    }
                },
                // {
                //     'treat': {
                //         '$regex': `${req.query.search}`,
                //         '$options': 'i'
                //     }
                // },
                {
                    'comments.recommended_use': {
                        '$regex': `${req.query.search}`,
                        '$options': 'i'
                    }
                },

                {
                    'comments.comment': {
                        '$regex': `${req.query.search}`,
                        '$options': 'i'
                    }
                },
                {
                    'comments.username': {
                        '$regex': `${req.query.search}`,
                        '$options': 'i'
                    }
                }


            ]
        };

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
                    // "estimate_delivery": 1,
                    "skin_type": 1,
                    "ingredients": 1,
                    "suitability": 1,
                    "comments": 1,

                }
            })
        res.status(200)
        //toArray is async
        res.send(await results.toArray())
    })

    // get doc field id
    app.get('/soap_listings/:id', async function (req, res) {

        let results = await db.collection(SOAP).findOne({
            '_id': ObjectId(req.params.id)
        }, {
            'projection': {
                // '_id': ObjectId(req.params.id),
                'name': 1,
                "email": 1,
                "contact_no": 1,
                "soap_label": 1,
                "image_url": 1,
                "color": 1,
                "country_origin": 1,
                "cost": 1,
                // "estimate_delivery": 1,
                "skin_type": 1,
                "ingredients": 1,
                "suitability": 1,
                "comments": 1,

            }

        })

        res.status(200)

        res.send(results)
    })





    //update 
    // patch vs put 
    app.put('/soap_listings/:id', async function (req, res) {


        try {

            let skinType = [];
            if (Array.isArray(req.body.skin_type)) {
                skinType = req.body.skin_type
            } else if (req.body.skin_type) {
                skinType = [req.body.skin_type]
            }

            let name = req.body.name
            let email = req.body.email
            let contact_no = req.body.contact_no
            let soap_label = req.body.soap_label
            let image_url = req.body.image_url
            let color = req.body.color
            let country_origin = req.body.country_origin
            let cost = req.body.cost
            // let estimateDelivery = req.body.estimate_delivery
            let skin_type = skinType

            let oil_ingredient = req.body.ingredients.oil_ingredient
            let base_ingredient = req.body.ingredients.base_ingredient
            let milk_ingredient = req.body.ingredients.milk_ingredient
            let ingredients = { oil_ingredient, base_ingredient, milk_ingredient }


            let treat = req.body.suitability.treat
            let recommended_use = req.body.suitability.recommended_use
            let date_posted = req.body.suitability.date_posted
            let suitability = { treat, recommended_use, date_posted }

            let msgError = [];

            if (name && name.length < 3 || typeof (name) === "number") {
                msgError.push({ "name": name + " is invalid" });
            }

            // if (email && email.length < 3 || typeof (email) !== "string") {
            //     msgError.push({ "email": email + " is invalid" })
            // }
            // else if (email && !email.includes('@')) {
            //     msgError.push({ "email": email + " is invalid" })
            // }
            validator.validate( email, msgError)

            if (soap_label && typeof (soap_label) !== "string") {
                msgError.push({ "soap_label": soap_label + " is invalid" })
            }

         
            if ( typeof (image_url) !== "string"
                // !image_url.match(/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/)
                ) {
                msgError.push({ image_url: `${image_url} is an invalid url` });
            }

            if (color && typeof (color) !== "string") {
                msgError.push({ "color": color + " is invalid" })
            }

            if (country_origin && typeof (country_origin) !== "string") {
                msgError.push({ "country_origin": country_origin  + " is invalid" })
            }
            // if (estimateDelivery && typeof (estimateDelivery) !== "string") {
            //     msgError.push({ "estimate_delivery": estimateDelivery + " is invalid" })
            // }

            if (skin_type && typeof (skin_type) !== "object") {
                msgError.push({ "skin_type": skin_type + " is invalid" })
            }


            if (oil_ingredient && typeof (oil_ingredient) !== "object") {
                msgError.push({ "oil_ingredient": oil_ingredient + " is invalid" })
            }

            if (base_ingredient && typeof (base_ingredient) !== "object") {
                msgError.push({ "base_ingredient": base_ingredient + " is invalid" })
            }

            if (milk_ingredient && typeof (milk_ingredient) !== "object") {
                msgError.push({ "milk_ingredient": milk_ingredient + " is invalid" })
            }

            if ((treat && typeof (treat) !== "object")) {
                msgError.push({ "treat": treat + " is invalid" })
            }

            if (recommended_use && typeof (recommended_use) !== "string") {
                msgError.push({ "recommended_use": recommended_use + " is invalid" })
            }

            if (date_posted && typeof (date_posted) !== "number") {
                msgError.push({ "date_posted": date_posted + " is invalid" })
            }
       

            if (msgError && msgError.length > 0) {
                res.status(406).json({ "Errors": msgError });
            } else {

                let results = await db.collection(SOAP).updateOne({
                    '_id': ObjectId(req.params.id)
                }, {
                    '$set': {
                        "name": name,
                        "email": email,
                        "contact_no": contact_no,
                        "soap_label": soap_label,
                        "image_url": image_url,
                        "color": color,
                        "country_origin": country_origin,
                        "cost": cost,
                        // "estimate_delivery": estimateDelivery,
                        "skin_type": skin_type,
                        "ingredients": ingredients,
                        "suitability": suitability
                    }
                })
                res.status(200);
                res.json(results);


            }
        } catch (e) {
            res.status(500)
            res.json("Internal Server error")
        }
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