var colorThief = new ColorThief();

function getComplimentary(rgb){

    // Convert hex to rgb
    // Credit to Denis http://stackoverflow.com/a/36253499/4939630
   
    // Get array of RGB values

    var r = rgb[0], g = rgb[1], b = rgb[2];

    // Convert RGB to HSL
    // Adapted from answer by 0x000f http://stackoverflow.com/a/34946092/4939630
    r /= 255.0;
    g /= 255.0;
    b /= 255.0;
    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2.0;

    if(max == min) {
        h = s = 0;  //achromatic
    } else {
        var d = max - min;
        s = (l > 0.5 ? d / (2.0 - max - min) : d / (max + min));

        if(max == r && g >= b) {
            h = 1.0472 * (g - b) / d ;
        } else if(max == r && g < b) {
            h = 1.0472 * (g - b) / d + 6.2832;
        } else if(max == g) {
            h = 1.0472 * (b - r) / d + 2.0944;
        } else if(max == b) {
            h = 1.0472 * (r - g) / d + 4.1888;
        }
    }

    h = h / 6.2832 * 360.0 + 0;

    // Shift hue to opposite side of wheel and convert to [0-1] value
    h+= 180;
    if (h > 360) { h -= 360; }
    h /= 360;

    // Convert h s and l values into r g and b values
    // Adapted from answer by Mohsen http://stackoverflow.com/a/9493060/4939630
    if(s === 0){
        r = g = b = l; // achromatic
    } else {
        var hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;

        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    r = Math.round(r * 255);
    g = Math.round(g * 255); 
    b = Math.round(b * 255);

    // Convert r b and g values to hex
    rgb = b | (g << 8) | (r << 16); 
    return "#" + (0x1000000 | rgb).toString(16).substring(1);
}

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
    ["Dark Samus","4ε"],
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
    ["Chrom","25ε"],
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
    ["Simon","66"],
    ["Richter","66ε"],
    ["King K. Rool","67"],
    ["RANDOM","999"]
    ]

    function clearAll(){
        localStorage.myChars= JSON.stringify([]);
        render();
    }
    roster = document.getElementById("canvas").getContext('2d');
    chars= baseChars.map(char=>makeChar.apply(this,char))        
    onlyMine=false
    compColor=false
    myChars=[]
    totChars=[]
    xChars=10;
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
    defaultGradient={
        one:"#9BEDDC",
        two:"#4B88E9",
        mid:0.3
    }
    gradientSettings=defaultGradient
    showEchoes=true
    echollapse=false
    dirtyDowns=true
    charCount=0
    setColorOne("#9BEDDC")
    setColorTwo("#4B88E9")
    setMidPoint(30)
    resetNew();
    setXChars(10);
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
    function setGradientUI(){
        document.getElementById("colorOne").value=gradientSettings.one
        document.getElementById("midPointSlider").value=Math.floor(gradientSettings.mid*100)
        document.getElementById("colorTwo").value=gradientSettings.two
        render()
    }
    function loadDefaultGradient(){
        gradientSettings={
            one:"#9BEDDC",
            two:"#4B88E9",
            mid:0.3
        }
        setGradientUI()
    }
    function loadMyGradient(){
        if(localStorage.myGradient){
            gradientSettings=JSON.parse(localStorage.myGradient)
            setGradientUI()
        }else{
            alert("You've never saved a Gradient!")
        }
    }
    function saveMyGradient(){
        localStorage.myGradient=JSON.stringify(gradientSettings)
    }

    function setXChars(x){
        xChars=x;
        document.getElementById("charWidth").value=x;
        render()
    }

    $("#addChar").on("show.bs.modal", x => {
        $('#my-cropper').cropit({
            width:defWidth,
            height:defHeight,
            freeMove:true,
            onImageLoaded:(()=>setNewImage()),
            smallImage:"allow",
            imageBackground:true,
            originalSize:true,
            imageBackgroundBorderWidth: 15})
            drawTest();
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
    
    function makeIcon(visibility){    
        ret= $.parseHTML(
            "<i class='material-icons' style='vertical-align: middle;margin-right:10%'>"+(visibility?"visibility":"visibility_off")+"</i>",
            document
        )
        return ret[0]
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
            icon = document.createElement('i')
            elem.appendChild(makeIcon(char.render))
            text=document.createElement("span")
            text.innerText= char.name
            elem.appendChild(text)
            elem.className="dropdown-item"
            elem.onclick= (() => {
                $("#addChar").modal({show:true})
                $("#newName").val(char.name)
                setNewName(char.name)
                setNewI(char.order)
                newURL=char.image
                setNewEcho(char.echo)
                setNewVisible(char.render)
            })
            hold.appendChild(elem)
            })
        dropdown.appendChild(hold)
        
    }

    function downloadCharSet(){
        download(localStorage.myChars,"characters.txt")
    }
    document.getElementById("savedFile").addEventListener("change", ()=>{
            reader=new FileReader()
            reader.readAsText(document.getElementById("savedFile").files[0])
            reader.addEventListener("load", ()=>setSaved(reader.result))
        }
    )    

    function setSaved(file){
        savedChars= JSON.parse(file).sort((a,b)=> a.name==b.name?0:a.name>b.name?1:-1)
        hold= document.getElementById("loadedContainer")
        while (hold.firstChild) {
            hold.removeChild(hold.firstChild);
        }
        savedChars.forEach( char =>{
            elem = document.createElement('a')
            icon = document.createElement('i')
            text=document.createElement("span")
            text.innerText= char.name
            elem.appendChild(text)
            elem.className="dropdown-item charFlex-item"
            elem.onclick= (() => {
                $("#addChar").modal({show:true})
                $("#newName").val(char.name)
                setNewName(char.name)
                newURL=(char.image)
                setNewI(char.order)
                setNewEcho(char.echo)
                setNewVisible(char.render)
            })
            hold.appendChild(elem)
        })
    }

    function defFont(x) {return" 900 "+(Math.ceil(defWidth/12)+x)+"px arial,sans-serif"}
    
    function render () {
        setChars();
        i=0
        roster.clearRect(0,0,canvas.width,canvas.height);
        roster.beginPath();
        roster.stroke();
        setDims()
        roster.font= defFont(0)
        loadMyChars()
        if (onlyMine){
            totChars=myChars.filter(char=>char.render).sort( (a,b)=> a.order-b.order)    
        }else{
            totChars=chars.concat(myChars).filter(char=>char.render).sort( (a,b)=> a.order-b.order)
        }
        charCount = echollapse?totChars.filter(c=>!c.echo).length:totChars.length
        function setDraw(char){
            if (char.setImage){
                if (char.setImage.complete){
                    draw(char,i)
                }else{
                    char.setImage.addEventListener("load",()=>draw(char,i))
                }
            }else{
                draw(char,i)
            }
            if (!(char.echo && echollapse)){
                i++
            }
        }
        totChars.forEach(setDraw)
    }
    function getEcho(char){
        return totChars.find( c => {
        return c.order-char.order ==0.5
        })
    }
    function draw (char,i){
        if (echollapse && char.echo){
            return null
        }
        roster.strokeStyle="black";
        startX=(i%xChars)*defWidth
        if(Math.floor(i/xChars)==Math.floor(charCount/xChars)){
            startX += ( defWidth * ( xChars - (charCount%xChars) ) ) / 2
        }
        startY=Math.floor(i/xChars)*defHeight
        if(compColor){
            color=colorThief.getPalette(char.setImage,8)[4]
            console.log(color)
            prim='#'+color[0].toString(16)+color[1].toString(16)+color[2].toString(16)
            
            roster.fillStyle=prim
        }else{
            roster.fillStyle=grd
        }
        roster.fillRect(startX,startY,defWidth,defHeight)
        if (char.image) {
            roster.drawImage(char.setImage,startX,startY,defWidth,defHeight);
        }
        roster.rect(startX,startY,defWidth,defHeight)
        roster.stroke();
        roster.fillStyle="white"
        textAdjust= defWidth/2 - roster.measureText(char.name.toUpperCase()).width/2;
        char.name!="RANDOM" &&roster.fillText(char.name.toUpperCase(),startX+ textAdjust,startY+(defHeight*0.9),defWidth)
        if(char.echo && showEchoes) {
            roster.font= defFont(14)
            roster.fillText("\u03B5",startX+3,startY+defWidth/12+5)
            roster.font= defFont(0)
        }
        if (echollapse && !char.echo){
            echo= getEcho(char)
            if(echo){
                if (echo.image) {
                    roster.fillStyle=grd
                    roster.fillRect(
                        startX+defWidth*(5/8),
                        startY,
                        defWidth*(3/8),
                        defHeight/2)
                    roster.drawImage(
                        echo.setImage,
                        echo.setImage.width/8,
                        0,
                        echo.setImage.width*6/8,
                        echo.setImage.height,
                        startX+defWidth*(5/8),
                        startY,
                        defWidth*(3/8),
                        defHeight/2
                    );
                    roster.rect(
                        startX+defWidth*(5/8),
                        startY,
                        defWidth*(3/8),
                        defHeight/2)
                    roster.stroke();  
                }else{
                    roster.fillText(echo.name,startX+3,startY+defWidth/12+5)
                }
            }
        }
        roster.fillStyle="white"
        roster.font= defFont(6) 
        orderWidth=roster.measureText(char.order).width
        if (showOrder) roster.fillText(char.order,startX+defWidth-orderWidth-2,startY+defWidth/8)
        roster.lineWidth=1;
        roster.strokeStyle="black"
        if(char.echo && showEchoes){
            roster.font= defFont(14)
            roster.strokeText("\u03B5",startX+3,startY+defWidth/12+5)
            roster.font= defFont(0)
        }
        roster.font= defFont(6)
        if (showOrder) roster.strokeText(char.order,startX+defWidth-orderWidth-2,startY+defWidth/8)
        roster.font= defFont(0)
        char.name!="RANDOM" && roster.strokeText(char.name.toUpperCase(),startX+textAdjust,startY+(defHeight*0.9),defWidth)
    }

    function drawTest (){
        document.getElementById("drawingBoard").width=defWidth
        document.getElementById("drawingBoard").height=defHeight
        drawingBoard=document.getElementById("drawingBoard").getContext("2d");
        drawingBoard.clearRect(0,0,defWidth,defHeight)
        drawingBoard.strokeStyle="black";
        drawingBoard.fillStyle=grd
        drawingBoard.fillRect(0,0,defWidth,defHeight)
        partTwo= () => {
            drawingBoard.font= defFont(0)
            drawingBoard.rect(0,0,defWidth,defHeight)
            drawingBoard.stroke();
            textAdjust= defWidth/2 - drawingBoard.measureText(newName.toUpperCase()).width/2;
            drawingBoard.fillStyle="white"
            drawingBoard.fillText(newName.toUpperCase(),0+ textAdjust,0+(defHeight*0.9),defWidth)
            if(newEcho) {
                drawingBoard.font= defFont(14)
                drawingBoard.fillText("\u03B5",3,defWidth/12+5)
                drawingBoard.font= defFont(0)
            }            
            drawingBoard.lineWidth=1;
            drawingBoard.strokeStyle="black"
            if(newEcho) {
                drawingBoard.font= defFont(14)
                drawingBoard.strokeText("\u03B5",3,defWidth/12+5)
                drawingBoard.font= defFont(0)
            }
            drawingBoard.font= defFont(0)
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

    function setNewImage(){
        newURL=$('#my-cropper').cropit('export');
        drawTest();
    }
    function toggleOrder(){
        showOrder=!showOrder
        render()
    }
    function toggleColor(){
        compColor=!compColor
        render()
    }
    
    function toggleMine(){
        onlyMine=!onlyMine
        render()
    }
    function toggleEchoes(){
        showEchoes=!showEchoes
        render()
    }
    function toggleEchollapse(){
        echollapse=!echollapse
        render()
    }
    function setGradient(){
        grd=roster.createLinearGradient(0,0,canvas.width,canvas.height);
        grd.addColorStop(0,gradientSettings.one)
        grd.addColorStop(1,gradientSettings.one)
        grd.addColorStop(gradientSettings.mid,gradientSettings.two)
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
        gradientSettings.one=x
        document.getElementById("colorOne").value=x
        setGradient()
        render();
        dirtyDowns=true
    }
    function setMidPoint(x){
        gradientSettings.mid= x/100
        document.getElementById("midPointSlider").value=x
        setGradient()
        render();
        dirtyDowns=true
    }
    function setColorTwo(x){
        gradientSettings.two=x
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

