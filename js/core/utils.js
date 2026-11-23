/* =========================== NARZĘDZIA =========================== */
const $=s=>document.querySelector(s);
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};
const pick=a=>a[Math.random()*a.length|0];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function chem(s){return s.replace(/<=>/g,'⇌').replace(/->/g,'→').replace(/([A-Za-z\)\]])(\d+)/g,'$1<sub>$2</sub>').replace(/\^(\d*[+\-])/g,'<sup>$1</sup>')}
function fmt(x){return String(x).replace(/\{([^}]+)\}/g,(m,f)=>`<span class="f">${chem(f)}</span>`)}
const flaskSvg=(cls='')=>`<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true"><use href="#flask"/></svg>`;
function parseFormula(f){let i=0;const num=()=>{let s='';while(i<f.length&&/\d/.test(f[i]))s+=f[i++];return s?+s:1};
  const group=()=>{const c={};while(i<f.length){const ch=f[i];
    if(ch==='('){i++;const g=group();i++;const n=num();for(const k in g)c[k]=(c[k]||0)+g[k]*n}
    else if(ch===')')return c;
    else if(/[A-Z]/.test(ch)){let el=ch;i++;while(i<f.length&&/[a-z]/.test(f[i]))el+=f[i++];const n=num();c[el]=(c[el]||0)+n}
    else i++}return c};return group()}
function balanceCounts(eq,k){const Lc={},R={};eq.r.forEach((f,i)=>{const c=parseFormula(f);for(const e in c)Lc[e]=(Lc[e]||0)+c[e]*k[i]});
  eq.p.forEach((f,j)=>{const c=parseFormula(f);for(const e in c)R[e]=(R[e]||0)+c[e]*k[eq.r.length+j]});
  const els=[...new Set([...Object.keys(Lc),...Object.keys(R)])];return els.map(e=>({e,l:Lc[e]||0,r:R[e]||0}))}
const gcd=(a,b)=>b?gcd(b,a%b):a;
