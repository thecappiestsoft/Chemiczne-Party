/* --- Wyścig do przycisku --- */
async function mgBuzz(){
  const score=S.players.map(()=>0);
  const qs=[];for(let i=0;i<5;i++)qs.push(takeQuestion());
  for(let qi=0;qi<qs.length;qi++)await buzzRound(qs[qi],qi,qs.length,score);
  return {s:score};
}
function buzzRound(q,qi,n,score){return new Promise(resolve=>{
  const ps=S.players,ans=shuffle(qAns(q).map((tx,i)=>({t:tx,ok:i===0})));
  openModal(`<div class="mg-title"><h2>${tr(MINIGAMES.buzz.n)}</h2><span class="mg-num">${t('qOf',qi+1,n)}</span></div>
    ${questionHead(q)}<p class="lead">${fmt(qText(q))}</p><div class="bar" id="qbar"><i></i></div>
    <div class="answers">${ans.map((a,k)=>`<button class="ans" type="button" data-k="${k}" disabled><span class="kbd">${k+1}</span><span>${fmt(a.t)}</span></button>`).join('')}</div>
    <div class="pads">${ps.map(p=>`<button class="pad" type="button" data-p="${p.i}" style="--pc:${p.color};--pk:${p.ink}"><span>${esc(p.name)}</span><span class="kbd">${BUZZ_KEYS[p.i].toUpperCase()}</span><small>${t('pts',score[p.i])}</small></button>`).join('')}</div>
    <div id="qres"><p class="note" style="text-align:center">${t('buzzHint')}</p></div>`,true);
  let locked=new Set(),active=-1,done=false,tm=20,at=0;
  const pads=[...$('#modal').querySelectorAll('.pad')],btns=[...$('#modal').querySelectorAll('.ans')];
  const iv=setInterval(()=>{if(done)return;
    if(active>=0){at-=.1;$('#qbar i').style.width=Math.max(0,at/8*100)+'%';$('#qbar').classList.add('warn');if(at<=0)choose(-1)}
    else{tm-=.1;$('#qbar i').style.width=Math.max(0,tm/20*100)+'%';$('#qbar').classList.remove('warn');if(tm<=0)reveal(-1)}},100);
  function buzz(i){if(done||active>=0||locked.has(i)||i>=ps.length)return;active=i;at=8;sfx.buzz();
    pads.forEach((p,k)=>p.classList.toggle('active',k===i));btns.forEach(b=>{if(!b.classList.contains('bad'))b.disabled=false});
    $('#qres').innerHTML=`<p class="note" style="text-align:center">${t('buzzAnswering',esc(ps[i].name),ans.length)}</p>`}
  function choose(k){if(active<0||done)return;const p=ps[active];p.tot++;
    if(k>=0&&ans[k].ok){p.ok++;score[active]++;btns[k].classList.add('ok');return reveal(active)}
    sfx.bad();score[active]--;if(k>=0)btns[k].classList.add('bad');recordWrong(q,'quiz');
    locked.add(active);pads[active].classList.remove('active');pads[active].classList.add('locked');pads[active].querySelector('small').textContent=t('pts',score[active]);
    active=-1;btns.forEach(b=>b.disabled=true);
    if(locked.size>=ps.length)return reveal(-1);
    $('#qres').innerHTML=`<p class="note" style="text-align:center">${t('buzzMiss')}</p>`}
  function reveal(w){done=true;clearInterval(iv);if(w>=0)sfx.ok();
    btns.forEach((b,i)=>{b.disabled=true;if(ans[i].ok)b.classList.add('ok')});pads.forEach(p=>p.classList.remove('active'));
    if(w>=0)pads[w].querySelector('small').textContent=t('pts',score[w]);
    $('#qres').innerHTML=`<div class="expl ${w>=0?'ok':''}"><b>${w>=0?t('pointFor',esc(ps[w].name)):t('nobody')}</b>${fmt(qExpl(q))}</div>
      <div class="actions" style="margin-top:12px"><button class="btn primary" id="next" type="button">${qi+1<n?t('nextQ'):t('toResults')}</button></div>`;
    $('#next').focus();$('#next').onclick=()=>resolve()}
  pads.forEach(p=>p.onclick=()=>buzz(+p.dataset.p));btns.forEach(b=>b.onclick=()=>choose(+b.dataset.k));
  S.key=e=>{const k=e.key.toLowerCase(),bi=BUZZ_KEYS.indexOf(k);
    if(bi>=0){e.preventDefault();return buzz(bi)}
    if(/^[1-4]$/.test(k)&&+k<=ans.length&&!btns[+k-1].disabled)return choose(+k-1);
    if(done&&(e.key==='Enter'||e.key===' ')){e.preventDefault();$('#next')?.click()}};
})}
