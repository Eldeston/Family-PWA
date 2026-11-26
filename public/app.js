const APP='Olive'; // change app name here
const KEY='oliveFamilyProto1';
const td=()=>new Date().toISOString().slice(0,10);
const e=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const MOODS=[['great','Great','#5f8f2f'],['good','Good','#9bb347'],['okay','Okay','#c9a227'],['low','Low','#c97a3a'],['stress','Stressed','#9c3d2e']];
const ACT={
great:{me:['Write down what went well today','Do something kind for someone'],fam:['Cook a favourite meal together','Plan a family outing for the weekend']},
good:{me:['Read or listen to something you enjoy','Take a short walk outside'],fam:['Play a board game after dinner','Share one good moment from your day']},
okay:{me:['Stretch or move for 10 minutes','Tidy one small space'],fam:['Have tea or a snack together, phones away','Watch something short together']},
low:{me:['Drink water and step outside for fresh air','Message someone you trust'],fam:['Ask for a quiet 10 minutes together','Ask for a hug or a talk, no advice needed']},
stress:{me:['Breathe slowly: in 4, hold 4, out 6','Write the worry down, then pick one small step'],fam:['Say "I need to talk" and pick a calm time','Ask a family member to help with one task']}};
const Q={parent:['What is one thing you wish I understood about your week?','When do you feel trusted by me? When not?','What rule would you change, and why?','How can I support you without taking over?'],
teen:['What is one thing you are proud of that I may not know?','What worries you about how we use screens?','What could I do to earn more freedom?','How can I tell you when I am struggling?']};
const D={role:'teen',tab:'home',names:{parent:'Parent',teen:'Teen'},goal:120,
remind:{on:false,time:'20:00',last:''},
rules:[{id:1,text:'Phones away at dinner',ok:{parent:true,teen:true}},{id:2,text:'Screens off 30 minutes before bed',ok:{parent:false,teen:false}}],
kept:{},habits:{parent:[{id:1,text:'Ask one open question'},{id:2,text:'Phone-free dinner'}],teen:[{id:1,text:'Read for 15 minutes'},{id:2,text:'Walk outside'}]},
done:{},screen:{},reqs:[],moods:{},qi:{parent:0,teen:0}};
let S;
try{S=Object.assign({},D,JSON.parse(localStorage.getItem(KEY)||'{}'))}catch(x){S=D}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(x){}};
const nm=r=>e(S.names[r]);const R=()=>S.role,O=()=>S.role==='parent'?'teen':'parent';
const nid=a=>a.reduce((m,x)=>Math.max(m,x.id),0)+1;

function pts(){let n=0;
for(const d in S.kept)n+=Object.values(S.kept[d]).filter(Boolean).length;
for(const d in S.done)for(const r in S.done[d])n+=Object.values(S.done[d][r]).filter(Boolean).length;
return n+S.reqs.filter(q=>q.status==='approved').length}
const TH=[0,4,12,25,45],SN=['Seed','Sapling','Young tree','Strong tree','Fruiting tree'];
function stage(p){let s=0;TH.forEach((t,i)=>{if(p>=t)s=i});return s}
function tree(s){
const top=135-(25+s*22);const n=[0,2,4,6,8][s];
const P=[[100,top+8],[78,top+30],[124,top+28],[88,top+52],[118,top+54],[66,top+55],[136,top+50],[100,top+70]];
let g='';for(let i=0;i<Math.max(n,2);i++){const[x,y]=i<n?P[i]:[[112,top+10],[88,top+14]][i];
g+=`<ellipse cx="${x}" cy="${y}" rx="${s?22:13}" ry="${s?10:6}" fill="var(--leaf)" transform="rotate(${i%2?28:-28} ${x} ${y})"/>`}
let f='';if(s>=4)[[84,top+36],[122,top+40],[102,top+58]].forEach(([x,y])=>f+=`<circle cx="${x}" cy="${y}" r="5" fill="var(--gold)"/>`);
return `<svg id="tree" viewBox="0 0 200 160" role="img" aria-label="Olive tree: ${SN[s]}"><g class="sprout"><rect x="96" y="${top}" width="8" height="${150-top}" rx="3" fill="#6b5a3e"/>${g}${f}</g><rect x="50" y="148" width="100" height="6" rx="3" fill="var(--line)"/></svg>`}

function toast(m){const t=document.getElementById('toast');t.textContent=m;t.style.display='block';setTimeout(()=>t.style.display='none',6000)}
function ping(m){toast(m);try{if('Notification'in window&&Notification.permission==='granted')new Notification(APP,{body:m})}catch(x){}}
function tick(){const r=S.remind;if(!r.on)return;const n=new Date(),hm=n.toTimeString().slice(0,5);
if(hm>=r.time&&r.last!==td()){r.last=td();save();ping(`Time for today's check-in: habits, screen time and mood.`)}}
setInterval(tick,30000);

const act={
role(r){S.role=r;save();draw()},tab(t){S.tab=t;save();draw()},
addRule(){const i=document.getElementById('nr');if(!i.value.trim())return;S.rules.push({id:nid(S.rules),text:i.value.trim(),ok:{parent:R()==='parent',teen:R()==='teen'}});save();draw()},
agree(id){const x=S.rules.find(r=>r.id===id);x.ok[R()]=!x.ok[R()];save();draw()},
keep(id){const d=td();S.kept[d]=S.kept[d]||{};S.kept[d][id]=!S.kept[d][id];save();draw()},
delRule(id){S.rules=S.rules.filter(r=>r.id!==id);save();draw()},
addHabit(){const i=document.getElementById('nh');if(!i.value.trim())return;const a=S.habits[R()];a.push({id:nid(a),text:i.value.trim()});save();draw()},
hab(id){const d=td(),r=R();S.done[d]=S.done[d]||{};S.done[d][r]=S.done[d][r]||{};S.done[d][r][id]=!S.done[d][r][id];save();draw()},
delHabit(id){S.habits[R()]=S.habits[R()].filter(h=>h.id!==id);save();draw()},
logScreen(){const v=parseInt(document.getElementById('sm').value,10);if(isNaN(v)||v<0)return;const d=td();S.screen[d]=S.screen[d]||{};S.screen[d][R()]=v;save();draw()},
nextQ(){S.qi[R()]=(S.qi[R()]+1)%Q[R()].length;save();draw()},
sendReq(){const t=document.getElementById('rq').value.trim();if(!t)return;S.reqs.unshift({id:nid(S.reqs),text:t,status:'pending',reply:'',date:td()});save();draw()},
reply(id,st){const x=S.reqs.find(q=>q.id===id);x.status=st;x.reply=(document.getElementById('rp'+id).value||'').trim();save();draw()},
mood(m){const d=td();S.moods[d]=S.moods[d]||{};const cur=S.moods[d][R()]||{share:true,note:''};S.moods[d][R()]={...cur,m};save();draw()},
moodMeta(){const d=td();const c=(S.moods[d]||{})[R()];if(!c)return;c.share=document.getElementById('ms').checked;c.note=document.getElementById('mn').value;save();draw()},
setNames(){S.names.parent=document.getElementById('np').value||'Parent';S.names.teen=document.getElementById('nt').value||'Teen';S.goal=parseInt(document.getElementById('gl').value,10)||120;S.remind.time=document.getElementById('rt2').value||'20:00';save();draw();toast('Settings saved')},
async remind(){const r=S.remind;if(!r.on){if('Notification'in window&&Notification.permission==='default'){try{await Notification.requestPermission()}catch(x){}}r.on=true;r.last=''}else r.on=false;save();draw()},
test(){ping('This is how your reminder will look.')},
reset(){if(confirm('Delete all saved family data on this device?')){localStorage.removeItem(KEY);S=JSON.parse(JSON.stringify(D));draw()}}};

function home(){const p=pts(),s=stage(p),nx=TH[s+1];
const pc=nx?Math.round((p-TH[s])/(nx-TH[s])*100):100;
const pend=S.reqs.filter(q=>q.status==='pending').length;
return `<div class="card" style="text-align:center">${tree(s)}<h2>${SN[s]}</h2>
<div class="bar" aria-label="Progress to next stage"><i style="width:${pc}%"></i></div>
<p class="m">${p} growth points. ${nx?`${nx-p} more to reach ${SN[s+1]}.`:'Fully grown. Keep it healthy.'}</p>
<p class="m">The tree grows when agreed rules are kept, habits are done and requests are agreed.</p></div>
<div class="card"><h3>Today for ${nm(R())}</h3>
<p>${S.rules.filter(r=>r.ok.parent&&r.ok.teen).length} agreed rules · ${S.habits[R()].length} habits${R()==='parent'&&pend?` · <b>${pend} request${pend>1?'s':''} waiting for your reply</b>`:''}</p>
<button class="p" onclick="act.tab('mood')">Log today's mood</button></div>
${famMood()}`}

function famMood(){const m=S.moods[td()]||{};
const rows=['parent','teen'].map(r=>{const x=m[r];if(!x)return `<div class="it"><span>${nm(r)}</span><span class="m">has not checked in yet</span></div>`;
if(!x.share&&r!==R())return `<div class="it"><span>${nm(r)}</span><span class="m">chose not to share today</span></div>`;
const mm=MOODS.find(k=>k[0]===x.m);return `<div class="it"><span class="dot" style="background:${mm[2]};margin:0"></span><span><b>${nm(r)}</b> is feeling ${mm[1].toLowerCase()}${x.note?`<br><span class="m">${e(x.note)}</span>`:''}</span></div>`}).join('');
return `<div class="card"><h3>How the family feels today</h3>${rows}</div>`}

function rules(){return `<h2>Family agreements</h2><p class="m">A rule counts once both ${nm('parent')} and ${nm('teen')} agree. Anyone can propose one.</p>
<div class="card"><div class="row"><input id="nr" placeholder="Propose a rule, e.g. Homework before games"><button class="p" onclick="act.addRule()">Propose</button></div></div>
<div class="card">${S.rules.map(r=>{const both=r.ok.parent&&r.ok.teen,k=((S.kept[td()]||{})[r.id]);return `<div class="it" style="flex-wrap:wrap">
<div style="flex:1;min-width:200px"><b>${e(r.text)}</b><br>
<span class="pill ${r.ok.parent?'ok':''}">${nm('parent')}: ${r.ok.parent?'agreed':'not yet'}</span>
<span class="pill ${r.ok.teen?'ok':''}">${nm('teen')}: ${r.ok.teen?'agreed':'not yet'}</span></div>
<button class="g" onclick="act.agree(${r.id})">${r.ok[R()]?'Withdraw':'I agree'}</button>
${both?`<label style="flex:none"><input type="checkbox" ${k?'checked':''} onchange="act.keep(${r.id})">Kept today</label>`:''}
<button class="d" onclick="act.delRule(${r.id})" aria-label="Delete rule">Delete</button></div>`}).join('')||'<p class="m">No rules yet. Propose the first one.</p>'}</div>`}

function habits(){const d=(S.done[td()]||{})[R()]||{};const hs=S.habits[R()];
const sc=(S.screen[td()]||{}),mine=sc[R()];const over=mine>S.goal;
return `<h2>${nm(R())}'s habits</h2>
<div class="card">${hs.map(h=>`<div class="it"><label><input type="checkbox" ${d[h.id]?'checked':''} onchange="act.hab(${h.id})">${e(h.text)}</label><button class="d" onclick="act.delHabit(${h.id})" aria-label="Delete habit">Delete</button></div>`).join('')||'<p class="m">Add a habit you want to build.</p>'}
<div class="row" style="margin-top:8px"><input id="nh" placeholder="New habit"><button class="p" onclick="act.addHabit()">Add</button></div></div>
<h2>Screen time</h2><div class="card"><p class="m">Self-reported. Daily goal: ${S.goal} minutes.</p>
<div class="row"><input id="sm" type="number" min="0" inputmode="numeric" placeholder="Minutes today" value="${mine??''}"><button class="p" onclick="act.logScreen()">Save</button></div>
${['parent','teen'].map(r=>{const v=sc[r];return `<div style="margin-top:10px"><div class="row" style="justify-content:space-between"><span>${nm(r)}</span><span class="m">${v==null?'not logged':v+' min'}</span></div>
<div class="bar ${v>S.goal?'over':''}"><i style="width:${v==null?0:Math.min(100,v/S.goal*100)}%"></i></div></div>`}).join('')}
${over?`<p class="m">Over the goal today. That is a good moment to talk, not to blame.</p>`:''}</div>
<h2>Conversation card</h2>${talk()}`}

function talk(){const q=Q[R()][S.qi[R()]];return `<div class="card"><p style="font:1.15rem/1.4 Georgia,serif">${e(q)}</p>
<p class="m">Ask it out loud, then listen first.</p><button class="g" onclick="act.nextQ()">Next question</button></div>`}

function reqs(){const T=R()==='teen';const lab={pending:'Waiting',approved:'Approved',declined:'Declined',counter:'Counter-offer'};
return `<h2>Requests</h2>${T?`<div class="card"><p class="m">Ask for something and explain why. ${nm('parent')} will reply.</p>
<textarea id="rq" rows="2" placeholder="Can I have 30 more minutes tonight because..."></textarea><button class="p" onclick="act.sendReq()">Send request</button></div>`:`<p class="m">Replies are most useful when they include a reason.</p>`}
${S.reqs.map(q=>`<div class="card"><span class="pill ${q.status==='approved'?'ok':''}">${lab[q.status]}</span> <span class="m">${q.date}</span>
<p><b>${nm('teen')}:</b> ${e(q.text)}</p>${q.reply?`<p><b>${nm('parent')}:</b> ${e(q.reply)}</p>`:''}
${!T&&q.status==='pending'?`<input id="rp${q.id}" placeholder="Add a reply or reason"><div class="row"><button class="p" onclick="act.reply(${q.id},'approved')">Approve</button><button class="g" onclick="act.reply(${q.id},'counter')">Counter-offer</button><button class="g" onclick="act.reply(${q.id},'declined')">Decline</button></div>`:''}</div>`).join('')||'<p class="m">No requests yet.</p>'}`}

function mood(){const c=(S.moods[td()]||{})[R()];const a=c&&ACT[c.m];
return `<h2>How are you feeling, ${nm(R())}?</h2><div class="card"><div class="moods">${MOODS.map(m=>`<button class="${c&&c.m===m[0]?'on':''}" onclick="act.mood('${m[0]}')"><span class="dot" style="background:${m[2]}"></span>${m[1]}</button>`).join('')}</div>
${c?`<input id="mn" placeholder="Add a note (optional)" value="${e(c.note||'')}" onchange="act.moodMeta()">
<label class="row" style="margin-top:6px"><input type="checkbox" id="ms" ${c.share?'checked':''} onchange="act.moodMeta()">Show this to the family</label>`:''}</div>
${a?`<div class="card"><h3>Things you can do</h3>${a.me.map(x=>`<div class="it">${e(x)}</div>`).join('')}<h3 style="margin-top:12px">Things to do with family</h3>${a.fam.map(x=>`<div class="it">${e(x)}</div>`).join('')}</div>`:''}
${famMood()}`}

function settings(){const r=S.remind;return `<h2>Settings</h2><div class="card">
<label>Parent name<input id="np" value="${e(S.names.parent)}"></label>
<label>Teen name<input id="nt" value="${e(S.names.teen)}"></label>
<label>Daily screen-time goal (minutes)<input id="gl" type="number" min="10" value="${S.goal}"></label>
<label>Reminder time<input id="rt2" type="time" value="${r.time}"></label>
<button class="p" onclick="act.setNames()">Save settings</button></div>
<div class="card"><h3>Daily reminder</h3><p class="m">Reminds you to check in. It works while this page is open.</p>
<div class="row"><button class="${r.on?'g':'p'}" onclick="act.remind()">${r.on?'Turn reminder off':'Turn reminder on'}</button><button class="g" onclick="act.test()">Send test</button></div></div>
<div class="card"><h3>Your data</h3><p class="m">Everything stays on this device. Nothing is sent or tracked.</p><button class="d" onclick="act.reset()">Delete all data</button></div>`}

const TABS=[['home','Home'],['rules','Rules'],['habits','Habits'],['reqs','Requests'],['mood','Mood'],['settings','Settings']];
function draw(){
document.getElementById('appname').textContent=APP;
document.getElementById('rp').className=R()==='parent'?'on':'';document.getElementById('rt').className=R()==='teen'?'on':'';
document.getElementById('rp').textContent=S.names.parent;document.getElementById('rt').textContent=S.names.teen;
const pend=S.reqs.filter(q=>q.status==='pending').length;
document.getElementById('nav').innerHTML=TABS.map(([k,l])=>`<button class="${S.tab===k?'on':''}" onclick="act.tab('${k}')">${l}${k==='reqs'&&pend?`<span class="b">${pend}</span>`:''}</button>`).join('');
document.getElementById('v').innerHTML=({home,rules,habits,reqs,mood,settings})[S.tab]();}
document.getElementById('rp').onclick=()=>act.role('parent');
document.getElementById('rt').onclick=()=>act.role('teen');
draw();tick();

if('serviceWorker' in navigator)addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
