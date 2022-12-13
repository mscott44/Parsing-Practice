async function getTopWords() {
  const resp = await fetch(
    "https://en.wikipedia.org/w/api.php?&origin=*&action=parse&format=json&page=Programming_language"
  );
  const resp2 = await fetch(
    "https://gist.githubusercontent.com/Thessiah/fb969b429b4d6173916628c7d92bf6e4/raw/fb30bf33cbade43fd667c45437d4937b53ce868a/top1k.json"
  );
  const data = await resp.json();
  const data2 = await resp2.json();

  const texts = data.parse.text["*"];

  //getting rid of html, punctuation and numbers with regex
  cleanText = texts.replace(/<[^>]*>?/g, "");
  cleanTextTwo = cleanText.replace(/[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g, "");
  cleanTextThree = cleanTextTwo.replace(/[1234567890]/g, "");

  //made each word in the top1k file uppercase to better match against the parsed data 
  const upperData2 = data2.map((element) => {
    return element.toUpperCase();
  });

  //splitting the html text by space to get each word in a string array
  const words = cleanTextThree.split(" ");

  //making each element uppercase to avoid 'at" function error
  const upperData = words.map((element) => {
    return element.toUpperCase();
  });
  for (let i = upperData.length - 1; i >= 0; i--) {
    if (upperData[i].length <= 1) {
      console.log("Spaces and/or single characters have been removed");
      upperData.splice(i, 1);
    } else if (upperData[i] == "\n\n") {
      upperData.splice(i, 1);
    }
    for (let j = 0; j < upperData2.length; j++) {
      if (upperData[i] === upperData2[j]) {
        upperData.splice(i, 1);

        console.log("Common words have been removed");
      }
    }
  }

  const freqWords = [];

  //getting frequency of each element in upperData
  upperData.forEach((element) => {
    freqWords[element] = (freqWords[element] || 0) + 1;
  });
  //using bucket sort, creating buckets
  //index value represent the # of times an element has occured
  const storeOccurence = []; //instanstiate the bucket 
  for (let i = 0; i <= upperData.length; i++) { //for every element in upperData lets push the array in the bucket //bounded to the length of the data 
    storeOccurence.push([]); //created bucket with nested arrays bounded by length 
  }

  //populating the buckets
  //key is the element
  for (let key in freqWords) { 
    let count = freqWords[key]; //renamed to count 
    storeOccurence[count].push(key); //bucket accessing the count, pusshing the element into the bucket with right count 
  }
  let final = [];
  //starting with the largest frequency
  for (let i = storeOccurence.length - 1; i >= 0; i--) {
    if (storeOccurence[i].length === 0) { //if its an empty array (element didn't occur x amount of times, just continue)
      continue;
    } else {
      final = [...final, ...storeOccurence[i]]; //spreading results (do a spread because you'll end up getting another nested result)
    }
  }
  result = final.slice(0, 25); //slice to get top 25 words 
  return result;
}

getTopWords().then((result) => {
  // got result here
  console.log(result);
});
