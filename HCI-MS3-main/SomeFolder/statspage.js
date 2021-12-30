let statsPage = document.getElementById("statistics_page");

let generalbtn=document.getElementById("general_btn");
let btn3020=document.getElementById("comp3020_btn");
let btn3040=document.getElementById("comp3040_btn");
let btn3050=document.getElementById("comp3050_btn");

generalbtn.addEventListener("click", function(e)
{
    initiate();
    projectedGrade(0);
});

btn3020.addEventListener("click", function(e)
{
    const comp3020hist= ["Comp3020-Study Session: 10/10/21","Comp3020-Study Session: 12/10/21","Comp3020-Study Session: 14/10/21","Comp3020-Study Session: 16/10/21","Comp3020-Study Session: 18/10/21"];
    let textBox=document.getElementById("history");
    let list=document.createElement("ul");
    let li=document.createElement('li');
    while(textBox.firstChild)
    {
        textBox.removeChild(textBox.lastChild);
    }
    textBox.appendChild(list);
    li.innerHTML="<font size='8'>"+"Course History"+"</font size>"+"<br>";
    list.appendChild(li);

    for(item in comp3020hist)
    {
        li.innerHTML+=comp3020hist[item]+"<br>";
        list.appendChild(li);
    }

    projectedGrade(75);

});

btn3040.addEventListener("click", function(e)
{
    const comp3040hist= ["Comp3040-Study Session: 10/11/21","Comp3040-Study Session: 13/10/21","Comp3040-Study Session: 15/10/21","Comp3040-Study Session: 02/11/21","Comp3040-Study Session: 04/11/21"];
    let textBox=document.getElementById("history");
    let list=document.createElement("ul");
    let li=document.createElement('li');
    while(textBox.firstChild)
    {
        textBox.removeChild(textBox.lastChild);
    }
    textBox.appendChild(list);
    li.innerHTML="<font size='8'>"+"Course History"+"</font size>"+"<br>";
    list.appendChild(li);

    for(item in comp3040hist)
    {
        li.innerHTML+=comp3040hist[item]+"<br>";
        list.appendChild(li);
    }
    projectedGrade(90);
});

btn3050.addEventListener("click", function(e)
{
    const comp3050hist= ["Comp3050-Study Session: 17/10/21","Comp3050-Study Session: 22/10/21","Comp3050-Study Session: 25/10/21","Comp3050-Study Session: 30/10/21","Comp3050-Study Session: 02/11/21"];
    let textBox=document.getElementById("history");
    let list=document.createElement("ul");
    let li=document.createElement('li');
    while(textBox.firstChild)
    {
        textBox.removeChild(textBox.lastChild);
    }
    textBox.appendChild(list);
    li.innerHTML="<font size='8'>"+"Course History"+"</font size>"+"<br>";
    list.appendChild(li);

    for(item in comp3050hist)
    {
        li.innerHTML+=comp3050hist[item]+"<br>";
        list.appendChild(li);
    }

    projectedGrade(60);

});

function initiate()
{
    //History panel

const coursehist= ["Comp3020-Study Session: 10/10/21","Comp3020-Study Session: 12/10/21","Comp3020-Study Session: 14/10/21","Comp3020-Study Session: 16/10/21","Comp3020-Study Session: 18/10/21",
    "Comp3020-Study Session: 10/10/21","Comp3020-Study Session: 12/10/21","Comp3020-Study Session: 14/10/21","Comp3020-Study Session: 16/10/21","Comp3020-Study Session: 18/10/21"
    ,"Comp3040-Study Session: 10/11/21","Comp3040-Study Session: 13/10/21","Comp3040-Study Session: 15/10/21","Comp3040-Study Session: 02/11/21","Comp3040-Study Session: 04/11/21"
    ,"Comp3050-Study Session: 17/10/21","Comp3050-Study Session: 22/10/21","Comp3050-Study Session: 25/10/21","Comp3050-Study Session: 30/10/21","Comp3050-Study Session: 02/11/21"];
    let textBox=document.getElementById("history");
    let list=document.createElement("ul");
    let li=document.createElement('li');
    while(textBox.firstChild)
    {
        textBox.removeChild(textBox.lastChild);
    }
    textBox.appendChild(list);

    li.innerHTML="<font size='8'>"+"Course History"+"</font size>"+"<br>";
    list.appendChild(li);
    for(item in coursehist)
    {
        li.innerHTML+=coursehist[item]+"<br>";
        list.appendChild(li);
    }

}

function generatePie()
{
    const pieCtx = document.getElementById('pie_area').getContext('2d');
    const myPieChart=new Chart(pieCtx, {
    type:'pie',
    data: {
        labels: [
            'Comp3020',
            'Comp3040',
            'Comp3050'
          ],
          datasets: [{
            label: 'Course Hours Distribution',
            data: [80, 50, 70],
            backgroundColor: [
              colours[5],
              colours[6],
              colours[0]
            ],
            hoverOffset: 4
          }]
    },
    options: {
        animation: {
            animateScale: true
        },
        responsive: false
    }
});
}

function generateBar()
{
    //Bar graph
    const ctx = document.getElementById('graph_area').getContext('2d');
    const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Comp3020', 'Comp3040', 'Comp3050'],
        datasets: [{
            label: 'Completed',
            data: [80, 50, 70],
            backgroundColor: [
              colours[5],
              colours[6],
              colours[0]
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)'
            ],
            borderWidth: 2
        },
        {
            label: 'Target',
            data: [100, 60, 120],
            backgroundColor: [
                'rgba(255, 99, 132, 0.8)',
                'rgba(54, 162, 235, 0.8)',
                'rgba(255, 206, 86, 0.8)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)'
            ],
            borderWidth: 2
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true,
                title:{
                    display:true,
                    text: "Hours Spent"
                }
            }
        },
        responsive: false,
        plugins: {
            legend: {
              display: false
            },
            title: {
                display:true,
                text:"Completed vs Target Hours Spent"
            }
          }

    }

});
}

function projectedGrade(grade)
{
    const projectArea = document.getElementById('projected');
    const gradeHtml=document.createElement('div');
    const pieCtx=document.createElement('canvas');
    pieCtx.style.height="200px";
    pieCtx.style.width="300px";
    pieCtx.style.left="0%";
    pieCtx.style.position="relative";
    const myPieChart=new Chart(pieCtx, {
    type:'doughnut',
    data: {
        labels: [
            'Projected Grade',
            ''
          ],
          datasets: [{
            label: 'Course Hours Distribution',
            data: [grade,100-grade],
            backgroundColor: [
              'rgb(255, 99, 132)',
              'lightgrey'
            ],
            hoverOffset: 4
          }]
    },
    options: {
        animation: {
            animateScale: true
        },
        responsive: false,
        plugins: {
            legend: {
              display: false
            },
            title: {
                display:true,
                text:"Projected Grade"
            }
          }
    }
});
while(projectArea.firstChild)
{
    projectArea.removeChild(projectArea.lastChild);
}
projectArea.appendChild(pieCtx);
if(grade!=0)
{
    gradeHtml.innerHTML="<font size='10'>"+grade+"%"+"</font>";
    gradeHtml.style.left="45%";
    gradeHtml.style.position="relative";
    gradeHtml.style.color='rgb(255, 99, 132)';
    projectArea.appendChild(gradeHtml);
}

}
let statisticsBtn = document.getElementById("statistics_btn");
statisticsBtn.addEventListener("click", function(e) {
    initiate();
    generatePie();
    generateBar();
    projectedGrade(0);
});

