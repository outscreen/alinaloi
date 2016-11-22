/*LMS*/
//init scorm adapter
var _Trace = false;
var internalSwitching = false;
var startTime=(new Date()).getTime();
function Initialize()
{
	var result = null;
	result = doInitialize();
	if(result=='false')
	{
		return false;
	}
	var completion_status = GetValue('cmi.completion_status');
	if(completion_status!="completed" && completion_status!="incomplete")
	{
		SetValue("cmi.completion_status", "incomplete")
	}
}
//stop scorm adapter
function Terminate()
{
	str = getAPIHandle();
	if(str!=null)
	{
		if(getAPIHandle().toString().indexOf("Not Initialized")!=-1)
			return;
	}
	if(internalSwitching == false )
	{
		var result = null;
		completion_status = GetValue("cmi.completion_status");
		if(completion_status!="completed")
		{
			SetValue("cmi.completion_status", "completed")
			SetValue("cmi.exit", "");
		}
		doCommit();
		doTerminate();
	}
}

//stop scorm adapter
function uncertifiedTerminate(page)
{
	if(internalSwitching == false)
	{
		str = getAPIHandle();
		if(str!=null)
		{
			if(getAPIHandle().toString().indexOf("Not Initialized")==-1)
			{
				doCommit();
				doTerminate();
			}
		}
	}
	else
	{
		internalSwitching = false;
	}
}

function SetValue(param1,param2)
{
	doSetValue(param1,param2);
//	doCommit();
}

function GetValue(param1)
{
	return doGetValue(param1);
}

// change sco

function changePage(page)
{
	internalSwitching = true;
	window.location.replace(page);
}

// tests 


function Trim(s){
	while ((s.substring(0,1) == ' ') || (s.substring(0,1) == '\n') || (s.substring(0,1) == '\r')){
		s = s.substring(1,s.length);
	}
	while ((s.substring(s.length-1,s.length) == ' ') || (s.substring(s.length-1,s.length) == '\n') || (s.substring(s.length-1,s.length) == '\r')){
		s = s.substring(0,s.length-1);
	}
	return s;
}
//set min max score limits
function setScoreLimit(minlimit,maximum)
{
	var tmp = new Array();
	tmp = maximum.split(",");
	maxlimit = 0;
	for(var i=0;i<tmp.length;i++)
	{
		if(parseInt(tmp[i]))
		{
			maxlimit +=parseInt(tmp[i]);
		}
	}
	SetValue( "cmi.score.min", minlimit);
	SetValue( "cmi.score.max", maxlimit);
}




function convertTotalSecondsIEEE(ts){
	var Y,M,D,H,Mnt,S,tmp;
	Y = 	Math.floor(ts/946080000);
	M = 	Math.floor((ts - Y*946080000)/2592000);
	D = 	Math.floor((ts - Y*946080000 - M*2592000)/86400);
	H = 	Math.floor((ts - Y*946080000 - M*2592000 - D*86400)/3600);
	Mnt =  	Math.floor((ts - Y*946080000 - M*2592000 - D*86400-H*3600)/60);
	S = 	Math.floor((ts - Y*946080000 - M*2592000 - D*86400-H*3600 - Mnt*60)*100)/100;

	return "P"+Y+"Y"+M+"M"+D+"DT"+H+"H"+Mnt+"M"+S+"S";
}

function fnBrowserDetect()
{
	/*	IE: 0
		Opera: 1
		Netscape: 2
	*/
	if(navigator.appName.indexOf("Netscape")>=0)
		return 2;
	if(navigator.userAgent.indexOf("MSIE")>0)
	{
		if(navigator.userAgent.indexOf("Opera")>0)
			return 1;
		if(navigator.userAgent.indexOf("Opera")==-1)
			return 0;
	}
	return -1;
}

function reference(identifier,href)
{	
	if(getAPIHandle()==null){
		window.location.replace(href);
	}else{
		SetValue("adl.nav.request", "{target="+identifier+"}choice");
		uncertifiedTerminate(null);
		internalSwitching = true;
	}
//	document.location=href;
}

//referances for popup window
function showPopup(windowPath, windowType)
{
	wnd=window.open(windowPath, windowType,'scrollbars=yes, resizable=yes, toolbar=no, width=800, height=600 '); 
	wnd.focus(); 
	void(0);
}


//See more block
function seeMore(id)
{
	var smore = document.getElementById('see-more'+id);
	var img= null;
	var div = null;
	for(r=0;r<smore.childNodes.length;r++)
	{
		if(smore.getElementsByTagName('IMG')[0].className.toLowerCase()=='collapse-img')
			img = smore.getElementsByTagName('IMG')[0];
		if(smore.childNodes[r].tagName == 'DIV')
			div = smore.childNodes[r];
	}
	if(img && div)
	{
		if(div.style.display == 'block')
		{
			div.style.display = 'none';
			img.setAttribute('src','../styles/files/seecollapsed.gif');
		}
		else
		{
			div.style.display = 'block';
			img.setAttribute('src','../styles/files/seeexpanded.gif');							
		}
	}
}

function correctPNG() 
   {
   for(var i=0; i<document.images.length; i++)
      {
	  var img = document.images[i]
	  var imgName = img.src.toUpperCase()
	  if (imgName.substring(imgName.length-3, imgName.length) == "PNG" && img.className.toUpperCase()=="PNG")
	     {
		 var imgSrc = ('..'+imgName.substring(imgName.lastIndexOf('/STYLES/FILES/'))).toLowerCase();
		 var imgID = (img.id) ? "id='" + img.id + "' " : "";
		 var imgClass = (img.className) ? "class='" + img.className + "' " : "";
		 var imgTitle = (img.title) ? "title='" + img.title + "' " : "title='" + img.alt + "' ";
		 var imgStyle = "display:inline-block;" + img.style.cssText; 
		 if (img.align == "left") imgStyle = "float:left;" + imgStyle;
		 if (img.align == "right") imgStyle = "float:right;" + imgStyle;
		 if (img.parentElement.href) imgStyle = "cursor:hand;" + imgStyle;		
		 var strNewHTML = "<span " + imgID + imgClass + imgTitle
		 + " style=\"" + "width:" + img.width + "px; height:" + img.height + "px;" + imgStyle + ";"
	     + "filter:progid:DXImageTransform.Microsoft.AlphaImageLoader"
		 + "(src=\'" + imgSrc + "\', sizingMethod='image');\"></span>"; 
		 img.outerHTML = strNewHTML;
		 i = i-1;
	     }
      }
   }

if(navigator.userAgent.indexOf("MSIE")>0 && parseFloat(navigator.userAgent.substring(navigator.userAgent.indexOf("MSIE")+5, navigator.userAgent.indexOf("MSIE")+8))>=5.5 &&navigator.userAgent.indexOf("Opera")<=0)
{
	window.attachEvent("onload", correctPNG);
}