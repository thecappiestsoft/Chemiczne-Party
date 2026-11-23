/* =========================== MINI-GRY =========================== */
function nextMinigame(){if(!S.mgQueue.length)S.mgQueue=shuffle(S.cfg.mgs);return S.mgQueue.shift()}
async function runMinigame(){
  const id=nextMinigame(),mg=MINIGAMES[id];
  openModal(`<div class="big-ico"><div class="tile" data-t="quiz"><span class="no">MG</span><span class="sym">${mg.sym}</span><span class="nm">${t('miniGame')}</span></div>
    <div><div class="mg-num">${t('mgEnd',S.round)}</div><h2>${tr(mg.n)}</h2></div></div>
    <p class="lead" style="font-weight:500">${tr(mg.d)}</p>
    <p class="note">${t('rewardsLbl')}: ${S.players.map((_,i)=>t('reward',i+1,REWARDS[i])).join(' · ')}</p>
    <div class="actions"><button class="btn primary big" id="go" type="button" autofocus>${t('go')}</button></div>`,true);
  S.key=e=>{if(e.key==='Enter'){e.preventDefault();$('#go').click()}};
  await waitBtn('#go');
  const score=await ({buzz:mgBuzz,bomb:mgBomb,memo:mgMemo,sort:mgSort,eq:mgEq})[id]();
  await mgResults(mg.n,score.s,score.label);
  closeModal();renderAll();
}
function mgResults(name,score,label){return new Promise(resolve=>{
  const order=S.players.map(p=>p.i).sort((a,b)=>score[b]-score[a]);
  const place=i=>1+score.filter(s=>s>score[i]).length;
  const rows=order.map(i=>{const p=S.players[i],pl=place(i),rw=REWARDS[pl-1]??0;giveAtoms(p,rw);
    return `<li class="${pl===1?'first':''}"><span class="pl">${pl}</span><span class="tok big" style="--pc:${p.color};--pk:${p.ink}">${p.sym}</span><span class="nm">${esc(p.name)}</span><span class="sc">${label?label(i):t('pts',score[i])}</span><span class="rw">+${rw}</span></li>`}).join('');
  sfx.win();const w=S.players[order[0]];addLog(()=>t('logMg',tr(name),nm(w)));
  openModal(`<h2>${t('results',tr(name))}</h2><ol class="rank">${rows}</ol><div class="actions"><button class="btn primary big" id="ok" type="button" autofocus>${t('back')}</button></div>`,true);
  S.key=e=>{if(e.key==='Enter'){e.preventDefault();$('#ok').click()}};
  waitBtn('#ok').then(resolve);
})}
function turnbar(cur,score,suffix=''){return `<div class="turnbar">${S.players.map(p=>`<span class="${p.i===cur?'cur':''}" style="--pc:${p.color}"><span class="tok big" style="--pc:${p.color};--pk:${p.ink}">${p.sym}</span>${esc(p.name)} · <b>${score[p.i]}</b>${suffix}</span>`).join('')}</div>`}
