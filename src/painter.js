'use strict';
/* Handles creation of nodes and inter-relationships between nodes 
 * @author:    Caleb Nii Tetteh Tsuru Addy(Virus) 
 * @date:      10th April, 2020 
 * @email:     100percentvirusdownloading@gmail.com 
 * @twitter:   @niitettehtsuru
 * @github :   https://github.com/niitettehtsuru/MeshMirror
 * @codepen:   https://codepen.io/niitettehtsuru/pen/GRpgvWw
 * @license:   GNU General Public License v3.0
 */
class Painter
{
    constructor(screenWidth,screenHeight)
    {      
        this.screenWidth   = screenWidth;
        this.screenHeight  = screenHeight;  
        this.backgroundColorCounter = 0;//a number from 0 to 255, used to ensure a smooth color transition 
        this.backgroundColorCounterToggle = true;//true to move 'this.backgroundColorCounter' from 255 to 0, false to move from 0 to 255
        this.backgroundColorCounterDelta = 2; //by how much should the 'this.backgroundColorCounter' increase or decrease
        //a node set is just a bag full of 1 or more nodes. 
        //We can display just one bag of nodes or as many bags of nodes as our machine can handle
        this.numOfNodeSets = 1;
        this.nodeSets      = this.spawnNodesSets(this.numOfNodeSets); 
        document.addEventListener('click',(event)=>//when user clicks on the canvas
        {   
            this.nodeSets      = this.spawnNodesSets(this.numOfNodeSets); 
        });  
    } 
    spawnNodesSets(numOfNodeSets)
    {   
        var nodeSets = []; 
        for( var k = 0; k < numOfNodeSets; k++)
        { 
            var numOfNodes  = Math.floor(this.getRandomNumber(50,100)); 
            //Keep all nodes in the upper half of the screen.   
            //The lower half is reserved for drawing the mirror image of each node
            var screenHeight = this.screenHeight/2;
            var nodes   = [];
            for(var i = 0; i < numOfNodes; i++)
            {   
                nodes.push(new Node(this.screenWidth,screenHeight/*this is the node's screenheight*/));  
            }   
            nodeSets.push(nodes);  
        } 
        return nodeSets; 
    } 
    /**
    * Let canvas respond to window resizing.
    * @param  {number} screenHeight The height of the screen. 
    * @param  {number} screenWidth  The width of the screen.  
    */
    refreshScreenSize(screenHeight,screenWidth)
    { 
        if(this.screenHeight !== screenHeight || this.screenWidth !== screenWidth)//if the screen size has changed
        { 
            var dy          = screenHeight/this.screenHeight;//percentage change in browser window height 
            var dx          = screenWidth/this.screenWidth;  //percentage change in browser window width  
            this.screenHeight = screenHeight;  
            this.screenWidth  = screenWidth;   
            this.nodeSets.forEach(function(nodeSet)
            {
                nodeSet.forEach(function(node)
                {
                    node.refreshScreenSize(screenHeight/2,screenWidth,dx,dy);//adjust the screen size of each node 
                });  
            });
        } 
    } 
    /**
    * Returns a random number between min (inclusive) and max (exclusive)
    * @param  {number} min The lesser of the two numbers. 
    * @param  {number} max The greater of the two numbers.  
    * @return {number} A random number between min (inclusive) and max (exclusive)
    */
    getRandomNumber(min, max) 
    {
        return Math.random() * (max - min) + min;
    } 
    update(deltaTime)
    {          
        this.nodeSets.forEach(function (nodeSet)//update all nodes
        {     
            nodeSet.forEach(function (node) 
            {      
                node.update(deltaTime);     
            });    
        });   
    }  
    /**
    * Fetches parameters of each and every node in a nodeset(a bag of nodes)
    * @param  {array} nodeSet The set(bag) of nodes  
    * @return {array} The parameters of each node in a nodeset
    */
    getAllNodeParams(nodeSet)
    {
        var allNodeParams = [];    
        nodeSet.forEach(function(node)
        {
            var nodeParam = node.getNodeParams(); 
            allNodeParams.push(nodeParam); 
        });  
        return allNodeParams; 
    }
    /**
    * Draw a line to separate the upper half of the screen from the lower half of the screen
    */
    drawBoundary(ctx)
    { 
        var counter = 0; 
        for(var i = 1; i > 0.7; i-=0.1)
        { 
            var grd = ctx.createLinearGradient(0,0,this.screenWidth,0); 
            grd.addColorStop(0, `rgba(0,0,0,${i})`);
            grd.addColorStop(1, "white"); 
            ctx.strokeStyle = grd;
            ctx.lineWidth = 0.5; 
            ctx.beginPath();   
            ctx.moveTo(0,this.screenHeight/2+(ctx.lineWidth *counter));  
            ctx.lineTo(this.screenWidth, this.screenHeight/2+(ctx.lineWidth *counter));  
            ctx.stroke();
            ctx.closePath();
            counter++; 
        } 
    }
    setBackgroundOfLowerScreen(ctx)
    {
        //draw background color of lower half of screen
        var grd = ctx.createLinearGradient(0, 0,this.screenWidth, 0);
        grd.addColorStop(0, `rgba(25,${this.backgroundColorCounter},230,0.7)`);
        //grd.addColorStop(0, `rgba(${this.backgroundColorCounter},${this.backgroundColorCounter},${this.backgroundColorCounter},0.7)`);
        grd.addColorStop(1, "white");
        //grd.addColorStop(1, "rgba(0,0,0,0.5)");
        ctx.fillStyle = grd;
        ctx.fillRect(0,this.screenHeight/2,this.screenWidth,this.screenHeight/2);  
        /*
        grd.addColorStop(0, `rgba(0,${this.backgroundColorCounter},0,0.5)`);
        grd.addColorStop(1, "white");
        ctx.fillStyle = grd;
        ctx.fillRect(0,this.screenHeight/2,this.screenWidth,this.screenHeight/2);  
        */
    }
    setBackgroundOfUpperScreen(ctx)
    {
        //draw background color of upper half of screen
        var grd = ctx.createLinearGradient(0, 0,this.screenWidth, 0);
        grd.addColorStop(0, `rgba(25,${this.backgroundColorCounter},230,0.3)`); 
        //grd.addColorStop(0, `rgba(${this.backgroundColorCounter},${this.backgroundColorCounter},${this.backgroundColorCounter},0.5)`); 
        grd.addColorStop(1, "white");
        ctx.fillStyle = grd;
        ctx.fillRect(0,0,this.screenWidth,this.screenHeight/2);  
    } 
    draw(ctx)
    {       
        this.setBackgroundOfLowerScreen(ctx);
        this.setBackgroundOfUpperScreen(ctx); 
        //ensure smooth background color transition
        if(this.backgroundColorCounterToggle)//if counter is counting from 0 to 255
        {
            this.backgroundColorCounter+=this.backgroundColorCounterDelta;
            if(this.backgroundColorCounter > 254)
            {
               this.backgroundColorCounterToggle = !this.backgroundColorCounterToggle; 
            } 
        }
        else //if counter is counting from 255 to 0(in reverse)
        {
            this.backgroundColorCounter-=this.backgroundColorCounterDelta;
            if(this.backgroundColorCounter <1)
            {
               this.backgroundColorCounterToggle = !this.backgroundColorCounterToggle; 
            } 
        }  
        for(var i = 0; i < this.nodeSets.length; i++) 
        {   //get parameters of every node in a node set
            var allNodeParams = this.getAllNodeParams(this.nodeSets[i]);
            this.nodeSets[i].forEach(function(node)
            {    
                node.draw(ctx,allNodeParams);//draw each node
            });  
        } 
        this.drawBoundary(ctx);//draw boundary between upper half of screen and lower half of screen 
    }  
}
