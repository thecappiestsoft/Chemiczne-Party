/* =========================== USTAWIENIA =========================== */
let cfg={players:[{name:t('playerN',1),sym:'Na'},{name:t('playerN',2),sym:'Fe'},{name:t('playerN',3),sym:'Au'}],lvl:'sp',cats:Object.keys(CATS),mgs:Object.keys(MINIGAMES),rounds:8};
let S=null;

function countFor(lvl,cat){return QUIZ.filter(q=>q[0]===lvl&&q[1]===cat).length+TF.filter(q=>q[0]===lvl&&q[1]===cat).length}

function renderSetup(){
  S=null; $('#roundPill').hidden=true; $('#newGameWrap').hidden=true;
  const legend=['start','plus','minus','quiz','event'].map(tp=>tileHTML(tp,null)).join('');
  $('#main').innerHTML=`
  <section class="setup">
    <div class="hero">
      <div>
        <h2>${t('heroH')}</h2>
        <p>${t('heroP')}</p>
        <p class="note">${t('bankNote',QUIZ.length,TF.length)}</p>
      </div>
      <div class="legend" aria-label="${t('tilesAria')}">${legend}</div>
    </div>
    <div class="cfg">
      <div class="card">
        <h3>${t('players')}</h3>
        <div id="plist"></div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button class="btn" id="addP" type="button">${t('addPlayer')}</button>
        </div>
        <p class="note">${t('privacy')}</p>
      </div>
      <div class="card">
        <h3>${t('level')}</h3>
        <div class="seg" id="lvlSeg">${Object.entries(LVLS).map(([k,v])=>`<button type="button" data-l="${k}" aria-pressed="${cfg.lvl===k}"><b>${tr(v.n)}</b><small>${tr(v.d)}</small></button>`).join('')}</div>
        <h3 style="margin-top:18px">${t('length')}</h3>
        <div class="chips" id="rndChips">${[5,8,12].map(r=>`<button class="chip" type="button" data-r="${r}" aria-pressed="${cfg.rounds===r}">${t('roundsN',r)} <span class="cnt">~${Math.round(r*4.5)} min</span></button>`).join('')}</div>
      </div>
      <div class="card">
        <h3>${t('cats')}</h3>
        <div class="chips" id="catChips"></div>
      </div>
      <div class="card">
        <h3>${t('mgs')}</h3>
        <div class="chips" id="mgChips">${Object.entries(MINIGAMES).map(([k,v])=>`<button class="chip" type="button" data-m="${k}" aria-pressed="${cfg.mgs.includes(k)}">${tr(v.n)}</button>`).join('')}</div>
        <p class="note">${t('keysNote')}</p>
      </div>
    </div>
    <details class="how">
      <summary>${t('rulesTitle')}</summary>
      <ul>${t('rules',FLASK_COST).map(x=>`<li>${x}</li>`).join('')}</ul>
    </details>
    <div class="start-row"><button class="btn primary big" id="startBtn" type="button">${t('start')}</button></div>
  </section>`;
  renderPlayers(); renderCats();
  $('#addP').onclick=()=>{if(cfg.players.length<4){readNames();const used=cfg.players.map(p=>p.sym);cfg.players.push({name:t('playerN',cfg.players.length+1),sym:ELEMENTS.find(e=>!used.includes(e))});renderPlayers()}};
  $('#lvlSeg').onclick=e=>{const b=e.target.closest('button');if(!b)return;cfg.lvl=b.dataset.l;$('#lvlSeg').querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',x===b));renderCats()};
  $('#rndChips').onclick=e=>{const b=e.target.closest('button');if(!b)return;cfg.rounds=+b.dataset.r;$('#rndChips').querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',x===b))};
  $('#mgChips').onclick=e=>{const b=e.target.closest('button');if(!b)return;const k=b.dataset.m;
    if(cfg.mgs.includes(k)){if(cfg.mgs.length>1)cfg.mgs=cfg.mgs.filter(x=>x!==k)}else cfg.mgs.push(k);
    $('#mgChips').querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',cfg.mgs.includes(x.dataset.m)))};
  $('#startBtn').onclick=()=>{readNames();startGame()};
}
function renderPlayers(){
  $('#plist').innerHTML=cfg.players.map((p,i)=>`<div class="prow">
    <span class="tok big" style="--pc:${COLORS[i].c};--pk:${COLORS[i].k}">${p.sym}</span>
    <input type="text" id="pname${i}" maxlength="16" value="${esc(p.name)}" aria-label="${t('nameAria',i+1)}">
    <select id="psym${i}" aria-label="${t('tokAria',i+1)}">${ELEMENTS.map(e=>`<option ${e===p.sym?'selected':''}>${e}</option>`).join('')}</select>
    ${cfg.players.length>2?`<button class="btn ghost" type="button" data-rm="${i}" aria-label="${t('rmAria',i+1)}">✕</button>`:`<span class="keytag">${t('keyTag',BUZZ_KEYS[i].toUpperCase())}</span>`}
  </div>`).join('');
  $('#addP').disabled=cfg.players.length>=4;
  cfg.players.forEach((p,i)=>{$('#psym'+i).onchange=e=>{readNames();p.sym=e.target.value;renderPlayers()}});
  $('#plist').querySelectorAll('[data-rm]').forEach(b=>b.onclick=()=>{readNames();cfg.players.splice(+b.dataset.rm,1);renderPlayers()});
}
function readNames(){cfg.players.forEach((p,i)=>{const el=$('#pname'+i);if(el)p.name=el.value.trim()||t('playerN',i+1)})}
function renderCats(){
  $('#catChips').innerHTML=Object.entries(CATS).map(([k,v])=>`<button class="chip" type="button" data-c="${k}" aria-pressed="${cfg.cats.includes(k)}">${tr(v)} <span class="cnt">${countFor(cfg.lvl,k)}</span></button>`).join('');
  $('#catChips').onclick=e=>{const b=e.target.closest('button');if(!b)return;const k=b.dataset.c;
    if(cfg.cats.includes(k)){if(cfg.cats.length>1)cfg.cats=cfg.cats.filter(x=>x!==k)}else cfg.cats.push(k);renderCats()};
}

/* =========================== PULE PYTAŃ =========================== */
function quizPool(){let p=QUIZ.filter(q=>q[0]===S.cfg.lvl&&S.cfg.cats.includes(q[1]));if(p.length<6)p=QUIZ.filter(q=>q[0]===S.cfg.lvl);return p}
function tfPool(){let p=TF.filter(q=>q[0]===S.cfg.lvl&&S.cfg.cats.includes(q[1]));if(p.length<8)p=TF.filter(q=>q[0]===S.cfg.lvl);return p}
function takeQuestion(){const pool=quizPool();let fresh=pool.filter(q=>!S.used.has(q));if(!fresh.length){pool.forEach(q=>S.used.delete(q));fresh=pool}
  const q=pick(fresh);S.used.add(q);return q}
function recordWrong(item,kind){if(!S.wrong.some(w=>w.item===item))S.wrong.push({item,kind})}
