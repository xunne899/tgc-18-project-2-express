async function validateEmail(email, msgError) {
  //email
  if (email == undefined || email.length < 3 || typeof email !== "string") {
    if (!("email" in msgError)) {
      msgError["email"] = [];
    }
    return msgError["email"].push("*Mandatory field!");
  } else if (email == undefined || !email.includes("@")) {
    if (!("email" in msgError)) {
      msgError["email"] = [];
    }
    return msgError["email"].push({ email: email + " is invalid" });
  }
}

async function validateNotEmptyString(data, dataName, msgError) {
  //email

  if (data == undefined || data == "" || typeof data !== "string") {
    if (!(dataName in msgError)) {
      msgError[dataName] = [];
    }
    return msgError[dataName].push("*Mandatory field!");
  }
}

async function validateNotEmptyList(data, dataName, msgError) {
  //email
  if (data == undefined || data.length == 0 || typeof data !== "object") {
    if (!(dataName in msgError)) {
      msgError[dataName] = [];
    }

    return msgError[dataName].push("*Data is invalid or empty!");
  }
}

async function validateNotNumber(data, dataName, msgError) {
  //email
  if (data == undefined || dataName > 0 || typeof data !== "number") {
    if (!(dataName in msgError)) {
      msgError[dataName] = []; // if key does not exist in msgError, add the key with an empty array.
    }

    return msgError[dataName].push("*Invalid number value!");
  }
}

module.exports = {
  validateEmail,
  validateNotEmptyString,
  validateNotEmptyList,
  validateNotNumber,
};
