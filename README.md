# tgc-18-project-2-express

- Please refer to main webpage over [here](https://github.com/xunne899/tgc-18-project-2-react) for more details.
- Refer [here](https://github.com/xunne899/tgc-18-project-2-express/blob/main/README.md) for more backend database details

# Summary

- Mongodb and express nodejs was used for this backend project
- API endpoint CRUD was created

### Collection

- tgc18_soap_collection.soaps

### Sample fields in database

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

<!-- # Make sure  heroku is installed
brew tap heroku/brew && brew install heroku
# Login
heroku login -i

# Add, commit, push
git add .
git commit -m "add new var"
git push heroku main   -->
