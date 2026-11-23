/* =========================== FINAŁ =========================== */
function showFinal(){
  const ord=[...S.players].sort((a,b)=>b.flasks-a.flasks||b.atoms-a.atoms);
  const podiumOrder=ord.length>=3?[ord[1],ord[0],ord[2]]:ord.length===2?[ord[1],ord[0]]:ord;
  const h={0:110,1:80,2:60};
  sfx.win();
  const pod=podiumOrder.map(p=>{const r=ord.indexOf(p);return `<div><span class="tok big" style="--pc:${p.color};--pk:${p.ink};width:44px;font-size:16px">${p.sym}</span><span class="nm">${esc(p.name)}</span>
    <span class="st">${t('podSt',p.flasks,p.atoms)}</span><div class="step" style="height:${h[r]}px;${r===0?'background:var(--gold-soft);border-color:var(--gold);color:var(--gold)':''}">${r+1}</div></div>`}).join('');
  const stats=ord.map(p=>`<li><span class="pl">${ord.indexOf(p)+1}</span><span class="tok big" style="--pc:${p.color};--pk:${p.ink}">${p.sym}</span><span class="nm">${esc(p.name)}</span><span class="sc">${t('okOf',p.ok,p.tot)}</span><span class="rw" style="color:var(--muted)">${p.tot?Math.round(p.ok/p.tot*100):0}%</span></li>`).join('');
  const rev=S.wrong.slice(0,8).map(w=>{const a=w.kind==='tf'?(w.item[3]?t('true'):t('false')):qAns(w.item)[0];return `<div>${fmt(qText(w.item))}<br><b>${fmt(a)}</b> — ${fmt(qExpl(w.item))}</div>`}).join('');
  openModal(`<h2>${t('winner',esc(ord[0].name))}</h2>
    <div class="podium">${pod}</div>
    <h3 class="mg-num" style="margin:8px 0 0">${t('accuracy')}</h3><ol class="rank">${stats}</ol>
    ${rev?`<h3 class="mg-num" style="margin:8px 0 0">${t('review')}</h3><p class="note" style="margin:0">${t('reviewNote')}</p><div class="review">${rev}</div>`:`<div class="expl ok"><b>${t('noMist')}</b>${t('noMistD')}</div>`}
    <div class="actions"><button class="btn" id="setup" type="button">${t('changeSet')}</button><button class="btn primary big" id="again" type="button" autofocus>${t('playAgain')}</button></div>`,true);
  S.final=true;
  $('#again').onclick=()=>{closeModal();startGame()};
  $('#setup').onclick=()=>{closeModal();renderSetup()};
}
