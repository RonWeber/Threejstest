var wPressed = false;
var aPressed = false;
var sPressed = false;
var dPressed = false;

document.addEventListener( 'keydown', function(event) {
    switch (event.keyCode) {
    case 87: //w
	wPressed = true;
	break;

    case 65: //a
	aPressed = true;
	break;

    case 83: //s
	sPressed = true;
	break;

    case 68: //d
	dPressed = true;
	break;
    }
}, false );


document.addEventListener( 'keyup', function(event) {
    switch (event.keyCode) {
    case 87: //w
	wPressed = false;
	break;

    case 65: //a
	aPressed = false;
	break;

    case 83: //s
	sPressed = false;
	break;

    case 68: //d
	dPressed = false;
	break;
    }
}, false );
