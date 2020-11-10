

const body =document.getElementsByTagName("body")[0];
const circle = document.getElementById("circle");
const anglebar = document.getElementById("anglebar");
const angleselector = document.getElementById("angleselector");
var colorinputs = document.getElementsByClassName("colorinput");
const addcolorinputhtml = document.getElementById("addcolorinput");
const colordiv = document.getElementById("colordiv");
const feelinglucky = document.getElementById("generate");
const codezone = document.getElementById("code");
const copybtn = document.getElementById("copybtn");
const codecontainer = document.getElementById("codecontainer");
const sliderselector = document.getElementById("sliderselector");
const sliderbox = document.getElementById("sliderbox");
const copied = document.getElementById("copied");


var angle=0;
var colors=[];
var circleclick = new Object();
circleclick.setState=(bool => circleclick.state=bool);
circleclick.setState(false);

function componentToHex(c) {
  	var hex = c.toString(16);
 	return hex.length == 1 ? "0" + hex : hex;
}	

const updateCode = text => {
	codezone.innerHTML=colorize("background: "+text);
	return true;
}

const colorize = (text) => {
	var r = /\d+/;
	r1="[(][0-9]+[d]";
	if(text.match(r1)){
		const match = text.match(r1);
		text = text.slice(0,match.index+1) + '<span style="color:violet">'+text.slice(match.index+1,match.index+match[0].length-1)+'</span>'+text.slice(match.index+match[0].length-1,text.length);
	}
	r2="[#][0-9a-fA-F]{6}";
	let oldtext="";
	var addon = 0;
	let length = text.length;
	for (match of text.matchAll(r2)){
		console.log(addon,text.slice(match.index+addon,match.index+7+addon));
		text = text.slice(0,match.index+addon) + '<span style="color:violet">'+text.slice(match.index+addon,match.index+7+addon)+'</span>'+text.slice(match.index+7+addon,text.length);
		addon+= text.length-length;
		length = text.length;
		
	}
	const replacors = [["background","turquoise"],["radial-gradient","turquoise"],["linear-gradient","turquoise"],["circle","red"],["deg","red"]];
	for (a of replacors){
		text = text.replace(a[0],'<span style="color:'+a[1]+'">'+a[0]+'</span>');
	} 

	return text;
}

const hexToRgb = hex => {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}
function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}	

const getSimilarColor = (c1,c2) => {
	const c1_rgb = hexToRgb(c1);
	const c2_rgb = hexToRgb(c2);
	return rgbToHex(Math.round((c1_rgb.r+c2_rgb.r)/2),Math.round((c1_rgb.g+c2_rgb.g)/2),Math.round((c1_rgb.b+c2_rgb.b)/2));
}

const setGradient = (obj,mode,colors,alpha=90) => {
	let txt="";
	if(mode==0){/*Linear*/
		txt="linear-gradient("+alpha+"deg, "+colors.reduce((acc, color) => acc+= ", "+color)+")"
		if (colors.length>1){
			obj.style.background= txt;
		}else if (colors.length == 1){
			obj.style.background="";
			obj.style.backgroundColor=colors[0];
		}
	}else if (mode===1){
		txt="radial-gradient(circle, "+colors.reduce((acc, color) => acc+= ", "+color)+")"
		if (colors.length>1){
			obj.style.background= txt;
		}else if (colors.length == 1){
			obj.style.background="";
			obj.style.backgroundColor=colors[0];
		}
	}
	return txt;
}

function updateGradients(){
	updateCode(setGradient(body,sliderMode,colors,angle));
	setGradient(circle,sliderMode,colors,angle);
}
function colorchange(){
	getColors();
	updateGradients();
}

function anglechange(e){
	updateAngle(e);
	updateGradients();
}
const getColorInputs = () => colorinputs = document.getElementsByClassName("colorinput");
const getColors = () => {
	colors=[];
	for (let i=0; i<colorinputs.length;i++){
		colors.push(colorinputs[i].value);
	}
	return colors;
}
const initAngle = () => {
	return setAngleBar();
}

const setAngleBar = () => anglebar.style.transform="rotate("+(angle)+"deg)";


const updateAngle = (e) => {
	let deg = x => x*=180/Math.PI;
	const x = e.offsetX-circle.clientWidth/2;
	const y = -e.offsetY+circle.clientHeight/2;
	if (y===0){
		if(x>0){
			angle=90;
		}else if(x<0){
			angle=-90;
		}
	}else{
		if(y>0){
			angle=deg(Math.atan(x/y));
		}else if (x===0){
			angle = 180;
		}else if (x>0){
			angle = 180 + deg(Math.atan(x/(y)));
		}else if (x<0){
			angle = -180 + deg(Math.atan(x/(y)));
		}
	}
	angle=Math.round(angle)
	setAngleBar();
	return angle;
	// console.log(x,y,angle);
}

const addColorInput = () => {
	colordiv.appendChild(colorinputs[colorinputs.length-1].cloneNode(true));
	getColorInputs();
	const newcolor = getSimilarColor(colors[colors.length-1],colors[colors.length-2]);
	colorinputs[colorinputs.length-1].value=colors[colors.length-1];
	colorinputs[colorinputs.length-2].value=newcolor;
	body.style.transition="all 1s";
	colorchange();
	colorListener();

}

const colorListener = () => {
	const showClosingTab = (elem) => {
		console.warn("1' elapsed !!");
	}
	for (a of colorinputs){
		a.addEventListener("input", colorchange);
		a.onmouseover = function() {
	        // Set timeout to be a timer which will invoke callback after 1s
	        timeout = setTimeout(showClosingTab, 1000);
	    };
	    a.onmouseout = function() {
	        // Clear any timers set to timeout
	        clearTimeout(timeout);
    	}
	    }
};

const removeColorInput = (i=-1) => { // i = index du color input
	let len = colorinputs.length;
	if (len >1){
		if (i===-1){ // removing last index
			colorinputs[len-1].parentNode.removeChild(colorinputs[len-1]);
			colorchange();
			return true;
		}
		if (i<=len-1 && i>=0){ // removing requested index
			colorinputs[i].parentNode.removeChild(colorinputs[i]);
			colorchange();
			return true;
		}else
		{
			// invalid parameter input
			return false;
		}
	}else { // Only one color remaining ==> no color change
		return false;
	}
	
}

const setColors = (spacing) => {
    const getColor = (angledeg,brightness) => {
        const angleGreen = Math.PI/3*2;
        const angleBlue = Math.PI/3*4;
        const anglerad = angledeg/180*Math.PI;
        const red = Math.round(Math.abs(Math.cos(anglerad)*brightness));
        const green = Math.round(Math.abs(Math.cos(anglerad-angleGreen)*brightness));
        const blue = Math.round(Math.abs(Math.cos(anglerad-angleBlue)*brightness));
        return rgbToHex(red,green,blue);
    }
    const angle=Math.random()*255;
    const brightness = 155+100*Math.random();
    const c1 = getColor(angle,brightness);
    const c2 = getColor(angle+spacing,brightness);
    colorinputs[0].value=c1;
    colorinputs[1].value=c2;
    colorchange();
}

const resetColors = () =>{
	let i = 0;
	for (let i = colorinputs.length-1; i>0;i--){
		if (i>=2){
			colorinputs[i].remove();
		}
		getColorInputs();
	}

	
}
const copy = e => {
    var dummy = document.createElement("textarea");
    // to avoid breaking orgain page when copying more words
    // cant copy when adding below this code
    // dummy.style.display = 'none'
    document.body.appendChild(dummy);
    //Be careful if you use texarea. setAttribute('value', value), which works with "input" does not work with "textarea". – Eduard
    dummy.value = codezone.innerText;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);

	move(copybtn,[-40,0]);
	fade(copybtn,0);
	copied.style.opacity=1;
	setTimeout(()=>copied.style.opacity=0,1000);
  	return true;
}


const showCircle = bool => {
	if (bool){
		angleselector.style.opacity="100%";
		circle.style.cursor="pointer";
		anglebar.style.cursor="pointer";
	}else{
		angleselector.style.opacity="0%";
		circle.style.cursor="default";
		anglebar.style.cursor="default";
	}
	return true;
}

const move = (obj,[xvalue,yvalue]) =>obj.style.transform="translate( "+xvalue+"px, "+yvalue+"px)";
const fade = (obj,opacity) =>  obj.style.opacity=(opacity+"%");
var sliderMode = 0;
const changeGradientMode = () => {
	if(sliderMode===0){
		move(sliderselector,[-65,0]);
		showCircle(false);
		sliderMode=1;
	}else{
		move(sliderselector,[-129,0]);
		showCircle(true);
		sliderMode=0;
	}
	colorchange();
	return true;
}
const addAngleListener = (set) =>{
	if(set){
		body.fun = body.addEventListener;
		circle.fun = circle.addEventListener;
		circle.onmousemove = event => {
		if (circleclick.state){
			anglechange(event);
			return true;
		}
	}
	}else{
		body.fun = body.removeEventListener;
		circle.fun = circle.removeEventListener;
		circle.onmousemove = event => null;
	}
	console.warn(circle.fun);
	circle.fun("mousedown", event => {
		circleclick.setState(true)
		return anglechange(event);
		});
	body.fun("mouseup", x => circleclick.setState(false));
	return set;
}
const color_spacing = 45
setColors(color_spacing);
colorListener();
addAngleListener(true);
addcolorinputhtml.onclick = x => addColorInput();

feelinglucky.addEventListener("click", x => {
		resetColors();
		setColors(color_spacing);
		return true;
	})
copybtn.addEventListener("click",e => copy(e));
codecontainer.addEventListener("mouseenter",x=>{
	move(copybtn,[-40,-30]);
	fade(copybtn,100);
	return true;
});
codecontainer.addEventListener("mouseleave",x=>{
	move(copybtn,[-40,0]);
	fade(copybtn,0);
	return true;
});
sliderbox.addEventListener("click",() => changeGradientMode());


// angle.addEventListener("input",colorchange);