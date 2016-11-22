//DRAG & DROP
var EASYCONTENT = 1;
var EASYWEB = 2;
var EASYSTUDY = 3;
var CURMODEL = EASYWEB;
function findPosXY(obj,axis)
{
	var curleft = 0;
	var curtop = 0;
	if(axis == 'x')
	{
		if (obj.offsetParent)
		{
			while (obj.offsetParent)
			{
				curleft += obj.offsetLeft
				obj = obj.offsetParent;
			}
		}
		else if (obj.x)
			curleft += obj.x;
		if(currBrowser.ie || currBrowser.op)
			return curleft;
		else
			return curleft;
	}
	if(axis == 'y')
	{
		if (obj.offsetParent)
		{
			while (obj.offsetParent)
			{
				curtop += obj.offsetTop
				obj = obj.offsetParent;
			}
		}
		else if (obj.y)
		curtop += obj.y;
		if(currBrowser.ie || currBrowser.op)
			return curtop;
		else
			return curtop;
	}
	return 0;
}


function browserDetect()
{
	this.n = navigator.userAgent.toLowerCase();
	
	this.db = (document.compatMode && document.compatMode.toLowerCase() != "backcompat")?
		document.documentElement
		: (document.body || null);
	this.op = !!(window.opera && document.getElementById);//opera7
	this.op6 = !!(this.op && !(this.db && this.db.innerHTML)); 
	if (this.op && !this.op6) document.onmousedown = new Function('e',
		'if (((e = e || window.event).target || e.srcElement).tagName == "IMAGE") return false;');
	this.ie = !!(this.n.indexOf("msie") >= 0 && document.all && this.db && !this.op); //ie
	this.iemac = !!(this.ie && this.n.indexOf("mac") >= 0);
	this.ie4 = !!(this.ie && !document.getElementById);
	this.n4 = !!(document.layers && typeof document.classes != "undefined");
	this.n6 = !!(typeof window.getComputedStyle != "undefined" && typeof document.createRange != "undefined");//firefox
	this.w3c = !!(!this.op && !this.ie && !this.n6 && document.getElementById);
	this.ce = !!(document.captureEvents && document.releaseEvents);
	this.px = (this.n4 || this.op6)? '' : 'px';
	this.tiv = this.w3c? 40 : 10;
	this.button = (this.n6)? 0:1; //left mouse button
	
}
function initPixel()
{
	this.x = 0;
	this.y = 0;
	this.tmp_x = 0;
	this.tmp_y = 0;	
	this.object = null;
	this.parent = null;
	this.dragAllow =false;
}


var currBrowser = new browserDetect();
var image =  new initPixel();


if(currBrowser.n6)
{
	document.captureEvents(Event.MOUSEDOWN | Event.MOUSEMOVE | Event.MOUSEUP);
}
document.onmousedown=startDrag;
document.onmousemove=move;
document.onmouseup=endDrag;


function startDrag(evt)
{
	var	sender = null;
	var Events = null;
	if(evt)
	{	
		sender = evt.target;
		Events = evt;
	}
	else
	{
		sender = event.srcElement;
		Events = event;
	}

	if(sender.tagName.toLowerCase()=='img' && sender.className.toLowerCase()=='drag')
	{
		if(currBrowser.op)
		{
//			sender.style.left = (findPosXY(sender,'x')-findPosXY(document.getElementById('holder1'),'x')) + currBrowser.px;
		//	sender.style.top = (findPosXY(sender,'y')-findPosXY(document.getElementById('holder1'),'y')) + currBrowser.px;
			sender.style.left = parseInt((findPosXY(sender,'x'))) + currBrowser.px;/*!*/
			sender.style.top = parseInt((findPosXY(sender,'y')))+ currBrowser.px;/*!*/
		}
		/*else if(currBrowser.ie==false){
			sender.style.left = parseInt((findPosXY(sender,'x'))-document.getElementById('content').scrollLeft + 30) + currBrowser.px;
			sender.style.top = parseInt((findPosXY(sender,'y'))-document.getElementById('content').scrollTop +5)+ currBrowser.px;

		}*/else
		{	
			sender.style.left = parseInt((findPosXY(sender,'x'))-document.getElementById('content').scrollLeft) + currBrowser.px;/*!*/
			sender.style.top = parseInt((findPosXY(sender,'y'))-document.getElementById('content').scrollTop)+ currBrowser.px;/*!*/
		}
		sender.style.position = "absolute";
		image.dragAllow = true;
		image.object = sender;
		image.parent = sender.parentNode;
		image.tmp_x = image.object.style.left;
		image.tmp_y = image.object.style.top;		
		sender.border=1;
		if(evt)
		{	
			image.x=Events.pageX;
			image.y=Events.pageY;
		}
		else
		{

			image.x=Events.clientX + document.body.scrollLeft;
			image.y=Events.clientY + document.body.scrollTop;
		}
	}
}
function move(evt)
{
	var	sender = null;
	var Events = null;
	if(evt)
	{	
		sender = evt.target;
		Events = evt;
	}
	else
	{
		sender = event.srcElement;
		Events = event;
	}
	
	if(image.dragAllow == true && Events.button==currBrowser.button) 
	{
		image.object.style.left=parseInt(image.tmp_x)+parseInt((evt)?(Events.pageX):(Events.clientX + document.body.scrollLeft))-parseInt(image.x)+currBrowser.px;
		image.object.style.top=parseInt(image.tmp_y)+parseInt((evt)?(Events.pageY):(Events.clientY + document.body.scrollTop))-parseInt(image.y)+currBrowser.px;
		return false;
	}
}
function endDrag(evt)
{
	var	sender = null;
	var Events = null;
	if(evt)
	{	
		sender = evt.target;
		Events = evt;
	}
	else
	{
		sender = event.srcElement;
		Events = event;
	}
	//alert(sender.tagName.toLowerCase());
	if(image.dragAllow==true)
	{
		if(sender.tagName.toLowerCase()!="img") //if image outside of the using region (e.c body)
		{
			image.object.style.position="static";
			image.object.border=0;
		}
		else
		{
			sender.border=0;
			var table_td = document.getElementsByTagName("TD");
			for(i=0;i<table_td.length;i++)
			{
				if(table_td[i].className.toLowerCase()==image.parent.className.toLowerCase())
				{

						if(currBrowser.op)
						{
							//x = parseInt(Events.clientX+document.body.scrollLeft+document.getElementById('holder1').scrollLeft);
							//y = parseInt(Events.clientY+document.body.scrollTop+document.getElementById('holder1').scrollTop);
							x = parseInt((evt)?(Events.pageX + document.getElementById('content').scrollLeft):(Events.clientX +document.body.scrollLeft+document.getElementById('content').scrollLeft));							
							y = parseInt((evt)?(Events.pageY + document.getElementById('content').scrollTop):(Events.clientY +document.body.scrollTop + document.getElementById('content').scrollTop));								
							
						}
						else
						{
							if(document.compatMode.toLowerCase() != "backcompat"){
								x = parseInt((evt)?(Events.pageX + document.getElementById('content').scrollLeft):(Events.clientX +document.getElementsByTagName("HTML")[0].scrollLeft+document.getElementById('content').scrollLeft));							
								y = parseInt((evt)?(Events.pageY + document.getElementById('content').scrollTop):(Events.clientY +document.getElementsByTagName("HTML")[0].scrollTop + document.getElementById('content').scrollTop));								
							}else{
								x = parseInt((evt)?(Events.pageX + document.getElementById('content').scrollLeft):(Events.clientX +document.body.scrollLeft+document.getElementById('content').scrollLeft));							
								y = parseInt((evt)?(Events.pageY + document.getElementById('content').scrollTop):(Events.clientY +document.body.scrollTop + document.getElementById('content').scrollTop));								
							}
						}


					if(x >= findPosXY(table_td[i],'x') && y>=findPosXY(table_td[i],'y') && x<=(findPosXY(table_td[i],'x')+table_td[i].offsetWidth) && y<=(findPosXY(table_td[i],'y')+table_td[i].offsetHeight))		
					{
						if(table_td[i].getElementsByTagName("IMG").length==0)
						{
							table_td[i].appendChild(sender);
							sender.style.position="static";
						}
					}
					else		
					{
						sender.style.position="static";
					}
				}
			}
		}
	}
	image.dragAllow = false;
}
//!DRAG & DROP

var maxScore = 0;
var rawScore = 0;
var curScore = 0;

function swapTest(formId,score,cScore){
	maxScore = score;
	curScore = cScore;
	
	var forms=document.getElementsByTagName("FORM");
	for(var i=0;i<forms.length;i++){
		if(forms[i].id=="form"+formId){
			if(checkQuiz(formId)){
				forms[i].parentNode.style.display="none";
				forms[i+1].parentNode.style.display="block";
				forms[i].reset();
			}
			if(i==forms.length-2){
				endTestTimer();
				document.getElementById("topBlankStripe").innerHTML = "&#xa0;";				
			}
		}
	}
}
var retry = "";
function checkQuiz(formId){
	var form = document.getElementById("form"+formId);
	var antswerArray = new Array();
	var ansCount = 0;
	var ansStat = 0;//missing
	retry = parseComment("init","retry:::");
	if(form){
		switch(form.className){
			case "multiply-choice-test":
				antswerArray = parseCommentTest(form,"a:::");
				
				var learnerArray = new Array();
				elements = form.getElementsByTagName("INPUT");
				for(var i=0;i<elements.length;i++){
					stat = (elements[i].checked)?1:0;
					learnerArray[i] =(elements[i].id+"[,]"+stat);
					if(stat == 1) ansCount++;
				}
				if(ansCount==0){
					if(!confirm(retry))
						return false;
					else 
						ansStat = 2;//missing
				}
				ansCount = 0;
				for(var i=0;i<antswerArray.length;i++){
					for(var j=0;j<learnerArray.length;j++){
						if(antswerArray[i] == learnerArray[j]){
							ansCount++;
						}
					}
				}
				if(ansCount == antswerArray.length){
					ansStat = 0;//rigth
				}else{
					if(ansStat!=2) ansStat = 1;//wrong
				}
				printRes(formId,ansStat);
				return true;
				//alert(antswerArray+"\n"+learnerArray);
			break;
			case "multiply-answers-test":
				antswerArray = parseCommentTest(form,"a:::");
				var learnerArray = new Array();
				elements = form.getElementsByTagName("INPUT");
				for(var i=0;i<elements.length;i++){
					stat = (elements[i].checked)?1:0;
					learnerArray[i] =(elements[i].id+"[,]"+stat);
					if(stat == 1) ansCount++;
				}
				if(ansCount==0){
					if(!confirm(retry))
						return false;
					else 
						ansStat = 2;//missing
				}
				ansCount = 0;
				for(var i=0;i<antswerArray.length;i++){
					for(var j=0;j<learnerArray.length;j++){
						if(antswerArray[i] == learnerArray[j])
							ansCount++;
					}
				}
				if(ansCount == antswerArray.length){
					ansStat = 0;//rigth
				}else{
					if(ansStat!=2) ansStat = 1;//wrong
				}
				printRes(formId,ansStat);
				return true;	
			break;
			case "true-false-test":
				antswerArray = parseCommentTest(form,"a:::");
				var learnerArray = new Array();
				elements = form.getElementsByTagName("INPUT");
				for(var i=0;i<elements.length;i++){
					stat = (elements[i].checked)?1:0;
					learnerArray[i] =(elements[i].id+"[,]"+stat);
					if(stat == 1) ansCount++;
				}
				if(ansCount==0){
					if(!confirm(retry))
						return false;
					else 
						ansStat = 2;//missing
				}
				ansCount = 0;
				for(var i=0;i<antswerArray.length;i++){
					for(var j=0;j<learnerArray.length;j++){
						if(antswerArray[i] == learnerArray[j])
							ansCount++;
					}
				}
				if(ansCount == antswerArray.length){
					ansStat = 0;//rigth
				}else{
					if(ansStat!=2) ansStat = 1;//wrong
				}
				printRes(formId,ansStat);
				return true;
			break;
			case "essay-test":
				elements = form.getElementsByTagName("TEXTAREA");
				if(elements.length>0){
					if(elements[0].value.length==0){
						if(!confirm(retry))
							return false;
						else 
							ansStat = 2;//missing
					}else{
						ansStat = 0;
					}
				}
				printRes(formId,ansStat);
				return true;
			break;
			case "fill-blank-test":
				antswerArray = parseCommentTest(form,"a:::");
				var learnerArray = new Array();
				elements = form.getElementsByTagName("INPUT");
				for(var i=0;i<elements.length;i++){
					if(elements[i].value!=""){
						learnerArray[i] =(elements[i].value);
						ansCount++;
					}
				}
				if(ansCount==0){
					if(!confirm(retry))
						return false;
					else 
						ansStat = 2;//missing
				}
				ansCount = 0;
				for(var i=0;i<antswerArray.length;i++){
					for(var j=0;j<learnerArray.length;j++){
						if(antswerArray[i] == learnerArray[j]){
							ansCount++;
							break;
						}
					}
				}
				if(ansCount == 1){
					ansStat = 0;//rigth
				}else{
					if(ansStat!=2) ansStat = 1;//wrong
				}
				printRes(formId,ansStat);
				return true;
			break;
			case "matching-test":
				antswerArray = parseCommentTest(form,"a:::");
				var learnerArray = new Array();
				elements = form.getElementsByTagName("SELECT");
				for(var i=0;i<elements.length;i++){
					learnerArray[i] =(elements[i].id+"[,]"+elements[i].value);
				}
				ansCount = 0;
				for(var i=0;i<antswerArray.length;i++){
					for(var j=0;j<learnerArray.length;j++){
						if(antswerArray[i] == learnerArray[j])
							ansCount++;
					}
				}
				if(ansCount == antswerArray.length){
					ansStat = 0;//rigth
				}else{
					if(ansStat!=2) ansStat = 1;//wrong
				}
				printRes(formId,ansStat);
				return true;			
			break;
			case "ordering-test":
				antswerArray = parseCommentTest(form,"a:::");
				var learnerArray = new Array();
				elements = form.getElementsByTagName("SELECT");
				for(var i=0;i<elements.length;i++){
					learnerArray[i] =(elements[i].id+"[,]"+elements[i].value);
				}
				ansCount = 0;
				for(var i=0;i<antswerArray.length;i++){
					for(var j=0;j<learnerArray.length;j++){
						if(antswerArray[i] == learnerArray[j])
							ansCount++;
					}
				}
				if(ansCount == antswerArray.length){
					ansStat = 0;//rigth
				}else{
					if(ansStat!=2) ansStat = 1;//wrong
				}
				printRes(formId,ansStat);
				return true;			
			break;
			case "drag-n-drop-test":
				antswerArray = parseCommentTest(form,"a:::");
				var learnerArray = new Array();
				elements = form.getElementsByTagName("IMG");
				for(var i=0;i<elements.length;i++)
				{
					if(elements[i].className=='drag' && elements[i].parentNode.id!='')
					{
						var sstr = elements[i].parentNode.id;
						learnerArray[ansCount] = sstr.substring(sstr.indexOf("_")+1,sstr.lastIndexOf("_"))+'[,]'+elements[i].id;
						ansCount++;
					}
				}
				if(ansCount==0){
					if(!confirm(retry))
						return false;
					else 
						ansStat = 2;//missing
				}
				ansCount = 0;		
				for(var i=0;i<antswerArray.length;i++){
					for(var j=0;j<learnerArray.length;j++){
						if(antswerArray[i] == learnerArray[j])
							ansCount++;
					}
				}
				if(ansCount == antswerArray.length){
					ansStat = 0;//rigth
				}else{
					if(ansStat!=2) ansStat = 1;//wrong
				}
				printRes(formId,ansStat);
				return true;			
			break;
		}
	}
}
function printRes(targetNodeId, ansStat){
	var testTrue = "\<span style=\"color:green\"\>"+parseComment("init","testTrue:::")+"\<\/span\>";
	var testFalse = "\<span style=\"color:red\"\>"+parseComment("init","testFalse:::")+"\<\/span\>";
	var strLabel = (ansStat==0)?testTrue:testFalse;
	if(ansStat==0){
		rawScore += curScore;
	}
	if(ansStat==0 || ansStat==1){
		document.getElementById("status"+targetNodeId).innerHTML = strLabel;
	}
	
}


//timer
var timerID=null;
var timeOFF=0;
var timeOver="";

function initTimer(){
	var testTargetNode = document.getElementById("topBlankStripe");
	var time0ut = parseInt(parseComment("init","timeLeft:::"));
	var timeText0ut = parseComment("init","timeLeftCaption:::");
	timeOver = parseComment("init","timeOut:::");
	if(time0ut>0){
		timeOFF = new Date().getTime()+time0ut*60000;
		if(testTargetNode){
			testTargetNode.innerHTML = "&#xa0;"+timeText0ut+"\<span id=\"testtime\"\>"+"\<\/span\>";
			parseTime(time0ut*60000);
			startTestTimer();
		}
	}
}
function parseComment(holderID,lex){
	var holder = document.getElementById(holderID);
	if(holder){
		var content = holder.childNodes;
		for(var i=0;i<content.length;i++){
			if(content[i].nodeType==8){
				if(content[i].nodeValue.indexOf(lex)==0)
					return content[i].nodeValue.substring(lex.length,content[i].nodeValue.length);
			}
		}
	}
	return null;
}
function parseCommentTest(holderObj,lex){
	var tmpArray = new Array();
	var counter = 0;
	if(holderObj){
		var content = holderObj.childNodes;
		for(var i=0;i<content.length;i++){
			if(content[i].nodeType==8){
				if(content[i].nodeValue.indexOf(lex)==0){
					tmpArray[counter] = content[i].nodeValue.substring(lex.length,content[i].nodeValue.length);
					counter++;
				}
			}
		}
	}
	return tmpArray;
}
function startTestTimer(){
	timerID = setInterval(recycleTestTimer,1000);
}
function recycleTestTimer(){
//	curDate = Date();
	currTime = new Date().getTime();
	deltaTime = timeOFF-currTime;
	parseTime(deltaTime);
	if((timeOFF-currTime)<100){
		endTestTimer();
		if(timeOver!="")
			alert(timeOver);
		document.getElementById("topBlankStripe").innerHTML = "&#xa0;";
		var forms=document.getElementsByTagName("FORM");
		for(var i=0;i<forms.length;i++){
			if(i==forms.length-1){
				forms[i].parentNode.style.display="block";
			}else{
				forms[i].parentNode.style.display="none";
			}
		}
	}
}

function endTestTimer(){
	SetValue("cmi.score.max", maxScore);
	SetValue("cmi.score.raw", rawScore);	
	if(timerID)
		clearInterval(timerID);
}

function parseTime(timeLeft){
	var parseMin = parseInt(timeLeft/60000);
   	var parseSec = parseInt((timeLeft%60000)/1000);
	if(parseSec<10)
      parseSec = "0"+parseSec;
	if(timeLeft<20000){
		document.getElementById("testtime").innerHTML = "\<span\ style=\"color:#FF0000;\">"+parseMin+":"+parseSec+"\<\/span\>";
   	}
	else{
		document.getElementById("testtime").innerHTML = "\<span\>"+parseMin+":"+parseSec+"\<\/span\>";
	}
}