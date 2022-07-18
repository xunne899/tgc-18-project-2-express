# Make sure  heroku is installed
brew tap heroku/brew && brew install heroku
# Login
heroku login -i

# Add, commit, push
git add .
git commit -m "add new var"
git push heroku main  
