# tgc-18-project-2-express-SoapAura

### Frontend Web Interface
- Refer to github frontend react webpage over [here](https://github.com/xunne899/tgc-18-project-2-react) for more details.
### BackEnd Database
- Refer [here](https://github.com/xunne899/tgc-18-project-2-express/blob/main/README.md) for more gitub backend database details

# Summary

- Mongodb and express nodejs was used for this backend project
- API endpoint CRUD was created
- Deployed to Heroku

### Collection

- tgc18_soap_collection.soaps

### Sample fields in database

```
{
"\_id": "62cf0498a6d329619e659f23",
"name": "roy",
"email": "royong@live.com",
"contact_no": "97862728",
"soap_label": "Lavender fragrance",
"image_url": "https://cdn.pixabay.com/photo/2020/05/08/10/22/soap-5145054_960_720.jpg",
"color": "orange",
"country_origin": "italy",
"cost": 40,
"skin_type": [
"oily",
"sensitive",
"dry"
],
"ingredients": {
"oil_ingredient": [
"grapeseed oil"
],
"base_ingredient": [
"tomato powder"
],
"milk_ingredient": [
"butter milk"
]
},
"suitability": {
"treat": [
"skin_Abrasion",
"inflammation",
"irritable_skin"
],
"recommended_use": "use 4 times a week",
"date_posted": 1657734295325
}
}
```

### Get/Request

```
GET /soap_listings
```

### Results/Response

```
Results of all soap listings field will show
```

### Create a new soap collection

```
POST /soap_listings
```

### Results/Response

```
A new soap collection will be added to soap listings database
```

### Edit a soap collection by ID

```
PUT /soap_listings/:id
```

### Results/Response

```
Soap collection with particular _id is updated in soap database
```

### Delete a soap collection by ID

```
DELETE /soap_listings/:id
```

### Results/Response

```
Soap collection with particular _id is deleted from soap database
```

### Allows user to post comments on a soap collection

```
POST /soap_listings/comments/:id
```

### Results/Response

```
Comments are posted and registered in mongoDB database
```

## Testing

- POST, GET, PUT, DELETE testing was done through Advanced REST Client (ARC)<br>
  Link of ARC software can be found [here](https://install.advancedrestclient.com/install)

## Live Deployment

- Deployment for backend database was done using HEROKU<br>
  Link of live HEROKU deployment can be found [here](https://project-2-soap.herokuapp.com/)

- Deployment for frontend react interface was done using Netlify<br>
  Link of live Netlify deployment can be found [here](https://main--project2-soapaura.netlify.app/)

## Main Tehnology Used (BackEnd Database)

- MongoDB - backend database
- ExpressNodejs - programming code
