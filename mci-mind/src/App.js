import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div id="arrowObj">
          >
        </div>
        <button onClick={handleClick}>Shoot</button>
      </header>
    </div>
  );
}


let t;

function handleClick() {
  alert("Clicked");
  t = new Date().getTime();
  console.log("Change Height")
  heightLoop(t);
}

function heightLoop(t) {
  let ret;
  while (ret = changeHeight(t)) {
    setTimeout(() => {
      t+=100;
      console.log(ret);
      if (ret < -0.1) {
        return;
      }
    }, 100);
  }
}

export default App;

let vi = 10;
let yi = 0;
let yf;
let xi = 0;
let xf;
let localTime;

function changeHeight(currentTime) {

  console.log("Called")
  localTime = currentTime - t;

  yf=yi+vi*localTime-0.5*9.8*Math.pow(localTime,2);
  // if (localTime > 0 && yf <= 0) {
  //   yf = 0;
  // }
 //xf = xi*vi*localTime;

  console.log(`localTime = ${localTime}`);

  if (yf < 0) {
    console.log("Exiting")
    return yf;
  }
  console.log(`yf = ${yf}`);
  //changeHeight(new Date());
  return yf;
}
