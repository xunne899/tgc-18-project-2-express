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

// collections defination
const SOAP = "soaps";

async function main() {
  const db = await MongoUtil.connect(MONGO_URI, "tgc18_soap_collection");
  console.log("Database connected");

  app.get("/", function (req, res) {
    res.send("hello world");
  });

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

  app.post("/soap_listings", async function (req, res) {
    //console.log(req.body.ingredients);

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
      // let estimateDelivery = req.body.estimate_delivery
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

      //name

      //   if (
      //     name == undefined ||
      //     (name.length < 3) ||
      //     typeof name === "number"
      //   ) {
      //     msgError.push({ name: name + " is invalid" });
      //   }
      //email
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

      //contact no
      //   if (contact_no == undefined || (contact_no.length < 3)) {
      //     msgError.push({ contact_no: contact_no + " is invalid" });
      //   }

      //soap
      //   if (
      //     soap_label == undefined ||
      //     (typeof soap_label !== "string")
      //   ) {
      //     msgError.push({ soap_label: soap_label + " is invalid" });
      //   }

      //image
      //   if (
      //     image_url == undefined ||
      //     typeof (image_url) !== "string"
      //     // !image_url.match(/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/)
      //   ) {
      //     msgError.push({ image_url: `${image_url} is an invalid url` });
      //   }

      //color
      //   if (color == undefined || (typeof color !== "string")) {
      //     msgError.push({ color: color + " is invalid" });
      //   }

      //country
      //   if (
      //     country_origin == undefined ||
      //     (typeof country_origin !== "string")
      //   ) {
      //     msgError.push({ country_origin: country_origin + " is invalid" });
      //   }

      //skin
      //   if (skin_type == undefined || typeof skin_type !== "object") {
      //     msgError.push({ skin_type: skin_type + " is invalid" });
      //   }

      //   //oil
      //   if (oil_ingredient == undefined || typeof oil_ingredient !== "object") {
      //     msgError.push({ oil_ingredient: oil_ingredient + " is invalid" });
      //   }
      //   //base
      //   if (base_ingredient == undefined || typeof base_ingredient !== "object") {
      //     msgError.push({ base_ingredient: base_ingredient + " is invalid" });
      //   }
      //   //milk
      //   if (milk_ingredient == undefined || typeof milk_ingredient !== "object") {
      //     msgError.push({ milk_ingredient: milk_ingredient + " is invalid" });
      //   }
      //   //treat
      //   if (treat == undefined || typeof treat !== "object") {
      //     msgError.push({ treat: treat + " is invalid" });
      //   }
      //recommend
      //   if (
      //     recommended_use == undefined ||
      //     (typeof recommended_use !== "string")
      //   ) {
      //     msgError.push({ recommended_use: recommended_use + " is invalid" });
      //   }
      //date
      //   if (
      //     date_posted == undefined ||
      //     (typeof date_posted !== "number")
      //   ) {
      //     msgError.push({ date_posted: date_posted + " is invalid" });
      //   }
      //console.log(msgError);
      //msgError["recommended_use"].push("*Need to have at least 50 characters for usage description.");
      //undefined.push <- crash
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
          // "estimate_delivery": estimateDelivery,
          skin_type: skin_type,
          ingredients: ingredients,
          suitability: suitability,
        });

        res.status(201);
        res.json(result);
        // db insert
        // success
      }
    } catch (e) {
      console.log(e);
      res.status(500);
      res.json("Internal Server error");
    }
  });

  app.get("/soap_listings", async function (req, res) {
    let criteria = {};

    //    //id
    //    if (req.query._id) {
    //     criteria['_id'] = {
    //         '$regex': ObjectId(req.query._id), '$options': 'i'
    //     }
    // }

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
      //     , {
      //     'projection': {
      //         'contact_no': 1
      //     }
      // }
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

    // cost
    // min cost
    // max cost

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
      // criteria["$and"] = req.query.skin_type.map((type) => {
      //   return { skin_type: { $in: [type] } };
      // });
      criteria['skin_type'] = {
          '$all': req.query.skin_type
      }
    }

    //ingredients
    // console.log(req.query.oil_ingredient)
    // console.log(req.query.stuff)
    //   console.log(req.query.ingredients.oil_ingredient)
    if (req.query.oil_ingredient) {
      // criteria["$and"] = req.query.oil_ingredient.map((type) => {
      //   return { "ingredients.oil_ingredient": { $in: [type] } };
      // });
      criteria['ingredients.oil_ingredient'] = {
          '$all': [req.query.oil_ingredient]
      }
    }
    if (req.query.base_ingredient) {
      // criteria["$and"] = req.query.base_ingredient.map((type) => {
      //   return { "ingredients.base_ingredient": { $in: [type] } };
      // });
      criteria['ingredients.base_ingredient'] = {
          '$all': [req.query.base_ingredient]
      }
    }

    if (req.query.milk_ingredient) {
      // criteria["$and"] = req.query.milk_ingredient.map((type) => {
      //   return { "ingredients.milk_ingredient": { $in: [type] } };
      // });
      criteria['ingredients.milk_ingredient'] = {
          '$all': [req.query.milk_ingredient]
      }
    }

    // suitability
    if (req.query.treat) {
      criteria["suitability.treat"] = {
        '$all': [req.query.treat],
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
        // "estimate_delivery": 1,
        skin_type: 1,
        ingredients: 1,
        suitability: 1,
        comments: 1,
      },
    });
    res.status(200);
    //toArray is async
    res.send(await results.toArray());
  });

  // get doc field id
  app.get("/soap_listings/:id", async function (req, res) {
    let results = await db.collection(SOAP).findOne(
      {
        _id: ObjectId(req.params.id),
      },

      {
        projection: {
          // '_id': ObjectId(req.params.id),
          name: 1,
          email: 1,
          contact_no: 1,
          soap_label: 1,
          image_url: 1,
          color: 1,
          country_origin: 1,
          cost: 1,
          // "estimate_delivery": 1,
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

  //update
  // patch vs put
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
      // let estimateDelivery = req.body.estimate_delivery
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
              // "estimate_delivery": estimateDelivery,
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
