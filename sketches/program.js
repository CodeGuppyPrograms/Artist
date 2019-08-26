// #SKETCHNAME Artist
var buttons = [];
var shapes = [];
var altShapes = [];

var currColor = "Navy";
var command = "Line";
var commandStarted = false;

var px;
var py;


function enter()
{
    addCommandButtons();
    addColorButtons(385);
}

function loop()
{
    clear();

    drawShapes();
    drawCurrShape();
    
    drawButtons();
    displayStatus();
}

function mouseClicked()
{
    if (!handleButtons())
    {
        runCommand();
    }
}

function runCommand()
{
    if (!command)
        return;
    
    if (commandStarted)
    {
        commandStarted = false;
        addShape(px, py, mouseX, mouseY);
    }
    else
    {
        commandStarted = true;
        px = mouseX;
        py = mouseY;
    }
}


function addShape(x1, y1, x2, y2)
{
    var shape = getShape(command, x1, y1, x2, y2);
    shape.color = currColor;
    
    shapes.push(shape);
    altShapes = [];
}


function getShape(shapeType, x1, y1, x2, y2)
{
    var shape = { type : shapeType,
                x1 : x1,
                y1 : y1,
                x2 : x2,
                y2 : y2
            };

    switch(shapeType)
    {
    	case "Line":
    	    break;
    	case "Circle":
            shape.r = dist(x1, y1, x2, y2);
            break;
        case "Ellipse":
            shape.dw = abs(x2 - x1) * 2;
            shape.dh = abs(y2 - y1) * 2;
            break;
        case "Square":
            var w = x2 - x1;
            var h = y2 - y1;
            var wh = min(abs(w), abs(h));
            var dw = w >= 0 ? 1 : -1;
            var dh = h >= 0 ? 1 : -1;
            shape.w = dw * wh;
            shape.h = dh * wh;
            break;
        case "Rect":
            shape.w = x2 - x1;
            shape.h = y2 - y1;
            break;
    }    
    
    return shape;
}


function handleUndoClick()
{
    var o = shapes.pop();
    if (o)
    {
        altShapes.push(o);
    }
}

function handleRedoClick()
{
    var o = altShapes.pop();
    if (o)
    {
        shapes.push(o);
    }
}


function drawShapes()
{
    for(var o of shapes)
    {
        stroke(o.color);
        strokeWeight(5);
        noFill();

        drawShape(o, false);
    }
}

function drawCurrShape()
{
    if (!command || !commandStarted)
        return;

    stroke(0);
    strokeWeight(1);
    noFill();
    
    var shape = getShape(command, px, py, mouseX, mouseY);
    drawShape(shape, true);
}

function drawShape(shape, decorations)
{
    switch(shape.type)
    {
    	case "Line":
    	    line(shape.x1, shape.y1, shape.x2, shape.y2);
    		break;
    	case "Circle":
    	    circle(shape.x1, shape.y1, shape.r);
    	    
    	    if (decorations)
    	    {
    	        line(shape.x1, shape.y1, shape.x2, shape.y2);
    	    }
    		break;
    	case "Ellipse":
    	    ellipse(shape.x1, shape.y1, shape.dw, shape.dh);
    	    
    	    if (decorations)
    	    {
    	        rect(shape.x1 - shape.dw / 2, shape.y1 - shape.dh / 2, shape.dw, shape.dh);
    	    }
    	    break;
    	case "Square":
    	    rect(shape.x1, shape.y1, shape.w, shape.h);
    	    break;
    	case "Rect":
    	    rect(shape.x1, shape.y1, shape.w, shape.h);
    	    break;
    }
    
    if (decorations)
    {
        fill(0);
        circle(px, py, 5);
        circle(mouseX, mouseY, 5);
    }
}


function displayStatus()
{
    stroke(0);
    strokeWeight(1);

    fill(currColor);
    rect(2, 10, 20, 10);
    
    fill(0);
    noStroke();
    var msg = command || "cmd?";
    textAlign(LEFT, TOP);
    text(msg, 30, 8);
}

function addCommandButtons()
{
    var btnUndo = addButton(2, height - 32, 45, 30, "Undo", handleUndoClick);
    btnUndo.backColor = "teal";
    btnUndo.hoverBackColor = "green";
    
    var btnRedo = addButton(50, height - 32, 45, 30, "Redo", handleRedoClick);
    btnRedo.backColor = "teal";
    btnRedo.hoverBackColor = "green";
    
    addButton(100, 568, 50, 30, "Line", handleCommandClick);
    addButton(152, 568, 50, 30, "Circle", handleCommandClick);
    addButton(204, 568, 50, 30, "Ellipse", handleCommandClick);
    addButton(256, 568, 50, 30, "Square", handleCommandClick);
    addButton(308, 568, 50, 30, "Rect", handleCommandClick);
}


function addColorButtons(x)
{
    var colors = ['IndianRed', 'Salmon', 'Crimson', 'Red', 'Tomato', 'Orange', 'Yellow', 'Violet', 'MediumPurple', 'SlateBlue', 'LimeGreen', 'ForestGreen', 'Teal', 'SkyBlue', 'Navy', 'Brown', 'DarkSlateGray', 'Black'];

    var w = (width - x) / colors.length;
    var h = 30;
    var y = height - h - 2;

    for(var i = 0; i < colors.length; i++)
    {
        var btn = addButton(x + i * w, y, w, h - 1, "", handleColorClick);
        btn.backColor = colors[i];
        btn.hoverBackColor = "";
    }
}

function handleCommandClick(btn)
{
    command = btn.text;
}

function handleColorClick(btn)
{
    currColor = btn.backColor;
}


function addButton(x, y, w, h, text, onClick)
{
    var btn = { x : x, 
                y : y, 
                w : w,
                h : h,
                text : text,
                foreColor : "white",
                backColor : "#0058AD",
                hoverForeColor : "lightblue",
                hoverBackColor : "#0068BD",
                pressedForeColor : "white",
                pressedBackColor : "#00489D",
                onClick : onClick
                };
                
    buttons.push(btn);
    
    return btn;
}

function drawButtons()
{
    for(var btn of buttons)
    {
        drawButton(btn);
    }
}

function handleButtons()
{
    for(var btn of buttons)
    {
        if (collisionPointRect(mouseX, mouseY, btn.x, btn.y, btn.w, btn.h))
        {
            if (btn.onClick)
                btn.onClick(btn);
                
            return true;
        }
    }
    
    return false;
}

function drawButton(btn)
{
    var fk = btn.foreColor;
    var bk = btn.backColor;

    if (collisionPointRect(mouseX, mouseY, btn.x, btn.y, btn.w, btn.h))
    {
        fk = mouseIsPressed ? btn.pressedForeColor || fk : btn.hoverForeColor || fk;
        bk = mouseIsPressed ? btn.pressedBackColor || bk : btn.hoverBackColor || bk;
    }

    noStroke();
    fill(bk);
    rect(btn.x, btn.y, btn.w, btn.h);

    if (btn.text)
    {
        fill(fk);
        noStroke();
        textAlign(CENTER, CENTER);
        text(btn.text, btn.x + btn.w / 2, btn.y + btn.h / 2);
    }
}
