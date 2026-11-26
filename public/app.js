const $ = s => document.querySelector(s);
const today = new Date().toLocaleDateString('en-CA');
const defaults = { goal: 120, minutes: 0, day: today, rules: [], habits: [] };
let data = { ...defaults };
try { data = { ...defaults, ...JSON.parse(localStorage.getItem('app')) }; } catch {}
if (data.day !== today) {
  data.day = today;
  data.minutes = 0;
  data.habits.forEach(h => h.done = false);
}

// Sample questions: team should rewrite in their own words
const prompts = [
  'What made you smile online this week?',
  'Which app do you enjoy most, and why?',
  'When is a good phone-free time for all of us?',
  'Is there anything online you want help with?'
];
let p = 0;

function save() {
  try { localStorage.setItem('app', JSON.stringify(data)); } catch {}
  render();
}

function list(key, el) {
  el.replaceChildren(...data[key].map((item, i) => {
    const li = document.createElement('li');
    const label = document.createElement('label');
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = item.done;
    box.onchange = () => { item.done = box.checked; save(); };
    label.append(box, ' ' + item.text);
    const del = document.createElement('button');
    del.textContent = '✕';
    del.ariaLabel = 'Delete';
    del.onclick = () => { data[key].splice(i, 1); save(); };
    li.append(label, del);
    return li;
  }));
}

function render() {
  $('#total').textContent = data.minutes;
  $('#goal').value = data.goal;
  $('#bar').max = data.goal;
  $('#bar').value = data.minutes;
  list('rules', $('#ruleList'));   // checkbox = everyone agreed
  list('habits', $('#habitList')); // checkbox = done today
}

function onAdd(id, fn) {
  $(id).onsubmit = e => {
    e.preventDefault();
    const value = e.target.querySelector('input').value.trim();
    if (value) { fn(value); e.target.reset(); save(); }
  };
}
onAdd('#timeForm', v => data.minutes += Number(v));
onAdd('#ruleForm', v => data.rules.push({ text: v, done: false }));
onAdd('#habitForm', v => data.habits.push({ text: v, done: false }));

$('#goal').onchange = e => { data.goal = Math.max(1, Number(e.target.value) || 120); save(); };
$('#resetTime').onclick = () => { data.minutes = 0; save(); };
$('#nextPrompt').onclick = () => $('#prompt').textContent = prompts[p++ % prompts.length];

document.querySelectorAll('nav button').forEach(b => b.onclick = () => {
  document.querySelectorAll('main section').forEach(s => s.hidden = s.id !== b.dataset.tab);
  document.querySelectorAll('nav button').forEach(n => n.removeAttribute('aria-current'));
  b.setAttribute('aria-current', 'page');
});

render();
if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js');
