/* dźwięk */
let AC=null, soundOn=true;
function beep(f=600,d=.08,type='square',v=.05){if(!soundOn)return;try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();
  const o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.value=f;g.gain.value=v;o.connect(g);g.connect(AC.destination);
  const tt=AC.currentTime;g.gain.exponentialRampToValueAtTime(.0001,tt+d);o.start(tt);o.stop(tt+d+.02)}catch(e){}}
const sfx={ok(){beep(660,.09,'triangle',.08);setTimeout(()=>beep(990,.12,'triangle',.08),90)},bad(){beep(180,.22,'sawtooth',.05)},
  step(){beep(420,.04,'square',.03)},buzz(){beep(880,.15,'square',.06)},win(){[523,659,784,1047].forEach((f,i)=>setTimeout(()=>beep(f,.15,'triangle',.08),i*110))},
  boom(){beep(70,.6,'sawtooth',.12)},tick(){beep(1200,.02,'square',.02)}};
