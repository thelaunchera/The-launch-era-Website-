/* The Launch Era canonical Booking Page: the public demo and each purchased page use exactly the same markup.
   Without ?key=, it remains a no-send demo. With a released booking key, it uses authoritative buyer pricing,
   service categories, real availability, and the existing booking-flow-inquiry endpoint. */
(async function(){
"use strict";
const params=new URLSearchParams(location.search);
const bookingKey=params.get("key")||"";
if(!bookingKey)return;
document.documentElement.classList.add("live-booking");
const API="https://bowacxhmjvrqixtwaikv.supabase.co/functions/v1/";
const E=id=>document.getElementById(id);
const $id=id=>document.getElementById(id);
const biz={
 config:null,
 service:null,
 services:[],
 addons:[],
 available:[],
 requestNumber:0,
 sending:false,
 language:(params.get("lang")==="es"?"es":"en")
};
const translate=(en,es)=>biz.language==="es"?es:en;
function showError(message,critical=false){
 const element=E("liveError");element.textContent=message;element.classList.add("show");
 if(critical){document.querySelector(".booking").hidden=true;document.querySelector(".intro h1").textContent=translate("Booking page unavailable","Página de reservas no disponible")}
}
async function api(action,payload){
 const resp=await fetch(API+action,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
 const data=await resp.json().catch(()=>({}));
 if(!resp.ok)throw Error(data.error||"The booking service is temporarily unavailable.");
 return data
}
const dollars=n=>new Intl.NumberFormat(biz.language==="es"?"es-US":"en-US",{style:"currency",currency:biz.config?.currency==="CAD"?"CAD":"USD"}).format(Number(n||0));
const safePhoto=url=>typeof url==="string" && /^https:\/\/[^\s"'<>]+$/i.test(url) && url.length<1200?url:"";
function titleText(node,value){if(node)node.textContent=value}
function catOf(item){
 if(["residential","commercial","both"].includes(item?.category))return item.category;
 return /office|commercial|retail|restaurant|salon|medical|warehouse|construction|janitorial|business|restroom|floor scrub|breakroom|after.hour/i.test(item?.name||"")?"commercial":
 /oven|fridge|refrigerator|baseboard|laundry|cabinet|bedroom/i.test(item?.name||"")?"residential":"both";
}
function renderBrand(){
 const config=biz.config;const business=String(config.business_name||"Your Cleaning Business");
 document.title=business+" | "+translate("Book a Cleaning","Reserva una limpieza");
 titleText(document.querySelector(".brand-copy strong"),business.toUpperCase());
 titleText(document.querySelector(".brand-copy span"),translate("Residential & commercial cleaning","Limpieza residencial y comercial"));
 titleText(document.querySelector(".mark"),business.trim().slice(0,1).toUpperCase()||"B");
 const tagline=config.branding?.headline||translate("Cleaning made simple for your space.","Limpieza sencilla para tu espacio.");
 titleText(document.querySelector(".intro h1"),tagline);
 titleText(document.querySelector(".intro p"),config.branding?.description||
  translate("Choose a service, tell us about your space, and book or request an estimate.","Elige el servicio y cuéntanos sobre tu espacio para reservar o pedir un estimado."));
 titleText(document.querySelector(".eyebrow"),translate("PERSONALIZED BOOKING PAGE","PÁGINA DE RESERVAS PERSONALIZADA"));
 const photo=safePhoto(config.branding?.hero_image);
 if(photo){const img=E("businessHero");img.src=photo;img.hidden=false;img.alt=business+" cleaning services"}
 const logo=safePhoto(config.branding?.logo_image);
 if(logo){const mark=document.querySelector(".mark");mark.replaceChildren();const img=document.createElement("img");img.src=logo;img.alt=business+" logo";img.style.cssText="max-width:100%;max-height:100%;object-fit:contain;border-radius:12px";mark.append(img)}
 if(/^#[0-9a-f]{6}$/i.test(config.branding?.primary_color||""))
  document.documentElement.style.setProperty("--blue-deep",config.branding.primary_color);
 if(/^#[0-9a-f]{6}$/i.test(config.branding?.accent_color||""))
  document.documentElement.style.setProperty("--blue",config.branding.accent_color);
 titleText(document.querySelector(".demo-note"),translate(
  "Booking, estimates and quote requests for "+business,
  "Reservas, estimados y cotizaciones de "+business));
 titleText(E("modeBadge"),translate("LIVE BOOKING","RESERVAS REALES"));
 document.querySelector(".owner-demo").hidden=true;
 document.querySelectorAll(".owner-link,[data-demo-offer]").forEach(x=>x.hidden=true);
 titleText(document.querySelector("footer .wrap"),business+" · "+translate("Booking experience powered by The Launch Era","Reservas gestionadas por The Launch Era"));
 const area=String(config.branding?.service_area||"").trim();
 if(area){const side=document.querySelector(".intro-side");if(side)side.textContent=translate("Serving ","Atendemos ")+area}
}
function createService(item,root){
 const button=document.createElement("button");button.className="service";button.type="button";
 button.dataset.service=String(item.name||"Custom Cleaning").slice(0,110);
 button.dataset.price=String(item.mode==="flat"?item.price:0);
 button.dataset.quote=String(item.mode!=="flat");
 button.dataset.id=item.id||"";
 const name=document.createElement("strong");name.textContent=button.dataset.service;
 const description=document.createElement("p");description.textContent=item.mode==="flat"?
  translate("Reserve an available appointment or ask for a custom quote.","Reserva un horario disponible o pide una cotización."):
  translate("Request a quote or an estimate tailored to your space.","Solicita un presupuesto adaptado a tu espacio.");
 const price=document.createElement("span");price.textContent=item.mode==="flat"?
 dollars(item.price):translate("Custom pricing →","Precio personalizado →");
 button.append(name,description,price);root.append(button);
 button.onclick=()=>{
  root.querySelectorAll(".service").forEach(x=>x.classList.toggle("active",x===button));
  biz.service=item;
  state.service=button.dataset.service;state.base=item.mode==="flat"?Number(item.price):0;
  state.serviceMode=item.mode==="flat"?"flat":"quote";
  if(item.mode!=="flat"&&state.intent==="book")state.intent="quote";
  render();
  refreshSlots();
 }
 return button;
}
function renderServices(){
 biz.services=(biz.config.services||[]).filter(x=>x.active!==false);
 const home=document.querySelector(".residential-services"),commercial=document.querySelector(".commercial-services");
 home.replaceChildren();commercial.replaceChildren();
 for(const service of biz.services){
  const cat=catOf(service);
  if(cat==="both"||cat==="residential")createService(service,home);
  if(cat==="both"||cat==="commercial")createService(service,commercial);
 }
 if(biz.config.quote_policy!=="no_quotes"){
  const custom={id:"special_request",name:translate("Other / Request a Custom Quote","Otro / Cotización personalizada"),price:null,mode:"quote"};
  createService(custom,home);createService(custom,commercial)
 }
 const hasHome=!!home.querySelector(".service"),hasCommercial=!!commercial.querySelector(".service");
 document.querySelector('[data-space="Residential"]').disabled=!hasHome;
 document.querySelector('[data-space="Commercial"]').disabled=!hasCommercial;
 const start=hasHome?"Residential":"Commercial";
 chooseCategory(start);
 biz.service=biz.services.find(x=>x.name===state.service)||{id:"special_request",name:state.service,mode:"quote",price:null};
}
function renderAddons(){
 biz.addons=(biz.config.addons||[]).filter(x=>x.active!==false);
 const areas=[["residential",document.querySelector(".residential-extras .extras")],
  ["commercial",document.querySelector(".commercial-extras .extras")]];
 for(const [category,root] of areas){
  root.replaceChildren();
  const choices=biz.addons.filter(x=>catOf(x)==="both"||catOf(x)===category);
  for(const add of choices){
   const label=document.createElement("label");label.className="extra";
   const box=document.createElement("input");box.type="checkbox";
   box.dataset.addonId=add.id;box.dataset.price=String(add.price||0);
   if(category==="commercial")box.dataset.commercialExtra=add.name;
   else box.dataset.extra=add.name;
   const desc=document.createElement("span"),bold=document.createElement("strong"),caption=document.createElement("small");
   bold.textContent=add.name;caption.textContent=add.price>0?
     "+"+dollars(add.price):translate("Included in quote","Incluido en cotización");
   desc.append(bold,caption);label.append(box,desc);root.append(label);
   box.onchange=()=>{
    state.extras=[...document.querySelectorAll(".residential-extras input[data-addon-id]:checked")].map(x=>({name:x.dataset.extra,price:Number(x.dataset.price||0)}));
    render();
   };
  }
  if(!choices.length){const p=document.createElement("p");p.className="intent-help";p.textContent=translate(
   "No additional services have been published for this category.","No se han publicado extras para esta categoría.");root.append(p)}
 }
 document.querySelectorAll("#frequency button small").forEach(x=>x.hidden=true);
 document.querySelectorAll("#frequency button").forEach(x=>x.dataset.discount="0");
}
const formatDay=iso=>new Date(iso+"T12:00:00Z");
function renderDates(){
 const root=E("dates");root.replaceChildren();
 const today=new Date();const zone=biz.config?.timezone||"America/New_York";
 const parts=new Intl.DateTimeFormat("en-CA",{timeZone:zone,year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(today);
 const vals=Object.fromEntries(parts.filter(x=>x.type!=="literal").map(x=>[x.type,x.value]));
 const start=new Date(Date.UTC(Number(vals.year),Number(vals.month)-1,Number(vals.day)));
 for(let n=1;n<=15;n++){
  const day=new Date(start);day.setUTCDate(day.getUTCDate()+n);
  const iso=day.toISOString().slice(0,10);
  const box=document.createElement("button");box.type="button";box.className="date-btn";
  box.dataset.date=iso;const small=document.createElement("small"),strong=document.createElement("strong"),month=document.createElement("span");
  const locale=biz.language==="es"?"es-US":"en-US";
  small.textContent=new Intl.DateTimeFormat(locale,{weekday:"short",timeZone:"UTC"}).format(day);
  strong.textContent=day.getUTCDate();month.textContent=new Intl.DateTimeFormat(locale,{month:"short",timeZone:"UTC"}).format(day);
  box.append(small,strong,month);
  box.onclick=()=>{root.querySelectorAll(".date-btn").forEach(x=>x.classList.toggle("active",x===box));state.date=iso;state.time="";refreshSlots()};
  root.append(box);
 }
 const first=root.querySelector(".date-btn");if(first){first.classList.add("active");state.date=first.dataset.date}
}
function renderSlotButtons(times,isPreferred=false){
 biz.available=times||[];
 const root=state.space==="Commercial"?E("commercialTimes"):E("residentialTimes");root.replaceChildren();
 const fmt=time=>{
  const parts=time.split(":");const hour=Number(parts[0]);return (hour%12||12)+":"+parts[1]+" "+(hour<12?"AM":"PM")
 };
 for(const time of biz.available){
  const button=document.createElement("button");button.type="button";button.className="time-btn";
  button.textContent=fmt(time);button.dataset.time=time;
  button.onclick=()=>{root.querySelectorAll(".time-btn").forEach(x=>x.classList.toggle("active",x===button));state.time=time;render()};
  root.append(button);
 }
 if(!biz.available.length)state.time="";
 const note=E("liveSlotNote")||document.createElement("p");note.id="liveSlotNote";note.className="intent-help";
 note.textContent=isPreferred?translate(
  "Preferred times only. Your quote request does not reserve an appointment.",
  "Estos son horarios preferidos. Solicitar una cotización no reserva una cita."):
  biz.available.length?translate("Choose an available time to confirm your booking.","Elige un horario disponible para confirmar tu reserva."):
   translate("No open booking times for this date. Try another date or request a quote.","No hay horarios disponibles ese día. Elige otra fecha o solicita una cotización.");
 root.after(note);
}
async function refreshSlots(){
 if(!biz.config||!state.date)return;
 const r=++biz.requestNumber;
 const wantsBooking=state.intent==="book"&&state.serviceMode==="flat";
 const root=state.space==="Commercial"?E("commercialTimes"):E("residentialTimes");
 root.replaceChildren();
 state.time="";
 if(!wantsBooking){
  if(r!==biz.requestNumber)return;
  renderSlotButtons(["09:00","11:00","13:00","15:00"],true);
  render();return
 }
 const note=E("liveSlotNote")||document.createElement("p");note.id="liveSlotNote";note.className="intent-help";
 note.textContent=translate("Checking real availability…","Consultando disponibilidad real…");root.after(note);
 try{
  const d=await api("tle-booking-flow-availability",{action:"public",booking_key:bookingKey,date:state.date});
  if(r!==biz.requestNumber)return;
  renderSlotButtons((d.slots||[]).filter(v=>/^(?:[01]\d|2[0-3]):(?:00|30)$/.test(v)));
  render();
 }catch(err){if(r===biz.requestNumber){renderSlotButtons([],false);showError(translate("Could not verify times. Please try another date.","No pudimos verificar horarios. Prueba otra fecha."))}}
}
function liveRender(){
 const selectedButton=document.querySelector((state.space==="Commercial"?".commercial-services":".residential-services")+" .service.active");
 if(selectedButton){
  biz.service=biz.services.find(x=>x.id===selectedButton.dataset.id)||{id:"special_request",mode:"quote",price:null,name:selectedButton.dataset.service};
 }
 const isFlat=biz.service?.mode==="flat";
 const isBook=state.intent==="book"&&isFlat;
 const selectedAddonPrices=[...document.querySelectorAll((state.space==="Commercial"?".commercial-extras":".residential-extras")+" input[data-addon-id]:checked")]
   .reduce((sum,x)=>sum+Number(x.dataset.price||0),0);
 const quote=translate(state.intent==="estimate"?"Estimate requested":"Custom quote",
  state.intent==="estimate"?"Estimado solicitado":"Cotización personalizada");
 const display=isFlat&&!(!isBook&&state.intent==="quote")?dollars(Number(biz.service.price)+selectedAddonPrices):quote;
 titleText(E("estimateValue"),state.intent==="book"?display:quote);
 titleText(E("mobileEstimate"),state.intent==="book"?display:quote);
 titleText(E("estimateNote"),isBook?translate(
  "Your published flat price, before any final onsite adjustments.","Precio fijo publicado, sujeto a ajustes autorizados.") :
  translate("The business will review your request and confirm the final price.","El negocio revisará tu solicitud y confirmará el precio final."));
 titleText(E("summaryFoot"),translate(
  "Your request goes directly to the cleaning business. No payment is collected here.",
  "Tu solicitud llega directamente al negocio. No se cobra nada aquí."));
 titleText(E("submitBtn"),isBook?translate("Confirm available booking →","Confirmar reserva disponible →"):
  state.intent==="estimate"?translate("Send estimate request →","Enviar solicitud de estimado →"):
   translate("Send quote request →","Enviar solicitud de cotización →"));
 titleText(E("summaryKicker"),isBook?translate("YOUR BOOKING","TU RESERVA"):state.intent==="estimate"?translate("YOUR ESTIMATE","TU ESTIMADO"):translate("YOUR QUOTE","TU COTIZACIÓN"));
 E("sumSchedule").textContent=state.date?(state.date+" · "+(state.time?state.time:translate("Choose a time","Elige hora"))):"—";
 E("sumExtras").textContent=[...document.querySelectorAll((state.space==="Commercial"?".commercial-extras":".residential-extras")+" input[data-addon-id]:checked")]
  .map(x=>x.dataset.extra||x.dataset.commercialExtra).join(", ")||translate("None","Ninguno");
}
function parseTime(value){return /^(?:[01]\d|2[0-3]):(?:00|30)$/.test(value)}
async function submitLive(){
 if(biz.sending||!biz.config)return;
 const button=E("submitBtn"),name=E("name").value.trim(),email=E("email").value.trim();
 const wantsBooking=state.intent==="book"&&state.serviceMode==="flat";
 if(!name||!email||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
  showError(translate("Please enter your name and a valid email.","Indica tu nombre y un correo válido."));E(!name?"name":"email").focus();return
 }
 if(!state.date||!parseTime(state.time)){
  showError(translate("Please select a date and a time.","Selecciona una fecha y una hora."));E("dates").scrollIntoView({behavior:"smooth"});return
 }
 if(wantsBooking&&!biz.available.includes(state.time)){
  showError(translate("This time has not been verified as available. Choose an open time.","Ese horario no está verificado como disponible. Elige uno libre."));return
 }
 const addons=[...document.querySelectorAll((state.space==="Commercial"?".commercial-extras":".residential-extras")+" input[data-addon-id]:checked")];
 const isBusiness=state.space==="Commercial";
 const contactNotes=E("notes").value.trim();
 const commercialNotes=isBusiness?[
  E("commercialNotes").value.trim(),E("commercialScope").value.trim(),
  "Commercial add-ons: "+addons.map(x=>x.dataset.commercialExtra).filter(Boolean).join(", ")
 ].filter(Boolean).join(" · "):"";
 const body={
  booking_key:bookingKey,
  request_type:wantsBooking?"booking":"quote",
  request_intent:wantsBooking?"booking":state.intent,
  preferred_language:biz.language,
  service_id:biz.service.id,
  service_name:biz.service.name,
  selected_addon_ids:addons.map(x=>x.dataset.addonId),
  extras:addons.map(x=>x.dataset.extra||x.dataset.commercialExtra),
  frequency:isBusiness?E("commercialFrequency").value:state.frequency,
  property_type:isBusiness?E("commercialType").value:E("homeType").value,
  square_footage:isBusiness?E("commercialSqft").value:E("sqft").options[E("sqft").selectedIndex]?.textContent,
  bedrooms:isBusiness?"":String(state.beds),bathrooms:isBusiness?"":String(state.baths),
  customer_name:name,customer_email:email,customer_phone:E("phone").value,
  service_address:E("address").value,notes:[contactNotes,commercialNotes].filter(Boolean).join(" · "),
  requested_date:state.date,requested_time:state.time,
  source:"booking_page",estimate_display:E("estimateValue").textContent
 };
 button.disabled=true;biz.sending=true;button.textContent=translate("Sending…","Enviando…");
 try{
  const data=await api("tle-booking-flow-inquiry",body);
  E("liveError").classList.remove("show");
  titleText(E("modalTitle"),data.booking_confirmed?translate("Booking confirmed!","¡Reserva confirmada!"):
   state.intent==="estimate"?translate("Estimate request received.","Solicitud de estimado recibida."):
    translate("Quote request received.","Solicitud de cotización recibida."));
  titleText(E("modalCopy"),data.booking_confirmed?
   translate("Your appointment is reserved. Check your inbox for the booking confirmation.","Tu cita está reservada. Revisa tu correo para la confirmación."):
   translate("The business received your request. Watch your inbox for their reply, and check Spam or Promotions if you do not see it.","El negocio recibió tu solicitud. Revisa tu correo, incluidos Spam o Promociones, para los próximos pasos."));
  E("confirmationSteps").textContent=translate("✓ Request saved · ✓ Business notified · ✓ Email receipt initiated","✓ Solicitud guardada · ✓ Negocio notificado · ✓ Envío de recibo iniciado");
  E("seeOwnerAfter").hidden=true;E("demoOffer").hidden=true;
  E("modal").classList.add("open");
  button.textContent=translate("Request received ✓","Solicitud recibida ✓");
 }catch(err){showError(String(err.message||err));button.disabled=false;button.textContent=translate("Try again →","Intentar de nuevo →")}
 finally{biz.sending=false}
}
try{
 if(!/^[0-9a-f-]{10,100}$/i.test(bookingKey)&&bookingKey.length<16)throw Error("Invalid booking link.");
 document.querySelector(".booking").style.visibility="hidden";
 const model=await api("tle-booking-flow-pricing",{action:"public",booking_key:bookingKey});
 if(!model?.services?.length)throw Error("There are no published services.");
 biz.config=model;
 if(params.get("lang")!=="en"&&params.get("lang")!=="es"&&model.language==="es"){
  params.set("lang","es");location.replace(location.pathname+"?"+params.toString());return;
 }
 window.TLE_LIVE_CONFIG=model;
 renderBrand();renderAddons();renderServices();renderDates();
 window.TLE_LIVE_RENDER=liveRender;
 document.querySelector(".booking").style.visibility="visible";
 document.querySelectorAll("[data-space],[data-intent]").forEach(x=>x.addEventListener("click",()=>{setTimeout(refreshSlots,0)}));
 document.querySelectorAll("#frequency button").forEach(x=>x.addEventListener("click",()=>{state.discount=0;liveRender()}));
 E("submitBtn").addEventListener("click",submitLive);
 refreshSlots();render();
}catch(err){
 document.querySelector(".booking").style.visibility="visible";
 showError(translate("This Booking Page isn't available yet. Please contact the business.","Esta página de reservas todavía no está disponible. Contacta al negocio.")+" "+String(err.message||""),true);
}
})();
