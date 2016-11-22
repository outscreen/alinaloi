function showTerm(id,sender){
	$S("div.glossaryHead a").each(function(el){
		if(el === sender){
			el.setProperty('class','charEnabledActive');
		}else{
			el.setProperty('class','charEnabled');
		}
	});
	
	$S("#glossaryContainer dd").each(function(el){
		if(el.hasClassName(id)){
			el.setStyle('display','block');
		}else{
			//alert(el.getStyle('display'));
			el.setStyle('display','none');			
		}
	});
}

function showAllTerm(sender){
	$S("div.glossaryHead a").each(function(el){
		if(el === sender){
			el.setProperty('class','charEnabledActive');
		}else{
			el.setProperty('class','charEnabled');
		}
	});
	
	$S("#glossaryContainer dd").each(function(el){
		el.setStyle('display','block');
	});
}


glossaryManager = function(URL){
	if(URL.indexOf("#")>0 && URL.substr(URL.indexOf("#")+1,URL.length).length>0){
		var blockId = URL.substr(URL.indexOf("#")+1,URL.length);
		if($(blockId)){
//						alert($($(blockId).parentNode).className);
			blockClass = $($(blockId).parentNode).className;
			showTerm(blockClass,$(blockClass));			
		}else{
			showAllTerm($('showAllTerms'));
		}
	}else{
		showAllTerm($('showAllTerms'));
	}
}

function onGlossRefClick(URL){
	glossaryManager(URL);
}
function onDocumebtLoaded(){
	URL = document.location.href;
	glossaryManager(URL);
}
window.onload = onDocumebtLoaded;