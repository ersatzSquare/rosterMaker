baseChars=[
    ["Mario","1"],
    ["Donkey Kong","2"],
    ["Link","3"],
    ["Samus","4"],
    ["Yoshi","5"],
    ["Kirby","6"],
    ["Fox","7"],
    ["Pikachu","8"],
    ["Luigi","9"],
    ["Ness","10"],
    ["Captain Falcon","11"],
    ["Jigglypuff","12"],
    ["Peach","13"],
    ["Daisy","13ε"],
    ["Bowser","14"],
    ["Ice Climbers","15"],
    ["Sheik","16"],
    ["Zelda","17"],
    ["Dr. Mario","18"],
    ["Pichu","19"],
    ["Falco","20"],
    ["Marth","21"],
    ["Lucina","21ε"],
    ["Young Link","22"],
    ["Ganondorf","23"],
    ["Mewtwo","24"],
    ["Roy","25"],
    ["Mr. Game & Watch","26"],
    ["Meta Knight","27"],
    ["Pit","28"],
    ["Dark Pit","28ε"],
    ["Zero Suit Samus","29"],
    ["Wario","30"],
    ["Snake","31"],
    ["Ike","32"],
    ["Pokemon Trainer","33"],
    ["Diddy Kong","36"],
    ["Lucas","37"],
    ["Sonic","38"],
    ["King Dedede","39"],
    ["Olimar","40"],
    ["Lucario","41"],
    ["R.O.B.", "42"],
    ["Toon Link","43"],
    ["Wolf","44"],
    ["Villager","45"],
    ["Mega Man","46"],
    ["Wii Fit Trainer","47"],
    ["Rosalina & Luma","48"],
    ["Little Mac","49"],
    ["Greninja","50"],
    ["Mii Fighter","51"],
    ["Palutena","54"],
    ["Pac-Man","55"],
    ["Robin","56"],
    ["Shulk","57"],
    ["Bowser Jr.","58"],
    ["Duck Hunt","59"],
    ["Ryu","60"],
    ["Cloud","61"],
    ["Corrin","62"],
    ["Bayonetta","63"],
    ["Inkling","64"],
    ["Ridley","65"],
    ["RANDOM","999"]
    ]
    
    roster = document.getElementById("canvas").getContext('2d');
    chars= baseChars.map(char=>makeChar.apply(this,char))        
    xChars=9;
    j=0;
    var grd=roster.createLinearGradient(0,0,canvas.width,canvas.height);
    grd.addColorStop(0,"yellow");
    grd.addColorStop(1,"DodgerBlue");
    newName=""
    newURL=""
    newI=0
    newEcho=false
    defWidth= canvas.width/xChars;
    defHeight= (defWidth/16)*9
    showOrder=false;
    setNewName("");
    

    function makeChar(name,order){
        img="http://www.smashbros.com/assets_v2/img/fighter/thumb_a/"+name.toLowerCase()
            .replace(".","")
            .replace(".","")
            .replace(".","")
            .replace(".","")
            .replace(".","")
            .replace("&","and")
            .replace("-","_")
            .replace("é","e")
            .replace(" ","_")
            .replace(" ","_")
            .replace(" ","_")   
            +".png"
            return {name:name,order:order,image:img,render:true,echo: order.search("ε")!=-1}
    }
    
    function setXChars(x){
        xChars=x;
        document.getElementById("charWidth").innerHTML=x;
        render()
    }

    $("#addChar").on("show.bs.modal", x => {$('#my-cropper').cropit({width:defWidth,height:defHeight,imageBackground:true, imageBackgroundBorderWidth: 15})} )
    $("#addChar").on("hide.bs.modal", x => {
        resetNew();
        $('.cropit-preview-image').removeAttr('src');
        $('.cropit-preview-background').removeAttr('src');
    })
    

    setXChars(9);

    function addChar(){
        name=newName
        url=newURL
        i=newI;
        echo=newEcho;
        if (localStorage.myChars) {
            temp = JSON.parse(localStorage.myChars);
            temp=temp.filter( char=>char.name!=name)
            temp.push({name:name,order:i,image: url, render:true,echo:echo })
            localStorage.myChars=JSON.stringify(temp)
        } else {
            temp = [];
            temp.push({name:name,order:i,image: url, render:true,echo:echo })
            localStorage.myChars=JSON.stringify(temp)
        }
        resetNew();
        $("#addChar").modal("hide")
        render();
    }
    function delChar(){
        name=newName
        url=newURL
        i=newI;
        echo=newEcho;
        if (localStorage.myChars) {
            temp = JSON.parse(localStorage.myChars);
            temp=temp.filter( char=>char.name!=name)
            localStorage.myChars=JSON.stringify(temp)
        }
        resetNew();
        $("#addChar").modal("hide")
        render();
    }
    
    function setChars(){
        temp = JSON.parse(localStorage.myChars)
        dropdown=document.getElementById("charDropdown");
        while (dropdown.firstChild) {
            dropdown.removeChild(dropdown.firstChild);
        }
        temp.forEach( char =>{
            elem = document.createElement('a')
            elem.innerText=char.name
            elem.className="dropdown-item"
            elem.onclick= (() => {
                $("#addChar").modal({show:true})
                setNewName(char.name)
                setNewI(char.order)
                setNewEcho(char.echo)
            })
            dropdown.appendChild(elem)
            })
    }


    function render () {
        setChars();
        roster.clearRect(0,0,canvas.width,canvas.height);
        roster.beginPath();
        roster.stroke(); 
        defWidth= canvas.width/xChars;
        defHeight= (defWidth/16)*9
        roster.font= " 900 "+(16+(8-xChars))+"px arial,sans-serif"
        myChars=JSON.parse(localStorage.myChars)
        totChars=chars.concat(myChars)
        totChars.filter(char=>char.render).sort( (a,b)=> a.order-b.order).forEach(draw)

    }
    function draw (char,i){
        roster.strokeStyle="black";
        startX=(i%xChars)*defWidth
        if(Math.floor(i/xChars)==Math.floor(totChars.length/xChars)) startX+= (defWidth* (xChars-(totChars.length%xChars)))/2
        startY=Math.floor(i/xChars)*defHeight
        roster.fillStyle= char.name=="RANDOM"?"#D3D3D3":grd
        roster.fillRect(startX,startY,defWidth,defHeight)
        if (char.image) {
            img= new Image
            img.src=char.image
            roster.drawImage(img,startX,startY,defWidth,defHeight);
        }
        roster.rect(startX,startY,defWidth,defHeight)
        roster.stroke();
        roster.fillStyle="white"
        textAdjust= defWidth/2 - roster.measureText(char.name.toUpperCase()).width/2;
        roster.fillText(char.name.toUpperCase(),startX+ textAdjust,startY+(defHeight*0.9),defWidth)
        roster.font= " 900 "+(22+(8-xChars))+"px arial,sans-serif"
        if(char.echo) roster.fillText("\uD835\uDEC6",startX+3,startY+15)
        if (showOrder) roster.fillText(char.order,startX+defWidth-45,startY+15)
        roster.lineWidth=1;
        roster.strokeStyle="black"
        if(char.echo) roster.strokeText("\uD835\uDEC6",startX+3,startY+15)
        if (showOrder) roster.strokeText(char.order,startX+defWidth-45,startY+15)
        roster.font= " 900 "+(16+(8-xChars))+"px arial,sans-serif"
        roster.strokeText(char.name.toUpperCase(),startX+textAdjust,startY+(defHeight*0.9),defWidth)

    }

    function drawTest (){
        document.getElementById("drawingBoard").width=defWidth
        document.getElementById("drawingBoard").height=defHeight
        drawingBoard=document.getElementById("drawingBoard").getContext("2d");
        drawingBoard.strokeStyle="black";
        drawingBoard.fillStyle=grd
        drawingBoard.fillRect(0,0,defWidth,defHeight)
        if (newURL) {
            img= new Image
            img.src=newURL
            drawingBoard.drawImage(img,0,0,defWidth,defHeight);
        }
        drawingBoard.rect(0,0,defWidth,defHeight)
        drawingBoard.stroke();
        drawingBoard.fillStyle="white"
        textAdjust= defWidth/2 - drawingBoard.measureText(newName.toUpperCase()).width/2;
        drawingBoard.fillText(newName.toUpperCase(),0+ textAdjust,0+(defHeight*0.9),defWidth)
        if(newEcho) drawingBoard.fillText("\uD835\uDEC6",3,15)
        drawingBoard.lineWidth=1;
        drawingBoard.strokeStyle="black"
        if(newEcho) drawingBoard.strokeText("\uD835\uDEC6",3,15)
        drawingBoard.strokeText(newName.toUpperCase(),0+textAdjust,0+(defHeight*0.9),defWidth)
    }
    
    function setNewName(x){
        $("#addCharButton").prop("disabled", x=="")
        $("#delCharButton").prop("disabled", x=="")
        newName=x;
        drawTest();
    }
    function setNewI(x){
        newI=x;
        document.getElementById("newI").value=x;
        drawTest();
    }
    function setNewEcho(x){
        newEcho=x;
        drawTest();
    }
    $("#newEcho").change(function() {
        setNewEcho(this.checked?true:false)
    })

    function setNewImage(x){
        newURL=$('#my-cropper').cropit('export');
        drawTest();
    }
    function toggleOrder(){
        showOrder=!showOrder
        render()
    }
    function resetNew(){
        setNewName("");
        setNewImage("");
        setNewI(0);
        setNewEcho(false);
    }

