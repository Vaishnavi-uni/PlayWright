const revString = (rev) => {
  emptyString = "";
  for (let i = rev.length-1; i >= 0; i--) {
    emptyString = emptyString + rev[i];
    // console.log("i " + i)
    // console.log("rev " + rev[i])
    // console.log("emptyString" + emptyString)
  }
 return emptyString
}
console.log(revString("hello"))