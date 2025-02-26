const launchBrowser = (browser) => { 
  if (browser === 'Chrome')
    console.log("Browser launched is chrome");
  else {
    console.log(`You have launched ${browser} and it is not chrome`);
  }
}
const runTests = (test) => { 
  switch (test) { 
    case "smoke":
      console.log(`${test} is executed`);
      break;
      case "sanity":
        console.log(`${test} is executed`);
      break;
      case "regression":
        console.log(`${test} is executed`);
      break;
      default:
        console.log(`Default case: smoke is executed`);
        break;
  }
}

launchBrowser("Chrome")
launchBrowser("FireFox")
runTests("sanity")
runTests("Test 1")