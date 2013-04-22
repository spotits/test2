/**********************************************************
 **                Crop&Resize                           **
 **                                                      **
 **            Author:  Pasquale Di Stasio               **
 **            E-Mail:  info@pasqualedistasio.com        **
 **          Web-Site:  www.pasqualedistasio.com         **
 **                                                      **
 **              Date:  2007-09-15                       **
 **           Version:  1.2                              **
 **********************************************************/

var userAgent = borderW = initX = initY = defWidth = defHeight = initCrsX = sliderWidth = currRotation = 0;
var cAction = activeResize = false;
var imgInfo, dDotted, tLeft, tTop, tBottom, tRight, squareTL, squareTC, squareTR, squareCR, squareBR, squareBC, squareBL, squareCL, cResize;

if (navigator.userAgent.toLowerCase().indexOf("msie") > 0) {
	userAgent = "IE";
	borderW = (parseFloat(navigator.appVersion) < 4) ? 0 : 2;
} else if (navigator.userAgent.toLowerCase().indexOf("gecko") > 0) {
	userAgent = "FF";
	borderW = 2;
}


function getObjInfo(obj){
	oLeft = oTop = 0;
	oTag = obj;
	do {
		oLeft += oTag.offsetLeft;
		oTop += oTag.offsetTop;
		oTag = oTag.offsetParent;
	} while (oTag.tagName != "BODY" && oTag.tagName != "HTML");
	oWidth = obj.offsetWidth;
	oHeight = obj.offsetHeight;
	if (isNaN(oWidth) || isNaN(oHeight)) {
		oWidth = parseInt(obj.style.width);
		oHeight = parseInt(obj.style.height);
	}
	return {
		left	: oLeft,
		top		: oTop,
		width	: oWidth,
		height	: oHeight
		
	}
}

function xId(id) {
	return document.getElementById(id);
}

function isset(v) {
	return (v == '' || v == undefined) ? true : false;
}



function addEvent(elm, evType, fnc, useCapture){
	if (elm.addEventListener) {
		elm.addEventListener(evType, fnc, useCapture);
		return true;
	} else if (elm.attachEvent) {
		var r = elm.attachEvent('on'+evType, fnc);
		return r;
	} else {
		elm['on'+evType] = fnc;
	}
}




function createDiv (c, l, t, w, h) {
	div = document.createElement('DIV');
	div.className = c;
	div.style.top = isNaN(t) ? t : t + 'px';
	div.style.left = isNaN(l) ? l : l + 'px';
	div.style.width = isNaN(w) ? w : w + 'px';
	div.style.height = isNaN(h) ? h : h + 'px';
	div.innerHTML = '<span></span>';
	return div;
}


function createSquare(t, l, c){
	square = document.createElement('IMG');
	square.src = 'images/small_square.gif';
	square.style.position = 'absolute';
	if (!isNaN(t)) square.style.top = t + 'px';		
	if (!isNaN(l)) square.style.left = l + 'px';		
	square.style.cursor = c;
	square.onmousedown = resizeInit;
	return square;
}


function initCrop(v){
	objDiv = xId('imgContainer');
	imgInfo = getObjInfo(objDiv.childNodes.item(0));
	objDiv.style.width = imgInfo.width + 'px';
	objDiv.style.height = imgInfo.height + 'px';

	if (v != "notset") {
		defWidth = imgInfo.width;
		defHeight = imgInfo.height;
		cResize = xId("cursorResize");
		setInputResizeValue();
		pCursorInfo = getObjInfo(cResize.parentNode);
		sliderWidth = pCursorInfo.width - parseInt(cResize.style.width);
		cResize.style.left = (pCursorInfo.width - parseInt(cResize.style.width)) / 2 + 'px';
	}


	dDotted = createDiv('dotted', 0, 0, imgInfo.width-borderW, imgInfo.height-borderW);
	dDotted.innerHTML = '<div style="background-color:#FFFFFF; filter:alpha(opacity=0); opacity:0; -khtml-opacity: 0; -moz-opacity: 0;width:100%; height:100%; cursor:move;"></div>'
	dDotted.onmousedown = resizeInit;

	objDiv.appendChild(dDotted);

	squareTL = createSquare(-4, -4, 'nw-resize');
	dDotted.appendChild(squareTL);
	squareTC = createSquare(-4, 0, 'n-resize');
	dDotted.appendChild(squareTC);
	squareTR = createSquare(-4, 0, 'ne-resize');
	dDotted.appendChild(squareTR);
	squareCR = createSquare(0, 0, 'e-resize');
	dDotted.appendChild(squareCR);
	squareBR = createSquare(0, 0, 'se-resize');
	dDotted.appendChild(squareBR);
	squareBC = createSquare(0, 0, 's-resize');
	dDotted.appendChild(squareBC);
	squareBL = createSquare(0, -4, 'sw-resize');
	dDotted.appendChild(squareBL);
	squareCL = createSquare(0, -4, 'w-resize');
	dDotted.appendChild(squareCL);

	tTop = createDiv('transparent', 0, 0, '100%', 0);
	objDiv.appendChild(tTop);

	tRight = createDiv('transparent', imgInfo.width-borderW, 0, 0, '100%');
	objDiv.appendChild(tRight);

	tBottom = createDiv('transparent', 0, imgInfo.height-borderW, '100%', 0);
	objDiv.appendChild(tBottom);

	tLeft = createDiv('transparent', 0, 0, 0, '100%');
	objDiv.appendChild(tLeft);

	setInputValue();
	setSquarePosition();
	return;
}


function setInputValue(){
	xId("input_x").value = parseInt(dDotted.style.left);
	xId("input_y").value = parseInt(dDotted.style.top);
	xId("input_w").value = parseInt(dDotted.style.width) + borderW;
	xId("input_h").value = parseInt(dDotted.style.height) + borderW;
}

function setInputResizeValue(w, h){
	if (!isNaN(w) && !isNaN(h)) {
		xId("input_w_r").value = w;
		xId("input_h_r").value = h;
	} else {
		xId("input_w_r").value = imgInfo.width;
		xId("input_h_r").value = imgInfo.height;
	}
}


function resizeInit(e){
	if (userAgent=="IE") e = window.event;
	obj = e.target ? e.target : e.srcElement
	initX = e.clientX;
	initY = e.clientY;
	dDotted.initLeft = parseInt(dDotted.style.left);
	dDotted.initTop = parseInt(dDotted.style.top);
	dDotted.initWidth = parseInt(dDotted.style.width);
	dDotted.initHeight = parseInt(dDotted.style.height);
	cAction = obj.style.cursor;
	return false;
}

function cropObj(e) {
	if (cAction == false) return false;
	if (window.event) e = window.event;
	if (cAction == "move") {
		w = h = null;
		x = e.clientX - initX + dDotted.initLeft;
		y = e.clientY - initY + dDotted.initTop;
		if (x < 0) {
			x = 0;
		} else if ((x + dDotted.initWidth + borderW) > imgInfo.width) {
			x = imgInfo.width - dDotted.initWidth - borderW
		}
		if (y < 0) {
			y = 0;
		} else if ((y + dDotted.initHeight + borderW) > imgInfo.height) {
			y = imgInfo.height - dDotted.initHeight - borderW
		}
	} else if (cAction == "nw-resize") {
		x = e.clientX - initX + dDotted.initLeft;
		y = e.clientY - initY + dDotted.initTop;
		w = dDotted.initWidth - e.clientX + initX;
		h = dDotted.initHeight - e.clientY + initY;
		if (x < 0) {
			w += x;
			x = 0;
		} else if (w < 20) {
			w = 20;
			x = dDotted.initLeft + dDotted.initWidth - 20;
		}
		if (y < 0) {
			h += y;
			y = 0;
		} else if (h < 20) {
			h = 20;
			y = dDotted.initTop + dDotted.initHeight - 20;
		}
	} else if (cAction == "n-resize") {
		x = w = null;
		y = e.clientY - initY + dDotted.initTop;
		h = dDotted.initHeight - e.clientY + initY;
		if (y < 0) {
			h += y;
			y = 0;
		} else if (h < 20) {
			h = 20;
			y = dDotted.initTop + dDotted.initHeight - 20;
		}
	} else if (cAction == "ne-resize") {
		w = e.clientX - initX + dDotted.initWidth;
		y = e.clientY - initY + dDotted.initTop;
		h = dDotted.initHeight - e.clientY + initY;
		x = null;
		if (w < 20) {
			w = 20;
		} else if ((dDotted.initLeft + w + borderW) > imgInfo.width) {
			w = imgInfo.width - dDotted.initLeft - borderW
		}
		if (y < 0) {
			h += y;
			y = 0;
		} else if (h < 20) {
			h = 20;
			y = dDotted.initTop + dDotted.initHeight - 20;
		}
	} else if (cAction == "e-resize") {
		x = y = h = null;
		w = e.clientX - initX + dDotted.initWidth;
		if (w < 20) {
			w = 20;
		} else if ((dDotted.initLeft + w + borderW) > imgInfo.width) {
			w = imgInfo.width - dDotted.initLeft - borderW
		}
	} else if (cAction == "se-resize") {
		x = y = null;
		w = e.clientX - initX + dDotted.initWidth;
		h = e.clientY - initY + dDotted.initHeight;
		if (w < 20) {
			w = 20;
		} else if ((dDotted.initLeft + w + borderW) > imgInfo.width) {
			w = imgInfo.width - dDotted.initLeft - borderW
		}
		if (h < 20) {
			h = 20;
		} else if ((dDotted.initTop + h + borderW) > imgInfo.height) {
			h = imgInfo.height - dDotted.initTop - borderW
		}
	} else if (cAction == "s-resize") {
		x = y = w = null;
		h = e.clientY - initY + dDotted.initHeight;
		if (h < 20) {
			h = 20;
		} else if ((dDotted.initTop + h + borderW) > imgInfo.height) {
			h = imgInfo.height - dDotted.initTop - borderW
		}
	} else if (cAction == "sw-resize") {
		y = null;
		x = e.clientX - initX + dDotted.initLeft;
		w = dDotted.initWidth - e.clientX + initX;
		h = e.clientY - initY + dDotted.initHeight;
		if (x < 0) {
			w += x;
			x = 0;
		} else if (w < 20) {
			w = 20;
			x = dDotted.initLeft + dDotted.initWidth - 20;
		}
		if (h < 20) {
			h = 20;
		} else if ((dDotted.initTop + h + borderW) > imgInfo.height) {
			h = imgInfo.height - dDotted.initTop - borderW
		}
	} else if (cAction == "w-resize") {
		y = h = null;
		x = e.clientX - initX + dDotted.initLeft;
		w = dDotted.initWidth - e.clientX + initX;
		if (x < 0) {
			w += x;
			x = 0;
		} else if (w < 20) {
			w = 20;
			x = dDotted.initLeft + dDotted.initWidth - 20;
		}
	}
	document.body.style.cursor = cAction;
	setDottedPosition(x, y, w, h);
	setSquarePosition();
	setTransparentDiv();
	setInputValue();
	return false;
}


function setSquarePosition() {
	xRight = parseInt(dDotted.style.width) - 4 + borderW - 1;
	yBottom = parseInt(dDotted.style.height) - 4 + borderW - 1;
	xCenter = (parseInt(dDotted.style.width) / 2) - 4;
	yCenter = (parseInt(dDotted.style.height) / 2) - 4;

	squareTR.style.left = xRight + 'px';
	squareBR.style.left = xRight+ 'px';
	squareBR.style.top = yBottom + 'px';
	squareBL.style.top = yBottom + 'px';

	squareTC.style.left = xCenter + 'px';
	squareCR.style.top = yCenter + 'px';
	squareCR.style.left = xRight + 'px';
	squareBC.style.top = yBottom + 'px';
	squareBC.style.left = xCenter + 'px';
	squareCL.style.top = yCenter + 'px';
}

function setTransparentDiv(){
	tLeft.style.width = parseInt(dDotted.style.left) + 'px';
	tTop.style.height = parseInt(dDotted.style.top) + 'px';
	tTop.style.left = parseInt(dDotted.style.left) + 'px';
	tTop.style.width = parseInt(dDotted.style.width) + borderW + 'px';
	tRight.style.left = parseInt(dDotted.style.left) + borderW + parseInt(dDotted.style.width) + 'px';
	tRight.style.width = imgInfo.width - parseInt(dDotted.style.left) - parseInt(dDotted.style.width) - borderW + 'px';
	tBottom.style.top = parseInt(dDotted.style.top) + parseInt(dDotted.style.height) + borderW + 'px';
	tBottom.style.left = parseInt(dDotted.style.left) + 'px';
	tBottom.style.width = parseInt(dDotted.style.width) + borderW + 'px';
	tBottom.style.height = imgInfo.height - parseInt(dDotted.style.top) - parseInt(dDotted.style.height) - borderW + 'px';
}



function setDottedPosition(x, y, w, h){
	if (x != null) dDotted.style.left = x + 'px';
	if (w != null) dDotted.style.width = w + 'px';
	if (h != null) dDotted.style.height = h + 'px';
	if (y != null) dDotted.style.top = y + 'px';
}


function cancelDrag() {
	cAction = false;
	if (activeResize == true) {
		initCrop("notset");
	}
	activeResize = false;
	document.body.style.cursor = "default";
	return false;
}


function moveByKey(e){
	if (e.keyCode < 37 || e.keyCode > 40) return;
	step = e.shiftKey ? 10 : 1;
	x = y = null;
	if (e.keyCode == 37) { // left
		x = parseInt(dDotted.style.left) - step;
	} else if (e.keyCode == 38) { // up
		y = parseInt(dDotted.style.top) - step;
	} else if (e.keyCode == 39) { // right
		x = parseInt(dDotted.style.left) + step;
	} else if (e.keyCode == 40) { // down
		y = parseInt(dDotted.style.top) + step;
	}
	if (x != null) {
		if (x < 0) {
			x = 0;
		} else if ((x + parseInt(dDotted.style.width) + borderW) >= imgInfo.width) {
			x = imgInfo.width - parseInt(dDotted.style.width) - borderW;
		}
		dDotted.style.left = x + 'px';
	}
	if (y != null) {
		if (y < 0) {
			y = 0;
		} else if ((y + parseInt(dDotted.style.height) + borderW) >= imgInfo.height) {
			y = imgInfo.height - parseInt(dDotted.style.height) - borderW;
		}
		dDotted.style.top = y + 'px';
	}
	setSquarePosition();
	setTransparentDiv();
	setInputValue();
	return;
}

function setInputCrop(){
	x = parseInt(xId("input_x").value);
	y = parseInt(xId("input_y").value);
	w = parseInt(xId("input_w").value) - borderW;
	h = parseInt(xId("input_h").value) - borderW;
	if ((w + borderW) > imgInfo.width) {
	if (w < 20) w = 20;
	if (h < 20) h = 20;
		w = imgInfo.width - borderW;
		x = 0;
	} else if (x < 0) {
		x = 0;
	} else if ((x + parseInt(dDotted.style.width) + borderW) >= imgInfo.width) {
		x = imgInfo.width - parseInt(dDotted.style.width) - borderW;
	}

	if ((h + borderW) > imgInfo.height) {
		h = imgInfo.height - borderW;
		y = 0;
	} else if (y < 0) {
		y = 0;
	} else if ((y + parseInt(dDotted.style.height) + borderW) >= imgInfo.height) {
		y = imgInfo.height - parseInt(dDotted.style.height) - borderW;
	}
	if (isNaN(w)) w = null;
	if (isNaN(h)) h = null;
	if (isNaN(x)) x = null;
	if (isNaN(y)) y = null;
	setDottedPosition(x, y, w, h);
	setSquarePosition();
	setTransparentDiv();
	setInputValue();
}




function mouseMove(e){
	if (cAction != false) {
		cropObj(e);
		return false;
	} else if (activeResize == true) {
		x = setXCursor(e.clientX - initCrsX);
		cResize.style.left = x + "px";
		p = Math.floor(x/sliderWidth*100*2);
		setResize(p);
		return false;
	}
	return;
}


function destroyCropObject() {
	objDiv.removeChild(tLeft);
	objDiv.removeChild(tTop);
	objDiv.removeChild(tRight);
	objDiv.removeChild(tBottom);
	objDiv.removeChild(dDotted);	
}
function setActiveResize(e) {
	destroyCropObject();
	cursorInfo = getObjInfo(cResize);
	parentInfo = getObjInfo(cResize.parentNode);
	initCrsX = parentInfo.left + e.clientX - cursorInfo.left;
	activeResize = true;
}

function setXCursor(x) {
	if (x < 0) {
		x = 0;
	} else if (x > (sliderWidth)) {
		x = sliderWidth;
	}
	return x;
}
function setResize(p) {
	objDiv = xId('imgContainer');
	img = objDiv.childNodes.item(0)
	newW = imgInfo.width = Math.round(defWidth * p / 100);
	newH = imgInfo.height = Math.round(defHeight * p / 100);
	w = (newW < 20) ? 20 : newW;
	h = (newH < 20) ? 20 : newH;
	img.style.width = w + "px";
	img.style.height = h + "px";
	xId("percent").innerHTML = "&nbsp;("+Math.round(p/2)+" %)"
	setInputResizeValue(w, h);
	return;
}

function setInputResize(){
	destroyCropObject();
	objDiv = xId('imgContainer');
	img = objDiv.childNodes.item(0)
	w = parseInt(xId("input_w_r").value);
	h = parseInt(xId("input_h_r").value);
	if (w < 20) w = 20;
	if (h < 20) h = 20;
	imgInfo.width = defWidth = w;
	imgInfo.height = defHeight = h;
	img.style.width = imgInfo.width + "px";
	img.style.height = imgInfo.height + "px";
	xId("percent").innerHTML = "&nbsp;(50 %)"
	initCrop();
}


function imageRotation(dir) {
	if (userAgent != "IE") return false;
	destroyCropObject();
	(dir == 1) ? --currRotation : ++currRotation;
	if (currRotation > 4) {
		currRotation -= 4;
	} else if (currRotation < 0) {
		currRotation += 4;
	}
	img = xId('imgContainer').childNodes.item(0);
	img.style.filter = "progid:DXImageTransform.Microsoft.BasicImage(grayscale=0, xray=0, mirror=0, invert=0, opacity=1, rotation=" + currRotation +");";
	xId('rotation').value = currRotation;
	initCrop();
}