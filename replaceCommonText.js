function replaceCommonText(text) {
  const freqWords = [];
  //converting the text to uppercase because there was a weird problem with an "at" function when running and to help when matching against the file 
  const upper = text.toUpperCase();

  //cleaning the text, making sure there isn't any weird characters using regex 
  cleanText = upper.replace(/<[^>]*>?/g, "");
  cleanTextTwo = cleanText.replace(/[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g, "");
  cleanTextThree = cleanTextTwo.replace(/[1234567890]/g, "");
  console.log(
    "Any punctuation, HTML tags, or numbers have been removed because those are not allowed"
  );

  //splitting the newly cleaned text by space to create seperate words 
  const words = cleanTextThree.split(" ");
  //retrieving data from the top1k file 
  async function getWords() {
    try {
      const response = await fetch(
        "https://gist.githubusercontent.com/Thessiah/fb969b429b4d6173916628c7d92bf6e4/raw/fb30bf33cbade43fd667c45437d4937b53ce868a/top1k.json",
        {
          method: "GET",
        }
      );
      //check to see if there is a response
      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }
      const data = await response.json();
      //map to each element in data and make it uppercase
      //uppercase to avoid 'at' function issue
      const upperData = data.map((element) => {
        return element.toUpperCase();
      });

      //check each element in the data againt each element in the input
      for (let i = words.length - 1; i >= 0; i--) { //words inputted
        for (let j = 0; j < upperData.length; j++) { //file
          if (words[i] === upperData[j]) {
            let word = words.splice(i, 1);

            console.log(word + " " + "is too common, do not use this word!");
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
  getWords();
  //edge cases
  for (let i = words.length - 1; i >= 0; i--) {
    //checking different cases against each word
    if (words[i].length <= 1) {
      let word = words.splice(i, 1);
      console.log(
        word +
          " " +
          "has been removed because words cannot contain spaces or be a single character"
      );
    }
    //getting frequency of each element in words
    words.forEach((element) => {
      freqWords[element] = (freqWords[element] || 0) + 1;
    });
    //we want the count of the element not the element itself, so push the count into the array not key 
    let replace = [];
    for (let key in freqWords) {
      let count = freqWords[key];
      replace.push(count);
    }
    return replace.slice(0, 25);
  }
}
