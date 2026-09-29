'use strict';

// Safe LocalStorage helpers: private mode, quota limits, or corrupted storage
// must not crash the whole application.
function storageGet(key, fallback=null){
 try{return localStorage.getItem(key) ?? fallback}catch{return fallback}
}
function storageSet(key,value){
 try{localStorage.setItem(key,value);return true}catch(err){console.warn('Không thể lưu dữ liệu:',key,err);return false}
}
function storageRemove(key){
 try{localStorage.removeItem(key);return true}catch(err){console.warn('Không thể xóa dữ liệu:',key,err);return false}
}

const defaultMovies=[
{id:1,title:'Shadow House',year:2024,genre:['Anime'],rating:4.5,poster:'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=900&q=85',desc:'Một bí ẩn mở ra trong căn nhà cổ, nơi những bí mật tưởng như đã ngủ quên bắt đầu thức tỉnh.',badges:['VIP','LT'],episodes:[1,2,3]},
{id:2,title:'Azure Pulse',year:2025,genre:['Khoa học viễn tưởng','Hành động'],rating:4.8,poster:'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=900&q=85',desc:'Trong tương lai gần, một nhóm hacker trẻ phát hiện ra AI đang âm thầm kiểm soát toàn bộ hạ tầng thành phố.',badges:['LT'],episodes:[1,2,3,4]},
{id:3,title:'Lạc Vào Giấc Mơ',year:2024,genre:['Tình cảm'],rating:4.6,poster:'https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=900&q=85',desc:'Một giấc mơ kỳ lạ kéo hai người xa lạ đến gần nhau hơn.',badges:['VIP'],episodes:[1,2]},
{id:4,title:'Your Lie in April',year:2015,genre:['Tình cảm','Âm nhạc'],rating:4.6,poster:'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=900&q=85',desc:'Âm nhạc, tình bạn và những ngày tháng tuổi trẻ.',badges:['VIP','LT'],episodes:[1,2,3]},
{id:5,title:'Solo Leveling',year:2024,genre:['Hành động','Fantasy'],rating:4.9,poster:'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=85',desc:'Một thợ săn yếu nhất bắt đầu hành trình thay đổi số phận.',badges:['LT'],episodes:[1,2,3,4]},
{id:6,title:'Suzume',year:2022,genre:['Phiêu lưu'],rating:4.7,poster:'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=85',desc:'Một cuộc hành trình kỳ diệu qua những cánh cửa bí ẩn.',badges:[],episodes:[1,2]},
{id:7,title:'Trái Tim Giấy',year:2023,genre:['Phim Việt','Tình cảm'],rating:5.0,poster:'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=85',desc:'Một câu chuyện nhẹ nhàng về những lựa chọn của tuổi trẻ.',badges:['VIP'],episodes:[1,2]},
{id:8,title:'Neon City',year:2025,genre:['Hành động','Khoa học viễn tưởng'],rating:4.4,poster:'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=85',desc:'Thành phố neon và cuộc chiến giành quyền kiểm soát dữ liệu.',badges:[],episodes:[1,2,3]}
];
let movies=readJSON('phimhayvietsub_movies',defaultMovies);
function normalizeMovie(m,i=0){
 const src=m&&typeof m==='object'?m:{};
 const genres=Array.isArray(src.genre)?src.genre.filter(Boolean).map(String):String(src.genre||'Phim').split(',').map(x=>x.trim()).filter(Boolean);
 const eps=Array.isArray(src.episodes)?src.episodes.map(Number).filter(Number.isFinite).map(n=>Math.max(1,Math.floor(n))):[1];
 return {id:src.id??Date.now()+i,authorId:String(src.authorId||''),authorName:String(src.authorName||''),title:String(src.title||'Phim chưa đặt tên'),year:Number.isFinite(Number(src.year))?Number(src.year):2026,genre:genres.length?genres:['Phim'],rating:Math.max(0,Math.min(5,Number(src.rating)||0)),poster:String(src.poster||''),desc:String(src.desc||''),badges:Array.isArray(src.badges)?src.badges.filter(Boolean).map(String):[],episodes:eps.length?[...new Set(eps)].sort((a,b)=>a-b):[1],status:['approved','pending','rejected'].includes(src.status)?src.status:'approved'};
}
if(!Array.isArray(movies)||!movies.length) movies=defaultMovies.map((m,i)=>normalizeMovie({...m,status:'approved'},i));
else movies=movies.map(normalizeMovie);
storageSet('phimhayvietsub_movies',JSON.stringify(movies));
function movieById(id){return movies.find(x=>String(x.id)===String(id));}
const crew=[['MA','Miu Anh','Đỗ Minh Anh'],['HK','Huy Kai','Trần Gia Huy'],['VR','Vy Rin','Phạm Thảo'],['TT','Trà Tím','Nguyễn Trà']];
let user=readJSON('phimhayvietsub_user',null);
if(!user || typeof user!=='object' || Array.isArray(user)) user=null;
const $=id=>document.getElementById(id);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function readJSON(k,f){try{const raw=storageGet(k,null);return raw===null?f:(JSON.parse(raw)??f)}catch{return f}}
function saveUser(u){user=u;storageSet('phimhayvietsub_user',JSON.stringify(u))}
function clearUser(){user=null;storageRemove('phimhayvietsub_user')}
function openModal(html){const c=$('modalContent'),m=$('modal');if(!c||!m)return;c.innerHTML=html;m.classList.remove('hidden');document.body.style.overflow='hidden'}
function closeModal(){const m=$('modal'),c=$('modalContent');if(m)m.classList.add('hidden');if(c)c.innerHTML='';document.body.style.overflow=''}
function closeSearch(){const p=$('searchPanel'),r=$('searchResults');if(p)p.classList.add('hidden');if(r)r.innerHTML='';document.body.style.overflow='';}
function openSearch(){const p=$('searchPanel');if(!p)return;p.classList.remove('hidden');document.body.style.overflow='hidden'; setTimeout(()=>$('searchInput')?.focus(),0) }
function movieCard(m){return `<article class="movie"><button class="movie-open" data-id="${m.id}" style="display:block;width:100%;padding:0;border:0;background:none;text-align:left;color:inherit"><div class="poster" style="background-image:url('${esc(m.poster)}')"><div class="badges">${m.badges.map(b=>`<span class="badge ${b==='LT'?'lt':''}">${esc(b)}</span>`).join('')}</div><div class="poster-title">${esc(m.title)}</div><div class="rating">★ ${m.rating.toFixed(1)}</div></div><div class="movie-info"><h3>${esc(m.title)}</h3><p>${m.year} · ${m.genre.join(' · ')}</p></div></button></article>`}
function renderRails(){
 const rail=$('newRail'); if(rail) rail.innerHTML=[...movies].filter(m=>m.status!=='pending'&&m.status!=='rejected').sort((a,b)=>b.year-a.year).map(movieCard).join('');
 rail?.querySelectorAll('.movie-open').forEach(b=>b.addEventListener('click',()=>showMovie(b.dataset.id)));
}
function renderGenres(){const rail=$('genreRail');if(!rail)return;const genres=[['MA','Tình cảm',''],['HK','Hành động',''],['VR','Phiêu lưu',''],['TT','Phim Việt','']];rail.innerHTML=genres.map(g=>`<button class="genre" data-genre="${esc(g[1])}" style="border:0;background:none;color:inherit;cursor:pointer"><span class="genre-icon">${g[0]}</span><b>${esc(g[1])}</b><small>Khám phá</small></button>`).join('');rail.querySelectorAll('.genre').forEach(b=>b.addEventListener('click',()=>searchGenre(b.dataset.genre)))}
function renderCrew(){const rail=$('crewRail');if(!rail)return;rail.innerHTML=crew.map(p=>`<div class="person"><div class="avatar">${esc(p[0])}</div><b>${esc(p[1])}</b><small>${esc(p[2])}</small></div>`).join('')}
function setHero(){
 const hero=document.querySelector('.hero'); if(!hero)return;
 hero.style.backgroundImage="linear-gradient(90deg,rgba(5,8,20,.88),rgba(5,8,20,.38)),linear-gradient(0deg,#050814 0%,transparent 48%),url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=2200&q=88')";
 const setText=(id,text)=>{const el=$(id);if(el)el.textContent=text};
 setText('heroTitle','Rạp chiếu phim');setText('heroYear','PhimHayVietSub');setText('heroGenre','Phim · Anime · Lồng tiếng');setText('heroRating','');
 setText('heroDesc','Không gian xem phim trực tuyến dành cho cộng đồng PhimHayVietSub.');
 setText('heroWatch','🎬 Khám phá phim');setText('heroDetail','🔎 Tìm kiếm');
 $('heroWatch')?.addEventListener('click',openSearch);
 $('heroDetail')?.addEventListener('click',openSearch);
}

function socialKey(name){return `phimhayvietsub_${name}`}
function getLikes(){return readJSON(socialKey('likes'),{} )||{}}
function getFollows(){return readJSON(socialKey('follows'),{})||{}}
function getComments(){return readJSON(socialKey('comments'),{})||{}}
function toggleLike(movieId){
 if(!user){auth('login');return false}
 const likes=getLikes(), key=String(movieId), list=Array.isArray(likes[key])?likes[key]:[];
 const uid=String(user.id); const i=list.indexOf(uid); if(i>=0) list.splice(i,1); else list.push(uid);
 likes[key]=list; storageSet(socialKey('likes'),JSON.stringify(likes)); return i<0;
}
function isFollowing(uid){const f=getFollows();return Array.isArray(f[String(user?.id)])&&f[String(user.id)].includes(String(uid))}
function toggleFollow(uid){
 if(!user){auth('login');return false}
 if(String(uid)===String(user.id))return false;
 const f=getFollows(), key=String(user.id), list=Array.isArray(f[key])?f[key]:[], id=String(uid), i=list.indexOf(id);
 if(i>=0)list.splice(i,1);else list.push(id); f[key]=list; storageSet(socialKey('follows'),JSON.stringify(f)); return i<0;
}
function commentsFor(movieId){const c=getComments();return Array.isArray(c[String(movieId)])?c[String(movieId)]:[]}
function addComment(movieId,text){
 if(!user){auth('login');return}
 const value=String(text||'').trim(); if(!value)return;
 const c=getComments(),key=String(movieId),list=commentsFor(movieId);
 list.unshift({id:Date.now(),userId:user.id,name:user.name||'Thành viên',avatar:user.avatar||'',text:value,at:Date.now()});
 c[key]=list.slice(0,100);storageSet(socialKey('comments'),JSON.stringify(c));
}
function userVoiceMovies(){return Array.isArray(user?.voiceMovies)?user.voiceMovies.map(String):[]}
function saveUserField(patch){
 if(!user)return; user={...user,...patch}; saveUser(user); const arr=getAccounts(),a=arr.find(x=>String(x.id)===String(user.id));
 if(a)Object.assign(a,patch); storageSet('phimhayvietsub_accounts',JSON.stringify(arr)); updateAccount();
}
function slugUsername(name,id){
 const base=String(name||'thanhvien').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'').slice(0,20)||'thanhvien';
 const tail=String(id||'').replace(/[^a-z0-9]/gi,'').slice(-4).toLowerCase();
 return base+(tail?'_'+tail:'');
}
function refreshCurrentAccount(){
 if(!user?.id)return user;
 const a=getAccounts().find(x=>String(x.id)===String(user.id));
 if(!a)return user;
 const {password,...safe}=a; if(safe.role==='OWNER'){safe.verified=true;safe.verifiedAt=safe.verifiedAt||Date.now();} user={...user,...safe,username:String(safe.username||'').replace(/^@+/,'')}; storageSet('phimhayvietsub_user',JSON.stringify(user)); return user;
}
function followerCount(uid){
 const f=getFollows(); let n=0;
 Object.keys(f).forEach(k=>{if(Array.isArray(f[k])&&f[k].some(x=>String(x)===String(uid)))n++});
 return n;
}
function followingCount(uid){
 const f=getFollows(); return Array.isArray(f[String(uid)])?f[String(uid)].length:0;
}
function likedCount(uid){
 const likes=getLikes(); let n=0;
 Object.values(likes).forEach(list=>{if(Array.isArray(list)&&list.some(x=>String(x)===String(uid)))n++});
 return n;
}
function profileContentMovies(uid){
 return movies.filter(m=>String(m.authorId||'')===String(uid)&&m.status==='approved');
}

function roleSpecificPanel(){
 if(!user)return auth('login');
 const info=ROLE_INFO[user.role]||ROLE_INFO.USER;
 if(user.role==='VOICE_ACTOR'){
   const selected=new Set(userVoiceMovies());
   openModal(`<div class="role-workspace"><div class="workspace-head"><div><div class="eyebrow">${info.icon} ${esc(info.label)}</div><h2 class="auth-title">Bảng vai trò của tôi</h2><p class="muted">Quản lý hồ sơ lồng tiếng và những phim bạn tham gia.</p></div><span class="role-pill">${esc(info.label)}</span></div><section class="role-work-card"><h3>🎙️ Phim mình lồng tiếng</h3><p class="muted">Chọn các phim bạn đã tham gia. Danh sách này sẽ xuất hiện công khai trong hồ sơ.</p><div class="role-movie-picker">${movies.filter(m=>m.status==='approved').map(m=>`<label class="role-check"><input type="checkbox" class="voice-movie-check" value="${m.id}" ${selected.has(String(m.id))?'checked':''}><span>${esc(m.title)}</span></label>`).join('')}</div><button class="btn gradient" id="saveVoiceMovies">💾 Lưu phim lồng tiếng</button></section><section class="role-work-card"><h3>👤 Hồ sơ giọng</h3><p class="muted">${esc(user.bio||'Bạn có thể thêm thông tin giọng, ngôn ngữ và vai diễn trong phần chỉnh sửa hồ sơ.')}</p><button class="btn" id="roleEditProfile">✏️ Chỉnh sửa hồ sơ</button></section></div>`);
   $('saveVoiceMovies').onclick=()=>{const ids=[...document.querySelectorAll('.voice-movie-check:checked')].map(x=>String(x.value));saveUserField({voiceMovies:ids});toast('Đã cập nhật phim lồng tiếng');profileModal()};
   $('roleEditProfile').onclick=profileEditModal; return;
 }
 if(user.role==='DIRECTOR'){
   openModal(`<div class="role-workspace"><div class="workspace-head"><div><div class="eyebrow">🎬 ĐẠO DIỄN</div><h2 class="auth-title">Bảng điều khiển vai trò</h2></div><span class="role-pill">Đạo diễn</span></div><div class="role-work-card"><h3>🎬 Dự án phim</h3><p class="muted">${movies.filter(m=>m.status==='approved').length} phim đang hiển thị. Bạn có thể theo dõi nội dung từ đây.</p><button class="btn gradient" id="roleMovieList">Mở danh sách phim</button></div></div>`);
   $('roleMovieList').onclick=()=>{closeModal();document.getElementById('movies')?.scrollIntoView({behavior:'smooth'})}; return;
 }
 if(user.role==='FILM_REVIEWER') return rolePanel();
 if(user.role==='OWNER') return rolePanel();
 rolePanel();
}
function showMovie(id){
 const m=movieById(id); if(!m||m.status!=='approved')return;
 const likes=getLikes(), liked=Array.isArray(likes[String(id)])&&user&&likes[String(id)].includes(String(user.id));
 const comments=commentsFor(id);
 openModal(`<div class="movie-detail social-detail"><div class="detail-poster" style="background-image:url('${esc(m.poster)}')"></div><div><div class="eyebrow">🎬 PHIM LỒNG TIẾNG</div><h2 class="auth-title">${esc(m.title)}</h2><p class="muted">${m.year} · ${esc(m.genre.join(' · '))} · ★ ${m.rating.toFixed(1)}</p><p class="muted">${esc(m.desc)}</p><div class="social-actions"><button class="btn ${liked?'liked':''}" id="movieLike">♥ <span id="likeCount">${Array.isArray(likes[String(id)])?likes[String(id)].length:0}</span></button><button class="btn" id="movieCommentFocus">💬 ${comments.length}</button></div><h3>Danh sách tập</h3><div class="episodes">${m.episodes.map(n=>`<div class="episode"><span>Tập ${n}</span><button class="btn gradient" data-watch="${m.id}" data-episode="${n}">▶ Xem</button></div>`).join('')}</div><section class="comments-box"><h3>💬 Bình luận</h3><form id="commentForm" class="comment-form"><input id="commentInput" maxlength="300" placeholder="Viết bình luận..." ${user?'':'disabled'}><button class="btn gradient" type="submit">Gửi</button></form><div class="comment-list">${comments.length?comments.slice(0,20).map(c=>`<div class="comment"><div class="comment-avatar">${esc((c.name||'U').slice(0,1).toUpperCase())}</div><div><b>${esc(c.name)}</b><p>${esc(c.text)}</p></div></div>`).join(''):'<p class="muted">Chưa có bình luận.</p>'}</div></section></div></div>`);
 $('modalContent')?.querySelectorAll('[data-watch]').forEach(b=>b.addEventListener('click',()=>watchEpisode(b.dataset.watch,Number(b.dataset.episode))));
 $('movieLike')?.addEventListener('click',()=>{if(!user){auth('login');return}const now=toggleLike(id);$('movieLike')?.classList.toggle('liked',now);const l=getLikes()[String(id)]||[];if($('likeCount'))$('likeCount').textContent=l.length});
 $('commentForm')?.addEventListener('submit',e=>{e.preventDefault();if(!user){auth('login');return}const input=$('commentInput');addComment(id,input?.value);showMovie(id)});
 $('movieCommentFocus')?.addEventListener('click',()=>$('commentInput')?.focus());
}
function watchEpisode(id,n){const m=movieById(id);if(!m)return;if(getSettings().saveHistory){const h=readJSON('phimhayvietsub_history',[]).filter(x=>!(x.id===id&&x.episode===n));h.unshift({id,episode:n,at:Date.now()});storageSet('phimhayvietsub_history',JSON.stringify(h.slice(0,50)))}openModal(`<div class="eyebrow">ĐANG XEM</div><h2 class="auth-title">${esc(m.title)} — Tập ${n}</h2><div style="aspect-ratio:16/9;background:radial-gradient(circle,#192b55,#02050b);border:1px solid #2b3d70;border-radius:16px;display:grid;place-items:center;font-size:45px;color:#5d72a6">▶</div><p class="muted">Trình phát video mẫu. Khi có backend, thay khu vực này bằng video/HLS player.</p>`)}
function auth(mode='login'){const register=mode==='register';openModal(`<div><div class="eyebrow">PHIMHAYVIETSUB ACCOUNT</div><h2 class="auth-title">${register?'Tạo tài khoản mới':'Đăng nhập tài khoản'}</h2><p class="muted">${register?'Tạo tài khoản để lưu lịch sử xem, yêu thích và tham gia cộng đồng lồng tiếng.':'Đăng nhập để tiếp tục hành trình xem phim. Tài khoản chủ website có quyền quản trị cao nhất.'}</p><form id="authForm" class="form">${register?`<div class="field"><label>TÊN HIỂN THỊ</label><input id="name" minlength="2" required placeholder="Tên của bạn"></div>`:''}<div class="field"><label>EMAIL</label><input id="email" type="email" required placeholder="you@example.com"></div><div class="field"><label>MẬT KHẨU</label><input id="password" type="password" minlength="6" required placeholder="Tối thiểu 6 ký tự"></div>${register?`<div class="role-note">Tài khoản mới mặc định là <b>Thành viên</b>. Các vai trò VIP, Diễn viên lồng tiếng, Duyệt phim và Đạo diễn chỉ được cấp bởi Chủ Website.</div>`:''}<div id="authMsg"></div><button class="submit" type="submit">${register?'Tạo tài khoản':'Đăng nhập'}</button><div class="divider">HOẶC</div><div id="googleButton"><button class="google" type="button" id="googleFallback">Đăng nhập bằng Google</button></div><p class="switch">${register?'Đã có tài khoản?':'Chưa có tài khoản?'} <button type="button" id="switchAuth">${register?'Đăng nhập':'Đăng ký'}</button></p></form></div>`);$('authForm').addEventListener('submit',register?registerAccount:loginAccount);$('switchAuth').addEventListener('click',()=>auth(register?'login':'register'));setTimeout(initGoogleLogin,100)}
const OWNER_ACCOUNT={id:'owner-001',name:'Chủ Website',email:'owner@phimhayvietsub.com',password:'PHVS@Owner2026!',role:'OWNER'};
function getAccounts(){
 const stored=readJSON('phimhayvietsub_accounts',[]);
 const accounts=Array.isArray(stored)?stored.filter(x=>x&&typeof x==='object').map((x,i)=>({
  id:x.id??`user-${Date.now()}-${i}`,
  name:String(x.name||'Thành viên'),
  email:String(x.email||'').trim().toLowerCase(),
  password:String(x.password||''),
  role:['USER','VIP','VOICE_ACTOR','FILM_REVIEWER','DIRECTOR','OWNER'].includes(x.role)?x.role:'USER',
  bio:String(x.bio||''),
  avatar:String(x.avatar||''),
  username:String(x.username||'').trim(),
  verified:!!x.verified,
  verifiedAt:x.verifiedAt||null,
  banned:!!x.banned,
  banReason:String(x.banReason||''),
  banAt:x.banAt||null,
  voiceMovies:Array.isArray(x.voiceMovies)?x.voiceMovies.map(String).filter(Boolean):[]
 })):[];
 accounts.forEach(a=>{a.username=String(a.username||'').replace(/^@+/,'')||slugUsername(a.name,a.id);});
 const ownerIndex=accounts.findIndex(x=>x.role==='OWNER'&&x.email===OWNER_ACCOUNT.email.toLowerCase());
 if(ownerIndex<0) accounts.unshift({...OWNER_ACCOUNT,verified:true,verifiedAt:Date.now()});
 else accounts[ownerIndex]={...accounts[ownerIndex],...OWNER_ACCOUNT,role:'OWNER',verified:true,verifiedAt:accounts[ownerIndex].verifiedAt||Date.now()};
 storageSet('phimhayvietsub_accounts',JSON.stringify(accounts));
 return accounts;
}
function registerAccount(e){
 e.preventDefault();
 const accounts=getAccounts(),email=$('email').value.trim().toLowerCase(),name=$('name').value.trim(),password=$('password').value;
 if(name.length<2)return $('authMsg').innerHTML='<div class="error">Tên hiển thị phải có ít nhất 2 ký tự.</div>';
 if(password.length<6)return $('authMsg').innerHTML='<div class="error">Mật khẩu phải có ít nhất 6 ký tự.</div>';
 if(accounts.some(x=>String(x.email).toLowerCase()===email))return $('authMsg').innerHTML='<div class="error">Email này đã được đăng ký.</div>';
 const id=`user-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;const u={id,name,email,username:slugUsername(name,id),role:'USER',bio:'',avatar:'',verified:false,voiceMovies:[]};
 accounts.push({...u,password});
 if(!storageSet('phimhayvietsub_accounts',JSON.stringify(accounts)))return $('authMsg').innerHTML='<div class="error">Không thể lưu tài khoản trên thiết bị này.</div>';
 saveUser(u);closeModal();updateAccount();toast('Tạo tài khoản thành công');
}
function loginAccount(e){
 e.preventDefault();
 const email=$('email').value.trim().toLowerCase(),p=$('password').value;
 const u=getAccounts().find(x=>String(x.email).toLowerCase()===email&&x.password===p);
 if(!u)return $('authMsg').innerHTML='<div class="error">Email hoặc mật khẩu không đúng.</div>';
 if(u.banned)return $('authMsg').innerHTML='<div class="error"><b>Tài khoản đã bị khóa.</b><br>Lý do: '+esc(u.banReason||'Không nêu lý do')+'</div>';
 const {password,...safe}=u;saveUser(safe);closeModal();updateAccount();toast('Đăng nhập thành công');
}
const GOOGLE_CLIENT_ID='YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';const GOOGLE_AUTH_ENDPOINT='/api/auth/google';
function initGoogleLogin(attempt=0){const host=$('googleButton');if(!host)return;if(!window.google?.accounts?.id){if(attempt<8)setTimeout(()=>initGoogleLogin(attempt+1),500);return}if(GOOGLE_CLIENT_ID.startsWith('YOUR_')){const b=$('googleFallback');if(b&&!b.dataset.bound){b.dataset.bound='1';b.addEventListener('click',()=>{const m=$('authMsg');if(m)m.innerHTML='<div class=\"error\">Google Login chưa được cấu hình cho bản demo này.</div>'});}return}host.innerHTML='';google.accounts.id.initialize({client_id:GOOGLE_CLIENT_ID,callback:handleGoogleCredential});google.accounts.id.renderButton(host,{theme:'outline',size:'large',width:320,text:'signin_with',shape:'rectangular'})}
async function handleGoogleCredential(response){try{const r=await fetch(GOOGLE_AUTH_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},credentials:'include',body:JSON.stringify({credential:response.credential})});if(!r.ok)throw new Error('auth failed');const data=await r.json();if(!data.user)throw new Error('invalid response');saveUser(data.user);closeModal();updateAccount()}catch(err){const m=$('authMsg');if(m)m.innerHTML='<div class="error">Google Login chưa được kết nối với máy chủ.</div>';console.error(err)}}
const DEFAULT_SETTINGS={theme:'dark',language:'vi',autoplay:false,quality:'auto',subtitle:true,notifications:true,saveHistory:true,reduceMotion:false};
function getSettings(){return {...DEFAULT_SETTINGS,...readJSON('phimhayvietsub_settings',{})}}
function saveSettings(s){storageSet('phimhayvietsub_settings',JSON.stringify(s));applySettings(s)}
function applySettings(s=getSettings()){const systemLight=typeof window.matchMedia==='function'&&window.matchMedia('(prefers-color-scheme: light)').matches;const theme=s.theme==='system'?(systemLight?'light':'dark'):(['light','dark'].includes(s.theme)?s.theme:'dark');document.documentElement.dataset.theme=theme;document.documentElement.lang=s.language==='en'?'en':'vi';document.body.classList.toggle('reduce-motion',!!s.reduceMotion)}
function settingsModal(){
 if(!user){auth('login');return}
 const s=getSettings();
 const info=ROLE_INFO[user.role]||ROLE_INFO.USER;
 const roleActions=info.actions||[];
 openModal(`<div class="compact-settings">
   <div class="settings-top"><button class="settings-back" id="settingsBack">‹</button><div><b>Cài đặt</b><small>PhimHayVietSub</small></div><button class="settings-close" id="settingsClose">×</button></div>
   <section class="settings-account-card"><div class="settings-avatar">${user.avatar?`<img src="${esc(user.avatar)}" alt="Avatar">`:esc((user.name||'U').trim().split(/\s+/).map(x=>x[0]).join('').slice(0,2).toUpperCase())}</div><div class="settings-account-main"><b>${verifiedName(user,'Tài khoản')}</b><span>@${esc(String(user.username||slugUsername(user.name,user.id)).replace(/^@+/,''))}</span><small>${info.icon} ${esc(info.label)}</small></div><button class="settings-mini" id="settingsEdit">Chỉnh sửa</button></section>
   <section class="settings-section compact"><div class="settings-section-title">🛡️ Chức năng vai trò</div><div class="role-summary"><span class="role-summary-icon">${info.icon}</span><div><b>${esc(info.label)}</b><small>${esc(info.desc)}</small></div></div><div class="role-quick-actions">${roleActions.map(a=>`<button class="role-quick" data-setting-role="${esc(a[2])}"><span>${a[0]}</span><b>${esc(a[1])}</b></button>`).join('')}</div>${user.role==='OWNER'?'<button class="owner-admin-shortcut" id="settingsOwnerPanel">👑 Mở Admin Panel</button>':''}</section>
   <section class="settings-section compact"><div class="settings-section-title">🎨 Giao diện</div><div class="settings-line"><span>Chủ đề</span><select id="setTheme"><option value="dark" ${s.theme==='dark'?'selected':''}>Tối</option><option value="light" ${s.theme==='light'?'selected':''}>Sáng</option><option value="system" ${s.theme==='system'?'selected':''}>Theo thiết bị</option></select></div><label class="settings-line"><span>Giảm chuyển động</span><input type="checkbox" id="setMotion" ${s.reduceMotion?'checked':''}></label></section>
   <section class="settings-section compact"><div class="settings-section-title">▶ Trình phát</div><label class="settings-line"><span>Tự động phát tập tiếp theo</span><input type="checkbox" id="setAutoplay" ${s.autoplay?'checked':''}></label><label class="settings-line"><span>Phụ đề mặc định</span><input type="checkbox" id="setSubtitle" ${s.subtitle?'checked':''}></label><div class="settings-line"><span>Chất lượng</span><select id="setQuality"><option value="auto" ${s.quality==='auto'?'selected':''}>Tự động</option><option value="1080p" ${s.quality==='1080p'?'selected':''}>1080p</option><option value="720p" ${s.quality==='720p'?'selected':''}>720p</option><option value="480p" ${s.quality==='480p'?'selected':''}>480p</option></select></div></section>
   <section class="settings-section compact"><div class="settings-section-title">🔔 Thông báo & dữ liệu</div><label class="settings-line"><span>Thông báo phim mới</span><input type="checkbox" id="setNotifications" ${s.notifications?'checked':''}></label><label class="settings-line"><span>Lưu lịch sử xem</span><input type="checkbox" id="setHistory" ${s.saveHistory?'checked':''}></label><div class="settings-button-row"><button class="settings-secondary" id="clearHistory">Xóa lịch sử</button><button class="settings-danger" id="resetSettings">Đặt lại</button></div></section>
   <button class="settings-save" id="saveSettingsBtn">Lưu cài đặt</button>
 </div>`);
 $('settingsBack')?.addEventListener('click',profileModal);$('settingsClose')?.addEventListener('click',closeModal);$('settingsEdit')?.addEventListener('click',editProfileModal);
 document.querySelectorAll('[data-setting-role]').forEach(b=>b.onclick=()=>roleAction(b.dataset.settingRole));
 $('settingsOwnerPanel')?.addEventListener('click',ownerPanel);
 $('saveSettingsBtn')?.addEventListener('click',()=>{saveSettings({theme:$('setTheme').value,language:s.language,autoplay:$('setAutoplay').checked,quality:$('setQuality').value,subtitle:$('setSubtitle').checked,notifications:$('setNotifications').checked,saveHistory:$('setHistory').checked,reduceMotion:$('setMotion').checked});closeModal();toast('Đã lưu cài đặt')});
 $('setTheme')?.addEventListener('change',()=>applySettings({...getSettings(),theme:$('setTheme').value}));
 $('clearHistory')?.addEventListener('click',()=>{storageRemove('phimhayvietsub_history');toast('Đã xóa lịch sử xem')});
 $('resetSettings')?.addEventListener('click',()=>{saveSettings(DEFAULT_SETTINGS);settingsModal()});
}
function fileToDataURL(file){return new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(file)})}
function persistMovies(){storageSet('phimhayvietsub_movies',JSON.stringify(movies))}
function addMovieModal(){
 if(!ownerGuard())return;
 openModal(`<div class="movie-edit"><div class="eyebrow">🎬 QUẢN LÝ PHIM</div><h2 class="auth-title">Thêm bộ phim</h2><p class="muted">Tải poster từ thiết bị và thêm phim vào hệ thống.</p><form id="addMovieForm" class="form"><div class="field"><label>TÊN PHIM</label><input id="movieTitle" required maxlength="80" placeholder="Tên phim"></div><div class="field"><label>NĂM</label><input id="movieYear" type="number" min="1900" max="2100" value="2026" required></div><div class="field"><label>THỂ LOẠI</label><input id="movieGenre" required placeholder="Anime, Hành động"></div><div class="field"><label>ĐIỂM ĐÁNH GIÁ</label><input id="movieRating" type="number" min="0" max="5" step="0.1" value="5"></div><div class="field"><label>MÔ TẢ</label><textarea id="movieDesc" rows="4" maxlength="500" placeholder="Mô tả phim..."></textarea></div><div class="field"><label>ẢNH BỘ PHIM / POSTER</label><input id="moviePoster" type="file" accept="image/png,image/jpeg,image/webp,image/gif" required><small class="upload-help">JPG, PNG, WEBP hoặc GIF · tối đa 4 MB</small></div><div class="field"><label>SỐ TẬP</label><input id="movieEpisodes" type="number" min="1" max="500" value="1"></div><button class="submit" type="submit">➕ Thêm phim</button><button class="btn" type="button" id="backAdminFromMovie">← Quay lại Admin Panel</button></form></div>`);
 $('addMovieForm').onsubmit=async e=>{
  e.preventDefault();
  const file=$('moviePoster').files?.[0];
  if(!file)return toast('Hãy chọn ảnh poster');
  if(file.size>4*1024*1024)return toast('Ảnh phim tối đa 4 MB');
  const title=$('movieTitle').value.trim(),genre=$('movieGenre').value.split(',').map(x=>x.trim()).filter(Boolean);
  if(title.length<1||!genre.length)return toast('Vui lòng nhập tên và ít nhất một thể loại');
  try{
   const poster=await fileToDataURL(file),count=Math.max(1,Math.min(500,Number($('movieEpisodes').value)||1));
   movies.push(normalizeMovie({id:`movie-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,title,year:Number($('movieYear').value)||2026,genre,rating:Math.max(0,Math.min(5,Number($('movieRating').value)||0)),poster,desc:$('movieDesc').value.trim(),badges:[],episodes:Array.from({length:count},(_,i)=>i+1),status:'pending',authorId:user?.id||'',authorName:user?.name||''}));
   if(!storageSet('phimhayvietsub_movies',JSON.stringify(movies)))return toast('Không đủ bộ nhớ để lưu phim');
   closeModal();renderRails();toast('Đã thêm phim mới — đang chờ duyệt');ownerPanel();
  }catch(err){console.error(err);toast('Không thể đọc ảnh hoặc lưu bộ phim');}
 };
 $('backAdminFromMovie').onclick=ownerPanel;
}
function profileModal(){
 if(!user){auth('login');return}
 refreshCurrentAccount();
 const info=ROLE_INFO[user.role]||ROLE_INFO.USER;
 const handle=String(user.username||slugUsername(user.name,user.id)).replace(/^@+/,'');
 const following=followingCount(user.id),followers=followerCount(user.id),likes=likedCount(user.id);
 const initials=(user.name||'U').trim().split(/\s+/).slice(0,2).map(x=>x[0]).join('').toUpperCase();
 const profileMovies=profileContentMovies(user.id);
 const avatar=user.avatar?`<img class="social-avatar-img" src="${esc(user.avatar)}" alt="Avatar">`:`<div class="social-avatar-fallback">${esc(initials||'U')}</div>`;
 const verified=isVerified(user)?verificationBadge():'';
 const renderPosts=()=>profileMovies.length?profileMovies.map(m=>`<button class="social-post" data-movie-id="${esc(m.id)}"><span class="social-post-image" style="background-image:url('${esc(m.poster)}')"></span><span class="social-post-meta">▶ ${m.episodes?.length||1}</span></button>`).join(''):`<div class="social-empty"><div>＋</div><b>Chưa có nội dung</b><small>Nội dung do tài khoản này đăng sẽ xuất hiện ở đây.</small></div>`;
 const renderLiked=()=>{const ids=[];const data=getLikes();Object.entries(data).forEach(([id,list])=>{if(Array.isArray(list)&&list.some(x=>String(x)===String(user.id)))ids.push(id)});const liked=ids.map(id=>movies.find(m=>String(m.id)===String(id))).filter(Boolean);return liked.length?liked.map(m=>`<button class="social-post" data-movie-id="${esc(m.id)}"><span class="social-post-image" style="background-image:url('${esc(m.poster)}')"></span><span class="social-post-meta">♥</span></button>`).join(''):`<div class="social-empty"><div>♡</div><b>Chưa có phim đã thích</b><small>Phim bạn bấm thích sẽ xuất hiện ở đây.</small></div>`};
 const renderHistory=()=>{const h=readJSON('phimhayvietsub_history',[]);const seen=[];h.forEach(x=>{const m=movies.find(m=>String(m.id)===String(x.id));if(m&&!seen.some(y=>String(y.id)===String(m.id)))seen.push(m)});return seen.length?seen.map(m=>`<button class="social-post" data-movie-id="${esc(m.id)}"><span class="social-post-image" style="background-image:url('${esc(m.poster)}')"></span><span class="social-post-meta">🕘</span></button>`).join(''):`<div class="social-empty"><div>🕘</div><b>Chưa có lịch sử xem</b><small>Bật “Lưu lịch sử xem” trong Cài đặt để sử dụng.</small></div>`};
 const renderDubbing=()=>{const list=myDubbingSubmissions().filter(v=>v.status==='approved');return list.length?list.map(v=>`<button class="social-post dubbing-post" data-dub-id="${esc(v.id)}"><span class="social-post-image" style="background-image:url('${esc(v.thumb||'')}')">${v.thumb?'':'🎙️'}</span><span class="social-post-meta">▶</span></button>`).join(''):`<div class="social-empty"><div>🎙️</div><b>Chưa có video lồng tiếng</b><small>Video được duyệt sẽ xuất hiện ở đây.</small></div>`};
 openModal(`<div class="social-profile account-compact">
   <div class="social-profile-top"><button class="social-icon-btn" id="profileBackHome" aria-label="Đóng">‹</button><div class="social-top-title">Tài khoản</div><button class="social-icon-btn settings-top-btn" id="profileTopSettings" aria-label="Cài đặt">⚙</button></div>
   <div class="social-profile-main">
    <div class="social-profile-summary"><div class="social-profile-info"><div class="social-profile-name">${esc(user.name||'Tài khoản')} ${verified}</div><div class="social-profile-handle">@${esc(handle)}</div><div class="social-profile-badges"><span>${info.icon} ${esc(info.label)}</span>${user.role==='OWNER'?'<span>👑 OWNER</span>':''}</div><div class="social-bio">${esc(user.bio||'Chưa có giới thiệu.')}</div></div><button class="social-avatar-ring account-avatar-button" id="profileAvatarEdit" aria-label="Đổi avatar">${avatar}<span class="social-avatar-plus">+</span></button></div>
    <div class="social-stats"><button id="profileFollowing"><b>${following}</b><span>Đã follow</span></button><button id="profileFollowers"><b>${followers}</b><span>Follower</span></button><button id="profileLikes"><b>${likes}</b><span>Thích</span></button></div>
    <div class="social-action-row"><button class="social-pill primary" id="editProfileFull">✏️ Chỉnh sửa</button><button class="social-pill" id="profileShare">↗ Chia sẻ</button></div>
   </div>
   <div class="social-highlights account-highlights"><button class="highlight" id="highlightEdit"><span>✏️</span><small>Hồ sơ</small></button><button class="highlight" id="highlightRole"><span>${info.icon}</span><small>Vai trò</small></button><button class="highlight" id="highlightDub"><span>🎙️</span><small>Lồng tiếng</small></button><button class="highlight" id="highlightHistory"><span>🕘</span><small>Lịch sử</small></button></div>
   <div class="social-tabs"><button class="social-tab active" data-tab="posts">▦<small>Phim</small></button><button class="social-tab" data-tab="dubbing">🎙️<small>Lồng tiếng</small></button><button class="social-tab" data-tab="likes">♡<small>Đã thích</small></button><button class="social-tab" data-tab="history">◷<small>Lịch sử</small></button></div>
   <div class="social-feed" id="socialFeed">${renderPosts()}</div>
   <div class="social-profile-footer"><button id="profileRole">${info.icon} Chức năng vai trò</button><button id="profileLogout">Đăng xuất</button></div>
 </div>`);
 const bindFeed=()=>document.querySelectorAll('.social-post').forEach(b=>b.onclick=()=>showMovie(b.dataset.movieId));
 $('profileBackHome').onclick=closeModal;
 $('profileTopSettings').onclick=settingsModal;
 $('profileAvatarEdit').onclick=editProfileModal;
 $('editProfileFull').onclick=editProfileModal;
 $('profileShare').onclick=()=>{const text=`${user.name||'Tài khoản'} @${handle}`;if(navigator.share)navigator.share({title:text,text}).catch(()=>{});else{navigator.clipboard?.writeText(text);toast('Đã sao chép thông tin hồ sơ')}};
 $('highlightEdit').onclick=editProfileModal;
 $('highlightRole').onclick=roleSpecificPanel;
 $('highlightMovies')?.addEventListener('click',()=>{closeModal();document.getElementById('movies')?.scrollIntoView({behavior:'smooth'})});
 $('highlightDub').onclick=dubbingSubmissionPanel;
 $('highlightHistory').onclick=()=>roleAction('history');
 $('profileFollowing').onclick=()=>openSimpleAccountList('following');
 $('profileFollowers').onclick=()=>openSimpleAccountList('followers');
 $('profileLikes').onclick=()=>{document.querySelector('.social-tab[data-tab="likes"]')?.click()};
 $('profileRole').onclick=roleSpecificPanel;
 $('profileLogout').onclick=()=>{clearUser();closeModal();updateAccount();toast('Đã đăng xuất')};
 document.querySelectorAll('.social-tab').forEach(tab=>tab.onclick=()=>{
   document.querySelectorAll('.social-tab').forEach(x=>x.classList.remove('active'));tab.classList.add('active');
   const feed=$('socialFeed');if(!feed)return;
   if(tab.dataset.tab==='posts')feed.innerHTML=renderPosts();
   else if(tab.dataset.tab==='dubbing'){feed.innerHTML=renderDubbing();document.querySelectorAll('.dubbing-post').forEach(b=>b.onclick=()=>playDubbingVideo(b.dataset.dubId));return}
   else if(tab.dataset.tab==='likes')feed.innerHTML=renderLiked();
   else feed.innerHTML=renderHistory();
   bindFeed();
 });
 bindFeed();
}
function openSimpleAccountList(type){
 if(!user)return;
 const f=getFollows();let ids=[];
 if(type==='following')ids=Array.isArray(f[String(user.id)])?f[String(user.id)]:[];
 else Object.entries(f).forEach(([uid,list])=>{if(Array.isArray(list)&&list.some(x=>String(x)===String(user.id)))ids.push(uid)});
 const people=ids.map(id=>getAccounts().find(a=>String(a.id)===String(id))).filter(Boolean);
 openModal(`<div class="account-list-modal"><div class="eyebrow">👥 ${type==='following'?'ĐANG FOLLOW':'FOLLOWER'}</div><h2 class="auth-title">${people.length} tài khoản</h2><div class="account-list">${people.length?people.map(a=>`<div class="account-list-item"><div class="settings-avatar">${a.avatar?`<img src="${esc(a.avatar)}" alt="">`:esc((a.name||'U').slice(0,1).toUpperCase())}</div><div><b>${verifiedName(a)}</b><small>@${esc(String(a.username||slugUsername(a.name,a.id)).replace(/^@+/,''))}</small></div></div>`).join(''):'<p class="muted">Chưa có tài khoản nào.</p>'}</div><button class="btn" id="accountListBack">← Quay lại tài khoản</button></div>`);
 $('accountListBack').onclick=profileModal;
}
function editProfileModal(){
 if(!user){auth('login');return}
 const initials=esc((user.name||'U').trim().split(/\s+/).slice(0,2).map(x=>x[0]).join('').toUpperCase()||'U');
 const currentAvatar=user.avatar?`<img id="profileAvatarPreview" src="${esc(user.avatar)}" alt="Ảnh hiện tại">`:`<div id="profileAvatarPreview" class="profile-avatar-fallback">${initials}</div>`;
 openModal(`<div class="profile-edit"><div class="eyebrow">✏️ HỒ SƠ</div><h2 class="auth-title">Chỉnh sửa hồ sơ</h2><p class="muted">Thay ảnh cũ bằng ảnh mới hoặc xóa ảnh hiện tại.</p><form id="profileForm" class="form"><div class="field"><label>TÊN HIỂN THỊ</label><input id="profileName" minlength="2" maxlength="40" required value="${esc(user.name||'')}"></div><div class="field"><label>EMAIL</label><input value="${esc(user.email||'')}" disabled></div><div class="field"><label>GIỚI THIỆU</label><textarea id="profileBio" maxlength="160" rows="4" placeholder="Viết vài dòng về bạn...">${esc(user.bio||'')}</textarea></div><div class="field"><label>ẢNH AVATAR</label><div class="avatar-change-box"><div class="avatar-change-preview">${currentAvatar}</div><div class="avatar-change-actions"><input id="profileAvatar" type="file" accept="image/png,image/jpeg,image/webp,image/gif"><button type="button" class="btn" id="removeProfileAvatar">🗑️ Xóa ảnh hiện tại</button><small class="upload-help">Chọn ảnh mới sẽ tự động thay ảnh cũ. JPG, PNG, WEBP hoặc GIF · tối đa 2 MB.</small></div></div></div><div class="profile-preview"><div class="profile-avatar small">${initials}</div><div><b>${esc((ROLE_INFO[user.role]||ROLE_INFO.USER).label)}</b><small>Vai trò do hệ thống quản lý</small></div></div><button class="submit auth-submit" type="submit">💾 Lưu thay đổi</button><button type="button" class="btn" id="backProfile">← Quay lại hồ sơ</button></form></div>`);
 $('profileAvatar')?.addEventListener('change',async e=>{const file=e.target.files?.[0];if(!file)return;if(file.size>2*1024*1024){e.target.value='';toast('Ảnh avatar tối đa 2 MB');return}if(!file.type.startsWith('image/')){e.target.value='';toast('Chỉ được chọn file ảnh');return}try{const data=await fileToDataURL(file);const preview=$('profileAvatarPreview');if(preview){preview.outerHTML=`<img id="profileAvatarPreview" src="${esc(data)}" alt="Ảnh mới">`}}catch{toast('Không đọc được ảnh')}});
 $('removeProfileAvatar')?.addEventListener('click',()=>{user.avatar='';const preview=$('profileAvatarPreview');if(preview)preview.outerHTML=`<div id="profileAvatarPreview" class="profile-avatar-fallback">${initials}</div>`;const input=$('profileAvatar');if(input)input.value='';toast('Đã chọn xóa ảnh cũ — bấm Lưu thay đổi để áp dụng')});
 $('profileForm').onsubmit=async e=>{e.preventDefault();const file=$('profileAvatar')?.files?.[0];if(file){if(file.size>2*1024*1024){toast('Ảnh avatar tối đa 2 MB');return}if(!file.type.startsWith('image/')){toast('Chỉ được chọn file ảnh');return}try{user.avatar=await fileToDataURL(file)}catch{toast('Không đọc được ảnh');return}}user.name=$('profileName').value.trim();user.bio=$('profileBio').value.trim();user.username=String(user.username||slugUsername(user.name,user.id)).replace(/^@+/,'');const accounts=getAccounts();const a=accounts.find(x=>String(x.id)===String(user.id));if(a){a.name=user.name;a.username=user.username||slugUsername(user.name,user.id);a.bio=user.bio;a.avatar=user.avatar||'';if(a.role==='OWNER'){a.verified=true;a.verifiedAt=a.verifiedAt||Date.now()}if(!storageSet('phimhayvietsub_accounts',JSON.stringify(accounts))){toast('Không đủ bộ nhớ để lưu hồ sơ');return}}saveUser(user);updateAccount();profileModal();toast('Đã cập nhật hồ sơ và ảnh')};
 $('backProfile').onclick=profileModal;
}
function toast(msg){const old=document.querySelector('.pv-toast');if(old)old.remove();const t=document.createElement('div');t.className='pv-toast';t.textContent=msg;document.body.appendChild(t);setTimeout(()=>t.remove(),2200)}

function updateAccount(){refreshCurrentAccount();const login=$('loginBtn'),register=$('registerBtn');if(!login||!register)return;if(user){login.innerHTML=user.role==='OWNER'?'👑 '+esc(user.name||'Chủ Website'):(verifiedName(user,'Tài khoản'));login.setAttribute('aria-label','Mở hồ sơ tài khoản');login.onclick=openAccount;register.textContent='Đăng xuất';register.onclick=()=>{clearUser();updateAccount();toast('Đã đăng xuất')}}else{login.textContent='Đăng nhập';register.textContent='Đăng ký';login.onclick=()=>auth('login');register.onclick=()=>auth('register')}}

const ROLE_INFO={
 USER:{label:'Thành viên',icon:'👤',desc:'Xem phim, đánh giá, yêu thích và gửi video lồng tiếng chờ duyệt.',actions:[['🎬','Xem phim','showMovies'],['🎙️','Đăng video lồng tiếng','voiceUpload'],['⭐','Đánh giá & yêu thích','favorites'],['🕘','Lịch sử xem','history'],['⚙','Cài đặt','settings']]},
 VIP:{label:'VIP',icon:'💎',desc:'Quyền thành viên nâng cao và khu vực nội dung VIP.',actions:[['🎬','Xem phim VIP','showMovies'],['💎','Kho VIP','vip'],['⭐','Đánh giá & yêu thích','favorites'],['🕘','Lịch sử xem','history'],['⚙','Cài đặt','settings']]},
 VOICE_ACTOR:{label:'Diễn viên lồng tiếng',icon:'🎙️',desc:'Quản lý hồ sơ giọng, vai diễn và nội dung lồng tiếng được giao.',actions:[['🎙️','Hồ sơ lồng tiếng','voiceProfile'],['📋','Vai diễn được giao','voiceRoles'],['⬆️','Gửi bản lồng tiếng','voiceUpload'],['🎬','Phim đang tham gia','showMovies'],['⚙','Cài đặt','settings']]},
 FILM_REVIEWER:{label:'Duyệt phim',icon:'🛡️',desc:'Kiểm tra nội dung và xử lý danh sách phim chờ duyệt.',actions:[['📋','Danh sách chờ duyệt','reviewQueue'],['🔎','Kiểm tra phim','reviewCheck'],['✅','Lịch sử duyệt','reviewHistory'],['⚙','Cài đặt','settings']]},
 DIRECTOR:{label:'Đạo diễn',icon:'🎬',desc:'Quản lý dự án, tập phim, phân công lồng tiếng và tiến độ.',actions:[['🎬','Dự án của tôi','directorProjects'],['📺','Quản lý tập phim','episodes'],['🎙️','Phân công lồng tiếng','cast'],['📊','Tiến độ dự án','progress'],['⚙','Cài đặt','settings']]},
 OWNER:{label:'Chủ Website',icon:'👑',desc:'Toàn quyền quản trị hệ thống, thành viên, nội dung và cấu hình.',actions:[['👑','Admin Panel','owner'],['🎬','Quản lý phim','showMovies'],['👥','Quản lý thành viên','accounts'],['⚙','Cài đặt website','settings']]}
};

/* ===== Community dubbing uploads =====
   Metadata stays in localStorage; video blobs stay in IndexedDB so large files do not
   exhaust LocalStorage. Every submission starts as pending and needs OWNER approval. */
const DUB_DB='phimhayvietsub_dubbing_db', DUB_STORE='videos', DUB_META='phimhayvietsub_dubbing_submissions';
function dubbingSubmissions(){return readJSON(DUB_META,[])||[]}
function saveDubbingSubmissions(list){return storageSet(DUB_META,JSON.stringify(list))}
function openDubbingDB(){return new Promise((resolve,reject)=>{if(!('indexedDB' in window))return reject(new Error('IndexedDB unavailable'));const req=indexedDB.open(DUB_DB,1);req.onupgradeneeded=()=>{const db=req.result;if(!db.objectStoreNames.contains(DUB_STORE))db.createObjectStore(DUB_STORE)};req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error||new Error('IndexedDB error'))})}
function idbPutVideo(id,blob){return openDubbingDB().then(db=>new Promise((resolve,reject)=>{const tx=db.transaction(DUB_STORE,'readwrite');tx.objectStore(DUB_STORE).put(blob,id);tx.oncomplete=()=>{db.close();resolve(true)};tx.onerror=()=>{db.close();reject(tx.error)}}))}
function idbGetVideo(id){return openDubbingDB().then(db=>new Promise((resolve,reject)=>{const tx=db.transaction(DUB_STORE,'readonly');const req=tx.objectStore(DUB_STORE).get(id);req.onsuccess=()=>{db.close();resolve(req.result||null)};req.onerror=()=>{db.close();reject(req.error)}}))}
function idbDeleteVideo(id){return openDubbingDB().then(db=>new Promise((resolve,reject)=>{const tx=db.transaction(DUB_STORE,'readwrite');tx.objectStore(DUB_STORE).delete(id);tx.oncomplete=()=>{db.close();resolve(true)};tx.onerror=()=>{db.close();reject(tx.error)}}))}
function dubbingStatusLabel(s){return s==='approved'?'Đã duyệt':s==='rejected'?'Từ chối':'Chờ duyệt'}
function dubbingStatusClass(s){return s==='approved'?'approved':s==='rejected'?'rejected':'pending'}
function addDubbingVideoModal(){
 if(!user)return auth('login');
 const approved=movies.filter(m=>m.status==='approved');
 openModal(`<div class="upload-panel"><div class="eyebrow">🎙️ CỘNG ĐỒNG LỒNG TIẾNG</div><h2 class="auth-title">Đăng video lồng tiếng</h2><p class="muted">Thành viên thường cũng có thể gửi video. Nội dung sẽ được kiểm tra trước khi hiển thị công khai.</p><form id="dubbingForm" class="form">
 <div class="field"><label>TÊN VIDEO</label><input id="dubTitle" maxlength="100" required placeholder="Ví dụ: Shadow House — Tập 1"></div>
 <div class="field"><label>PHIM LIÊN QUAN</label><select id="dubMovie"><option value="">Video độc lập</option>${approved.map(m=>`<option value="${esc(m.id)}">${esc(m.title)}</option>`).join('')}</select></div>
 <div class="field"><label>MÔ TẢ</label><textarea id="dubDesc" rows="3" maxlength="500" placeholder="Giới thiệu ngắn về video..."></textarea></div>
 <div class="field"><label>FILE VIDEO</label><input id="dubVideo" type="file" accept="video/mp4,video/webm,video/quicktime" required><small class="upload-help">MP4, WebM hoặc MOV · tối đa 40 MB</small></div>
 <div class="field"><label>ẢNH ĐẠI DIỆN (TÙY CHỌN)</label><input id="dubThumb" type="file" accept="image/png,image/jpeg,image/webp"><small class="upload-help">Tối đa 2 MB</small></div>
 <div class="upload-notice">⏳ Sau khi gửi, video có trạng thái <b>Chờ duyệt</b>. Chỉ video được duyệt mới xuất hiện công khai.</div>
 <button class="submit" type="submit">📤 Gửi chờ duyệt</button><button class="btn" type="button" id="cancelDubUpload">Hủy</button></form></div>`);
 $('cancelDubUpload').onclick=profileModal;
 $('dubbingForm').onsubmit=async e=>{e.preventDefault();const video=$('dubVideo').files?.[0];if(!video)return toast('Hãy chọn video');if(video.size>40*1024*1024)return toast('Video tối đa 40 MB');if(!video.type.startsWith('video/'))return toast('File không phải video');
  const title=$('dubTitle').value.trim();if(title.length<2)return toast('Tên video quá ngắn');
  const id=`dub-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;let thumb='';const tf=$('dubThumb').files?.[0];if(tf){if(tf.size>2*1024*1024)return toast('Ảnh đại diện tối đa 2 MB');try{thumb=await fileToDataURL(tf)}catch{return toast('Không đọc được ảnh')}}
  const meta={id,title,desc:$('dubDesc').value.trim(),movieId:$('dubMovie').value||'',authorId:String(user.id),authorName:String(user.name||'Thành viên'),authorUsername:String(user.username||''),thumb,status:'pending',createdAt:Date.now(),reviewedAt:null};
  try{await idbPutVideo(id,video);const list=dubbingSubmissions();list.unshift(meta);if(!saveDubbingSubmissions(list)){await idbDeleteVideo(id);return toast('Không đủ bộ nhớ để lưu video')}closeModal();toast('Đã gửi video — đang chờ duyệt');}catch(err){console.error(err);toast('Thiết bị không hỗ trợ lưu video hoặc bộ nhớ không đủ')}};
}
async function playDubbingVideo(id){const meta=dubbingSubmissions().find(x=>String(x.id)===String(id));if(!meta)return;try{const blob=await idbGetVideo(id);if(!blob)return toast('Không tìm thấy file video');const url=URL.createObjectURL(blob);openModal(`<div class="video-view"><div class="eyebrow">🎙️ ${meta.status==='approved'?'ĐÃ DUYỆT':'VIDEO CỦA BẠN'}</div><h2 class="auth-title">${esc(meta.title)}</h2><video class="dubbing-player" src="${url}" controls playsinline preload="metadata"></video><p class="muted">${esc(meta.desc||'')}</p><button class="btn" id="closeDubPlayer">Đóng</button></div>`);$('closeDubPlayer').onclick=()=>{URL.revokeObjectURL(url);closeModal()};}catch{toast('Không thể mở video')}}
function myDubbingSubmissions(){return dubbingSubmissions().filter(x=>String(x.authorId)===String(user?.id)).sort((a,b)=>b.createdAt-a.createdAt)}
function dubbingSubmissionPanel(){
 const list=myDubbingSubmissions();
 openModal(`<div class="role-workspace"><div class="workspace-head"><div><div class="eyebrow">🎙️ LỒNG TIẾNG</div><h2 class="auth-title">Video của tôi</h2><p class="muted">Tài khoản nào cũng được gửi video; hệ thống duyệt trước khi công khai.</p></div><span class="role-pill">${list.length} video</span></div><button class="btn gradient upload-main-btn" id="newDubbingVideo">＋ Đăng video lồng tiếng</button><div class="dubbing-my-list">${list.length?list.map(v=>`<button class="dubbing-row" data-dub-id="${esc(v.id)}"><span class="dub-thumb" style="background-image:url('${esc(v.thumb||'')}')">${v.thumb?'':'🎙️'}</span><span><b>${esc(v.title)}</b><small>${esc(dubbingStatusLabel(v.status))} · ${new Date(v.createdAt).toLocaleDateString('vi-VN')}</small></span><em class="dub-status ${dubbingStatusClass(v.status)}">${esc(dubbingStatusLabel(v.status))}</em></button>`).join(''):'<div class="social-empty"><div>🎙️</div><b>Chưa có video</b><small>Hãy gửi video lồng tiếng đầu tiên.</small></div>'}</div><button class="btn ghost" id="backDubProfile">← Tài khoản</button></div>`);
 $('newDubbingVideo').onclick=addDubbingVideoModal;$('backDubProfile').onclick=profileModal;document.querySelectorAll('.dubbing-row').forEach(b=>b.onclick=()=>playDubbingVideo(b.dataset.dubId));
}

function roleAction(type){
 if(type==='settings')return settingsModal();
 if(type==='owner')return ownerPanel();
 if(type==='showMovies'){closeModal();$('movies')?.scrollIntoView({behavior:'smooth'});return}
 if(type==='history'){
   const h=readJSON('phimhayvietsub_history',[]);const seen=[];h.forEach(x=>{const m=movies.find(m=>String(m.id)===String(x.id));if(m&&!seen.some(y=>String(y.id)===String(m.id)))seen.push(m)});
   openModal(`<div class="role-workspace"><div class="eyebrow">🕘 LỊCH SỬ XEM</div><h2 class="auth-title">Lịch sử của tôi</h2><p class="muted">${seen.length} phim đã xem trên thiết bị này.</p><div class="role-movie-list">${seen.length?seen.map(m=>`<button class="role-movie-row" data-id="${esc(m.id)}"><span style="background-image:url('${esc(m.poster)}')"></span><b>${esc(m.title)}</b><small>▶ ${m.episodes?.length||1} tập</small></button>`).join(''):'<p class="muted">Chưa có lịch sử xem.</p>'}</div><button class="btn" id="roleBackProfile">← Tài khoản</button></div>`);
   document.querySelectorAll('.role-movie-row').forEach(b=>b.onclick=()=>showMovie(b.dataset.id));$('roleBackProfile')?.addEventListener('click',profileModal);return;
 }
 if(type==='favorites'||type==='vip'){
   const liked=[];const data=getLikes();Object.entries(data).forEach(([id,list])=>{if(Array.isArray(list)&&list.some(x=>String(x)===String(user.id))){const m=movies.find(x=>String(x.id)===String(id));if(m&&(!type||type==='favorites'||m.badges?.includes('VIP')))liked.push(m)}});
   const list=type==='vip'?movies.filter(m=>m.badges?.includes('VIP')&&m.status==='approved'):liked;
   openModal(`<div class="role-workspace"><div class="eyebrow">${type==='vip'?'💎 VIP':'⭐ YÊU THÍCH'}</div><h2 class="auth-title">${type==='vip'?'Kho VIP':'Phim đã thích'}</h2><div class="role-movie-list">${list.length?list.map(m=>`<button class="role-movie-row" data-id="${esc(m.id)}"><span style="background-image:url('${esc(m.poster)}')"></span><b>${esc(m.title)}</b><small>★ ${m.rating.toFixed(1)}</small></button>`).join(''):'<p class="muted">Chưa có nội dung.</p>'}</div><button class="btn" id="roleBackProfile">← Tài khoản</button></div>`);
   document.querySelectorAll('.role-movie-row').forEach(b=>b.onclick=()=>showMovie(b.dataset.id));$('roleBackProfile')?.addEventListener('click',profileModal);return;
 }
 if(type==='voiceUpload')return dubbingSubmissionPanel();
 if(['voiceProfile','voiceRoles','directorProjects','episodes','cast','progress'].includes(type))return roleSpecificPanel();
 if(['reviewQueue','reviewCheck','reviewHistory'].includes(type)){
   if(user.role==='FILM_REVIEWER')return reviewerPanel(type);
   if(user.role==='OWNER')return ownerPanel();
   toast('Chức năng này cần vai trò Duyệt phim');return;
 }
 if(type==='accounts'){return user.role==='OWNER'?ownerPanel():toast('Chỉ Chủ Website mới được quản lý tài khoản');}
 rolePanel();
}
function rolePanel(){
 if(!user)return auth('login'); const info=ROLE_INFO[user.role]||ROLE_INFO.USER;
 openModal(`<div class="role-panel"><div class="workspace-head"><div><div class="eyebrow">${info.icon} ${esc(info.label)}</div><h2 class="auth-title">Bảng vai trò của tôi</h2><p class="muted">${esc(info.desc)}</p></div><span class="role-pill">${esc(info.label)}</span></div><div class="role-actions">${info.actions.map(a=>`<button class="btn role-action" data-role-action="${a[2]}"><span>${a[0]}</span>${esc(a[1])}</button>`).join('')}</div><div class="role-permission"><b>Quyền hiện tại:</b> ${esc(info.label)} · Chức năng hiển thị theo tài khoản.</div><button class="btn ghost" id="roleBackProfile">← Hồ sơ</button></div>`);
 document.querySelectorAll('[data-role-action]').forEach(b=>b.onclick=()=>roleAction(b.dataset.roleAction)); $('roleBackProfile')?.addEventListener('click',profileModal);
}
function reviewerPanel(mode='reviewQueue'){
 if(!user || user.role!=='FILM_REVIEWER'){toast('Chỉ vai trò Duyệt phim mới được mở khu này');return}
 const pending=movies.filter(m=>m.status==='pending');
 const approved=movies.filter(m=>m.status==='approved');
 const rejected=movies.filter(m=>m.status==='rejected');
 const list=mode==='reviewHistory'?[...approved,...rejected]:pending;
 const title=mode==='reviewHistory'?'Lịch sử duyệt':mode==='reviewCheck'?'Kiểm tra phim':'Danh sách chờ duyệt';
 openModal(`<div class="role-panel"><div class="workspace-head"><div><div class="eyebrow">🛡️ DUYỆT PHIM</div><h2 class="auth-title">${title}</h2><p class="muted">Chỉ xử lý nội dung phim; không có quyền quản lý tài khoản.</p></div><span class="role-pill">${pending.length} chờ</span></div><div class="role-movie-list">${list.length?list.map(m=>`<div class="role-movie-row reviewer-row"><span style="background-image:url('${esc(m.poster)}')"></span><div><b>${esc(m.title)}</b><small>${m.year} · ${esc(m.genre.join(' · '))} · ${m.status==='pending'?'⏳ Chờ duyệt':m.status==='approved'?'✅ Đã duyệt':'❌ Từ chối'}</small></div><div class="review-actions">${m.status==='pending'?`<button class="btn small-btn approve-review" data-id="${esc(m.id)}">Duyệt</button><button class="btn small-btn danger-btn reject-review" data-id="${esc(m.id)}">Từ chối</button>`:`<button class="btn small-btn view-review" data-id="${esc(m.id)}">Xem</button>`}</div></div>`).join(''):'<p class="muted">Không có nội dung trong mục này.</p>'}</div><button class="btn ghost" id="reviewBack">← Vai trò</button></div>`);
 $('reviewBack').onclick=rolePanel;
 document.querySelectorAll('.approve-review').forEach(b=>b.onclick=()=>reviewMovieByReviewer(b.dataset.id,'approved'));
 document.querySelectorAll('.reject-review').forEach(b=>b.onclick=()=>reviewMovieByReviewer(b.dataset.id,'rejected'));
 document.querySelectorAll('.view-review').forEach(b=>b.onclick=()=>{closeModal();showMovie(b.dataset.id)});
}
function reviewMovieByReviewer(id,status){if(!user||user.role!=='FILM_REVIEWER')return;const m=movieById(id);if(!m||m.status!=='pending')return;m.status=status;persistMovies();renderRails();toast(status==='approved'?'Đã duyệt phim':'Đã từ chối phim');reviewerPanel('reviewQueue')}

function ownerGuard(){if(!user||user.role!=='OWNER'){toast('Chỉ Chủ Website mới được mở Admin Panel');return false}return true}
function verificationBadge(){
 return '<span class="verified-badge" title="Tài khoản đã được Chủ Website xác minh" aria-label="Đã xác minh">✓</span>';
}
function isVerified(account){ return !!account?.verified; }
function verifiedName(account, fallback='Không tên'){
 const name=esc(account?.name||fallback);
 return name+(isVerified(account)?' '+verificationBadge():'');
}
function setVerification(id, verified){
 if(!ownerGuard())return;
 const arr=getAccounts();
 const a=arr.find(x=>String(x.id)===String(id));
 if(!a || a.role==='OWNER')return;
 a.verified=!!verified;
 a.verifiedAt=verified?Date.now():null;
 storageSet('phimhayvietsub_accounts',JSON.stringify(arr));
 if(user && String(user.id)===String(a.id)){
   const {password,...safe}=a; saveUser(safe); updateAccount();
 }
 toast(verified?'Đã cấp tích xanh':'Đã gỡ tích xanh');
 ownerPanel();
}

function ownerPanel(){
 if(!ownerGuard())return;
 const accounts=getAccounts();
 const history=readJSON('phimhayvietsub_history',[]);
 const pending=movies.filter(m=>m.status==='pending');
 const pendingDubbing=dubbingSubmissions().filter(v=>v.status==='pending');
 const banned=accounts.filter(a=>a.banned);
 openModal(`<div class="admin-wrap">
   <div class="admin-head"><div><div class="eyebrow">👑 OWNER CONTROL CENTER</div><h2 class="auth-title">Admin Panel</h2><p class="muted">Quản lý gọn: phim, duyệt nội dung, thành viên và tài khoản bị ban.</p></div><div class="owner-badge">OWNER · FULL ACCESS</div></div>
   <div class="admin-stats"><div class="admin-stat"><b>${accounts.length}</b><span>Tài khoản</span></div><div class="admin-stat"><b>${movies.filter(m=>m.status!=='rejected').length}</b><span>Phim</span></div><div class="admin-stat"><b>${pending.length+pendingDubbing.length}</b><span>Chờ duyệt</span></div><div class="admin-stat"><b>${banned.length}</b><span>Đang ban</span></div></div>
   <div class="admin-grid">
    <section class="admin-card"><h3>🎬 Phim</h3><div class="admin-actions"><button class="btn gradient" id="adminAddMovie">➕ Thêm phim</button><button class="btn" id="adminRefresh">↻ Làm mới</button></div>
      <div class="admin-list">${movies.map(m=>`<div class="admin-item"><div class="admin-movie-info">${m.poster?`<img class="admin-thumb" src="${esc(m.poster)}" alt="">`:``}<span><b>${esc(m.title)}</b><small>${m.year} · ${esc(m.genre.join(' · '))} · ${m.status==='pending'?'⏳ Chờ duyệt':m.status==='rejected'?'❌ Từ chối':'✅ Đã duyệt'}</small></span></div><div class="admin-item-actions">${m.status==='pending'?`<button class="btn small-btn approve-movie" data-id="${m.id}">Duyệt</button><button class="btn small-btn danger-btn reject-movie" data-id="${m.id}">Từ chối</button>`:''}<button class="btn small-btn view-movie" data-id="${m.id}">Xem</button><button class="btn small-btn danger-btn delete-movie" data-id="${m.id}">Xóa</button></div></div>`).join('')}</div>
    </section>
    <section class="admin-card"><h3>🎙️ Video lồng tiếng chờ duyệt</h3><p class="muted">Video do thành viên gửi sẽ không công khai cho tới khi được duyệt.</p><div class="admin-list">${dubbingSubmissions().filter(v=>v.status==='pending').map(v=>`<div class="admin-item"><div><b>${esc(v.title)}</b><small>${esc(v.authorName)} · ${new Date(v.createdAt).toLocaleString('vi-VN')}</small></div><div class="admin-item-actions"><button class="btn small-btn view-dub" data-id="${esc(v.id)}">Xem</button><button class="btn small-btn approve-dub" data-id="${esc(v.id)}">Duyệt</button><button class="btn small-btn danger-btn reject-dub" data-id="${esc(v.id)}">Từ chối</button></div></div>`).join('') || '<p class="muted">Không có video đang chờ duyệt.</p>'}</div></section>
    <section class="admin-card"><h3>👥 Thành viên</h3><p class="muted">Đổi vai trò, ban hoặc gỡ ban. Khi ban phải ghi rõ lý do.</p>
      <div class="admin-list">${accounts.map(a=>`<div class="admin-item"><div><b>${a.role==='OWNER'?'👑 ':''}${verifiedName(a)}</b><small>${esc(a.email)} · ${esc(a.role)}${a.banned?' · 🚫 ĐANG BAN':''}${a.verified?' · ✓ ĐÃ XÁC MINH':''}</small>${a.banned?`<small class="ban-reason">Lý do: ${esc(a.banReason||'Không nêu lý do')}</small>`:''}</div><div class="admin-item-actions">${a.role==='OWNER'?'<span class="owner-mini">OWNER · ✓ TÍCH XANH</span>':`<select class="admin-role" data-user-id="${esc(a.id)}"><option value="USER" ${a.role==='USER'?'selected':''}>Thành viên</option><option value="VIP" ${a.role==='VIP'?'selected':''}>VIP</option><option value="VOICE_ACTOR" ${a.role==='VOICE_ACTOR'?'selected':''}>Lồng tiếng</option><option value="FILM_REVIEWER" ${a.role==='FILM_REVIEWER'?'selected':''}>Duyệt phim</option><option value="DIRECTOR" ${a.role==='DIRECTOR'?'selected':''}>Đạo diễn</option></select>${a.banned?`<button class="btn small-btn unban-user" data-id="${esc(a.id)}">Gỡ ban</button>`:`<button class="btn small-btn danger-btn ban-user" data-id="${esc(a.id)}">Ban</button>`}${a.verified?`<button class="btn small-btn verify-user" data-id="${esc(a.id)}">✓ Gỡ tích xanh</button>`:`<button class="btn small-btn verify-user" data-id="${esc(a.id)}">✓ Cấp tích xanh</button>`}`}</div></div>`).join('')}</div>
    </section>
    <section class="admin-card"><h3>🚫 Bảng ban người dùng</h3>${banned.length?`<div class="ban-table">${banned.map(a=>`<div class="ban-row"><b>${esc(a.name)}</b><span>${esc(a.email)}</span><span>${esc(a.banReason||'Không nêu lý do')}</span><button class="btn small-btn unban-user" data-id="${esc(a.id)}">Gỡ ban</button></div>`).join('')}</div>`:'<p class="muted">Chưa có người dùng bị ban.</p>'}</section>
    <section class="admin-card"><h3>⚙️ Hệ thống</h3><div class="admin-actions"><button class="btn" id="adminSettings">Cài đặt</button><button class="btn" id="adminClearHistory">Xóa lịch sử</button><button class="btn danger-btn" id="adminResetUsers">Xóa thành viên</button></div></section>
   </div>
   <div class="settings-bottom"><button class="btn ghost" id="adminClose">Đóng</button></div>
 </div>`);
 $('adminClose').onclick=closeModal;
 $('adminRefresh').onclick=ownerPanel;
 $('adminSettings').onclick=settingsModal;
 $('adminAddMovie').onclick=addMovieModal;
 $('adminClearHistory').onclick=()=>{storageRemove('phimhayvietsub_history');toast('Đã xóa lịch sử');ownerPanel()};
 $('adminResetUsers').onclick=()=>{if(confirm('Xóa tất cả tài khoản thành viên?')){const owner=getAccounts().find(a=>a.role==='OWNER')||{...OWNER_ACCOUNT};storageSet('phimhayvietsub_accounts',JSON.stringify([{...owner,...OWNER_ACCOUNT,role:'OWNER'}]));if(user?.role==='OWNER')saveUser({...owner,...OWNER_ACCOUNT,role:'OWNER'});toast('Đã xóa tài khoản thành viên');ownerPanel()}};
 document.querySelectorAll('.admin-role').forEach(sel=>sel.onchange=()=>{const allowed=['USER','VIP','VOICE_ACTOR','FILM_REVIEWER','DIRECTOR'];const next=allowed.includes(sel.value)?sel.value:'USER';const arr=getAccounts();const a=arr.find(x=>String(x.id)===String(sel.dataset.userId));if(a){a.role=next;storageSet('phimhayvietsub_accounts',JSON.stringify(arr));if(user&&String(user.id)===String(a.id)){const {password,...safe}=a;saveUser(safe);updateAccount()}toast('Đã cập nhật vai trò')}});
 document.querySelectorAll('.approve-movie').forEach(b=>b.onclick=()=>{const m=movies.find(x=>String(x.id)===String(b.dataset.id));if(m){m.status='approved';persistMovies();renderRails();toast('Đã duyệt phim');ownerPanel()}});
 document.querySelectorAll('.reject-movie').forEach(b=>b.onclick=()=>{const m=movies.find(x=>String(x.id)===String(b.dataset.id));if(m){m.status='rejected';persistMovies();toast('Đã từ chối phim');ownerPanel()}});
 document.querySelectorAll('.delete-movie').forEach(b=>b.onclick=()=>{if(!confirm('Xóa bộ phim này?'))return;movies=movies.filter(x=>String(x.id)!==String(b.dataset.id));persistMovies();renderRails();toast('Đã xóa phim');ownerPanel()});
 document.querySelectorAll('.view-movie').forEach(b=>b.onclick=()=>{closeModal();showMovie(b.dataset.id)});
 document.querySelectorAll('.ban-user').forEach(b=>b.onclick=()=>banUser(b.dataset.id));
 document.querySelectorAll('.unban-user').forEach(b=>b.onclick=()=>unbanUser(b.dataset.id));
document.querySelectorAll('.verify-user').forEach(b=>b.onclick=()=>{const arr=getAccounts();const a=arr.find(x=>String(x.id)===String(b.dataset.id));setVerification(b.dataset.id,!a?.verified)});
 document.querySelectorAll('.approve-dub').forEach(b=>{b.onclick=()=>reviewDubbing(b.dataset.id,'approved')});
 document.querySelectorAll('.reject-dub').forEach(b=>{b.onclick=()=>reviewDubbing(b.dataset.id,'rejected')});
 document.querySelectorAll('.view-dub').forEach(b=>{b.onclick=()=>playDubbingVideo(b.dataset.id)});
}
function reviewDubbing(id,status){if(!ownerGuard())return;const list=dubbingSubmissions();const v=list.find(x=>String(x.id)===String(id));if(!v)return;v.status=status;v.reviewedAt=Date.now();if(!saveDubbingSubmissions(list))return toast('Không thể lưu trạng thái duyệt');toast(status==='approved'?'Đã duyệt video lồng tiếng':'Đã từ chối video lồng tiếng');ownerPanel()}
function banUser(id){if(!ownerGuard())return;const arr=getAccounts();const a=arr.find(x=>String(x.id)===String(id));if(!a||a.role==='OWNER')return;openModal(`<div><div class="eyebrow">🚫 BAN NGƯỜI DÙNG</div><h2 class="auth-title">Ban ${esc(a.name||a.email)}</h2><p class="muted">Người dùng sẽ không thể đăng nhập cho tới khi được gỡ ban.</p><form id="banForm" class="form"><div class="field"><label>LÝ DO BAN</label><textarea id="banReasonInput" rows="4" maxlength="300" required placeholder="Nhập lý do ban..."></textarea></div><button class="submit" type="submit">🚫 Xác nhận ban</button><button class="btn" type="button" id="cancelBan">Hủy</button></form></div>`);$('cancelBan').onclick=ownerPanel;$('banForm').onsubmit=e=>{e.preventDefault();const reason=$('banReasonInput').value.trim();if(!reason)return;const target=arr.find(x=>String(x.id)===String(id));target.banned=true;target.banReason=reason;target.banAt=Date.now();storageSet('phimhayvietsub_accounts',JSON.stringify(arr));if(user&&String(user.id)===String(id)){clearUser();updateAccount()}toast('Đã ban người dùng');ownerPanel()}}
function unbanUser(id){if(!ownerGuard())return;const arr=getAccounts();const a=arr.find(x=>String(x.id)===String(id));if(!a)return;a.banned=false;delete a.banReason;delete a.banAt;storageSet('phimhayvietsub_accounts',JSON.stringify(arr));toast('Đã gỡ ban');ownerPanel()}

function openAccount(){ if(!user){auth('login');return} profileModal() }

function searchGenre(g){openSearch();$('searchInput').value=g;renderSearch(g)}
function renderSearch(q){
 const box=$('searchResults');
 if(!box)return;
 const query=String(q??'').trim().toLowerCase();
 const result=movies.filter(m=>m.status!=='pending'&&m.status!=='rejected').filter(m=>{
  const haystack=[m.title,...m.genre,m.desc].join(' ').toLowerCase();
  return haystack.includes(query);
 });
 box.innerHTML=result.length?result.map(m=>`<div class="search-result"><button type="button" data-result="${m.id}"><b>${esc(m.title)}</b><br><span class="muted">${m.year} · ${esc(m.genre.join(' · '))}</span></button></div>`).join(''):'<p class="muted">Không tìm thấy phim.</p>';
 box.querySelectorAll('[data-result]').forEach(b=>b.addEventListener('click',()=>{closeSearch();showMovie(b.dataset.result)}));
}
function closeMenu(){const n=$('mainNav');if(!n)return;n.classList.remove('nav-open');n.removeAttribute('aria-hidden');$('menuBtn')?.setAttribute('aria-expanded','false')}
$('searchBtn')?.addEventListener('click',openSearch);$('searchInput')?.addEventListener('input',e=>renderSearch(e.target.value));document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>closeSearch()));$('searchPanel')?.addEventListener('click',e=>{if(e.target===$('searchPanel'))closeSearch()});$('modalClose')?.addEventListener('click',closeModal);$('modal')?.addEventListener('click',e=>{if(e.target===$('modal'))closeModal()});document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeModal();closeSearch();closeMenu()}});const loginBtn=$('loginBtn'),registerBtn=$('registerBtn'),accountBottom=$('accountBottom');if(loginBtn)loginBtn.onclick=()=>auth('login');if(registerBtn)registerBtn.onclick=()=>auth('register');const settingsFooter=$('settingsFooter');if(settingsFooter)settingsFooter.onclick=e=>{e.preventDefault();settingsModal()};if(accountBottom)accountBottom.onclick=openAccount;document.addEventListener('click',e=>{const a=e.target instanceof Element?e.target.closest('.see-all'):null;if(a&&a.dataset.scroll)document.getElementById(a.dataset.scroll).scrollIntoView({behavior:'smooth'})});
if(typeof window.matchMedia==='function'){const mq=window.matchMedia('(prefers-color-scheme: light)');if(typeof mq.addEventListener==='function')mq.addEventListener('change',()=>{if(getSettings().theme==='system')applySettings()});}
applySettings();renderRails();renderGenres();renderCrew();setHero();updateAccount();

// Final navigation: the old hamburger menu was removed; Explore always opens the dedicated search view.
$('discoverBottom')?.addEventListener('click',e=>{e.preventDefault();openSearch()});
$('allGenres')?.addEventListener('click',()=>{openSearch();$('searchInput').value='';renderSearch('')});

document.addEventListener('click',e=>{if(e.target.closest('#topSettingsBtn')||e.target.closest('#settingsFooter')){e.preventDefault();settingsModal()}});

/* ===== Bottom navigation ===== */
(function(){
  const nav=document.getElementById('bottomNav');
  if(!nav)return;
  const tabs=[...nav.querySelectorAll('[data-tab]')];
  const setActive=(key)=>tabs.forEach(x=>x.classList.toggle('active',x.dataset.tab===key));
  nav.addEventListener('click',e=>{
    const item=e.target.closest('[data-tab]');
    if(item)setActive(item.dataset.tab);
  });
  document.querySelectorAll('a[href="#home"]').forEach(a=>a.addEventListener('click',()=>setActive('home')));
  document.querySelectorAll('a[href="#movies"]').forEach(a=>a.addEventListener('click',()=>setActive('library')));
  const add=document.getElementById('addBottom');
  if(add) add.onclick=()=>{
    if(typeof user!=='undefined' && user){
      if(typeof addDubbingVideoModal==='function')addDubbingVideoModal();
    }else if(typeof auth==='function')auth('login');
  };
})();
