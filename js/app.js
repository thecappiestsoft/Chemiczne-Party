/* =========================== JĘZYK: PRZEŁĄCZANIE =========================== */
const DEFAULT_NAME=/^(Gracz|Player) ([1-4])$/;
function applyStatic(){
  document.documentElement.lang=L;
  document.title=t('docTitle');
  $('#gameTitle').innerHTML=t('brand');
  $('#soundBtn').textContent=t('sound',soundOn);
  applyTheme();
  const sw=$('#langSw');sw.setAttribute('aria-label',t('langAria'));
  sw.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.lang===L));
  restoreNG();
}
function setLang(l){
  if(l===L)return;
  if(!S)readNames();
  L=l;try{localStorage.setItem('chem-party-lang',l)}catch(e){}
  const rn=p=>{p.name=p.name.replace(DEFAULT_NAME,(m,a,d)=>t('playerN',d))};
  cfg.players.forEach(rn);
  applyStatic();
  if(!S){renderSetup();return}
  S.players.forEach(rn);
  if($('#board')){buildBoard();renderSide();renderAll()}
  if(S.final&&!$('#overlay').hidden)showFinal();
}

/* =========================== START =========================== */
document.addEventListener('keydown',e=>{
  if(S&&S.key&&!$('#overlay').hidden){
    const typing=e.target.tagName==='INPUT';
    if(typing&&e.key!=='Enter')return;
    S.key(e);return}
  if(S&&e.key===' '&&$('#overlay').hidden&&e.target.tagName!=='INPUT'&&e.target.tagName!=='BUTTON'){e.preventDefault();doTurn()}
});
$('#soundBtn').onclick=()=>{soundOn=!soundOn;$('#soundBtn').textContent=t('sound',soundOn);$('#soundBtn').setAttribute('aria-pressed',soundOn)};
$('#langSw').onclick=e=>{const b=e.target.closest('button[data-lang]');if(b)setLang(b.dataset.lang)};
function restoreNG(){$('#newGameWrap').innerHTML=`<button class="btn" id="newGameBtn" type="button">${t('newGame')}</button>`;bindNG()}
function bindNG(){$('#newGameBtn').onclick=()=>{const w=$('#newGameWrap');w.innerHTML=`<span class="confirm-inline"><span class="note" style="margin:0">${t('quit')}</span><button class="btn" id="ngYes" type="button">${t('yes')}</button><button class="btn" id="ngNo" type="button">${t('no')}</button></span>`;
  $('#ngYes').onclick=()=>{restoreNG();closeModal();renderSetup()};$('#ngNo').onclick=restoreNG}}
/* =========================== MOTYW JASNY / CIEMNY =========================== */
let theme=null;
try{const v=localStorage.getItem('chem-party-theme');if(v==='light'||v==='dark')theme=v}catch(e){}
const darkMq=window.matchMedia?matchMedia('(prefers-color-scheme: dark)'):null;
const SUN='<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4.5" fill="currentColor"/><path d="M12 1.5v2.5M12 20v2.5M1.5 12H4M20 12h2.5M4.6 4.6l1.8 1.8M17.6 17.6l1.8 1.8M4.6 19.4l1.8-1.8M17.6 6.4l1.8-1.8"/></svg>';
const MOON='<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20.5 14.6A8.6 8.6 0 0 1 9.4 3.5a8.6 8.6 0 1 0 11.1 11.1z"/></svg>';
function curTheme(){return theme||document.documentElement.getAttribute('data-theme')||(darkMq&&darkMq.matches?'dark':'light')}
function applyTheme(){
  if(theme)document.documentElement.setAttribute('data-theme',theme);
  const cur=curTheme(),sw=$('#themeSw');
  sw.setAttribute('aria-label',t('themeGroup'));
  sw.querySelectorAll('button').forEach(b=>{const dk=b.dataset.th==='dark';b.innerHTML=dk?MOON:SUN;const lb=t(dk?'thDark':'thLight');b.setAttribute('aria-label',lb);b.title=lb;b.setAttribute('aria-pressed',b.dataset.th===cur)});
}
$('#themeSw').onclick=e=>{const b=e.target.closest('button[data-th]');if(!b)return;theme=b.dataset.th;try{localStorage.setItem('chem-party-theme',theme)}catch(err){}applyTheme()};
if(darkMq&&darkMq.addEventListener)darkMq.addEventListener('change',()=>{if(!theme)applyTheme()});
cfg.players.forEach(p=>{p.name=p.name.replace(DEFAULT_NAME,(m,a,d)=>t('playerN',d))});
applyStatic();
renderSetup();
