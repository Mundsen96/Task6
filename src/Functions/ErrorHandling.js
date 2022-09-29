export function ifOneError(n) {
  return !!n && Math.random() <= n;
}

export function makeErrors(arrayToError, numOfErrors) {
  let errors = [deleteCharacter, swapCharacter, addCharacter];
  if (numOfErrors === 0) {
    return arrayToError;
  } else if (numOfErrors < 1) {
    let isError = ifOneError(numOfErrors);
    return isError
      ? applyError(arrayToError, errors[randomNumber(errors.length)])
      : arrayToError;
  } else {
    let tempArray = arrayToError;
    for (let i = 1; i <= numOfErrors; i++) {
      tempArray = [
        ...applyError(tempArray, errors[randomNumber(errors.length )]),
      ];
    }
    return tempArray;
  }
}

export function randomNumber(limit) {
  return Math.floor(Math.random() * limit);
}

function randomObjectKey(object) {
  let allKeys = Object.keys(object);
  let randomObjectKey = allKeys[randomNumber(allKeys.length)];
  return randomObjectKey;
}

function deleteCharacter(string, index) {
  return index === 0
    ? string.substring(1)
    : index === string.length - 1
    ? string.substring(0, string.length - 1)
    : string.substring(0, index - 1) + string.substring(index, string.length);
}

function swapCharacter(string, index) {
  if(index === 0){
    let letters = [string.charAt(index), string.charAt(index+1)];
    let temp = string.replace(string[index], letters[1]);
    return temp.replace(temp[index+1], letters[0]);
  }
  let letters = [string.charAt(index), string.charAt(index-1)];
  let temp = string.replace(string[index], letters[1]);
  return temp.replace(temp[index - 1], letters[0]);
}

function addCharacter(string, index) {
  let allLetters = getLetters();
  let letterToAdd = allLetters[randomNumber(allLetters.length)];
  const temp = Array.from(string);
  temp.splice(index, 0, letterToAdd);
  return temp.join('');
}

function applyError(array, method) {
  return array.map((element) => {
    let objectValue = `${element[randomObjectKey(element)]}`;
    let afterErrorString = method(objectValue, randomNumber(toString(objectValue).length));
    return { ...element, [randomObjectKey(element)]: afterErrorString };
  });
}

function getLetters() {
  const alpha = Array.from(Array(26)).map((e, i) => i + 65);
  const alphabet = alpha.map((x) => String.fromCharCode(x));
  const lowerCase = alphabet.map(l => l.toLowerCase())
  return [...alphabet, ...lowerCase];
}

export function extractData(array) {
  return array.map((element) => {
    return {
      phone: element.phone,
      country: element.location.country,
      state: element.location.state,
      city: element.location.city,
      address:`${element.location.postcode} ${element.location.street.number} ${element.location.street.name}`,
      name: `${element.name.first} ${element.name.last}`,
      title: element.name.title,
    };
  });
}
