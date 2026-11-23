/* =========================== TOAST / MODAL =========================== */
async function toast(html,ms=1400){const el=$('#toast');el.innerHTML=html;el.hidden=false;await sleep(ms);el.hidden=true}
function openModal(html,wide){$('#overlay').hidden=false;const m=$('#modal');m.className='modal'+(wide?' wide':'');m.innerHTML=html;m.scrollTop=0;
  const f=m.querySelector('[autofocus]')||m.querySelector('button');if(f)setTimeout(()=>f.focus({preventScroll:true}),30);return m}
function closeModal(){$('#overlay').hidden=true;$('#modal').innerHTML='';if(S)S.key=null}
function waitBtn(sel){return new Promise(r=>{const b=$('#modal').querySelector(sel);b.addEventListener('click',()=>r(b.dataset.v),{once:true})})}
function waitAny(sels){return new Promise(r=>{sels.forEach(s=>{const b=$('#modal').querySelector(s);if(b)b.addEventListener('click',()=>r(s),{once:true})})})}
