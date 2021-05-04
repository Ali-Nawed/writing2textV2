
import { useState, useRef, useEffect } from "react";
import { draw, drawPath } from "./draw";

function App() {

  const canvasRef = useRef(null);
  const [paths, setPaths] = useState([]);
  const [hold, setHold] = useState(false);

  useEffect(() => {
    const canvasObj = canvasRef.current;
    const ctx = canvasObj.getContext('2d');
    ctx.clearRect(0, 0, 400, 400);
    ctx.beginPath()
    paths.forEach((path) => drawPath(ctx, path));
  }, [paths]);

  const onMouseDown = (e) => {
    setHold(true);
    const currCoord = {x: e.clientX, y: e.clientY};
    const newPath = [currCoord];
    setPaths((oldPaths) => [...oldPaths, newPath]);
  }

  const onMouseMove = (e) => {
    if (hold == true) { 
      const currCoord = {x: e.clientX, y: e.clientY};
      paths[paths.length - 1].push(currCoord)
      setPaths((oldPaths) => [...oldPaths]);
    }
  }

  const onMouseUp = (e) => {
      setHold(false);
    }

  const clearCanvas = (e) => {
    setPaths((oldPaths) => []);
  } 

  return ([
    <canvas ref={canvasRef} style={{backgroundColor: 'black'}} width={"400"} height={"400"}
    onMouseDown={onMouseDown}
    onMouseMove={onMouseMove}
    onMouseUp={onMouseUp}/>,
    <div>
    <button style={{height: '30px', width : '400px'}} onClick={clearCanvas}>
      Clear
    </button>
    </div>])
}

export default App;
