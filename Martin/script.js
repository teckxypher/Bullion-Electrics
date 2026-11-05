
const BULLION = {
  adminUser: "admin",
  adminPass: "Bullion@123",
  services: [
    {title:"Electrical Wiring", text:"Complete domestic and commercial wiring, rewiring and circuit upgrades.", img:"images/wiring.jpg"},
    {title:"Socket & Breaker Installation", text:"Safe installation and replacement of sockets, breakers and distribution points.", img:"images/socket.jpg"},
    {title:"Electrical Fault Diagnosis", text:"Fast tracing of short circuits, tripping, outages and unstable electrical systems.", img:"images/wiring2.jpg"},
    {title:"Lighting Solutions", text:"Indoor, outdoor, security and energy-efficient lighting installation.", img:"images/light.jpg"},
    {title:"Solar & Backup Power", text:"Solar power, inverters, batteries and backup system installation.", img:"images/solar.jpg"},
    {title:"Generator Installation", text:"Generator wiring, changeover systems, servicing and load planning.", img:"images/gen.jpg"},
    {title:"Preventive Maintenance", text:"Scheduled inspections to reduce failures, hazards and downtime.", img:"images/maint.jpg"},
    {title:"Emergency Electrical Response", text:"Rapid support for dangerous faults, shocks, sparks and power failures.", img:"images/emerg.jpg"}
  ]
};

function $(s){return document.querySelector(s)}
function getStore(k,f=[]){try{return JSON.parse(localStorage.getItem(k)) ?? f}catch(e){return f}}
function setStore(k,v){localStorage.setItem(k,JSON.stringify(v))}
function escapeHTML(s=""){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}

function injectChrome(){
  const side = document.createElement("aside");
  side.className="side";
  side.id="sideMenu";
  const links=[
    ["index.html","Home"],["services.html","Services"],["electrical-wiring.html","Electrical Wiring"],
    ["socket-breakers.html","Sockets & Breakers"],["fault-diagnosis.html","Fault Diagnosis"],
    ["emergency.html","Emergency Response"],["lighting.html","Lighting"],
    ["solar.html","Solar & Backup"],["generator.html","Generator"],
    ["maintenance.html","Maintenance"],["projects.html","Projects"],
    ["pricing.html","Pricing"],["booking.html","Book a Service"],
    ["testimonials.html","Testimonials"],["faq.html","FAQ"],
    ["safety.html","Electrical Safety"],["contact us.html","Contact Us"],
    ["about.html","About Bullion"],["admin.html","Admin Login"]
  ];
  const current=location.pathname.split("/").pop() || "index.html";
  side.innerHTML=`<div class="side-head"><div class="brand"><div class="logo">⚡</div><span>Bullion Electrix</span></div><button class="icon-btn" data-close>×</button></div>
  <div class="side-nav">${links.map(([href,label])=>`<a href="${href}" class="${href.endsWith(current) || (current==="index.html"&&href==="index.html")?"active":""}">${label}</a>`).join("")}</div>
  <div class="side-bottom"><div class="toggle"><span>Dark mode</span><label class="switch"><input id="themeToggle" type="checkbox"><span class="slider"></span></label></div><a class="btn primary" style="width:100%" href="admin.html">Log in as admin</a><p style="font-size:.75rem">Demo admin area. Replace credentials and add a backend before production use.</p></div>`;
  document.body.appendChild(side);
  const overlay=document.createElement("div"); overlay.className="overlay"; overlay.id="overlay"; document.body.appendChild(overlay);
  document.querySelectorAll("[data-menu]").forEach(b=>b.addEventListener("click",()=>{side.classList.add("open");overlay.classList.add("show")}));
  side.querySelector("[data-close]").addEventListener("click",closeMenu); overlay.addEventListener("click",closeMenu);
  function closeMenu(){side.classList.remove("open");overlay.classList.remove("show")}
  const toggle=$("#themeToggle");
  const saved=localStorage.getItem("bullion-theme");
  if(saved==="light"){document.body.classList.add("light");toggle.checked=false}else toggle.checked=true;
  toggle.addEventListener("change",()=>{document.body.classList.toggle("light",!toggle.checked);localStorage.setItem("bullion-theme",toggle.checked?"dark":"light")});
}
function injectLoader(){
  const l=document.createElement("div"); l.className="loader"; l.id="loader";
  l.innerHTML='<div class="loader-inner"><div class="spinner"></div><strong>Powering Bullion Electrix</strong><div class="load-line"></div><div class="load-line" style="width:70%;margin-left:auto;margin-right:auto"></div></div>';
  document.body.prepend(l);
  window.addEventListener("load",()=>setTimeout(()=>l.classList.add("hide"),450));
}
function toast(msg){let t=$("#toast");if(!t){t=document.createElement("div");t.id="toast";t.className="toast glass";document.body.appendChild(t)}t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2800)}

document.addEventListener("DOMContentLoaded",()=>{
  injectLoader(); injectChrome();
  document.querySelectorAll("form[data-store]").forEach(form=>{
    form.addEventListener("submit",e=>{
      e.preventDefault();
      const data=Object.fromEntries(new FormData(form).entries());
      const key=form.dataset.store; const arr=getStore(key,[]); arr.unshift({...data,date:new Date().toLocaleString()}); setStore(key,arr);
      form.reset(); toast("Request received. Bullion Electrix will contact you.");
      const n=form.querySelector(".notice"); if(n){n.textContent="Submitted successfully.";n.classList.add("show","success")}
    })
  });
  document.querySelectorAll("[data-year]").forEach(x=>x.textContent=new Date().getFullYear());
  const serviceBox=$("#serviceCards");
  if(serviceBox){
    const custom=getStore("bullion-custom-services",[]);
    [...BULLION.services,...custom].forEach(s=>serviceBox.insertAdjacentHTML("beforeend",`<article class="card glass"><img src="${s.img||"../images/wiring.svg"}" alt=""><div class="icon">⚡</div><h3>${escapeHTML(s.title)}</h3><p>${escapeHTML(s.text)}</p><a class="btn" href="booking.html">Request service →</a></article>`));
  }
  if($("#adminLogin")) setupAdminLogin();
  if($("#dashboard")) setupDashboard();
});

function setupAdminLogin(){
  $("#adminLogin").addEventListener("submit",e=>{
    e.preventDefault(); const u=$("#adminUser").value.trim(), p=$("#adminPass").value;
    if(u===BULLION.adminUser && p===BULLION.adminPass){localStorage.setItem("bullion-admin","true");location.href="Dashboard.html"}
    else {$("#adminError").textContent="Invalid demo credentials.";$("#adminError").classList.add("show","error")}
  });
}
function setupDashboard(){
  if(localStorage.getItem("bullion-admin")!=="true"){location.href="admin.html";return}
  const requests=getStore("contactRequests",[]), bookings=getStore("bookingRequests",[]), custom=getStore("bullion-custom-services",[]);
  $("#requestCount").textContent=requests.length; $("#bookingCount").textContent=bookings.length; $("#serviceCount").textContent=BULLION.services.length+custom.length;
  const tbody=$("#requestRows");
  [...requests,...bookings].slice(0,12).forEach(r=>tbody.insertAdjacentHTML("beforeend",`<tr><td>${escapeHTML(r.name||"—")}</td><td>${escapeHTML(r.phone||r.email||"—")}</td><td>${escapeHTML(r.service||"General enquiry")}</td><td>${escapeHTML(r.date||"")}</td></tr>`));
  $("#logout").addEventListener("click",()=>{localStorage.removeItem("bullion-admin");location.href="admin.html"});
  $("#serviceForm").addEventListener("submit",e=>{
    e.preventDefault();const d=Object.fromEntries(new FormData(e.currentTarget).entries());
    const a=getStore("bullion-custom-services",[]);a.push({...d,img:"../images/wiring.svg"});setStore("bullion-custom-services",a);e.currentTarget.reset();toast("New service published locally.");setTimeout(()=>location.reload(),500);
  });
}
