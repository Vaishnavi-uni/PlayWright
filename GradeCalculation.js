function gradeCalculator(score) { 

  switch (true) { 
    case (score >=90):
      console.log(`Grade for your ${score} is A`);
      break;
      case (score >=80 && score <90):
        console.log(`Grade for your ${score} is B`);
         break;
      case (score >=70 && score <80):
        console.log(`Grade for your ${score} is C`);
         break;
    default:
      console.log(`Your Score is ${score} and you fall under Defaulter`);
      break;
    
  }

}

gradeCalculator(92)
gradeCalculator(12)
gradeCalculator(80)