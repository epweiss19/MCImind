import './App.css';
import hoop from "./Assets/bBallHoop.webp";
import ball from "./Assets/bBall.webp";
import background from "./Assets/BBallCourt.jpg";

function App() {
  return (
    <div>
      <div style={{ height: "100vh",
                    width: "100vw",
                    position:'absolute',
                    backgroundImage: `url(${background})`,
                    filter: 'grayscale(60%)',
                    backgroundSize: "contain",
                    zIndex: '-1',
                    backgroundRepeat: "no-repeat",}}>
      </div>
      <header className="App-header">
        <img src={ball} id="arrowObj"/>
        <img id="target" src={hoop}/>
        <button onClick={handleClick} onMouseOver={drawTrajectory} onMouseLeave={hideTrajectory}>Shoot</button>
        <button onClick={getVelocityHTTP}>Make HTTP Request</button>
      </header>
    </div>
  );
}

//document.getElementById('arrowObj').style="position:absolute; top:" + 300 + "px; left: " + 400 + "px;";

let g_in_flight = false;
let shooting = false;

function handleClick() {

  shooting = true;

  // THESE CHANGE RESOLUTION AND ANIMATION SPEED
  const time_step   = 40;   // Decrease for smoother animation
  const time_scale  = 300;  // Decrease for faster animation

  // Get the time the click occurred
  const start_time = Date.now();

  // Continuously update the height
  if (!g_in_flight) {
    g_in_flight = true;
    heightLoop(start_time, time_step, time_scale);
    
  }
}

let vi = 40;
let yi = -300;

function heightLoop(start_time, time_step, time_scale) {

  // Set Intial Conditions : Declare final positions

  let new_y;
  let new_x;
  let current_vx = vi;
  let current_vy = vi;
  let angle = 0;

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
    
    if(arrowObjPos.top >= targetPos.top && 
      arrowObjPos.right <= targetPos.right &&
      arrowObjPos.bottom <= targetPos.bottom && 
      arrowObjPos.left >= targetPos.left) {
        let overlap = true;
        //console.log(overlap);
        shooting = false;
        return overlap;
    }
    else if(((arrowObjPos.top <= targetPos.top && arrowObjPos.bottom >= targetPos.top) || 
    (arrowObjPos.bottom >= targetPos.bottom && arrowObjPos.top <= targetPos.bottom)) &&
    ((arrowObjPos.left <= targetPos.left && arrowObjPos.right >= targetPos.left) || 
    (arrowObjPos.right >= targetPos.right && arrowObjPos.left <= targetPos.right)))  {
      let overlap = true;
      //console.log(overlap);
      shooting = false;
      return overlap;
    }
    else {
      let overlap = false;
      //console.log(overlap);
      return overlap;
    }
  }

  function getNewVY(start_time) {
    // Time Scale used to slow down the simulation
    let localTime = (Date.now() - start_time) / time_scale;

    // Update final positions
    let new_vy = vi - 9.8 * localTime;
    return new_vy;
  }

  // SetInterval used as constant time delayed loop
  let timerID = setInterval(() => {

    // Calculate New Height
    new_y = getNewHeight(start_time);

    new_x = getNewDistance(start_time);
    current_vx = vi;
    current_vy = getNewVY(start_time);
    angle = -Math.atan(current_vy / current_vx) * 180 / Math.PI;

    checkIfOverlapping();

    // Exit Handling
    if (new_y < -300) {
      clearInterval(timerID);
      new_y = -300;
      g_in_flight = false;
    }
    //console.log(new_y);
    //console.log(`${angle}, ${current_vy}`);


    // Update Position of Arrow
    const the_arrow = document.getElementById('arrowObj');
    the_arrow.style="position:absolute; top:" + -new_y + "px; left: " + new_x + "px;"
    // Rotate element by 90 degrees clockwise
    the_arrow.style.transform = "rotate(" + angle + "deg)";

  }, time_step);
}

let drawn = false;

function drawTrajectory() {

  if (drawn) {
    return;
  }
  drawn = true;

  let final_time_in_msec = 2 * vi / 9.81;
  let tmp_x;
  let tmp_y;

  for (let time = 0; time < final_time_in_msec; time+=0.5) {
    tmp_x = getNewDistance(time) + 5;
    tmp_y = getNewHeight(time) + 25;
    let elemDiv = document.createElement('div');
    elemDiv.innerText = ".";
    elemDiv.setAttribute("class", "trajectory");
    elemDiv.style.cssText = "position:absolute; top:" + -tmp_y + "px; left: " + tmp_x + "px; font-size: 70px;";
    document.body.appendChild(elemDiv);
  }

  function getNewHeight(htime) {

    // Time Scale used to slow down the simulation
    let localTime = (htime);

    // Update final positions
    let new_y = yi + vi * localTime - 0.5 * 9.8 * Math.pow(localTime, 2);
    return new_y;
  }

  function getNewDistance(htime) {

    // Time Scale used to slow down the simulation
    let localTime = (htime);

    // Update final positions
    let new_x = 370 + localTime * vi;
    return new_x;
  }
  
}

function hideTrajectory() {
  let trajDots = document.getElementsByClassName("trajectory");
  let i = 0;
  while(trajDots[i] != null) {
    trajDots[i].remove(); //second console output
  }
  drawn = false;
}

 var socket = new WebSocket('ws://3.144.233.109:8081');

 function getVelocityHTTP() {
    let timer = setInterval(function () {
      if(!shooting) {
        //console.log("http function start");
        //this.socket = new WebSocket('ws://localhost:3000');

        //wait for socket connection to be established
        //socket.onopen = () => {
          socket.send("[gE]");
          //console.log("Connection msg sent");
        //};

        socket.onmessage = (event) => {
          //console.log(event.data);
          let messageBack = event.data.split(':');
          messageBack = messageBack[1];
          messageBack = JSON.parse(messageBack);
          console.log(messageBack[0]);
          if(messageBack[0] >= 150) {
            console.log("shooting");
            handleClick();
          }
          //vi = messageBack[0];
          //console.log(vi)
          //vi = vi/80 * 40;
          //hideTrajectory();
          //drawTrajectory();
        };
      }
  }, 100);

 }

export default App;