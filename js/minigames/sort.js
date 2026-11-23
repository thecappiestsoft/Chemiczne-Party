/* --- Sortownia --- */
async function mgSort(){
  const sets=SORTS.filter(s=>s.l===S.cfg.lvl),set=pick(sets),score=S.players.map(()=>0);
  for(const p of S.players)score[p.i]=await sortTurn(p,set,score);
  return {s:score};
}
function sortTurn(p,set,score){return new Promise(resolve=>{
  const bins=tr(set.bins);
  openModal(`<div class="mg-title"><h2>${tr(MINIGAMES.sort.n)}</h2><span class="mg-num">${tr(set.title)}</span></div>${turnbar(p.i,score)}
    <p class="lead" style="text-align:center">${t('nowPlays',`<span style="color:${p.color}">${esc(p.name)}</span>`,20)}</p>
    <p class="note" style="text-align:center">${t('sortHint',bins.length)}</p>
    <div class="actions" style="justify-content:center"><button class="btn primary big" id="go" type="button" autofocus>${t('ready')}</button></div>`,true);
  S.key=e=>{if(e.key==='Enter'){e.preventDefault();$('#go').click()}};
  $('#go').onclick=()=>{
    let pts=0,tm=20,done=false,items=shuffle(set.items),ii=0,cur=null,lock=false;
    $('#modal').innerHTML=`<div class="mg-title"><h2>${tr(MINIGAMES.sort.n)}</h2><span class="mg-num">${tr(set.title)}</span></div>
      <div class="scoreline"><span class="tag who" style="--pc:${p.color};--pk:${p.ink}">${esc(p.name)}</span><span class="num" id="spts">${t('pts',0)}</span></div>
      <div class="bar" id="sbar"><i></i></div><div class="sort-item" id="sitem"></div><div class="note" id="sfb" style="text-align:center;min-height:1.5em"></div>
      <div class="bins">${bins.map((b,k)=>`<button class="btn" type="button" data-b="${k}"><span class="kbd">${k+1}</span>${b}</button>`).join('')}</div>`;
    const show=()=>{if(ii>=items.length){items=shuffle(set.items);ii=0}cur=items[ii++];const el=$('#sitem');el.className='sort-item';el.innerHTML=fmt(sortText(cur))};
    const choose=k=>{if(done||lock)return;const ok=k===cur[1];pts+=ok?1:-1;$('#spts').textContent=t('pts',pts);const el=$('#sitem');el.classList.add(ok?'ok':'bad');
      if(ok)sfx.ok();else{sfx.bad();$('#sfb').innerHTML=`${fmt(sortText(cur))} → ${bins[cur[1]]}`}
      lock=true;setTimeout(()=>{lock=false;if(!done){show();if(ok)$('#sfb').textContent=''}},ok?220:650)};
    $('#modal').querySelectorAll('[data-b]').forEach(b=>b.onclick=()=>choose(+b.dataset.b));
    S.key=e=>{if(/^[1-4]$/.test(e.key)&&+e.key<=bins.length){e.preventDefault();choose(+e.key-1)}};
    show();
    const iv=setInterval(()=>{tm-=.1;$('#sbar i').style.width=Math.max(0,tm/20*100)+'%';$('#sbar').classList.toggle('warn',tm<5);
      if(tm<=0){done=true;clearInterval(iv);sfx.win();$('#sitem').className='sort-item';$('#sitem').innerHTML=t('pts',pts);
        $('#sfb').textContent=t('timeUpX');$('#modal').querySelectorAll('[data-b]').forEach(b=>b.disabled=true);
        $('#modal').insertAdjacentHTML('beforeend',`<div class="actions"><button class="btn primary big" id="next" type="button">${t('next')}</button></div>`);
        $('#next').focus();S.key=e=>{if(e.key==='Enter'){e.preventDefault();$('#next').click()}};$('#next').onclick=()=>resolve(pts)}},100);
  };
})}
