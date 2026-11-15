// PapaLazzo — prototype du site
(function(){
var P=[{"n": "4 Fromages", "i": "tomate, mozzarella, chèvre, roquefort", "p": [10.9, 12.6, 15.3, 17.5], "b": "tomate", "v": true, "q": false, "f": false}, {"n": "4 Saisons", "i": "tomate, mozzarella, champignons, cœur d'artichaut, poivrons", "p": [10.7, 11.9, 13.9, 16.5], "b": "tomate", "v": true, "q": false, "f": false}, {"n": "Agenaise", "i": "tomate, magret, pomme Golden, pruneau", "p": [11.1, 12.9, 15.8, 17.7], "b": "tomate", "v": false, "q": false, "f": true}, {"n": "Andalouse", "i": "tomate, champignons, jambon, chorizo, merguez", "p": [11.0, 12.5, 15.3, 17.5], "b": "tomate", "v": false, "q": false, "f": false}, {"n": "Bahamas", "i": "tomate, mozzarella, chèvre, oignons, fromage, miel", "p": [10.9, 12.4, 15.1, 17.3], "b": "tomate", "v": true, "q": false, "f": false}, {"n": "Barracuda", "i": "crème fraîche, mozzarella, cocktail de fruits de mer, persillade", "p": [11.1, 12.9, 15.7, 17.6], "b": "creme", "v": false, "q": false, "f": false}, {"n": "Cannibale", "i": "tomate, champignons, steak haché, oignons, fromage, œuf", "p": [10.9, 12.4, 15.1, 17.1], "b": "tomate", "v": false, "q": false, "f": false}, {"n": "Cheese", "i": "crème fraîche, mozzarella, chèvre, roquefort", "p": [11.1, 12.9, 15.5, 17.6], "b": "creme", "v": true, "q": false, "f": false}, {"n": "Chèvre", "i": "tomate, mozzarella, chèvre, crème fraîche", "p": [10.7, 11.9, 14.3, 17.1], "b": "tomate", "v": true, "q": false, "f": false}, {"n": "Chicken", "i": "tomate, champignons, poulet", "p": [10.7, 11.9, 14.3, 16.8], "b": "tomate", "v": false, "q": false, "f": false}, {"n": "Citadelle", "i": "crème fraîche, mozzarella, thon, persillade", "p": [10.8, 12.3, 15.1, 17.9], "b": "creme", "v": false, "q": false, "f": false}, {"n": "Classique", "i": "tomate, champignons, jambon", "p": [9.8, 10.9, 13.0, 15.1], "b": "tomate", "v": false, "q": false, "f": false}, {"n": "Diable", "i": "tomate, mozzarella, aubergines, courgettes, poivrons, merguez, sauce piquante, fromage, œuf", "p": [10.9, 12.4, 14.8, 17.3], "b": "tomate", "v": false, "q": true, "f": false}, {"n": "Farmer", "i": "crème fraîche, mozzarella, oignons, lardons", "p": [10.7, 11.9, 13.5, 16.5], "b": "creme", "v": false, "q": false, "f": false}, {"n": "Gascogne", "i": "tomate, champignons, magret, poivre vert, crème fraîche", "p": [11.1, 12.9, 15.8, 17.7], "b": "tomate", "v": false, "q": false, "f": false}, {"n": "Gourmande", "i": "crème fraîche, mozzarella, pommes de terre, lardons, reblochon", "p": [11.1, 12.9, 15.5, 17.6], "b": "creme", "v": false, "q": false, "f": false}, {"n": "Grand Large", "i": "tomate, cocktail de fruits de mer, crème fraîche, persillade", "p": [11.1, 12.8, 15.7, 17.6], "b": "tomate", "v": false, "q": false, "f": false}, {"n": "Napolitaine", "i": "tomate, mozzarella, câpres, anchois", "p": [10.5, 11.5, 13.5, 15.5], "b": "tomate", "v": false, "q": false, "f": false}, {"n": "Neptune", "i": "tomate, thon, moules, crème fraîche, persillade", "p": [10.8, 12.3, 15.3, 17.5], "b": "tomate", "v": false, "q": false, "f": false}, {"n": "Niçoise", "i": "tomate, champignons, lardons, chorizo", "p": [10.7, 11.9, 13.9, 16.5], "b": "tomate", "v": false, "q": false, "f": false}, {"n": "Nordique", "i": "tomate, saumon, pétoncles, persillade", "p": [11.1, 12.8, 15.7, 17.6], "b": "tomate", "v": false, "q": false, "f": false}, {"n": "Orientale", "i": "tomate, champignons, merguez, poivrons rouges, sauce piquante", "p": [10.9, 12.4, 15.3, 16.9], "b": "tomate", "v": false, "q": true, "f": false}, {"n": "Pizza des Îles", "i": "tomate, poulet, saucisses, ananas", "p": [10.7, 11.9, 14.5, 16.5], "b": "tomate", "v": false, "q": false, "f": false}, {"n": "Pizza du Chef", "i": "tomate, poireaux, oignons, jambon, crème fraîche", "p": [10.7, 11.9, 14.0, 16.5], "b": "tomate", "v": false, "q": false, "f": false}, {"n": "Savoyarde", "i": "tomate, pommes de terre, lardons, crème fraîche, reblochon", "p": [10.9, 12.4, 15.0, 17.1], "b": "tomate", "v": false, "q": false, "f": false}, {"n": "Végétarienne", "i": "tomate, mozzarella, aubergines, courgettes, poivrons", "p": [10.7, 11.9, 13.9, 16.5], "b": "tomate", "v": true, "q": false, "f": false}];
var $=function(i){return document.getElementById(i)};
var calme=matchMedia('(prefers-reduced-motion: reduce)').matches;
function euro(n){return n.toFixed(2).replace('.',',')+' €'}
function svg(d,c){return '<svg viewBox="0 0 24 24" aria-hidden="true" style="color:'+c+'"><path d="'+d+'" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'}
var FEU='M12 3c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2 1-3.2 2-4.2.3 1.6 1 2.4 1.8 2.7C10.5 8.5 11 5.5 12 3z',FEUILLE='M5 19C5 11 10 6 19 5c0 9-5 14-13 13.5M5 19c2-4 5-7 9-9',PIMENT='M15.5 6.5c.5-2 2-3 4-3M15.5 6.5c3 1 4 4 2.5 7.5-1.8 4-6 6.5-12 6 4-1.2 6.5-3.5 7-7 .3-2.5.5-5 2.500-6.500z';

/* ouvert / fermé en direct */
var H={1:[[600,870]],2:[[600,870]],3:[[600,870],[1050,1320]],4:[[600,870],[1050,1320]],5:[[600,870],[1050,1380]],6:[[600,1380]],0:[]};
var J=['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'];
function hh(m){var h=Math.floor(m/60),r=m%60;return h+' h'+(r?' '+(r<10?'0':'')+r:'')}
var pr=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Paris',weekday:'short',hour:'2-digit',minute:'2-digit',hour12:false}).formatToParts(new Date());
var o={};pr.forEach(function(x){o[x.type]=x.value});
var jour=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(o.weekday),min=(+o.hour%24)*60+ +o.minute;
var ouvert=null,txt='';
(H[jour]||[]).forEach(function(c){if(min>=c[0]&&min<c[1])ouvert=c});
if(ouvert)txt='Ouvert · ferme à '+hh(ouvert[1]);
else{var s=(H[jour]||[]).filter(function(c){return c[0]>min})[0];
  if(s)txt='Fermé · ouvre à '+hh(s[0]);
  else for(var k=1;k<=7;k++){var d=(jour+k)%7;if(H[d].length){txt='Fermé · ouvre '+(k===1?'demain':J[d])+' à '+hh(H[d][0][0]);break}}}
document.querySelectorAll('[data-etat]').forEach(function(e){e.classList.toggle('ferme',!ouvert);e.querySelector('span').textContent=txt});
var ord=[1,2,3,4,5,6,0],ab=['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'];
$('sem').innerHTML=ord.map(function(d,i){var c=H[d],f=c.length?hh(c[c.length-1][1]):'Fermé';return '<div class="'+(d===jour?'auj':'')+(c.length?'':' f')+'"><b>'+ab[i]+'</b><span>'+f+'</span></div>'}).join('');

/* bardage */
var porte=$('porte'),vg=porte.querySelector('.g'),vd=porte.querySelector('.d');
function bardage(){var r=porte.getBoundingClientRect(),p=Math.min(1,Math.max(0,-r.top/(r.height-innerHeight)));
  if(calme)p=1;var e=p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2;
  vg.style.transform='translateX('+(-e*102)+'%)';vd.style.transform='translateX('+(e*102)+'%)'}
/* pizza qui tourne */
var pz=$('pizza');
var pz2=$('pz2');function tourne(){if(!calme){var a='rotate('+(scrollY*0.1)+'deg)';pz.style.transform=a;pz2.style.transform=a}}
var tic=false;addEventListener('scroll',function(){if(!tic){tic=true;requestAnimationFrame(function(){bardage();tourne();tic=false})}},{passive:true});
addEventListener('resize',bardage);bardage();

/* carte */
var T=['Petite','Moyenne','Grande','XXL'],DIA=[280,310,340,370],ti=0,fi='toutes',si=2,aff=P[2].p[0];
var F=[['toutes','Toutes'],['tomate','Tomate'],['creme','Crème'],['vege','Sans viande']];
$('tailles').innerHTML=T.map(function(t,i){return '<button type="button" data-t="'+i+'" aria-pressed="'+(i===0)+'">'+t+'</button>'}).join('');
$('filtres').innerHTML=F.map(function(f,i){return '<button type="button" data-f="'+f[0]+'" aria-pressed="'+(i===0)+'">'+(f[0]==='vege'?svg(FEUILLE,'currentColor').replace('<svg','<svg style="width:16px;height:16px"'):'')+f[1]+'</button>'}).join('');
$('liste').innerHTML=P.map(function(p,i){return '<li data-i="'+i+'"><button type="button"><span class="n">'+p.n+(p.f?svg(FEU,'#D9C4A0'):'')+(p.v?svg(FEUILLE,'#B5B99E'):'')+(p.q?svg(PIMENT,'#E0A27F'):'')+'</span><span class="pp"></span></button></li>'}).join('');
function roule(el,de,a){if(calme){el.textContent=euro(a);return}var t0=performance.now();
  (function pas(t){var k=Math.min(1,(t-t0)/450),e=1-Math.pow(1-k,3);el.textContent=euro(de+(a-de)*e);if(k<1)requestAnimationFrame(pas)})(t0)}
var vue=si,pzg=$('pzg'),pzb=$('pzb');function image(){if(vue===si)return;vue=si;var s='img/p/'+('0'+si).slice(-2)+'.webp',b='img/p/'+(P[si].b==='creme'?'bc':'bt')+'.webp';pzg.alt='Pizza '+P[si].n+', image de synthèse';pz2.src=s;
  if(calme){pzb.src=b;pzg.src=s;return}pzg.classList.add('hors');setTimeout(function(){pzb.src=b;pzg.onload=function(){setTimeout(function(){pzg.classList.remove('hors')},260)};pzg.src=s},180)}
function rendu(){var p=P[si];image();
  $('c-lab').innerHTML=(p.f?svg(FEU,'#D9C4A0').replace('<svg','<svg style="width:15px;height:15px"')+'La pizza du mois':(p.b==='creme'?'Base crème':'Base tomate'));
  $('c-nom').textContent=p.n;$('c-ing').textContent=p.i;
  roule($('c-prix'),aff,p.p[ti]);aff=p.p[ti];
  var w=DIA[ti];pz.style.width=pz.style.height=w+'px';pz.style.right=(-w*0.42)+'px';pz.style.top=(135-w/2)+'px';
  document.querySelectorAll('#tailles button').forEach(function(b){b.setAttribute('aria-pressed',+b.dataset.t===ti)});
  document.querySelectorAll('#filtres button').forEach(function(b){b.setAttribute('aria-pressed',b.dataset.f===fi)});
  document.querySelectorAll('#liste li').forEach(function(li){var q=P[+li.dataset.i];
    var ok=fi==='toutes'||(fi==='vege'?q.v:q.b===fi);li.classList.toggle('cache',!ok);li.classList.toggle('sel',+li.dataset.i===si);
    li.querySelector('.pp').textContent=euro(q.p[ti])})}
$('tailles').addEventListener('click',function(e){var b=e.target.closest('button');if(b){ti=+b.dataset.t;rendu()}});
$('filtres').addEventListener('click',function(e){var b=e.target.closest('button');if(b){fi=b.dataset.f;rendu()}});
$('liste').addEventListener('click',function(e){var li=e.target.closest('li');if(li){si=+li.dataset.i;rendu()}});
rendu();

/* avis */
var C=[[5,94],[4,31],[3,9],[2,2],[1,4]];
$('barres').insertAdjacentHTML('beforeend',C.map(function(c){return '<div class="r"><span>'+c[0]+'</span><span><i data-w="'+Math.max(2,Math.round(c[1]/94*100))+'"></i></span><span>'+c[1]+'</span></div>'}).join(''));
$('etoiles').innerHTML=[0,1,2,3,4].map(function(i){return '<svg viewBox="0 0 22 22"'+(i===4?' data-demi':'')+'><path d="M11 1l3 6.6 7.1.8-5.3 4.8 1.5 7L11 16.6 4.7 20.2l1.5-7L.9 8.4 8 7.600z"/></svg>'}).join('');
var TH=['Rapide le midi','Bon rapport qualité-prix','Accueil'],th=0;
$('themes').innerHTML=TH.map(function(t,i){return '<button type="button" data-k="'+i+'" aria-pressed="'+(i===0)+'">'+t+'</button>'}).join('');
function extrait(){var e=$('extrait');e.style.opacity=0;setTimeout(function(){e.textContent='[Extrait d’un vrai avis Google : « '+TH[th].toLowerCase()+' »]';e.style.opacity=1},calme?0:200);
  document.querySelectorAll('#themes button').forEach(function(b){b.setAttribute('aria-pressed',+b.dataset.k===th)})}
$('themes').addEventListener('click',function(e){var b=e.target.closest('button');if(b){th=+b.dataset.k;extrait()}});extrait();
var joue=false;
function monte(){if(joue)return;joue=true;var el=$('note'),t0=performance.now(),d=calme?1:1400;
  (function pas(t){var k=Math.min(1,(t-t0)/d),e=1-Math.pow(1-k,3);el.textContent=(4.3*e).toFixed(1).replace('.',',');if(k<1)requestAnimationFrame(pas)})(t0);
  document.querySelectorAll('#etoiles svg').forEach(function(s,i){setTimeout(function(){if(s.hasAttribute('data-demi')){s.style.fill='#8E8468'}else s.classList.add('on')},calme?0:300+i*220)});
  document.querySelectorAll('#barres i').forEach(function(b,i){setTimeout(function(){b.style.width=b.dataset.w+'%'},calme?0:200+i*120)})}
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){if(e.target.id==='avis')monte();e.target.classList.add('la')}})},{threshold:.25});
io.observe($('avis'));document.querySelectorAll('.vu').forEach(function(n){io.observe(n)});

/* itinéraire */
var dest='50+All%C3%A9e+des+Mousquetaires%2C+47520+Le+Passage';
var AP=[['Google Maps','https://www.google.com/maps/dir/?api=1&destination='+dest],['Waze','https://waze.com/ul?q='+dest+'&navigate=yes'],['Plans','https://maps.apple.com/?daddr='+dest]];
$('applis').innerHTML=AP.map(function(a){return '<a class="app-l" href="'+a[1]+'"><svg viewBox="0 0 80 112" aria-hidden="true"><path d="M5 40A35 35 0 0 1 75 40V64L40 106L5 64Z" fill="none" stroke="currentColor" stroke-width="8" stroke-linejoin="round"/><path d="M28 30V66M40 22V80M52 30V66" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/></svg><span>'+a[0]+'</span><svg viewBox="0 0 10 16" aria-hidden="true"><path d="M2 2l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></a>'}).join('');
})();
