 // ==UserScript==
 // @name         Flex Reduce Details
 // @namespace    http://tampermonkey.net/
 // @version      14.0
 // @description  Shows Flex Reduce Demand table inside QBAR
 // @author       Samuel Sumanth(@samumzz)
 // @match        https://na.coworkassignment.science.last-mile.a2z.com/*
 // @updateURL    https://github.com/samuel2105/Scheduler-Install/raw/main/flexreducedemand.user.js
 // @downloadURL  https://github.com/samuel2105/Scheduler-Install/raw/main/flexreducedemand.user.js
 // @grant        none
 // ==/UserScript==


(function () {
'use strict';

let flexBox=null;
let flexContent=null;
let lastStation="";
let lastCycle="";

// ---------- CREATE BOX ----------
function createBox(){
if(flexBox) return;

flexBox=document.createElement("div");

flexBox.style.position="fixed";
flexBox.style.bottom="20px";
flexBox.style.right="20px";
flexBox.style.width="520px";
flexBox.style.height="320px";
flexBox.style.background="#fafafa";
flexBox.style.border="1px solid #cfcfcf";
flexBox.style.zIndex="999999";
flexBox.style.padding="10px";
flexBox.style.overflow="hidden";
flexBox.style.fontSize="13px";
flexBox.style.boxShadow="0 4px 16px rgba(0,0,0,0.15)";
flexBox.style.borderRadius="10px";
flexBox.style.cursor="move";
flexBox.style.fontFamily="Segoe UI,Arial";

// ---------- HEADER ----------
const title=document.createElement("div");
title.innerText="Flex Reduce Details";
title.style.textAlign="center";
title.style.fontSize="16px";
title.style.fontWeight="700";
title.style.color="#ff3b3b";
title.style.background="#000000";
title.style.padding="7px";
title.style.borderRadius="6px";
title.style.marginBottom="6px";
title.style.letterSpacing="1px";
flexBox.appendChild(title);

// ---------- CONTENT ----------
flexContent=document.createElement("div");
flexContent.style.height="calc(100% - 42px)";
flexContent.style.overflow="auto";   // 🔥 SCROLL ENABLED
flexContent.style.background="#ffffff";
flexContent.style.borderRadius="6px";
flexContent.style.padding="4px";
flexBox.appendChild(flexContent);

document.body.appendChild(flexBox);

makeDraggable(flexBox);
makeResizable(flexBox);
}

// ---------- REMOVE ----------
function removeBox(){
if(flexBox) flexBox.remove();
flexBox=null;
}

// ---------- DRAG ----------
function makeDraggable(el){
let isDown=false,offsetX=0,offsetY=0;

el.addEventListener("mousedown",(e)=>{
isDown=true;
offsetX=e.clientX-el.offsetLeft;
offsetY=e.clientY-el.offsetTop;
el.style.right="auto";
el.style.bottom="auto";
});

document.addEventListener("mousemove",(e)=>{
if(!isDown) return;
el.style.left=(e.clientX-offsetX)+"px";
el.style.top=(e.clientY-offsetY)+"px";
});

document.addEventListener("mouseup",()=>isDown=false);
}

// ---------- RESIZE ----------
function makeResizable(el){

const resizer=document.createElement("div");
resizer.style.width="14px";
resizer.style.height="14px";
resizer.style.background="#888";
resizer.style.position="absolute";
resizer.style.left="0";
resizer.style.top="0";
resizer.style.cursor="nwse-resize";
resizer.style.borderRadius="0 0 6px 0";
el.appendChild(resizer);

let startX,startY,startW,startH,startLeft,startTop;

resizer.addEventListener("mousedown",(e)=>{
e.stopPropagation();

startX=e.clientX;
startY=e.clientY;
startW=el.offsetWidth;
startH=el.offsetHeight;
startLeft=el.offsetLeft;
startTop=el.offsetTop;

el.style.right="auto";
el.style.bottom="auto";

document.addEventListener("mousemove",resize);
document.addEventListener("mouseup",stop);
});

function resize(e){

let dx=e.clientX-startX;
let dy=e.clientY-startY;

let newWidth=startW-dx;
let newHeight=startH-dy;

if(newWidth<360) newWidth=360;
if(newHeight<220) newHeight=220;

el.style.width=newWidth+"px";
el.style.height=newHeight+"px";
el.style.left=(startLeft+dx)+"px";
el.style.top=(startTop+dy)+"px";

// auto font scaling
let scale=Math.max(12,newWidth/42);
el.style.fontSize=scale+"px";
}

function stop(){
document.removeEventListener("mousemove",resize);
}
}

// ---------- FETCH ----------
async function findFlexTask(station){

const MAX_PAGES=60;

for(let page=1;page<=MAX_PAGES;page++){

const url=`https://na.coworkassignment.science.last-mile.a2z.com/TasksDataHandler?pageIndex=${page}&pageSize=20`;
const res=await fetch(url,{credentials:"include"});
const json=await res.json();

if(!json?.data?.length) break;

for(const task of json.data){
if(task.Station===station && task.Cycle?.toUpperCase().includes("FLEX")){
return task;
}
}
}
return null;
}

// ---------- MAIN ----------
async function runChecker(){

const stationInput=document.querySelector("#stationCode")||document.querySelector("input[placeholder='Station Code']");
const cycleDropdown=document.querySelector("#cycleSelection")||document.querySelectorAll("select")[1];

if(!stationInput||!cycleDropdown) return;

const station=stationInput.value?.trim();
const cycle=cycleDropdown.options[cycleDropdown.selectedIndex]?.text?.trim();

if(!station||!cycle) return;
if(station===lastStation && cycle===lastCycle) return;

lastStation=station;
lastCycle=cycle;

if(!cycle.toUpperCase().includes("FLEX")){
removeBox();
return;
}

createBox();
flexContent.innerHTML="Fetching flex data...";

try{

const task=await findFlexTask(station);

if(!task){
flexContent.innerHTML="No Flex task found";
return;
}

const flexData=task["Flex Demand Table"]||task["Flex Reduce Demand Table"];

if(!flexData?.length){
flexContent.innerHTML="No flex data yet";
return;
}

// ---------- TABLE ----------
let html=`
<table style="width:100%;border-collapse:collapse;text-align:center;">
<tr style="background:#f1f1f1;color:#333;font-weight:600">
<th style="padding:6px">#Flex</th>
<th>Duration</th>
<th>Cycle</th>
<th>Departure</th>
</tr>
`;

flexData.forEach(r=>{

let cycle=r["Cycle"]||"";
let cycleStyled=cycle;

if(cycle==="SAME_DAY_SUNRISE"){
cycleStyled=`<span style="background:#f4f1a1;padding:2px 6px;border-radius:4px">${cycle}</span>`;
}
if(cycle==="SAME_DAY_AM"){
cycleStyled=`<span style="background:#cfe8ff;padding:2px 6px;border-radius:4px">${cycle}</span>`;
}

html+=`
<tr style="border-bottom:1px solid #eee">
<td style="padding:6px">${r["# Flex"]||""}</td>
<td>${r["Route Duration (hour)"]||""}</td>
<td>${cycleStyled}</td>
<td>${r["Estimated Departure time"]||""}</td>
</tr>`;
});

html+="</table>";

flexContent.innerHTML=html;

}catch(e){
console.log(e);
flexContent.innerHTML="Error loading data";
}
}

setInterval(runChecker,2500);

})();
