const numberType = (num) => { 
  if (num > 0) {
    return "Positive"
  }
  else if (num === 0) {
    return "Neutral"
  }
  else { 
    return "Negative"
  }


}
console.log(numberType(-1))
console.log(numberType(0))
console.log(numberType(1))