import './App.css';
import { useEffect, useRef } from 'react';
import { PAGInit } from 'libpag';

let PAG,
  pagView,
  url = './like.pag';
// url = './page-00-00_bmp.pag';

function App() {
  const doChange = useRef(false);

  const handleChange = () => (doChange.current = true);
  const handleRepeat = () => {
    if (doChange.current) {
      // if (url === './page-00-00_bmp.pag') {
      //   url = './page-01-01_bmp.pag';
      // } else {
      //   url = './page-00-00_bmp.pag';
      // }
      if (url === './like.pag') {
        url = './snowman.pag';
      } else {
        url = './like.pag';
      }
      fetch(url)
        .then((response) => response.arrayBuffer())
        .then(async (buffer) => {
          const pagFile = await PAG.PAGFile.load(buffer);
          pagView.setComposition(pagFile);
          doChange.current = false;
        });
    }
  };

  useEffect(() => {
    PAGInit().then((p) => {
      PAG = p;
      fetch(url)
        .then((response) => response.arrayBuffer())
        .then(async (buffer) => {
          const pagFile = await PAG.PAGFile.load(buffer);
          const canvas = document.getElementById('pag');
          canvas.width = pagFile.width();
          canvas.height = pagFile.height();
          pagView = await PAG.PAGView.init(pagFile, canvas);
          pagView.addListener('onAnimationRepeat', handleRepeat);
          pagView.setRepeatCount(0);
          await pagView.play();
        });
    });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <canvas id="pag"></canvas>
      </header>
      <div>
        <button onClick={handleChange} style={{ position: 'absolute', top: 20, left: 20 }}>
          Change
        </button>
      </div>
    </div>
  );
}

export default App;
