"use strict"

let canvas = document.querySelector("#canvas");
let ctx = canvas.getContext("2d");

const width = canvas.width;
const height = canvas.height;

var start = null;

const radius1 = width/5;

var wave = [];
var startx = width/2;
var animate;
var requestAnimate = true;


let freqDial = document.querySelector("#frequency");
var baseFrequency = (freqDial.value*10)+1;
freqDial.addEventListener("input", function(e) {
    baseFrequency = Math.floor(e.target.value * 10) +1;
});

let trucDial = document.querySelector("#nsticks");
var numberofsticks = trucDial.value;
trucDial.addEventListener("input", function(e) {
    numberofsticks = trucDial.value;
})

var frequency = (n) => baseFrequency/n;

function XYlist(nsticks, progress) {
    let XYlist = []
    XYlist.push({x: radius1*Math.cos(progress/frequency(1)) + width/3, y: radius1*Math.sin(progress/frequency(1)) + height/2});
    let count = 1;
    for (let i = 1; i <= nsticks; ++i) {
        count += 2;
        let radius = radius1/count;
        XYlist.push({x: radius*Math.cos(progress/frequency(count)) + XYlist[i-1].x, y: radius*Math.sin(progress/frequency(count)) + XYlist[i-1].y});
    }
    return XYlist;
}

function mainloop(timestamp) {
    if (!start) { start = timestamp;}
    let progress = timestamp - start;

    let sticks = XYlist(numberofsticks, progress);

    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.ellipse(width/3, height/2, radius1, radius1, 0, 0, 2*Math.PI);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(width/3, height/2);

    for (let i of sticks) {
        ctx.lineTo(i.x, i.y);
        ctx.stroke();
    }
    
    ctx.beginPath();
    ctx.ellipse(sticks[0].x, sticks[0].y, 2, 2, 0, 0, 2*Math.PI);
    ctx.fill();

    wave.push({x: startx + 50,y: sticks[sticks.length -1].y});

    ctx.beginPath();
    ctx.moveTo(sticks[sticks.length -1].x, sticks[sticks.length -1].y);
    ctx.lineTo(wave[wave.length -1].x, sticks[sticks.length -1].y);
    ctx.stroke();
    
    ctx.beginPath();
    for (let i = 0; i < wave.length; ++i) {
        ctx.lineTo(wave[i].x, wave[i].y);
        wave[i].x += 0.5;
    }
    ctx.stroke();

    if (wave.length > 750) {
        wave.shift();
    }

    animate = window.requestAnimationFrame(mainloop);       
}
animate = window.requestAnimationFrame(mainloop);

