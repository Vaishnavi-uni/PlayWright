const isAnagram = (word1, word2) => { 
  //Step 1: cleaning up the words- removing spaces and converting them to same case for comparison
  let s1 = word1.trim().toLowerCase()
  let s2 = word2.trim().toLowerCase()
  // console.log(s1);
  // console.log(s1.length);
  // console.log(s2);
  // console.log(s2.length);
//Step 2: Comparing the length of the strings
  if (s1.length === s2.length) {
//Step 3: Splitting the string to char, sorting them and again joining the characters and comparing
    return s1.split("").sort().join("")===s2.split("").sort().join("")
    
  }
else { 
    return false;
  }

}

console.log(isAnagram('listen', 'silent'));
console.log(isAnagram('hello', 'world'));