let tooltip = document.getElementById("tooltip");
let currMessage, currElement;

window.addEventListener("resize", function()
{
    resetTooltip();
});

function hideTooltip() { tooltip.style.display = "none"; }

function resetTooltip() { currMessage = undefined; currElement = undefined; hideTooltip(); }

function createTooltip(message, element)
{
    if (message !== undefined && element !== undefined)
    {
        currMessage = message;
        currElement = element;
        let rect = element.getBoundingClientRect();

        tooltip.innerHTML = message;
        tooltip.style.display = "block";
        placeTooltip(rect);
    }
}

function placeTooltip(rect)
{
    let wide = tooltip.getBoundingClientRect().width;
    let high = tooltip.getBoundingClientRect().height;
    let tipTop = 0, tipLeft = 0;

    //place on the bottom-right corner
    tipTop =  rect.bottom + window.scrollY - rect.height / 4;
    tipLeft = rect.right - rect.width / 4;

    if (tipInBounds(tipLeft, tipTop, wide, high))
    {
        tooltip.style.left = tipLeft + "px";
        tooltip.style.top = tipTop + "px";
    }
    else
    {
        //place on the top-right corner
        tipTop = rect.top + window.scrollY + rect.height / 4 - high;
        tipLeft = rect.right - rect.width / 4;

        if (tipInBounds(tipLeft, tipTop, wide, high))
        {
            tooltip.style.left = tipLeft + "px";
            tooltip.style.top = tipTop + "px";
        }
        else
        {
            //place on the bottom-left corner
            tipTop = rect.bottom + window.scrollY - rect.height / 4;
            tipLeft = rect.left + rect.width / 4 - wide;

            if (tipInBounds(tipLeft, tipTop, wide, high))
            {
                tooltip.style.left = tipLeft + "px";
                tooltip.style.top = tipTop + "px";
            }
            else
            {
                //place on the top-left corner
                tipTop = rect.top + window.scrollY + rect.height / 4 - high;;
                tipLeft = rect.left + rect.width / 4 - wide;

                if (tipInBounds(tipLeft, tipTop, wide, high))
                {
                    tooltip.style.left = tipLeft + "px";
                    tooltip.style.top = tipTop + "px";
                }
                else
                {
                    tooltip.style.display = "none";
                }
            }
        }
    }
}

function tipInBounds(left, top, wide, high)
{
    return (left >= 0 && (top - window.scrollY) >= 0 && left + wide < window.innerWidth && (top - window.scrollY) + high < window.innerHeight);
}