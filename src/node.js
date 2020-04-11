'use strict';
/* A node (a dot on the screen).  
 * @author:    Caleb Nii Tetteh Tsuru Addy(Virus) 
 * @date:      10th April, 2020 
 * @email:     100percentvirusdownloading@gmail.com 
 * @twitter:   @niitettehtsuru
 * @github :   https://github.com/niitettehtsuru/MeshMirror
 * @codepen:   https://codepen.io/niitettehtsuru/pen/GRpgvWw
 * @license:   GNU General Public License v3.0
 */
class Node
{ 
    constructor(screenWidth,screenHeight)
    {     
        this.id                 = Math.floor((Math.random() * 100000000) + 1);
        this.screenWidth        = screenWidth; 
        this.screenHeight       = screenHeight;    
        this.radius             = 2;  
        this.color              = 'black'; 
        this.velocityMagnitude  = 1.5; 
        this.velocity           = this.getRandomVelocity(); 
        this.linkDistance       = 100;//The maximum distance required for a node to link to other nodes
        this.borderIsTouched    = false;//true if node touches the bottom border, false otherwise 
        //set the starting position of the node on the canvas  
        this.xcoordOfCenter     = Math.floor((Math.random() * this.screenWidth) + 1);//a random number between 1 and the width of the screen.  
        this.ycoordOfCenter     = Math.floor((Math.random() * this.screenHeight) + 1);//a random number between 1 and the height of the screen.  
    } 
    /**
    * Set the node in a random direction on start
    * @return  {object} The direction of the node (depicted as x and y coordinates).  
    */
    getRandomVelocity() 
    {  
        var x = Math.random() > 0.5? -this.velocityMagnitude: this.velocityMagnitude;//flip a coin to decide if node moves forwards or downwards
        var y = Math.random() > 0.5? -this.velocityMagnitude: this.velocityMagnitude;//flip a coin to decide if node moves upwards or downwards 
        return {x:x, y:y};
    }  
    getColor() 
    {  
        return this.color; 
    } 
    /**
    * Let node correspond to window resizing.
    * @param  {number} screenHeight The height of the screen. 
    * @param  {number} screenWidth  The width of the screen.  
    * @param  {number} dy           The percentage change in browser window height 
    * @param  {number} dx           The percentage change in browser window width  .  
    */
    refreshScreenSize(screenHeight,screenWidth,dx,dy)
    {   
        this.screenHeight       = screenHeight;  
        this.screenWidth        = screenWidth; 
        this.xcoordOfCenter     *= dx; 
        this.ycoordOfCenter     *= dy;  
    }   
    //Get some basic details about this node  
    getNodeParams()
    {
        return {
            id:this.id,
            x:this.xcoordOfCenter, 
            yImage:this.ycoordOfCenter,
            yMirror:this.screenHeight + (this.screenHeight -this.ycoordOfCenter),
            borderIsTouched: this.borderIsTouched
        }; 
    }
    draw(ctx,allNodeParams)
    {    
        //draw the image node
        ctx.beginPath(); 
        ctx.arc(this.xcoordOfCenter,this.ycoordOfCenter,this.radius,0,2*Math.PI); 
        ctx.fillStyle = this.getColor() ; 
        ctx.fill();  
        ctx.strokeStyle =  this.colorAlpha;
        ctx.stroke(); 
        //draw the mirror node
        ctx.beginPath();  
        ctx.arc(this.xcoordOfCenter,this.screenHeight + (this.screenHeight -this.ycoordOfCenter) ,this.radius,0,2*Math.PI); 
        ctx.fillStyle = this.getColor() ; 
        ctx.fill();  
        ctx.strokeStyle =  this.colorAlpha;
        ctx.stroke();
        //draw link to other nodes that are within link distance
        this.drawLinkToOtherNodes(allNodeParams,ctx); 
        //if border is touched, draw nodes again and paint them white. This creates a twinkling effect. 
        if(this.borderIsTouched)
        {
            //draw the image node
            ctx.beginPath(); 
            ctx.arc(this.xcoordOfCenter,this.ycoordOfCenter,this.radius,0,2*Math.PI); 
            ctx.fillStyle = 'white' ; 
            ctx.fill();  
            ctx.strokeStyle =  this.colorAlpha;
            ctx.stroke(); 
            //draw the mirror node
            ctx.beginPath();  
            ctx.arc(this.xcoordOfCenter,this.screenHeight + (this.screenHeight -this.ycoordOfCenter) ,this.radius,0,2*Math.PI); 
            ctx.fillStyle = 'white' ; 
            ctx.fill();  
            ctx.strokeStyle =  this.colorAlpha;
            ctx.stroke(); 
        } 
    }    
    drawLinkToOtherNodes(coordinates,ctx)
    { 
        var xOfThisNode         = this.xcoordOfCenter,
            yOfThisNode         = this.ycoordOfCenter, 
            yMirrorOfThisNode   = this.screenHeight + (this.screenHeight -this.ycoordOfCenter),
            color               = this.color,  
            linkDistance        = this.linkDistance,
            borderIsTouched     = false,
            id                  = this.id; 
        coordinates.forEach(function(coord) 
        { 
            //to prevent the drawing of double lines. For any two nodes, only the one with the higher id can draw the line. 
            //the one with the lower id must not draw the line.
            if(id > coord.id)
            {
                var xOfOtherNode = coord.x; 
                var yOfOtherNode = coord.yImage;   
                var dx = xOfOtherNode - xOfThisNode; 
                var dy = yOfOtherNode - yOfThisNode;  
                var distance = Math.sqrt(dx*dx + dy*dy);
                if( distance <= linkDistance)//if another node is within link distance, draw the link
                {
                    //draw link for image
                    ctx.strokeStyle = color;
                    ctx.lineWidth = 0.3; 
                    ctx.beginPath();  
                    ctx.moveTo(xOfThisNode, yOfThisNode);  
                    ctx.lineTo(xOfOtherNode, yOfOtherNode);   
                    ctx.stroke();
                    ctx.closePath();  
                    //draw link for mirror
                    var yMirrorOfOtherNode = coord.yMirror;  
                    ctx.strokeStyle = color;
                    ctx.lineWidth = 0.3; 
                    ctx.beginPath();  
                    ctx.moveTo(xOfThisNode, yMirrorOfThisNode);  
                    ctx.lineTo(xOfOtherNode, yMirrorOfOtherNode);   
                    ctx.stroke();
                    ctx.closePath(); 
                    //if the other node just touched its border, set this node's property to true. 
                    //this ensures that all nodes within the linkage chain twinkle. 
                    if(coord.borderIsTouched)
                    {
                        borderIsTouched = coord.borderIsTouched;
                    }
                }  
            } 
             
        });  
        this.borderIsTouched = borderIsTouched;
    }  
    update(deltaTime)
    {    
        this.borderIsTouched = false; 
        //randomly change the angle of movement in the current direction 
        this.velocity.x += Math.random() > 0.5? -Math.random()/20:Math.random()/20; 
        this.velocity.y += Math.random() > 0.5? -Math.random()/20:Math.random()/20; 
        //keep the node moving in its current direction  
        this.xcoordOfCenter += this.velocity.x;//if node is going left or right at an angle, keep it going
        this.ycoordOfCenter += this.velocity.y;//if node is going up or down at an angle, keep it going  
        if(this.xcoordOfCenter - this.radius < 0)//if node touches the left wall of the canvas
        {
            this.velocity.x = -this.velocity.x;//move to the right 
            this.velocity.y = Math.random() > 0.5? -this.velocityMagnitude: this.velocityMagnitude ;//flip a coin to move either up or down
            this.xcoordOfCenter = 10;//push the node slightly away from the left wall
        } 
        if(this.xcoordOfCenter + this.radius> this.screenWidth)//if node touches the right wall
        {
            this.velocity.x = -this.velocity.x;//move to the left
            this.velocity.y = Math.random() > 0.5? -this.velocityMagnitude: this.velocityMagnitude ;//flip a coin to move either up or down 
            this.xcoordOfCenter = this.screenWidth - 10;//push the node slightly away from the right wall
        } 
        if( this.ycoordOfCenter - this.radius< 0)//if node touches the top of the wall 
        {
            this.velocity.y = -this.velocity.y;//move down 
            this.velocity.x = Math.random() > 0.5? -this.velocityMagnitude: this.velocityMagnitude ;//flip a coin to move either left or right
            this.ycoordinateOfCenter = 10;//push the node slightly down
        } 
        if(this.ycoordOfCenter + this.radius > this.screenHeight)//if node touches the bottom of the wall
        { 
            this.velocity.y = -this.velocity.y;//move up  
            this.velocity.x = Math.random() > 0.5? -this.velocityMagnitude: this.velocityMagnitude ;//flip a coin to move either left or right 
            this.ycoordinateOfCenter = this.screenHeight - 10;//push the node slightly up
            this.borderIsTouched   = true; 
        } 
    }      
}