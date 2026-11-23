/* --- Bilansownia --- */
async function mgEq(){
  const pool=EQS.filter(e=>e.l===S.cfg.lvl),score=S.players.map(()=>0),secs={sp:50,lo:60,tech:80}[S.cfg.lvl];
  for(const p of S.players)score[p.i]=await eqTurn(p,pool,secs,score);
  return {s:score,label:i=>t('eqShort',score[i])};
}
function eqTurn(p,pool,secs,score){return new Promise(resolve=>{
  openModal(`<div class="mg-title"><h2>${tr(MINIGAMES.eq.n)}</h2><span class="mg-num">${t('eqSub')}</span></div>${turnbar(p.i,score,t('eqSuf'))}
    <p class="lead" style="text-align:center">${t('nowPlays',`<span style="color:${p.color}">${esc(p.name)}</span>`,secs)}</p>
    <p class="note" style="text-align:center">${t('eqHint')}</p>
    <div class="actions" style="justify-content:center"><button class="btn primary big" id="go" type="button" autofocus>${t('ready')}</button></div>`,true);
  S.key=e=>{if(e.key==='Enter'){e.preventDefault();$('#go').click()}};
  $('#go').onclick=()=>{
    let pts=0,tm=secs,done=false,list=shuffle(pool),li=0,eq=null;
    $('#modal').innerHTML=`<div class="mg-title"><h2>${tr(MINIGAMES.eq.n)}</h2></div>
      <div class="scoreline"><span class="tag who" style="--pc:${p.color};--pk:${p.ink}">${esc(p.name)}</span><span class="num" id="epts">${t('eqN',0)}</span></div>
      <div class="bar" id="ebar"><i></i></div><div class="eq" id="eq"></div><div class="atoms" id="eat"></div>
      <div class="actions"><button class="btn" type="button" id="skip">${t('skip')}</button><button class="btn primary big" type="button" id="chk">${t('check')}</button></div>`;
    const spc=(f,i)=>`<span class="spc"><span class="coef"><button type="button" data-i="${i}" data-d="1" aria-label="${t('inc')}">▲</button><input id="c${i}" type="number" inputmode="numeric" min="1" max="30" value="1" aria-label="${t('coef')}"><button type="button" data-i="${i}" data-d="-1" aria-label="${t('dec')}">▼</button></span><span class="f">${chem(f)}</span></span>`;
    const show=()=>{if(li>=list.length){list=shuffle(pool);li=0}eq=list[li++];
      $('#eq').innerHTML=[...eq.r.map((f,i)=>(i?'<span class="op">+</span>':'')+spc(f,i)),'<span class="op">→</span>',...eq.p.map((f,j)=>(j?'<span class="op">+</span>':'')+spc(f,eq.r.length+j))].join('');
      $('#eat').innerHTML='';$('#eq').querySelectorAll('[data-d]').forEach(b=>b.onclick=()=>{const inp=$('#c'+b.dataset.i);inp.value=Math.min(30,Math.max(1,(+inp.value||1)+ +b.dataset.d))})};
    const coefs=()=>[...eq.r,...eq.p].map((_,i)=>Math.max(1,Math.round(+$('#c'+i).value||1)));
    const check=()=>{if(done)return;const k=coefs(),cnt=balanceCounts(eq,k),bal=cnt.every(c=>c.l===c.r),g=k.reduce(gcd);
      $('#eat').innerHTML=cnt.map(c=>`<span class="${c.l===c.r?'ok':'bad'}">${c.e}: ${c.l} | ${c.r}</span>`).join('');
      if(bal&&g===1){pts++;sfx.ok();$('#epts').textContent=t('eqN',pts);setTimeout(()=>{if(!done)show()},450)}
      else{sfx.bad();const el=$('#eq');el.classList.remove('shake');void el.offsetWidth;el.classList.add('shake');
        if(bal)$('#eat').insertAdjacentHTML('beforeend',`<span class="bad">${t('reduce')}</span>`)}};
    $('#chk').onclick=check;$('#skip').onclick=()=>{if(!done)show()};
    S.key=e=>{if(e.key==='Enter'){e.preventDefault();check()}};
    show();
    const iv=setInterval(()=>{tm-=.1;$('#ebar i').style.width=Math.max(0,tm/secs*100)+'%';$('#ebar').classList.toggle('warn',tm<8);
      if(tm<=0){done=true;clearInterval(iv);sfx.win();
        $('#eat').innerHTML=`<span>${t('solution',eq.k.join(' : '))}</span>`;$('#modal').querySelectorAll('.coef button,#chk,#skip').forEach(b=>b.disabled=true);
        $('#modal').insertAdjacentHTML('beforeend',`<p class="lead" style="text-align:center">${t('timeUpX')} ${esc(p.name)}: ${t('eqN',pts)}</p><div class="actions"><button class="btn primary big" id="next" type="button">${t('next')}</button></div>`);
        $('#next').focus();S.key=e=>{if(e.key==='Enter'){e.preventDefault();$('#next').click()}};$('#next').onclick=()=>resolve(pts)}},100);
  };
})}
