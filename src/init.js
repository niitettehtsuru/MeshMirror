'use strict'; 
/* Initialises the app. 
 * @author:    Caleb Nii Tetteh Tsuru Addy(Virus) 
 * @date:      10th April, 2020 
 * @email:     100percentvirusdownloading@gmail.com 
 * @twitter:   @niitettehtsuru
 * @github :   https://github.com/niitettehtsuru/MeshMirror
 * @codepen:   https://codepen.io/niitettehtsuru/pen/GRpgvWw
 * @license:   GNU General Public License v3.0
 */
var c                   = document.getElementById("meshMirrorCanvas");
var ctx                 = c.getContext("2d"); 
/**
 * Gets the size of the browser window. 
 * @return {object} The length and breadth of the browser window.
 */
function getBrowserWindowSize() 
{
    var win = window,
    doc     = document,
    docElem = doc.documentElement,
    body    = doc.getElementsByTagName('body')[0],
    browserWindowWidth  = win.innerWidth || docElem.clientWidth || body.clientWidth,
    browserWindowHeight = win.innerHeight|| docElem.clientHeight|| body.clientHeight; 
    return {x:browserWindowWidth-20,y:browserWindowHeight-20}; 
} 
var browserWindowSize   = getBrowserWindowSize(); 
//set size of canvas
c.width                 = browserWindowSize.x; 
c.height                = browserWindowSize.y; 
var SCREEN_WIDTH        = browserWindowSize.x;
var SCREEN_HEIGHT       = browserWindowSize.y;   
var painter             = new Painter(SCREEN_WIDTH,SCREEN_HEIGHT),  
    lastTime            = 100, 
    windowSize;   
function updateWindowSize() 
{
    windowSize     = getBrowserWindowSize();
    c.width        = windowSize.x; 
    c.height       = windowSize.y; 
    SCREEN_WIDTH   = windowSize.x;
    SCREEN_HEIGHT  = windowSize.y;  
} 
function nodeLoop(timestamp)
{       
    updateWindowSize(); //make canvas responsive to window resizing
    ctx.clearRect(0,0,SCREEN_WIDTH,SCREEN_HEIGHT); 
    painter.refreshScreenSize(SCREEN_HEIGHT,SCREEN_WIDTH);//let nodes respond to window resizing  
    let deltaTime  = timestamp - lastTime; 
        lastTime   = timestamp;
    painter.update(deltaTime); 
    painter.draw(ctx);  
    requestAnimationFrame(nodeLoop);  
} 
requestAnimationFrame(nodeLoop); 

 
 