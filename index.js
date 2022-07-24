const express = require("express");
const cors = require("cors");
require("dotenv").config();
const validator = require("./validator");
const MongoUtil = require("./MongoUtil");
const MONGO_URI = process.env.MONGO_URI;
const app = express();

const { ObjectId } = require("mongodb");

app.use(cors());
app.use(express.json());

// soap collections
const SOAP = "soaps";

async function main() {
  const db = await MongoUtil.connect(MONGO_URI, "tgc18_soap_collection");
  console.log("Database connected");

  app.get("/", function (req, res) {
    res.send("hello world");
  });


  app.get("/soap_listings/comments/:id", async function (req, res) {
    let results = await db.collection(SOAP).findOne(
      {
        _id: ObjectId(req.params.id),
      },

      {
        projection: {
          name: 1,
          email: 1,
          contact_no: 1,
          soap_label: 1,
          image_url: 1,
          color: 1,
          country_origin: 1,
          cost: 1,
          skin_type: 1,
          ingredients: 1,
          suitability: 1,
          comments: 1,
        },
      }
    );

    res.status(200);
    res.send(results);
  });





  //post comments route
  app.post("/soap_listings/comments/:id", async (req, res) => {
    let _id = new ObjectId();
    let datePosted = new Date();
    let username = req.body.username;
    let comment = req.body.comment;

    let msgError = [];

    if (typeof username !== "string") {
      msgError.push({ userName: username + " is invalid" });
    }

    if (typeof comment !== "string") {
      msgError.push({ comment: comment + " is invalid" });
    }

    if (msgError && msgError.length > 0) {
      res.status(406).json({ Errors: msgError });
    } else {
      let result = await db.collection(SOAP).updateOne(
        {
          _id: ObjectId(req.params.id),
        },
        {
          $push: {
            comments: {
              _id,
              datePosted,
              username,
              comment,
            },
          },
        }
      );
      res.status(201);
      res.json(result);
    }
  });

  //post of all soap listings route
  app.post("/soap_listings", async function (req, res) {
    try {
      let skinType = [];
      if (Array.isArray(req.body.skin_type)) {
        skinType = req.body.skin_type;
      } else if (req.body.skin_type) {
        skinType = [req.body.skin_type];
      }

      let name = req.body.name;
      let email = req.body.email;
      let contact_no = req.body.contact_no;
      let soap_label = req.body.soap_label;
      let image_url = req.body.image_url;
      let color = req.body.color;
      let country_origin = req.body.country_origin;
      let cost = req.body.cost;
      let skin_type = skinType;

      let oil_ingredient = req.body.ingredients.oil_ingredient;
      let base_ingredient = req.body.ingredients.base_ingredient;
      let milk_ingredient = req.body.ingredients.milk_ingredient;
      let ingredients = { oil_ingredient, base_ingredient, milk_ingredient };

      let treat = req.body.suitability.treat;
      let recommended_use = req.body.suitability.recommended_use;
      let date_posted = req.body.suitability.date_posted;
      let suitability = { treat, recommended_use, date_posted };

      let msgError = {};

      // custom module validator for each field
      validator.validateNotEmptyString(name, "name", msgError);
      validator.validateEmail(email, msgError);
      validator.validateNotEmptyString(contact_no, "contact_no", msgError);
      validator.validateNotEmptyString(soap_label, "soap_label", msgError);
      validator.validateNotEmptyString(image_url, "image_url", msgError);
      validator.validateNotEmptyString(color, "color", msgError);
      validator.validateNotEmptyString(country_origin, "country_origin", msgError);
      validator.validateNotEmptyString(recommended_use, "recommended_use", msgError);
      validator.validateNotEmptyList(skin_type, "skin_type", msgError);
      validator.validateNotEmptyList(oil_ingredient, "oil_ingredient", msgError);
      validator.validateNotEmptyList(base_ingredient, "base_ingredient", msgError);
      validator.validateNotEmptyList(milk_ingredient, "milk_ingredient", msgError);
      validator.validateNotEmptyList(treat, "treat", msgError);
      validator.validateNotNumber(date_posted, "date_posted", msgError);
      validator.validateNotNumber(cost, "cost", msgError);

    
      if (msgError && Object.keys(msgError).length > 0) {
        res.status(406).json({ Errors: msgError });
      } else {
        let result = await db.collection(SOAP).insertOne({
          name: name,
          email: email,
          contact_no: contact_no,
          soap_label: soap_label,
          image_url: image_url,
          color: color,
          country_origin: country_origin,
          cost: cost,
          skin_type: skin_type,
          ingredients: ingredients,
          suitability: suitability,
        });

        res.status(201);
        res.json(result);
        
      }
    } catch (e) {
      console.log(e);
      res.status(500);
      res.json("Internal Server error");
    }
  });

  // get soap listings route
  app.get("/soap_listings", async function (req, res) {
    let criteria = {};


    //name
    if (req.query.name) {
      criteria["name"] = {
        $regex: req.query.name,
        $options: "i",
      };
    }

    //email
    if (req.query.email) {
      criteria["email"] = {
        $regex: req.query.email,
        $options: "i",
      };
    }

    //contact no
    if (req.query.contact_no) {
      criteria["contact_no"] = {
        $regex: req.query.contact_no,
        $options: "i",
      };

    }
    //soap
    if (req.query.soap_label) {
      criteria["soap_label"] = {
        $regex: req.query.soap_label,
        $options: "i",
      };
    }
    // image_url
    if (req.query.image_url) {
      criteria["image_url"] = {
        $regex: req.query.image_url,
        $options: "i",
      };
    }
    //colour
    if (req.query.color) {
      criteria["color"] = {
        $regex: req.query.color,
        $options: "i",
      };
    }
    //country_origin
    if (req.query.country_origin) {
      criteria["country_origin"] = {
        $regex: req.query.country_origin,
        $options: "i",
      };
    }

    // min max cost
    if (req.query.min_cost && req.query.max_cost) {
      criteria["cost"] = {
        $gte: parseInt(req.query.min_cost),
        $lte: parseInt(req.query.max_cost),
      };
    } else if (req.query.min_cost) {
      criteria["cost"] = {
        $gte: parseInt(req.query.min_cost),
      };
    } else if (req.query.max_cost) {
      criteria["cost"] = {
        $lte: parseInt(req.query.max_cost),
      };
    }

    // skin type
    if (req.query.skin_type) {
      criteria['skin_type'] = {
          '$all': req.query.skin_type
      }
    }
    // ingredients
    if (req.query.oil_ingredient) {
      criteria['ingredients.oil_ingredient'] = {
          '$all': [req.query.oil_ingredient]
      }
    }
    if (req.query.base_ingredient) {
      criteria['ingredients.base_ingredient'] = {
          '$all': [req.query.base_ingredient]
      }
    }

    if (req.query.milk_ingredient) {
      criteria['ingredients.milk_ingredient'] = {
          '$all': [req.query.milk_ingredient]
      }
    }

    // suitability
    if (req.query.treat) {
      criteria["suitability.treat"] = {
        '$in': [req.query.treat],
      };
    }
    if (req.query.recommended_use) {
      criteria["suitability.recommended_use"] = {
        $regex: req.query.recommended_use,
        $options: "i",
      };
    }
    if (req.query.date_posted) {
      criteria["suitability.date_posted"] = {
        $regex: req.query.date_posted,
        $options: "i",
      };
    }
    //comments
    if (req.query.username) {
      criteria["comments.username"] = {
        $regex: req.query.username,
        $options: "i",
      };
    }
    if (req.query.comment) {
      criteria["comments.comment"] = {
        $regex: req.query.comment,
        $options: "i",
      };
    }
   // search field
    if (req.query.search) {
      criteria["$or"] = [
        {
          name: {
            $regex: `${req.query.search}`,
            $options: "i",
          },
        },
        {
          email: {
            $regex: `${req.query.search}`,
            $options: "i",
          },
        },
        {
          contact_no: {
            $regex: `${req.query.search}`,
            $options: "i",
          },
        },
        {
          country_origin: {
            $regex: `${req.query.search}`,
            $options: "i",
          },
        },
        {
          color: {
            $regex: `${req.query.search}`,
            $options: "i",
          },
        },
        {
          skin_type: {
            $regex: `${req.query.search}`,
            $options: "i",
          },
        },
        {
          "suitability.treat": {
            $regex: `${req.query.search}`,
            $options: "i",
          },
        },
        {
          "suitability.recommended_use": {
            $regex: `${req.query.search}`,
            $options: "i",
          },
        },
        {
          "suitability.date_posted": {
            $regex: `${req.query.search}`,
            $options: "i",
          },
        },

        {
          "ingredients.oil_ingredient": {
            $regex: `${req.query.search}`,
            $options: "i",
          },
        },
        {
          "ingredients.base_ingredient": {
            $regex: `${req.query.search}`,
            $options: "i",
          },
        },
        {
          "ingredients.milk_ingredient": {
            $regex: `${req.query.search}`,
            $options: "i",
          },
        },
      ];
    }

    let results = await db.collection(SOAP).find(criteria, {
      projection: {
        name: 1,
        email: 1,
        contact_no: 1,
        soap_label: 1,
        image_url: 1,
        color: 1,
        country_origin: 1,
        cost: 1,
        skin_type: 1,
        ingredients: 1,
        suitability: 1,
        comments: 1,
      },
    });
    res.status(200);
    res.send(await results.toArray());
  });

  // get document by field id route
  app.get("/soap_listings/:id", async function (req, res) {
    let results = await db.collection(SOAP).findOne(
      {
        _id: ObjectId(req.params.id),
      },

      {
        projection: {
          name: 1,
          email: 1,
          contact_no: 1,
          soap_label: 1,
          image_url: 1,
          color: 1,
          country_origin: 1,
          cost: 1,
          skin_type: 1,
          ingredients: 1,
          suitability: 1,
          comments: 1,
        },
      }
    );

    res.status(200);
    res.send(results);
  });

  //update put
  app.put("/soap_listings/:id", async function (req, res) {
    try {
      let skinType = [];
      if (Array.isArray(req.body.skin_type)) {
        skinType = req.body.skin_type;
      } else if (req.body.skin_type) {
        skinType = [req.body.skin_type];
      }

      let name = req.body.name;
      let email = req.body.email;
      let contact_no = req.body.contact_no;
      let soap_label = req.body.soap_label;
      let image_url = req.body.image_url;
      let color = req.body.color;
      let country_origin = req.body.country_origin;
      let cost = req.body.cost;
      let skin_type = skinType;

      let oil_ingredient = req.body.ingredients.oil_ingredient;
      let base_ingredient = req.body.ingredients.base_ingredient;
      let milk_ingredient = req.body.ingredients.milk_ingredient;
      let ingredients = { oil_ingredient, base_ingredient, milk_ingredient };

      let treat = req.body.suitability.treat;
      let recommended_use = req.body.suitability.recommended_use;
      let date_posted = req.body.suitability.date_posted;
      let suitability = { treat, recommended_use, date_posted };

      let msgError = {};
 

      // validator
      validator.validateNotEmptyString(name, "name", msgError);
      validator.validateEmail(email, msgError);
      validator.validateNotEmptyString(contact_no, "contact_no", msgError);
      validator.validateNotEmptyString(soap_label, "soap_label", msgError);
      validator.validateNotEmptyString(image_url, "image_url", msgError);
      validator.validateNotEmptyString(color, "color", msgError);
      validator.validateNotEmptyString(country_origin, "country_origin", msgError);
      validator.validateNotEmptyString(recommended_use, "recommended_use", msgError);
      validator.validateNotEmptyList(skin_type, "skin_type", msgError);
      validator.validateNotEmptyList(oil_ingredient, "oil_ingredient", msgError);
      validator.validateNotEmptyList(base_ingredient, "base_ingredient", msgError);
      validator.validateNotEmptyList(milk_ingredient, "milk_ingredient", msgError);
      validator.validateNotEmptyList(treat, "treat", msgError);
      validator.validateNotNumber(date_posted, "date_posted", msgError);
      validator.validateNotNumber(cost, "cost", msgError);



      if (msgError && Object.keys(msgError).length > 0) {
        res.status(406).json({ Errors: msgError });
      } else {
        let results = await db.collection(SOAP).updateOne(
          {
            _id: ObjectId(req.params.id),
          },
          {
            $set: {
              name: name,
              email: email,
              contact_no: contact_no,
              soap_label: soap_label,
              image_url: image_url,
              color: color,
              country_origin: country_origin,
              cost: cost,
              skin_type: skin_type,
              ingredients: ingredients,
              suitability: suitability,
            },
          }
        );
        res.status(200);
        res.json(results);
      }
    } catch (e) {
      res.status(500);
      res.json("Internal Server error");
    }
  });

  // delete
  app.delete("/soap_listings/:id", async function (req, res) {
    let results = await db.collection(SOAP).deleteOne({
      _id: ObjectId(req.params.id),
    });

    res.status(200);
    res.json({ status: "ok" });
  });
}

main();

app.listen( process.env.PORT, function () {
  console.log("Server has started");
});
