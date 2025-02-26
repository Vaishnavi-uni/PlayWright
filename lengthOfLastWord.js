const lengthOfLastWord = sentence => { 
  splitWords = sentence.trim().split(" ");
  console.log(`The length of the last word "${splitWords[splitWords.length -1]}" is ${splitWords[splitWords.length -1].length} `)
}
lengthOfLastWord("Hello World")
lengthOfLastWord("   fly me   to   the moon  " )
