if (!localStorage.myChars){
    temp=[]
    localStorage.myChars= JSON.stringify(temp);
}
$(function () {
    $('[data-toggle="tooltip"]').tooltip()
  })
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

    function clearAll(){
        localStorage.myChars= JSON.stringify([]);
        render();
    }
    roster = document.getElementById("canvas").getContext('2d');
    chars= baseChars.map(char=>makeChar.apply(this,char))        
    myChars=[]
    totChars=[]
    xChars=9;
    j=0;
    newName=""
    newURL=""
    newI=0
    defWidth=0
    defHeight=0
    grd=0   
    setNewName("");
    newEcho=false
    showOrder=false
    colorsOne="#9BEDDC"
    colorsTwo="#4B88E9"
    midPoint=0.3
    showEchoes=true
    dirtyDowns=true
    setColorOne(colorsOne)
    setColorTwo(colorsTwo)
    setMidPoint(30)
    resetNew();
    setXChars(9);
    setResolution(window.innerWidth-24);

    function makeChar(name,order){
        img="./baseImages/"+name.toLowerCase()
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
            image = new Image();
            image.src=img;
            return {name:name,order:(order.replace("ε",".5")),image:img,setImage:image,render:true,echo: order.search("ε")!=-1}
    }
    
    function loadMyChars(){
        myChars=JSON.parse(localStorage.myChars)
        myChars.forEach((char,i,arr)=>{
            if (char.image) {
                img= new Image
                img.src=char.image
                arr[i].setImage=img
            }
        })
    }

    function setXChars(x){
        xChars=x;
        document.getElementById("charWidth").value=x;
        render()
    }

    $("#addChar").on("show.bs.modal", x => {
        drawTest();$('#my-cropper').cropit({
            width:defWidth,
            height:defHeight,
            freeMove:true,
            smallImage:"allow",
            imageBackground:true, 
            imageBackgroundBorderWidth: 15})
    })
    $("#addChar").on("hide.bs.modal", x => {
        resetNew();
        $('.cropit-preview-image').removeAttr('src');
        $('.cropit-preview-background').removeAttr('src');
    })
    
    function addChar(){
        name=newName
        url=newURL
        i=newI;
        echo=newEcho;
        visible=newVisible;
        if (echo){
            i=Math.floor(i)+1/2
        }else{
            i=Math.floor(i)
        }
        if (localStorage.myChars) {
            temp = JSON.parse(localStorage.myChars);
            old= temp.find(char=> char.name==name)
            aux=temp.filter( char=>char.name!=name)
            newImage= url?url:(old?old.image:"")
            aux.push({name:name,order:i,image: newImage, render:visible,echo:echo })
            localStorage.myChars=JSON.stringify(aux)
        } else {
            temp = [];
            temp.push({name:name,order:i,image: url, render:visible,echo:echo })
            localStorage.myChars=JSON.stringify(temp)
        }
        loadMyChars()
        resetNew();
        $("#addChar").modal("hide")
        render();
        dirtyDowns=true
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
        loadMyChars()
        resetNew();
        $("#addChar").modal("hide")
        render();
        dirtyDowns=true
    }
    
    function setChars(){
        temp = JSON.parse(localStorage.myChars).sort((a,b)=> a.name==b.name?0:a.name>b.name?1:-1)
        dropdown=document.getElementById("charDropdown");
        while (dropdown.firstChild) {
            dropdown.removeChild(dropdown.firstChild);
        }
        hold=document.createElement("div")
        hold.className=("characterDropdown")
        temp.forEach( char =>{
            elem = document.createElement('a')
            elem.innerHTML= "<i class='material-icons' style='vertical-align: middle;margin-right:10%'>"
                +(char.render?"visibility":"visibility_off")+"</i>"
                +"<span>"+char.name+"</span>"
            elem.className="dropdown-item"
            elem.onclick= (() => {
                $("#addChar").modal({show:true})
                $("#newName").val(char.name)
                setNewName(char.name)
                setNewI(char.order)
                setNewEcho(char.echo)
                setNewVisible(char.render)
            })
            hold.appendChild(elem)
            })
        dropdown.appendChild(hold)
        butt=document.createElement('button')
        hr=document.createElement('div')
        hr.className="dropdown-divider"
        butt.innerText="Remove All Characters"
        butt.className="dropdown-item eraserButton" 
        butt.setAttribute("data-toggle","modal") 
        butt.setAttribute("data-target","#DeleteChars")
        dropdown.appendChild(hr)
        dropdown.appendChild(butt)
    }

    function defFont() {return" 900 "+Math.ceil(defWidth/12)+"px arial,sans-serif"}

    function render () {
        setChars();
        roster.clearRect(0,0,canvas.width,canvas.height);
        roster.beginPath();
        roster.stroke();
        setDims()
        roster.font= defFont()
        loadMyChars()
        totChars=chars.concat(myChars).filter(char=>char.render).sort( (a,b)=> a.order-b.order)
        console.log(grd)
        totChars.forEach(draw)
    }

    function draw (char,i){
        roster.strokeStyle="black";
        startX=(i%xChars)*defWidth
        if(Math.floor(i/xChars)==Math.floor(totChars.length/xChars)){
            startX += ( defWidth * ( xChars - (totChars.length%xChars) ) ) / 2
        }
        startY=Math.floor(i/xChars)*defHeight
        roster.fillStyle=grd
        roster.fillRect(startX,startY,defWidth,defHeight)
        if (char.image) {
            roster.drawImage(char.setImage,startX,startY,defWidth,defHeight);
        }
        roster.rect(startX,startY,defWidth,defHeight)
        roster.stroke();
        roster.fillStyle="white"
        textAdjust= defWidth/2 - roster.measureText(char.name.toUpperCase()).width/2;
        char.name!="RANDOM" &&roster.fillText(char.name.toUpperCase(),startX+ textAdjust,startY+(defHeight*0.9),defWidth)
        if(char.echo && showEchoes) roster.fillText("\u03B5",startX+3,startY+defWidth/12)
        orderWidth=roster.measureText(char.order).width
        if (showOrder) roster.fillText(char.order,startX+defWidth-orderWidth-2,startY+defWidth/12)
        roster.lineWidth=1;
        roster.strokeStyle="black"
        if(char.echo && showEchoes) roster.strokeText("\u03B5",startX+3,startY+defWidth/12)
        if (showOrder) roster.strokeText(char.order,startX+defWidth-orderWidth-2,startY+defWidth/12)
        char.name!="RANDOM" && roster.strokeText(char.name.toUpperCase(),startX+textAdjust,startY+(defHeight*0.9),defWidth)

    }

    function drawTest (){
        if(!newVisible){
            return 0;
        }
        document.getElementById("drawingBoard").width=defWidth
        document.getElementById("drawingBoard").height=defHeight
        drawingBoard=document.getElementById("drawingBoard").getContext("2d");
        drawingBoard.clearRect(0,0,defWidth,defHeight)
        drawingBoard.strokeStyle="black";
        drawingBoard.fillStyle=grd
        drawingBoard.fillRect(0,0,defWidth,defHeight)
        partTwo= () => {
            drawingBoard.font= defFont()
            drawingBoard.rect(0,0,defWidth,defHeight)
            drawingBoard.stroke();
            textAdjust= defWidth/2 - drawingBoard.measureText(newName.toUpperCase()).width/2;
            drawingBoard.fillStyle="white"
            drawingBoard.fillText(newName.toUpperCase(),0+ textAdjust,0+(defHeight*0.9),defWidth)
            if(newEcho) drawingBoard.fillText("\u03B5",3,15)
            drawingBoard.lineWidth=1;
            drawingBoard.strokeStyle="black"
            if(newEcho) drawingBoard.strokeText("\u03B5",3,15)
            drawingBoard.font= defFont()
            drawingBoard.strokeText(newName.toUpperCase(),0+textAdjust,0+(defHeight*0.9),defWidth)
        }
        if (newURL) {
            img= new Image
            img.addEventListener("load", function () { 
                drawingBoard.drawImage(img,0,0,defWidth,defHeight); 
                partTwo()
            });
            img.src=newURL
        }else{
            partTwo();
        }
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
    $("#newEcho").prop("checked", x);
        newEcho=x;
        drawTest();
    }
    $("#newEcho").change(function() {
        setNewEcho(this.checked?true:false)
    })
    function setNewVisible(x){
        $("#newVisible").prop("checked", x);
        newVisible=x;
        drawTest();
    }
    $("#newVisible").change(function() {
        setNewVisible(this.checked?true:false)
    })

    function setNewImage(x){
        newURL=$('#my-cropper').cropit('export');
        drawTest();
    }
    function toggleOrder(){
        showOrder=!showOrder
        render()
    }
    function toggleEchoes(){
        showEchoes=!showEchoes
        render()
    }
    function setGradient(){
        grd=roster.createLinearGradient(0,0,canvas.width,canvas.height);
        grd.addColorStop(0,colorsOne)
        grd.addColorStop(midPoint,colorsTwo)
        grd.addColorStop(1,colorsOne)
    }
    function setDims(){
        defWidth= canvas.width/xChars;
        defHeight= (defWidth/16)*9
        roster.canvas.height=defHeight*Math.ceil(totChars.length/xChars);
        setGradient()
        //grd.addColorStop(0,"yellow");
        //grd.addColorStop(1,"DodgerBlue");
    }

    function makeDownloadLinks(){
        if (dirtyDowns){
            console.log("Generating downloads")
            jpegURL=document.getElementById("canvas").toDataURL("image/jpeg")
            pngURL=document.getElementById("canvas").toDataURL("image/png")
            document.getElementById("downloadLinkJPG").onclick=(() => download(jpegURL,"roster.jpg"))
            document.getElementById("downloadLinkJPG").innerText="JPEG (~"+Math.ceil((jpegURL.length*0.75)/(1024*1024))+"MB)"
            document.getElementById("downloadLinkPNG").onclick=(() => download(pngURL,"roster.png"))
            document.getElementById("downloadLinkPNG").innerText="PNG (~"+Math.ceil((pngURL.length*0.75)/(1024*1024))+"MB)"
            dirtyDowns=false
        }
    }

    function setResolution(x){
        roster.canvas.width=x;
        document.getElementById("customRes").value=x
        render();
        dirtyDowns=true
    }
    function setColorOne(x){
        colorsOne=x
        document.getElementById("colorOne").value=x
        setGradient()
        render();
        dirtyDowns=true
    }
    function setMidPoint(x){
        midPoint= x/100
        document.getElementById("midPointSlider").value=x
        setGradient()
        render();
        dirtyDowns=true
    }
    function setColorTwo(x){
        colorsTwo=x
        document.getElementById("colorTwo").value=x
        setGradient()
        render();
        dirtyDowns=true
    }
    function resetNew(){
        setNewName("");
        document.getElementById("newName").value=""
        newURL=""
        document.getElementById("newURL").value=newURL
        setNewI(0);
        setNewEcho(false);
        setNewVisible(true);
    }

