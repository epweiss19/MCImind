import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div id="arrowObj">
          {'>'}
        </div>
        <div id="target"></div>
        <button onClick={handleClick}>Shoot</button>
      </header>
    </div>
  );
}

function handleClick() {

  // THESE CHANGE RESOLUTION AND ANIMATION SPEED
  const time_step   = 40;   // Decrease for smoother animation
  const time_scale  = 300;  // Decrease for faster animation

  // Get the time the click occurred
  const start_time = Date.now();

  // Continuously update the height
  heightLoop(start_time, time_step, time_scale);
}

function heightLoop(start_time, time_step, time_scale) {

  // Set Intial Conditions : Declare final positions
  let yi = -300;
  let vi = 40;
  let new_y;
  let new_x;

  // Limited Scope for getNewHeight() : limits use of global variables
  function getNewHeight(start_time) {

    // Time Scale used to slow down the simulation
    let localTime = (Date.now() - start_time) / time_scale;

    // Update final positions
    let new_y = yi + vi * localTime - 0.5 * 9.8 * Math.pow(localTime, 2);
    return new_y;
  }

  function getNewDistance(start_time) {

    // Time Scale used to slow down the simulation
    let localTime = (Date.now() - start_time) / time_scale;

    // Update final positions
    let new_x = 370 + localTime * vi;
    return new_x;
  }

  function checkIfOverlapping() {
    let arrowObj = document.getElementById("arrowObj");
    var arrowObjPos = arrowObj.getBoundingClientRect();
    //console.log(arrowObjPos.top, arrowObjPos.right, arrowObjPos.bottom, arrowObjPos.left);

    let target = document.getElementById("target");
    var targetPos = target.getBoundingClientRect();
    //console.log(targetPos.top, targetPos.right, targetPos.bottom, targetPos.left);
    
    //if(arrowObjPos.top <= targetPos.top) {

    //}
  }

  // SetInterval used as constant time delayed loop
  let timerID = setInterval(() => {

    // Calculate New Height
    new_y = getNewHeight(start_time);

    new_x = getNewDistance(start_time);

    checkIfOverlapping();

    // Exit Handling
    if (new_y < -300) {
      clearInterval(timerID);
      new_y = -300;
    }
    console.log(new_y);


    // Update Position of Arrow
    document.getElementById('arrowObj').style="position:absolute; top:" + -new_y + "px; left: " + new_x + "px;";

  }, time_step);
}

export default App;