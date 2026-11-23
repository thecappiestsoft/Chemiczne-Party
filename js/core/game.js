/* =========================== GRA =========================== */
function startGame(){
  S={cfg:{...cfg,cats:[...cfg.cats],mgs:[...cfg.mgs]},players:cfg.players.map((p,i)=>({...p,i,color:COLORS[i].c,ink:COLORS[i].k,atoms:10,flasks:0,pos:0,ok:0,tot:0})),
    cur:0,round:1,flask:0,used:new Set(),wrong:[],mgQueue:[],log:[],busy:false,key:null};
  S.flask=randomFlaskTile(0);
  $('#roundPill').hidden=false; $('#newGameWrap').hidden=false;
  $('#main').innerHTML=`<section class="game"><div class="board" id="board"></div><aside class="side" id="side"></aside></section>`;
  buildBoard(); renderSide(); renderAll();
  const fl=S.flask+1; addLog(()=>t('logStart',fl));
}
function renderSide(){
  $('#side').innerHTML=`
      <div class="card"><h3>${t('scores')}</h3><ul class="scores" id="scores"></ul></div>
      <div class="card turn">
        <div class="turn-head"><span id="turnTok"></span><div><div class="note" style="margin:0">${t('nowRolls')}</div><b id="turnName"></b></div></div>
        <div class="dice-row"><div class="die" id="die" aria-live="polite">?</div><button class="btn primary big" id="rollBtn" type="button">${t('roll')} <span class="kbd">${t('space')}</span></button></div>
      </div>
      <div class="card"><h3>${t('tiles')}</h3><div class="mini-legend">
        <span><i class="sw" style="background:var(--t-plus)"></i>${t('lgPlus')}</span><span><i class="sw" style="background:var(--t-minus)"></i>${t('lgMinus')}</span>
        <span><i class="sw" style="background:var(--t-quiz)"></i>${t('lgQuiz')}</span><span><i class="sw" style="background:var(--t-event)"></i>${t('lgEvent')}</span>
        <span><i class="sw" style="background:var(--gold)"></i>${t('lgFlask')}</span><span><i class="sw" style="background:var(--ink)"></i>${t('lgStart')}</span>
      </div></div>`;
  $('#rollBtn').onclick=doTurn;
}
function randomFlaskTile(from){const opts=[];for(let i=1;i<N;i++){const d=(i-from+N)%N;if(d>=5&&TILE_TYPES[i]!=='start')opts.push(i)}return pick(opts)}
function tileHTML(tp,i){const [sym,nm]=TILE_INFO[tp];return `<div class="tile" data-t="${tp}" ${i!=null?`id="t${i}"`:''}><span class="no">${i!=null?i+1:''}</span><span class="sym">${sym}</span><span class="nm">${tr(nm)}</span>${i!=null?'<div class="toks"></div>':''}</div>`}
function coordOf(i){if(i<9)return[1,i+1];if(i<14)return[i-7,9];if(i<22)return[6,9-(i-13)];return[6-(i-21),1]}
function buildBoard(){
  const b=$('#board');b.innerHTML=TILE_TYPES.map((tp,i)=>tileHTML(tp,i)).join('')+`<div class="center"><div class="rnd" id="cRound"></div><div class="sub" id="cSub"></div><ul class="log" id="log"></ul></div>`;
  TILE_TYPES.forEach((tp,i)=>{const [r,c]=coordOf(i);const el=$('#t'+i);el.style.gridRow=r;el.style.gridColumn=c});
}
function renderAll(){renderTokens();renderPanel()}
function renderTokens(hopIdx){
  for(let i=0;i<N;i++){const el=$('#t'+i);if(!el)continue;el.classList.toggle('flask',i===S.flask);
    const old=el.querySelector('.fico');if(old)old.remove();if(i===S.flask)el.insertAdjacentHTML('beforeend',flaskSvg('fico'));
    el.querySelector('.toks').innerHTML=S.players.filter(p=>p.pos===i).map(p=>`<span class="tok p${p.i}${p.i===hopIdx?' hop':''}" style="--pc:${p.color};--pk:${p.ink}" title="${esc(p.name)}">${p.sym}</span>`).join('')}
}
function renderPanel(){
  if(!$('#scores'))return;
  const p=S.players[S.cur];
  $('#scores').innerHTML=S.players.map(pl=>`<li class="${pl.i===S.cur?'cur':''}"><span class="tok big" style="--pc:${pl.color};--pk:${pl.ink}">${pl.sym}</span><span class="pn">${esc(pl.name)}</span><span class="fl" title="${t('flasksTitle')}">${flaskSvg()}${pl.flasks}</span><span class="at">${pl.atoms}<small> ${t('atomsUnit')}</small></span></li>`).join('');
  $('#turnTok').innerHTML=`<span class="tok big" style="--pc:${p.color};--pk:${p.ink}">${p.sym}</span>`;
  $('#turnName').textContent=p.name;
  const rd=Math.min(S.round,S.cfg.rounds);
  $('#roundPill').textContent=t('round',rd,S.cfg.rounds);
  $('#cRound').textContent=t('roundShort',rd,S.cfg.rounds);
  $('#cSub').textContent=S.round===S.cfg.rounds?t('lastRound'):t('flaskAt',S.flask+1,FLASK_COST);
  $('#rollBtn').disabled=S.busy;
  renderLog();
}
function addLog(fn){S.log.unshift(fn);S.log=S.log.slice(0,5);renderLog()}
function renderLog(){const l=$('#log');if(l&&S)l.innerHTML=S.log.map(f=>`<li>${f()}</li>`).join('')}
function nm(p){return `<b style="color:${p.color}">${esc(p.name)}</b>`}
function giveAtoms(p,n){p.atoms=Math.max(0,p.atoms+n)}
