import {clickBubble} from "./InfoForm.js";

class Bubble
{
    constructor(cx, cy, rad, label, colour)
    {
        this.cx = cx;
        this.cy = cy;
        this.rad = rad;
        this.label = label;
        this.colour = colour;
        
        this.div = document.createElement("div");
        this.div.style.position = "absolute";

        this.setDimensions(cx, cy, rad);
        this.div.style.backgroundColor = colour;
        this.div.style.textAlign = "center";
        this.div.style.overflow = "hidden";
        this.div.innerHTML = label;
        this.div.style.paddingTop = "2em";
        this.div.style.paddingBottom = "2em";
        this.div.style.cursor = "pointer";
        this.div.style.userSelect = "none";
        this.div.addEventListener("mouseover", overBubble);
        this.div.addEventListener("mouseleave", leaveBubble);
        this.div.addEventListener("click", clickBubble);
        document.getElementById("home_main_bubble").appendChild(this.div);
    }

    /* PURPOSE: This function sets the coordinates, size, and font size of the bubble.
    * It is a function because we want to call this every time the window size changes
    */
    setDimensions(cx, cy, rad)
    {
        this.div.style.left = cx - rad + "px";
        this.div.style.top = cy - rad + "px";
        this.div.style.width = rad * 2 + "px";
        this.div.style.height = rad * 2 + "px";
        this.div.style.borderRadius = rad + "px";
        this.div.style.fontSize = rad / 3 + "px"; 
    }

    intersects(x, y, rad)
    {
        //All the instance variables of Bubble are in percent because we need to
        //be able to scale the bubble if the window changes size
        //Hence, we need to convert all of them to pixels so that we can use
        //them for intersection calculation.

        return Math.sqrt(Math.pow(this.cx - x, 2) + Math.pow(this.cy - y, 2)) + 0.1 < this.rad + rad;
    }
}

class BubbleMenu
{
    constructor()
    {
        this.bubbles = new Array();
    }

    add(rad, label, colour)
    {
        this.bubbles.push(new Bubble(0, 0, rad, label, colour));
    }

    remove(idx)
    {
        if (idx >= 0 && idx < this.bubbles.length)
        {
            document.getElementById("home_main_bubble").removeChild(this.bubbles[idx].div); //remove the bubble from the page

            //remove the bubble from the list of bubbles
            for (let i = idx; i < this.bubbles.length - 1; i++)
                this.bubbles[i] = this.bubbles[i + 1];
            
            this.bubbles.pop();
        }
    }

    setRadius(idx, rad)
    {
        if (idx >= 0 && idx < this.bubbles.length)
            this.bubbles[idx].rad = rad;
    }

    generateBubbles()
    {
        let sources = new Array();
        let rect = document.getElementById("home_main_bubble").getBoundingClientRect();

        if (this.bubbles.length > 0)
        {
          //place the first bubble in the middle of the parent
          let curr = this.bubbles[0];
          curr.cx = rect.width / 2;
          curr.cy = rect.height / 2;
          curr.setDimensions(curr.cx, curr.cy, curr.rad);
    
          if (this.bubbles.length > 1)
          {
            let src = curr;
            let prev = null;
            let keepGoing = true;
            let idx = 2;
            let angle = 0;
    
            //place the second bubble to the left of the first bubble
            curr = this.bubbles[1];
            curr.cx = (src.cx - (src.rad + curr.rad));
            curr.cy = src.cy;
            curr.setDimensions(curr.cx, curr.cy, curr.rad);
            prev = curr;
    
            sources.push(curr);
    
            while (keepGoing && idx < this.bubbles.length)
            {
              curr = this.bubbles[idx];

              //get the instance variables of the bubbles in pixels

              angle = Math.atan2(src.cy - prev.cy, prev.cx - src.cx);
              let c = prev.rad + curr.rad;
              let a = src.rad + curr.rad;
              let b = src.rad + prev.rad;
              let theta = Math.acos((a * a + b * b - c * c) / (2 * a * b));
              angle -= theta;
    
              let cx = src.cx + Math.cos(angle) * a;
              let cy = src.cy - Math.sin(angle) * a;
    
              if (this.validBubble(cx, cy, curr.rad, idx))
              {
                curr.cx = cx;
                curr.cy = cy;
                curr.setDimensions(curr.cx, curr.cy, curr.rad);
                sources.push(curr);
    
                idx++;
                prev = curr;
              } else
              {
                keepGoing = false;
              }
            }
    
            while (idx < this.bubbles.length)
            {
              let i = 0;
    
              while (i < sources.length - 1 && idx < this.bubbles.length)
              {
                src = sources[i];
                prev = sources[i + 1];
                curr = this.bubbles[idx];

                angle = Math.atan2(src.cy - prev.cy, prev.cx - src.cx);
                let c = prev.rad + curr.rad;
                let a = src.rad + curr.rad;
                let b = src.rad + prev.rad;
                let theta = Math.acos((a * a + b * b - c * c) / (2 * a * b));
                angle += theta;
    
                let cx = src.cx + Math.cos(angle) * a;
                let cy = src.cy - Math.sin(angle) * a;
    
                if (this.validBubble(cx, cy, curr.rad, idx))
                {
                    curr.cx = cx;
                    curr.cy = cy;
                    curr.setDimensions(curr.cx, curr.cy, curr.rad);

                    //insert curr to sources as its (i + 1)th element
                    sources.push(0);
                    for (let j = sources.length - 1; j >= i + 2; j--) 
                        sources[j] = sources[j - 1];
                  
                    sources[i + 1] = curr;
                    i += 2;
                    idx++;
                } else
                {
                  i++;
                }
              }
            }
          }
        }

        //shift all the bubbles to the right and downward if there are bubbles that have areas
        //that lie outside the bounds of the parent (to its left and top)

        let minLeft = 0, minTop = 0;

        //figure out the leftmost and topmost bubble (may be different bubbles)
        for (let i = 0; i < this.bubbles.length; i++)
        {
            let bubble = this.bubbles[i];
            let cx = bubble.cx;
            let cy = bubble.cy;
            let rad = bubble.rad;

            if (cx - rad < minLeft)
                minLeft = cx - rad;
            if (cy - rad < minTop)
                minTop = cy - rad;
        }

        //adjust all the bubbles
        for (let i = 0; i < this.bubbles.length; i++)
        {
            let bubble = this.bubbles[i];
            bubble.cx -= minLeft;
            bubble.cy -= minTop;
            bubble.setDimensions(bubble.cx, bubble.cy, bubble.rad);
        }  
    }

    validBubble(x, y, r, n)
    {
        let toReturn = true;

        for (let i = 0; i < n && toReturn; i++)
        {
            if (this.bubbles[i].intersects(x, y, r))
                toReturn = false;
        }

        return toReturn;
    }
}

//change the dimensions of the bubbles if window changes size
window.addEventListener("resize", function()
{
    menu.bubbles.forEach(element => {
        element.setDimensions(element.cx, element.cy, element.rad);
    });
    menu.generateBubbles();
});

export let menu = new BubbleMenu();

function overBubble(e)
{
    let done = false;

    for(let i = 0; i < menu.bubbles.length && !done; i++)
    {
        let bubble = menu.bubbles[i];
        if (e.target === bubble.div)
        {
            bubble.setDimensions(bubble.cx, bubble.cy, bubble.rad * 1.2);
            bubble.div.style.zIndex = 1;
            done = true;
        }
    }
}

function leaveBubble(e)
{
    let done = false;

    for(let i = 0; i < menu.bubbles.length && !done; i++)
    {
        let bubble = menu.bubbles[i];
        if (e.target === bubble.div)
        {
            bubble.setDimensions(bubble.cx, bubble.cy, bubble.rad);
            bubble.div.style.zIndex = 0;
            done = true;
        }
    }
}