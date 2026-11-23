/* L'ArcaVerde v2 — interazioni (FRAME Agency) */
(function(){
"use strict";
var EMAIL="info@larcaverde.com";
var P=window.PRODOTTI||[];
var lang=(document.documentElement.lang||"it").slice(0,2);
var A=document.body.getAttribute("data-a")||"";
var FILE=document.body.getAttribute("data-f")||"index.html";
var I=lang==="en"?1:lang==="fr"?2:0;
function T(it,en,fr){return [it,en,fr][I]}
var COL={rosso:["Rosso","Red","Rouge","#A8322F"],oro:["Oro e argento","Gold & silver","Or et argent","linear-gradient(135deg,#D4B26A 0 50%,#C9CCD1 50%)"],naturale:["Naturale e crema","Natural & cream","Naturel et crème","#E7DCC8"],tartan:["Tartan e quadri","Tartan & check","Tartan et carreaux","repeating-linear-gradient(45deg,#8E2B2B 0 3px,#2B5A3C 3px 6px)"],fantasia:["Fantasia","Patterned","Motifs","linear-gradient(135deg,#B5463C 0 50%,#EDE3D0 50%)"],blu:["Blu","Blue","Bleu","#2F4E9E"]};
function $(s,c){return (c||document).querySelector(s)}
function $$(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))}
function store(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){return null}}
function trova(c){for(var i=0;i<P.length;i++)if(P[i].c===c)return P[i];return null}
function esc(s){return String(s).replace(/[&<>"]/g,function(m){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[m]})}

/* lingua: prima visita da browser non italiano -> versione EN/FR */
$$(".lang a").forEach(function(a){a.addEventListener("click",function(){store("av_lang",a.getAttribute("data-l"))})});
(function(){
  var scelta=store("av_lang");
  if(scelta||lang!=="it")return;
  var nl=(navigator.language||"it").slice(0,2).toLowerCase();
  if(nl==="en"||nl==="fr"){store("av_lang",nl);location.replace(nl+"/"+(FILE==="index.html"?"":FILE)+location.hash)}
})();

/* menu */
var bur=$(".burger"),nav=$(".nav");
function chiudiMenu(){if(!nav)return;nav.classList.remove("aperto");bur.setAttribute("aria-expanded","false");document.body.classList.remove("blocco");document.body.style.overflow=""}
if(bur)bur.addEventListener("click",function(){var o=nav.classList.toggle("aperto");bur.setAttribute("aria-expanded",o);document.body.classList.toggle("blocco",o);document.body.style.overflow=o?"hidden":""});

/* comparsa */
var io="IntersectionObserver" in window?new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}})},{threshold:.1,rootMargin:"0px 0px -6% 0px"}):null;
function osserva(){$$(".rv:not(.in)").forEach(function(el){if(!io||el.getBoundingClientRect().top<innerHeight)el.classList.add("in");else io.observe(el)})}

/* toast */
var to;function toast(m){var el=$(".toast");if(!el)return;el.textContent=m;el.classList.add("on");clearTimeout(to);to=setTimeout(function(){el.classList.remove("on")},2600)}

/* lista (stato) */
var lista={};try{lista=JSON.parse(store("av_lista")||"{}")||{}}catch(e){lista={}}
Object.keys(lista).forEach(function(c){if(!trova(c)||!(lista[c]>0))delete lista[c]});

/* card */
function card(p){
  var c=COL[p.k],ok=lista[p.c];
  return '<button class="card rv" type="button" data-c="'+p.c+'" aria-label="'+T("Apri il modello ","Open model ","Ouvrir le modèle ")+p.c+'">'+
  '<span class="img"><img src="'+A+'img/thumb/'+p.c+'.webp" alt="'+T("Alberello natalizio decorato, codice ","Decorated Christmas tree, item ","Petit arbre de Noël décoré, référence ")+p.c+'" loading="lazy" decoding="async" width="520" height="714">'+
  (ok?'<span class="in-lista">'+T("In lista","In list","Dans la liste")+' · '+ok+'</span>':'')+'<span class="piu" aria-hidden="true">+</span></span>'+
  '<span class="info"><span class="cod">'+p.c+'</span><span class="det"><i>'+p.s+'</i><br>'+T("Vaso","Pot","Pot")+' Ø '+p.v+' cm</span></span></button>';
}

/* vetrina home */
var vetrina=$("#vetrina");
function disegnaVetrina(){if(vetrina)vetrina.innerHTML=["001","053","029","008","035","046","009","043"].map(function(c){return card(trova(c))}).join("")}
disegnaVetrina();

/* catalogo */
var filtro={v:"",s:"",k:"",q:""},visibili=P;
function render(){
  var box=$("#catalogo");if(!box)return;
  visibili=P.filter(function(p){return (!filtro.v||p.v==filtro.v)&&(!filtro.s||p.s===filtro.s)&&(!filtro.k||p.k===filtro.k)&&(!filtro.q||p.c.indexOf(filtro.q)>-1)});
  box.innerHTML=visibili.map(card).join("");
  var n=visibili.length;
  $("#conta").textContent=n+" "+(n===1?T("modello","model","modèle"):T("modelli","models","modèles"));
  $(".vuoto").style.display=n?"none":"block";
  $(".azzera").classList.toggle("on",!!(filtro.v||filtro.s||filtro.k||filtro.q));
  osserva();
}
function setChip(f,v){filtro[f]=v;$$('.chip[data-f="'+f+'"]').forEach(function(x){x.setAttribute("aria-pressed",String(x.getAttribute("data-val")===v))})}
if($("#catalogo")){
  $("#chips-colore").innerHTML='<button class="chip" type="button" data-f="k" data-val="" aria-pressed="true">'+T("Tutti","All","Toutes")+'</button>'+Object.keys(COL).map(function(k){return '<button class="chip" type="button" data-f="k" data-val="'+k+'" aria-pressed="false"><span class="pal" style="background:'+COL[k][3]+'"></span>'+COL[k][I]+'</button>'}).join("");
  $$(".chip[data-f]").forEach(function(b){b.addEventListener("click",function(){setChip(b.getAttribute("data-f"),b.getAttribute("data-val"));render()})});
  $("#cerca").addEventListener("input",function(e){filtro.q=e.target.value.replace(/\D/g,"").slice(0,3);render()});
  $(".azzera").addEventListener("click",function(){["v","s","k"].forEach(function(f){setChip(f,"")});filtro.q="";$("#cerca").value="";render()});
  var h=decodeURIComponent(location.hash.replace("#",""));
  if(/^c-[a-z]+$/.test(h)&&COL[h.slice(2)])setChip("k",h.slice(2));
  if(/^vaso-(9|11|13|17)$/.test(h))setChip("v",h.split("-")[1]);
  render();
  if(/^\d{3}$/.test(h)&&trova(h))setTimeout(function(){apri(h)},250);
}

/* modale */
var mod=$(".modale"),attuale=null,ultimoFocus=null;
function sequenza(){return $("#catalogo")?visibili:P}
function riempi(p){
  attuale=p;var img=$(".m-foto img",mod);
  img.src=A+"img/prodotti/"+p.c+".webp";img.alt=T("Alberello natalizio decorato, codice ","Decorated Christmas tree, item ","Petit arbre de Noël décoré, référence ")+p.c;
  $("#m-cod").textContent=p.c;$("#m-sp").textContent=p.s;$("#m-vaso").textContent="Ø "+p.v+" cm";$("#m-col").textContent=COL[p.k][I];
  $("#m-q").value=lista[p.c]||10;
  $("#m-aggiungi").textContent=lista[p.c]?T("Aggiorna quantità in lista","Update quantity in list","Mettre à jour la quantité"):T("Aggiungi alla lista richiesta","Add to request list","Ajouter à la liste de demande");
}
function apri(c){
  var p=trova(c);if(!p||!mod)return;ultimoFocus=document.activeElement;riempi(p);
  mod.hidden=false;requestAnimationFrame(function(){mod.classList.add("aperta")});
  document.body.style.overflow="hidden";document.body.classList.add("blocco");$(".chiudi",mod).focus();
}
function chiudi(){if(!mod||mod.hidden)return;mod.classList.remove("aperta");document.body.style.overflow="";document.body.classList.remove("blocco");setTimeout(function(){mod.hidden=true},280);if(ultimoFocus)ultimoFocus.focus()}
function scorri(d){var s=sequenza(),i=s.indexOf(attuale);if(i<0)i=0;riempi(s[(i+d+s.length)%s.length])}
document.addEventListener("click",function(e){
  var c=e.target.closest(".card");if(c){apri(c.getAttribute("data-c"));return}
  if(e.target===mod||e.target.closest(".modale .chiudi"))chiudi();
});
document.addEventListener("keydown",function(e){
  if(e.key==="Escape"){chiudi();chiudiLista();chiudiMenu()}
  if(mod&&!mod.hidden&&(e.key==="ArrowRight"||e.key==="ArrowLeft"))scorri(e.key==="ArrowRight"?1:-1);
});
if(mod){
  $(".m-prec").addEventListener("click",function(){scorri(-1)});
  $(".m-succ").addEventListener("click",function(){scorri(1)});
  var x0=null;
  $(".m-foto").addEventListener("touchstart",function(e){x0=e.touches[0].clientX},{passive:true});
  $(".m-foto").addEventListener("touchend",function(e){if(x0===null)return;var dx=e.changedTouches[0].clientX-x0;if(Math.abs(dx)>50)scorri(dx<0?1:-1);x0=null},{passive:true});
  $("#m-meno").addEventListener("click",function(){var i=$("#m-q");i.value=Math.max(1,(parseInt(i.value,10)||1)-1)});
  $("#m-piu").addEventListener("click",function(){var i=$("#m-q");i.value=(parseInt(i.value,10)||0)+1});
  $("#m-aggiungi").addEventListener("click",function(){var q=Math.max(1,parseInt($("#m-q").value,10)||1);lista[attuale.c]=q;salva();chiudi();toast(T("Nella tua lista: ","In your list: ","Dans votre liste : ")+attuale.c+" × "+q)});
}

/* pannello lista */
function salva(){store("av_lista",JSON.stringify(lista));disegnaLista();if($("#catalogo"))render();else disegnaVetrina();osserva()}
function totale(){return Object.keys(lista).reduce(function(a,k){return a+lista[k]},0)}
var pan=$(".pannello"),velo=$(".velo");
function apriLista(){if(!pan)return;chiudiMenu();pan.classList.add("aperto");velo.classList.add("on");document.body.style.overflow="hidden";document.body.classList.add("blocco");$(".chiudi-lista").focus()}
function chiudiLista(){if(!pan||!pan.classList.contains("aperto"))return;pan.classList.remove("aperto");velo.classList.remove("on");document.body.style.overflow="";document.body.classList.remove("blocco")}
$$(".lista-btn").forEach(function(b){b.addEventListener("click",apriLista)});
if(velo)velo.addEventListener("click",chiudiLista);
if($(".chiudi-lista"))$(".chiudi-lista").addEventListener("click",chiudiLista);
function disegnaLista(){
  var n=Object.keys(lista).length;
  $$(".n").forEach(function(e){e.textContent=n;e.classList.toggle("vuoto0",!n)});
  var r=$(".righe");if(!r)return;
  if(!n){r.innerHTML='<p class="vuota">'+T("La lista è vuota. Apri un modello dalla collezione e aggiungilo con la quantità che ti serve.","Your list is empty. Open a model in the collection and add the quantity you need.","Votre liste est vide. Ouvrez un modèle de la collection et ajoutez la quantité souhaitée.")+'</p><a class="btn ghost" href="collezione.html">'+T("Vai alla collezione","Go to the collection","Voir la collection")+'</a>'}
  else r.innerHTML=Object.keys(lista).sort().map(function(c){
    var p=trova(c);
    return '<div class="riga"><img src="'+A+'img/thumb/'+c+'.webp" alt="" width="64" height="84"><div><b>'+c+'</b><small>'+p.s+' · Ø '+p.v+' cm</small></div>'+
    '<div class="qta"><button type="button" data-r="'+c+'" data-d="-1" aria-label="'+T("Meno","Less","Moins")+'">−</button><input value="'+lista[c]+'" data-i="'+c+'" inputmode="numeric" aria-label="'+T("Quantità ","Quantity ","Quantité ")+c+'"><button type="button" data-r="'+c+'" data-d="1" aria-label="'+T("Più","More","Plus")+'">+</button></div></div>';
  }).join("");
  var tt=$(".tot");if(tt)tt.textContent=n?n+" "+T("modelli","models","modèles")+" · "+totale()+" "+T("pezzi","pcs","pièces"):"";
}
document.addEventListener("click",function(e){
  var b=e.target.closest("[data-r]");if(!b)return;
  var c=b.getAttribute("data-r");lista[c]=(lista[c]||0)+(+b.getAttribute("data-d"));if(lista[c]<=0)delete lista[c];salva();
});
document.addEventListener("change",function(e){
  var c=e.target.getAttribute&&e.target.getAttribute("data-i");if(!c)return;var v=parseInt(e.target.value,10);
  if(!v||v<1)delete lista[c];else lista[c]=v;salva();
});
function testoLista(){
  return Object.keys(lista).sort().map(function(c){var p=trova(c);return "- "+T("Cod.","Item","Réf.")+" "+c+" ("+p.s+", "+T("vaso","pot","pot")+" Ø "+p.v+" cm): "+lista[c]+" "+T("pz","pcs","pièces")}).join("\n");
}
if($("#invia-lista"))$("#invia-lista").addEventListener("click",function(){
  if(!totale()){toast(T("Aggiungi almeno un modello","Add at least one model","Ajoutez au moins un modèle"));return}
  var body=T("Buongiorno, vorrei ricevere listino e disponibilità per questi alberelli:","Hello, I would like to receive your price list and availability for these trees:","Bonjour, je souhaiterais recevoir vos tarifs et disponibilités pour ces petits arbres :")+"\n\n"+testoLista()+"\n\n"+T("Ragione sociale:\nCittà:\nTelefono:\n","Company:\nCity / country:\nPhone:\n","Raison sociale :\nVille / pays :\nTéléphone :\n");
  location.href="mailto:"+EMAIL+"?subject="+encodeURIComponent("Richiesta listino alberelli di Natale"+(I?" ("+lang.toUpperCase()+")":""))+"&body="+encodeURIComponent(body);
});
if($("#copia-lista"))$("#copia-lista").addEventListener("click",function(){
  var tx=testoLista();if(!tx){toast(T("La lista è vuota","Your list is empty","Votre liste est vide"));return}
  (navigator.clipboard?navigator.clipboard.writeText(tx):Promise.reject()).then(function(){toast(T("Lista copiata","List copied","Liste copiée"))},function(){toast(tx)});
});
if($("#stampa-lista"))$("#stampa-lista").addEventListener("click",function(){
  if(!totale()){toast(T("La lista è vuota","Your list is empty","Votre liste est vide"));return}
  var d=new Date().toLocaleDateString(lang);
  $(".stampa").innerHTML='<img class="lg" src="'+A+'img/brand/logo-verde.webp" alt="L\'ArcaVerde"><h1>'+T("Richiesta listino","Price list request","Demande de tarifs")+'</h1><p>'+d+'</p><table><thead><tr><th></th><th>'+T("Codice","Item","Réf.")+'</th><th>'+T("Pianta","Plant","Plante")+'</th><th>'+T("Vaso","Pot","Pot")+'</th><th>'+T("Pezzi","Pcs","Pièces")+'</th></tr></thead><tbody>'+
  Object.keys(lista).sort().map(function(c){var p=trova(c);return '<tr><td><img src="'+A+'img/thumb/'+c+'.webp" alt=""></td><td>'+c+'</td><td><i>'+esc(p.s)+'</i></td><td>Ø '+p.v+' cm</td><td>'+lista[c]+'</td></tr>'}).join("")+
  '</tbody></table><p class="pie">'+Object.keys(lista).length+" "+T("modelli","models","modèles")+" · "+totale()+" "+T("pezzi","pcs","pièces")+'<br>L\'ArcaVerde S.r.l. · Voc. La Selva, 05100 Terni (TR) · +39 0744 303773 · info@larcaverde.com</p>';
  var imgs=$$(".stampa img"),attese=imgs.length;
  function via(){setTimeout(function(){window.print()},80)}
  imgs.forEach(function(im){if(im.complete){if(!--attese)via()}else im.onload=im.onerror=function(){if(!--attese)via()}});
});

/* moduli -> email precompilata */
$$("form[data-mail]").forEach(function(f){
  f.addEventListener("submit",function(e){
    e.preventDefault();
    if(!f.reportValidity())return;
    var righe=$$("input,select,textarea",f).filter(function(i){return i.name&&i.type!=="checkbox"&&i.value}).map(function(i){return i.getAttribute("data-lab")+": "+i.value});
    righe.push("Lingua del sito: "+lang.toUpperCase());
    var tx=testoLista();if(tx&&f.hasAttribute("data-lista"))righe.push("\nModelli selezionati:\n"+tx);
    location.href="mailto:"+EMAIL+"?subject="+encodeURIComponent(f.getAttribute("data-mail"))+"&body="+encodeURIComponent(righe.join("\n"));
    toast(T("Si apre la tua email con il messaggio pronto","Your email app opens with the message ready","Votre messagerie s'ouvre avec le message prêt"));
  });
});

/* galleria scene: frecce */
var sc=$(".scene");
if(sc){
  function passo(){var f=$("figure",sc);return f?f.getBoundingClientRect().width+16:400}
  $(".fr-s").addEventListener("click",function(){sc.scrollBy({left:-passo(),behavior:"smooth"})});
  $(".fr-d").addEventListener("click",function(){sc.scrollBy({left:passo(),behavior:"smooth"})});
}

/* chiudi menu su link */
$$(".nav a").forEach(function(a){a.addEventListener("click",chiudiMenu)});

$$(".anno").forEach(function(e){e.textContent=new Date().getFullYear()});
disegnaLista();
osserva();
})();
