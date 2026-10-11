import { webkit } from 'playwright';
const origin='https://thelaunchera.github.io/The-launch-era-Website-/command-center/';
const browser=await webkit.launch({headless:true});
const page=await browser.newPage({viewport:{width:1024,height:1366}});
page.on('pageerror',err=>console.log('PAGE_ERROR',String(err.message).slice(0,350)));
page.on('requestfailed',req=>console.log('FAILED_REQUEST',req.url().slice(0,150),req.failure()?.errorText));
page.on('response',res=>{if(res.status()>=400)console.log('HTTP_'+res.status(),res.url().slice(0,150));});
async function test(name,url,field){
 const response=await page.goto(url,{waitUntil:'domcontentloaded',timeout:22000});
 console.log('HTTP_STATUS',name,response?.status());
 await page.waitForTimeout(name==='main'?12500:1200);
 const state=await page.evaluate(sel=>{
 const input=document.querySelector(sel),loader=document.querySelector('#tleLoading');
 const visible=el=>!!el&&getComputedStyle(el).visibility!=='hidden'&&getComputedStyle(el).display!=='none';
 return {title:document.title,readyState:document.readyState,formVisible:visible(input),loadingVisible:visible(loader)&&!loader.classList.contains('tle-loading-hide'),sdk:typeof window.supabase?.createClient==='function',loadingMessage:loader?.innerText?.slice(0,150),body:document.body.innerText.slice(0,100)}
 },field);
 console.log('STATE',name,JSON.stringify(state));
 await page.screenshot({path:'qa-'+name+'.png'});
 if(!state.formVisible)throw new Error(name+' login form missing in Safari');
 if(name==='main'&&state.loadingVisible&&(!state.loadingMessage||!state.loadingMessage.includes('Try again')))throw new Error('Main login remains blocked under overlay');
}
try{
 await test('light',origin+'access','#signin');
 await test('main',origin+'?app=tle','#authForm');
 console.log('PASS: Independent Safari-compatible Command Center sign-in forms load');
}finally{await browser.close()}
