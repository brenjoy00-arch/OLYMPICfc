const teamSchedules = {
    "U14": { opp: "Rivals FC", train: "Mon @ 5:30PM", loc: "Ground 2" },
    "U16": { opp: "City Stars", train: "Wed @ 6:00PM", loc: "Main Pitch" },
    "First Team": { opp: "United Pro", train: "Tue/Thu @ 7PM", loc: "Olympic Stadium" }
};

let userRole = 'player';
let activeColor = 'red';
let currentUser = { first: '', last: '', team: '', age: '', pos: '', img: null };

// 1. AUTH & TEAM SYNC
window.handleLogin = function(role) {
    const f = document.getElementById('reg-first').value;
    const l = document.getElementById('reg-last').value;
    const t = document.getElementById('reg-team').value;
    const pass = document.getElementById('reg-pass').value;

    if (!f || !t || !pass) return alert("Required: Name, Team, and Password.");

    let finalRole = role;
    if (f.toLowerCase() === 'breanna' && l.toLowerCase() === 'dodds') finalRole = 'coach';

    userRole = finalRole;
    currentUser = { 
        first: f, last: l, team: t, 
        age: document.getElementById('reg-age').value, 
        pos: document.getElementById('reg-pos').value 
    };
    
    document.body.className = `user-${finalRole}`;
    
    const sched = teamSchedules[t] || { opp: "TBA", train: "TBA", loc: "TBA" };
    document.getElementById('opp-name').innerText = sched.opp;
    document.getElementById('train-day').innerText = sched.train;
    document.getElementById('train-loc').innerText = sched.loc;
    
    document.getElementById('user-welcome').innerText = `HELLO, ${f.toUpperCase()}!`;
    document.getElementById('team-display').innerText = `OLYMPIC FC • ${t}`;
    
    updateProfileUI();
    
    const badge = document.getElementById('role-badge');
    badge.innerText = finalRole.toUpperCase();
    badge.className = `text-[8px] font-black px-2 py-1 rounded-md uppercase ${finalRole === 'coach' ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-600'}`;

    document.getElementById('screen-auth').classList.add('hidden');
    document.getElementById('screen-main').classList.remove('hidden');
    initTactics();
};

window.logout = function() { location.reload(); };

// 2. MESSAGING, RIDE & POLLS
window.postMessage = function() {
    const val = document.getElementById('chat-input').value;
    if (!val) return;
    const msg = `<div class="bg-white p-4 rounded-2xl shadow-sm border border-gray-100"><p class="text-[9px] font-black text-red-600 uppercase mb-1">${currentUser.first}</p><p class="text-xs text-slate-700">${val}</p></div>`;
    document.getElementById('chat-feed').insertAdjacentHTML('afterbegin', msg);
    document.getElementById('chat-input').value = "";
};

window.postRide = function(type) {
    const msg = `<div class="bg-red-50 p-4 rounded-2xl border-2 border-red-200"><p class="text-[9px] font-black text-red-600 uppercase mb-1">${currentUser.first}</p><p class="text-[11px] font-bold text-slate-800 italic">🚗 ${type}</p></div>`;
    document.getElementById('chat-feed').insertAdjacentHTML('afterbegin', msg);
};

window.togglePollModal = function() { document.getElementById('poll-modal').classList.toggle('hidden'); };

window.addPollFromInput = function() {
    const t = document.getElementById('poll-title').value;
    if (!t) return;
    const poll = `<div class="bg-white p-5 rounded-3xl border-2 border-slate-800"><p class="text-sm font-black mb-4 uppercase italic">${t}</p><div class="space-y-2"><button class="w-full text-left p-3 border border-gray-100 text-[10px] font-black rounded-xl uppercase hover:bg-red-50">Available</button><button class="w-full text-left p-3 border border-gray-100 text-[10px] font-black rounded-xl uppercase hover:bg-red-50">Unavailable</button></div></div>`;
    document.getElementById('chat-feed').insertAdjacentHTML('afterbegin', poll);
    togglePollModal();
};

// 3. TACTICS
function initTactics() {
    const pitch = document.getElementById('tactical-pitch');
    pitch.onclick = function(e) {
        if (userRole !== 'coach' || e.target.classList.contains('counter')) return;
        const rect = pitch.getBoundingClientRect();
        const init = prompt("Player Marker:");
        if (!init) return;
        const counter = document.createElement('div');
        counter.className = `counter ${activeColor === 'red' ? 'bg-red-600' : 'bg-blue-600'}`;
        counter.style.left = `${e.clientX - rect.left - 22}px`;
        counter.style.top = `${e.clientY - rect.top - 22}px`;
        counter.innerText = init.toUpperCase().substring(0, 2);
        counter.onclick = (ev) => { ev.stopPropagation(); if(confirm("Remove Player?")) counter.remove(); };
        pitch.appendChild(counter);
    };
}

window.setMarkerColor = function(c) {
    activeColor = c;
    document.getElementById('btn-red-marker').classList.toggle('scale-110', c === 'red');
    document.getElementById('btn-blue-marker').classList.toggle('scale-110', c === 'blue');
};

window.clearMarkers = function() { if(confirm("Reset Field?")) document.querySelectorAll('.counter').forEach(c => c.remove()); };

// 4. GOALS, DRILLS & UI
window.addGoal = function() {
    const input = document.getElementById('goal-input');
    if (!input.value) return;
    document.getElementById('goal-list').insertAdjacentHTML('beforeend', `<div class="flex items-center text-[10px] font-black text-slate-600 uppercase animate-pulse"><i class="fas fa-futbol mr-2 text-red-600"></i> ${input.value}</div>`);
    input.value = "";
};

window.addDrill = function() {
    const t = document.getElementById('drill-title').value;
    if (!t) return;
    const d = `<div class="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100"><h4 class="font-black text-sm uppercase text-red-600 mb-1">${t}</h4><p class="text-[11px] text-slate-600">${document.getElementById('drill-notes').value}</p></div>`;
    document.getElementById('drill-feed').insertAdjacentHTML('afterbegin', d);
};

function updateProfileUI() {
    document.getElementById('prof-name').innerText = `${currentUser.first} ${currentUser.last}`;
    document.getElementById('prof-team-display').innerText = `OLYMPIC FC: ${currentUser.team}`;
    document.getElementById('prof-details').innerText = `POS: ${currentUser.pos} | AGE: ${currentUser.age}`;
    document.getElementById('prof-initials').innerText = currentUser.first.substring(0,2).toUpperCase();
}

window.saveProfile = function() {
    const n = document.getElementById('edit-first').value;
    const p = document.getElementById('edit-pos').value;
    if(n) currentUser.first = n;
    if(p) currentUser.pos = p;
    updateProfileUI();
    toggleProfileEdit();
};

window.uploadPhoto = function(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imgHtml = `<img src="${e.target.result}">`;
            document.getElementById('prof-img-box').innerHTML = imgHtml;
            document.getElementById('header-img').innerHTML = imgHtml;
        };
        reader.readAsDataURL(input.files[0]);
    }
};

window.toggleProfileEdit = function() {
    document.getElementById('profile-view').classList.toggle('hidden');
    document.getElementById('profile-edit').classList.toggle('hidden');
};

window.setSlot = function(el) {
    if (userRole !== 'coach') return;
    const name = prompt("Assign Player:");
    if (name) el.innerText = name.toUpperCase().substring(0, 3);
};

window.showTab = function(tabId, btn) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.add('hidden'));
    document.getElementById(tabId).classList.remove('hidden');
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.replace('text-red-600', 'text-gray-300'));
    if (btn) btn.classList.replace('text-gray-300', 'text-red-600');
};
