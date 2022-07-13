


async function validate(email, msgError) {
  

//email
  if (email && email.length < 3 || typeof (email) !== "string") {
    return msgError.push({ "email": email + " is invalid" })
}
else if (email && !email.includes('@')) {
  return msgError.push({ "email": email + " is invalid" })
}


}


module.exports = {
validate
 
}