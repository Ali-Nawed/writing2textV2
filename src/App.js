
import { useState, useRef, useEffect } from "react";
import { drawPath } from "./draw";
import * as tf from '@tensorflow/tfjs';

function App() {

  const canvasRef = useRef(null);
  const [paths, setPaths] = useState([]);
  const [hold, setHold] = useState(false);
  const [model, setModel] = useState();
  const [predictions, setPredictions] = useState();
  const [imageData, setImageData] = useState();
  const canvasWidth = 400;
  const canvasHeight = 400;
  useEffect(() => {
    const canvasObj = canvasRef.current;
    const ctx = canvasObj.getContext('2d');
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.beginPath()
    paths.forEach((path) => drawPath(ctx, path));
    setImageData((oldImageData) => ctx.getImageData(0,0,canvasWidth,canvasHeight));
  }, [paths]);

  useEffect(() => {
    tf.loadGraphModel('/model.json').then(result => setModel(result));
  }, []);

  const predict = async (imageData) => {
    await tf.tidy(()  => {
      if (imageData != null) {
        let img = tf.browser.fromPixels(imageData, 1);
        img =  tf.image.resizeBilinear(img, [28,28], true);
        img = img.reshape([1, 28, 28, 1]);
        img = tf.cast(img, 'float32');
        const output = model.predict(img);
        const predictions = Array.from(output.dataSync());
        setPredictions((oldPredictions) => predictions);
        
      }
    });
  }

  const argMax = (array) => {
    return array.map((x, i) => [x, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1];
  }
  
  const onMouseDown = (e) => {
    setHold(true);
    const currCoord = {x: e.clientX, y: e.clientY};
    const newPath = [currCoord];
    
    setPaths((oldPaths) => [...oldPaths, newPath]);
  }

  const onMouseMove = (e) => {
    if (hold === true && paths.length > 0) { 
      const currCoord = {x: e.clientX, y: e.clientY};
      paths[paths.length - 1].push(currCoord)
      setPaths((oldPaths) => [...oldPaths]);
    }
  }

  const onMouseUp = (e) => {
    if (hold === true) {
      predict(imageData);
      console.log(predictions);
    }
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
