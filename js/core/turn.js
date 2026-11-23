/* =========================== TURA GRACZA =========================== */
async function doTurn(){
  if(!S||S.busy||!$('#overlay').hidden)return;
  S.busy=true;renderPanel();
  const p=S.players[S.cur];
  let again=true,guard=0;
  while(again&&guard<2){guard++;const n=await rollDie();addLog(()=>t('logRoll',nm(p),n));await move(p,n);again=await resolveTile(p);renderAll();if(again)await toast(t('again'),1100)}
  await endTurn();
}
async function rollDie(){const d=$('#die');d.classList.add('spin');let n=1;for(let k=0;k<9;k++){n=1+(Math.random()*6|0);d.textContent=n;sfx.tick();await sleep(60+k*8)}d.classList.remove('spin');return n}
async function move(p,n){
  for(let s=0;s<n;s++){p.pos=(p.pos+1)%N;sfx.step();renderTokens(p.i);
    if(p.pos===0){giveAtoms(p,2);addLog(()=>t('logStartPass',nm(p)));renderPanel()}
    await sleep(230);
    if(p.pos===S.flask)await offerFlask(p)}
}
async function offerFlask(p){
  if(p.atoms>=FLASK_COST){
    openModal(`<div class="big-ico"><div class="tile" data-t="event" style="--tb:var(--gold-soft);--ti:var(--gold)"><span class="no">★</span><span class="sym">${flaskSvg().replace('<svg','<svg style="width:34px"')}</span><span class="nm">${t('flaskWord')}</span></div>
      <div><span class="tag who" style="--pc:${p.color};--pk:${p.ink}">${esc(p.name)}</span><h2 style="margin-top:6px">${t('flaskH')}</h2></div></div>
      <p class="lead">${t('flaskQ',p.atoms,FLASK_COST)}</p>
      <div class="actions"><button class="btn" id="no" type="button" data-v="0">${t('notNow')}</button><button class="btn gold big" id="yes" type="button" data-v="1" autofocus>${t('buy')}</button></div>`);
    S.key=e=>{if(e.key==='Enter'){e.preventDefault();$('#yes').click()}};
    const v=await waitAny(['#yes','#no']);closeModal();
    if(v==='#yes'){p.atoms-=FLASK_COST;p.flasks++;sfx.win();S.flask=randomFlaskTile(S.flask);const fl=S.flask+1;addLog(()=>t('logFlask',nm(p),fl));renderAll();await toast(t('hasFlasks',esc(p.name),p.flasks),1300)}
  }else{await toast(t('flaskShort',FLASK_COST,FLASK_COST-p.atoms),1500)}
}
async function resolveTile(p){
  const tp=TILE_TYPES[p.pos];
  if(tp==='plus'){giveAtoms(p,3);sfx.ok();addLog(()=>t('logPlus',nm(p)));renderPanel();await toast(t('plus3'),800);return false}
  if(tp==='minus'){giveAtoms(p,-3);sfx.bad();addLog(()=>t('logMinus',nm(p)));renderPanel();await toast(t('trap'),900);return false}
  if(tp==='quiz'){const ok=await askQuestion(takeQuestion(),p,25);if(ok){giveAtoms(p,5);addLog(()=>t('logQok',nm(p)))}else addLog(()=>t('logQbad',nm(p)));renderPanel();return false}
  if(tp==='event')return await eventTile(p);
  return false;
}
async function eventTile(p){
  const ev=pick(EVENTS);let again=false,msg=()=>'';
  const others=S.players.filter(x=>x!==p);
  openModal(`<div class="big-ico">${tileHTML('event',null).replace('<span class="no"></span>','<span class="no">!</span>')}<div><span class="tag who" style="--pc:${p.color};--pk:${p.ink}">${esc(p.name)}</span><h2 style="margin-top:6px">${tr(ev.t)}</h2></div></div>
    <p class="lead">${tr(ev.d)}</p><div class="expl"><b>${t('fact')}</b>${fmt(tr(ev.f))}</div>
    <div class="actions"><button class="btn primary" id="ok" type="button" autofocus>OK</button></div>`);
  S.key=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();$('#ok').click()}};
  await waitBtn('#ok');closeModal();
  if(typeof ev.a==='number'){giveAtoms(p,ev.a);const a=ev.a;msg=()=>a?t('evAtoms',a):t('evNone')}
  else if(ev.a==='again'){again=true;msg=()=>t('evAgain')}
  else if(ev.a==='back3'){for(let s=0;s<3;s++){p.pos=(p.pos-1+N)%N;renderTokens(p.i);sfx.step();await sleep(200)}msg=()=>t('evBack')}
  else if(ev.a==='all2'){S.players.forEach(x=>giveAtoms(x,2));msg=()=>t('evAll')}
  else if(ev.a==='toFlask'){p.pos=(S.flask-1+N)%N;renderTokens(p.i);msg=()=>t('evTele')}
  else if(ev.a==='steal3'){const lead=[...others].sort((a,b)=>b.atoms-a.atoms)[0];
    if(lead&&lead.atoms>p.atoms){const n=Math.min(3,lead.atoms);lead.atoms-=n;p.atoms+=n;msg=()=>t('evSteal',n,esc(lead.name))}else msg=()=>t('evLeader')}
  addLog(()=>t('logEv',nm(p),tr(ev.t),msg()));renderAll();return again;
}
function questionHead(q){return `<div class="meta"><span class="tag">${tr(CATS[q[1]])}</span><span class="tag">${tr(LVLS[q[0]].n)}</span></div>`}
function askQuestion(q,p,secs){return new Promise(resolve=>{
  const src=qAns(q);const ans=shuffle(src.map((tx,i)=>({t:tx,ok:i===0})));
  openModal(`<div class="meta"><span class="tag who" style="--pc:${p.color};--pk:${p.ink}">${esc(p.name)}</span><span class="tag">${tr(CATS[q[1]])}</span><span class="tag">${t('for5')}</span></div>
    <p class="lead">${fmt(qText(q))}</p><div class="bar" id="qbar"><i></i></div>
    <div class="answers">${ans.map((a,k)=>`<button class="ans" type="button" data-k="${k}"><span class="kbd">${k+1}</span><span>${fmt(a.t)}</span></button>`).join('')}</div>
    <div id="qres"></div>`);
  let tm=secs,done=false;
  const iv=setInterval(()=>{if(done)return;tm-=.1;const w=Math.max(0,tm/secs*100);$('#qbar i').style.width=w+'%';$('#qbar').classList.toggle('warn',tm<6);if(tm<=0)finish(-1)},100);
  function finish(k){if(done)return;done=true;clearInterval(iv);const ok=k>=0&&ans[k].ok;p.tot++;if(ok){p.ok++;sfx.ok()}else{sfx.bad();recordWrong(q,'quiz')}
    $('#modal').querySelectorAll('.ans').forEach((b,i)=>{b.disabled=true;if(ans[i].ok)b.classList.add('ok');else if(i===k)b.classList.add('bad')});
    $('#qres').innerHTML=`<div class="expl ${ok?'ok':'bad'}"><b>${ok?t('right5'):(k<0?t('timeUp'):t('wrong'))}</b>${fmt(qExpl(q))}</div>
      <div class="actions" style="margin-top:12px"><button class="btn primary" id="next" type="button">${t('next')}</button></div>`;
    $('#next').focus();$('#next').onclick=()=>{closeModal();resolve(ok)}}
  $('#modal').querySelectorAll('.ans').forEach(b=>b.onclick=()=>finish(+b.dataset.k));
  S.key=e=>{if(!done&&/^[1-4]$/.test(e.key)&&+e.key<=ans.length)finish(+e.key-1);else if(done&&(e.key==='Enter'||e.key===' ')){e.preventDefault();$('#next')?.click()}};
})}

async function endTurn(){
  S.cur++;
  if(S.cur>=S.players.length){
    S.cur=0;renderPanel();await sleep(300);
    await runMinigame();
    S.round++;
    if(S.round>S.cfg.rounds){S.busy=false;return showFinal()}
    if(S.round===S.cfg.rounds)await toast(t('lastRound'),1300);
  }
  S.busy=false;renderAll();
}
