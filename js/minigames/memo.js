/* --- Memory --- */
function mgMemo(){return new Promise(resolve=>{
  const set=MEMO[S.cfg.lvl],pairs=shuffle(set.pairs).slice(0,8),ps=S.players,score=ps.map(()=>0);
  const cards=shuffle(pairs.flatMap((p,i)=>[{t:tr(p[0]),id:i},{t:tr(p[1]),id:i}]));
  let turn=Math.random()*ps.length|0,flipped=[],lock=false,matched=0;
  openModal(`<div class="mg-title"><h2>${tr(MINIGAMES.memo.n)}</h2><span class="mg-num">${tr(set.title)}</span></div>
    <div id="mturn"></div><div class="memo" id="memo">${cards.map((c,k)=>`<button class="mcard" type="button" data-k="${k}" aria-label="${t('cardAria',k+1)}"><span class="back">?</span></button>`).join('')}</div>
    <div id="mres"></div>`,true);
  const els=[...$('#memo').children];
  const upd=()=>{$('#mturn').innerHTML=turnbar(turn,score,t('pairsSuf'))};upd();
  els.forEach(el=>el.onclick=()=>{const k=+el.dataset.k,c=cards[k];if(lock||c.done||flipped.includes(k))return;
    el.classList.add('up');el.innerHTML=fmt(c.t);flipped.push(k);sfx.tick();
    if(flipped.length===2){lock=true;const [a,b]=flipped;
      if(cards[a].id===cards[b].id){const p=ps[turn];[a,b].forEach(x=>{cards[x].done=true;els[x].classList.add('done');els[x].style.setProperty('--pc',p.color)});
        score[turn]++;matched++;sfx.ok();flipped=[];lock=false;upd();
        if(matched===pairs.length){$('#mres').innerHTML=`<div class="actions"><button class="btn primary big" id="next" type="button">${t('toResults')}</button></div>`;$('#next').focus();$('#next').onclick=()=>resolve({s:score,label:i=>t('pairsN',score[i])})}}
      else{setTimeout(()=>{[a,b].forEach(x=>{els[x].classList.remove('up');els[x].innerHTML='<span class="back">?</span>'});flipped=[];lock=false;turn=(turn+1)%ps.length;upd()},1200)}}});
  S.key=e=>{if(e.key==='Enter'&&$('#next')){e.preventDefault();$('#next').click()}};
})}
