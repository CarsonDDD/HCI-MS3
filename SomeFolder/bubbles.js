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
        document.getElementById("home_main_bubble").appendChild(this.div);
    }

    /* PURPOSE: This function sets the coordinates, size, and font size of the bubble.
    * It is a function because we want to call this every time the window size changes
    */
    setDimensions(cx, cy, rad)
    {
        let r = this.calculateRadius(rad);

        this.div.style.left = this.calculateCenterX(cx) - r + "px";
        this.div.style.top = this.calculateCenterY(cy) - r + "px";
        this.div.style.width = r * 2 + "px";
        this.div.style.height = r * 2 + "px";
        this.div.style.borderRadius = r + "px";
        this.div.style.fontSize = r / 3 + "px"; 
    }

    //The following three functions will convert cx, cy, and rad to pixels (from %)

    calculateRadius(rad)
    { 
        let rect = document.getElementById("home_main_bubble").getBoundingClientRect();
        return (rect.width < rect.height) ? rad * rect.width : rad * rect.height;
    }

    calculateCenterX(cx)
    {
        let rect = document.getElementById("home_main_bubble").getBoundingClientRect();
        return cx * rect.width;
    }

    calculateCenterY(cy)
    {
        let rect = document.getElementById("home_main_bubble").getBoundingClientRect();
        return cy * rect.height;
    }

    intersects(x, y, rad)
    {
        //All the instance variables of Bubble are in percent because we need to
        //be able to scale the bubble if the window changes size
        //Hence, we need to convert all of them to pixels so that we can use
        //them for intersection calculation.
        let cx = this.calculateCenterX(this.cx);
        let cy = this.calculateCenterY(this.cy);
        let r = this.calculateRadius(this.rad);

        return Math.sqrt(Math.pow(cx - x, 2) + Math.pow(cy - y, 2)) + 0.1 < r + rad;
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

    remove(label)
    {
        let idx = -1;

        //look for the bubble with the said label
        for (let i = 0; i < this.bubbles.length && idx == -1; i++)
        {
            if (this.bubbles[i].label === label)
                idx = i;
        }

        if (idx != -1)
        {
            document.getElementById("home_main_bubble").removeChild(this.bubbles[idx].div); //remove the bubble from the page

            //remove the bubble from the list of bubbles
            for (let i = idx; i < this.bubbles.length - 1; i++)
                this.bubbles[i] = this.bubbles[i + 1];
            
            this.bubbles.pop();
        }
    }

    setRadius(label, rad)
    {
        for (let i = 0; i < this.bubbles.length; i++)
        {
            if (this.bubbles[i].label === label)
                this.bubbles[i].rad = rad;
        }
    }

    generateBubbles()
    {
        let sources = new Array();
        let rect = document.getElementById("home_main_bubble").getBoundingClientRect();

        if (this.bubbles.length > 0)
        {
          //place the first bubble in the middle of the parent
          let curr = this.bubbles[0];
          curr.cx = 0.5;
          curr.cy = 0.5;
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
            curr.cx = ((src.cx * rect.width) - (src.calculateRadius(src.rad) + curr.calculateRadius(curr.rad))) / rect.width;
            curr.cy = src.cy;
            curr.setDimensions(curr.cx, curr.cy, curr.rad);
            prev = curr;
    
            sources.push(curr);
    
            while (keepGoing && idx < this.bubbles.length)
            {
              curr = this.bubbles[idx];

              //get the instance variables of the bubbles in pixels
              let srcCX_Px = src.calculateCenterX(src.cx);
              let srcCY_Px = src.calculateCenterY(src.cy);
              let prevCX_Px = prev.calculateCenterX(prev.cx)
              let prevCY_Px = prev.calculateCenterY(prev.cy)
              let prevRad_Px = prev.calculateRadius(prev.rad);
              let currRad_Px = curr.calculateRadius(curr.rad);
              let srcRad_Px = src.calculateRadius(src.rad);

              angle = Math.atan2(srcCY_Px - prevCY_Px, prevCX_Px - srcCX_Px);
              let c = prevRad_Px + currRad_Px;
              let a = srcRad_Px + currRad_Px;
              let b = srcRad_Px + prevRad_Px;
              let theta = Math.acos((a * a + b * b - c * c) / (2 * a * b));
              angle -= theta;
    
              let cx = srcCX_Px + Math.cos(angle) * a;
              let cy = srcCY_Px - Math.sin(angle) * a;
    
              if (this.validBubble(cx, cy, currRad_Px, idx))
              {
                curr.cx = cx / rect.width;
                curr.cy = cy / rect.height;
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

                let srcCX_Px = src.calculateCenterX(src.cx);
                let srcCY_Px = src.calculateCenterY(src.cy);
                let prevCX_Px = prev.calculateCenterX(prev.cx);
                let prevCY_Px = prev.calculateCenterY(prev.cy);
                let prevRad_Px = prev.calculateRadius(prev.rad);
                let currRad_Px = curr.calculateRadius(curr.rad);
                let srcRad_Px = src.calculateRadius(src.rad);

                angle = Math.atan2(srcCY_Px - prevCY_Px, prevCX_Px - srcCX_Px);
                let c = prevRad_Px + currRad_Px;
                let a = srcRad_Px + currRad_Px;
                let b = srcRad_Px + prevRad_Px;
                let theta = Math.acos((a * a + b * b - c * c) / (2 * a * b));
                angle += theta;
    
                let cx = srcCX_Px + Math.cos(angle) * a;
                let cy = srcCY_Px - Math.sin(angle) * a;
    
                if (this.validBubble(cx, cy, currRad_Px, idx))
                {
                  curr.cx = cx / rect.width;
                  curr.cy = cy / rect.height;
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
            let cx = bubble.calculateCenterX(bubble.cx);
            let cy = bubble.calculateCenterY(bubble.cy);
            let rad = bubble.calculateRadius(bubble.rad);

            if (cx - rad < minLeft)
                minLeft = cx - rad;
            if (cy - rad < minTop)
                minTop = cy - rad;
        }

        minLeft /= rect.width;
        minTop /= rect.height;

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
    b.bubbles.forEach(element => {
        element.setDimensions(element.cx, element.cy, element.rad);
    });
    b.generateBubbles();
});

function overBubble(e)
{
    let done = false;

    for(let i = 0; i < b.bubbles.length && !done; i++)
    {
        let bubble = b.bubbles[i];
        if (e.target === bubble.div)
        {
            bubble.setDimensions(bubble.cx, bubble.cy, bubble.rad * 1.3);
            bubble.div.style.zIndex = 1;
            done = true;
        }
    }
}

function leaveBubble(e)
{
    let done = false;

    for(let i = 0; i < b.bubbles.length && !done; i++)
    {
        let bubble = b.bubbles[i];
        if (e.target === bubble.div)
        {
            bubble.setDimensions(bubble.cx, bubble.cy, bubble.rad);
            bubble.div.style.zIndex = 0;
            done = true;
        }
    }
}


let b = new BubbleMenu();
let n = Math.floor(Math.random() * 20 + 1);
let courses = new Array("COMP", "CHEMISTRY", "BIO", "PHYS", "PSYCH", "MATH", "ARTS", "PHIL", "GEO");

for (let i = 0; i < n; i++)
{
  b.add(Math.random() * 0.1 + 0.05, 
  courses[Math.floor(Math.random() * courses.length)] + " " + Math.floor(Math.random() * 9000 + 1000),
  "rgb(" + Math.floor(Math.random() * 128 + 128) + 
  ", " + Math.floor(Math.random() * 128 + 128) + 
   ", " + Math.floor(Math.random() * 128 + 128) + ")");
}

b.generateBubbles();