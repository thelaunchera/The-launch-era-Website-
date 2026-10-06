(()=>{
  const GA_ID="G-N5BHMC432Q";
  const host=String(location.hostname||"").toLowerCase();
  const ua=String(navigator.userAgent||"");
  const allowedHost=host==="thelaunchera.com"||host==="www.thelaunchera.com";
  const automation=Boolean(
    navigator.webdriver ||
    /HeadlessChrome|PhantomJS|Google-InspectionTool|Lighthouse|PageSpeed/i.test(ua)
  );
  const enabled=allowedHost&&!automation;
  window.__tleAnalyticsEnabled=enabled;

  const cleanPath=()=>location.pathname||"/";
  const cleanLocation=()=>location.origin+cleanPath();

  window.tleTrackEvent=(name,params={})=>{
    try{
      if(!window.__tleAnalyticsEnabled||typeof window.gtag!=="function") return;
      window.gtag("event",name,{
        site_surface:"website",
        page_path:cleanPath(),
        page_location:cleanLocation(),
        ...params
      });
    }catch{}
  };

  window.tleTrackPage=(path=cleanPath(),title=document.title)=>{
    try{
      if(!window.__tleAnalyticsEnabled||typeof window.gtag!=="function") return;
      const clean=String(path||"/").split("?")[0].split("#")[0]||"/";
      window.gtag("event","page_view",{
        site_surface:"website",
        page_path:clean,
        page_location:location.origin+clean,
        page_title:title||document.title
      });
    }catch{}
  };

  if(!enabled) return;

  window.dataLayer=window.dataLayer||[];
  window.gtag=window.gtag||function(){window.dataLayer.push(arguments);};
  const script=document.createElement("script");
  script.async=true;
  script.src="https://www.googletagmanager.com/gtag/js?id="+encodeURIComponent(GA_ID);
  document.head.appendChild(script);
  window.gtag("js",new Date());
  window.gtag("config",GA_ID,{send_page_view:false});
  window.tleTrackPage();

  let qualified=false;
  const qualify=(event)=>{
    if(qualified) return;
    qualified=true;
    window.tleTrackEvent("qualified_visit",{interaction_type:event?.type||"interaction"});
    ["pointerdown","touchstart","keydown"].forEach(type=>window.removeEventListener(type,qualify,true));
  };
  ["pointerdown","touchstart","keydown"].forEach(type=>window.addEventListener(type,qualify,{capture:true,passive:true}));

  document.addEventListener("click",(event)=>{
    const link=event.target?.closest?.("a[href]");
    if(!link) return;
    let target;
    try{target=new URL(link.href,location.href);}catch{return;}
    const servicePath=cleanPath();
    const serviceName=servicePath.startsWith("/cleaning-app")?"cleaning_web_app":servicePath.startsWith("/start")?"booking_lead_automation":servicePath.startsWith("/automation")?"website_automation":servicePath.startsWith("/virtual-assistant")?"virtual_assistant":null;
    if(serviceName&&target.hostname==="thelaunchera.com"&&target.pathname!==servicePath){ window.tleTrackEvent("service_view",{service_name:serviceName,destination:target.pathname}); }
    if(link.dataset?.catalogItem){
      window.tleTrackEvent("catalog_item_click",{item:link.dataset.catalogItem,link_path:target.pathname});
    }else if(link.hasAttribute("data-demo-offer")){
      window.tleTrackEvent("demo_offer_click",{link_path:target.pathname});
    }else if(target.pathname.includes("/demo-booking")){
      window.tleTrackEvent("booking_demo_view",{link_path:target.pathname});
    }else if(target.pathname.includes("/booking-checkout")||target.pathname.includes("/pay/booking-flow")){
      window.tleTrackEvent("checkout_click",{product:"booking_lead_automation",link_path:target.pathname});
    }else if(target.hostname==="app.thelaunchera.com"){
      window.tleTrackEvent("trial_start",{product:"cleaning_web_app",link_path:target.pathname||"/"});
    }
  },true);
})();