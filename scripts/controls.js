var wPressed = false;
var aPressed = false;
var sPressed = false;
var dPressed = false;

document.addEventListener( 'keydown', function(event) {
    switch (event.keyCode) {
    case 38: //up
    case 87: //w
	wPressed = true;
	break;

    case 37: //left
    case 65: //a
	aPressed = true;
	break;

    case 40: //down
    case 83: //s
	sPressed = true;
	break;

    case 39: //right
    case 68: //d
	dPressed = true;
	break;
    }
}, false );


document.addEventListener( 'keyup', function(event) {
    switch (event.keyCode) {
    case 38: //up
    case 87: //w
	wPressed = false;
	break;

    case 37: //left
    case 65: //a
	aPressed = false;
	break;

    case 40: //down	
    case 83: //s
	sPressed = false;
	break;
	
    case 39: //right
    case 68: //d
	dPressed = false;
	break;
    }
}, false );
