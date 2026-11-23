/* --- Reakcja łańcuchowa (bomba) --- */
function mgBomb(){return new Promise(resolve=>{
  const ps=S.players,n=ps.length,score=Array(n).fill(0);
  let holder=Math.random()*n|0,elapsed=0,done=false,lock=false;
  const fuse=28+Math.random()*22;let pool=shuffle(tfPool()),qi=0,cur=null;
  openModal(`<div class="mg-title"><h2>${tr(MINIGAMES.bomb.n)}</h2><span class="mg-num">${t('tfSub')}</span></div>
    <div class="bomb-stage">
      <div class="bomb" id="bomb"><svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="46" cy="58" r="34" fill="var(--ink)"/><rect x="56" y="18" width="16" height="14" rx="3" transform="rotate(35 64 25)" fill="var(--muted)"/>
        <path d="M70 22 Q80 8 84 18" stroke="var(--t-event-ink)" stroke-width="3" fill="none"/><circle class="spark" cx="84" cy="18" r="6" fill="var(--gold)"/><circle cx="34" cy="46" r="7" fill="var(--surface)" opacity=".25"/></svg></div>
      <div style="display:flex;flex-direction:column;gap:10px;min-width:0"><div class="holder" id="holder"></div><p class="lead" id="stmt"></p></div>
    </div>
    <div class="tf"><button class="btn yes" type="button" id="bT">${t('true')} <span class="kbd">←</span></button><button class="btn no" type="button" id="bF">${t('false')} <span class="kbd">→</span></button></div>
    <div id="bres" style="min-height:52px"></div>
    <div id="bscore">${turnbar(holder,score,' ✓')}</div>`,true);
  function nextStmt(){if(qi>=pool.length){pool=shuffle(pool);qi=0}cur=pool[qi++];const p=ps[holder];
    $('#holder').innerHTML=`<span class="tok big" style="--pc:${p.color};--pk:${p.ink}">${p.sym}</span>${t('holds',esc(p.name))}`;
    $('#stmt').innerHTML=fmt(qText(cur));$('#bscore').innerHTML=turnbar(holder,score,' ✓')}
  function answer(v){if(done||lock)return;const p=ps[holder],ok=(v===!!cur[3]);p.tot++;
    if(ok){p.ok++;score[holder]++;sfx.ok();$('#bres').innerHTML=`<div class="expl ok"><b>${t('bombOk')}</b>${fmt(qExpl(cur))}</div>`;holder=(holder+1)%n;nextStmt()}
    else{sfx.bad();recordWrong(cur,'tf');lock=true;$('#bres').innerHTML=`<div class="expl bad"><b>${t('bombBad',cur[3])}</b>${fmt(qExpl(cur))}</div>`;
      setTimeout(()=>{lock=false;if(!done)nextStmt()},1300)}}
  const iv=setInterval(()=>{if(done)return;elapsed+=.1;const r=elapsed/fuse;
    $('#bomb').style.setProperty('--spd',Math.max(.08,.6-r*.55)+'s');if(Math.random()<r*.25)sfx.tick();if(elapsed>=fuse)explode()},100);
  function explode(){done=true;clearInterval(iv);sfx.boom();const p=ps[holder];
    const order=score.map((s,i)=>i===holder?-1:s);
    $('#modal').innerHTML=`<div class="boom">${t('boom')}</div><p class="lead" style="text-align:center">${t('boomAt',esc(p.name))}</p>
      <p class="note" style="text-align:center">${t('boomNote')}</p>
      ${turnbar(-1,score,' ✓')}<div class="actions"><button class="btn primary big" id="next" type="button">${t('toResults')}</button></div>`;
    $('#next').focus();S.key=e=>{if(e.key==='Enter'){e.preventDefault();$('#next').click()}};
    $('#next').onclick=()=>resolve({s:order,label:i=>i===holder?t('exploded'):t('goodN',score[i])})}
  $('#bT').onclick=()=>answer(true);$('#bF').onclick=()=>answer(false);
  S.key=e=>{const k=e.key.toLowerCase();if(e.key==='ArrowLeft'||k==='t'||k==='p'){e.preventDefault();answer(true)}if(e.key==='ArrowRight'||k==='f'){e.preventDefault();answer(false)}};
  nextStmt();
})}
