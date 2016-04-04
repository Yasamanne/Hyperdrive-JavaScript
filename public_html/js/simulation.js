


function simulate(xo, yo, zo, T) {
    var x = xo, y = yo, z = zo;
    var dt = 0.01;
    var sigma = 10;
    var r = 28;
    var beta = 2.66666666667;
    var values = [{x: x, y: y, z: z}];
    var i = 0;
    for (var t = dt; t < T; t += dt) {
        x += ((dt * sigma * y) - (dt * sigma * x));
        y += ((dt * r * x) - (dt * y) - (dt * x * z));
        z += ((dt * x * y) - (dt * beta * z));
        values[i] = {x: x, y: y, z: z};
        //console.log("Simulation: " + x + ", " + y +", "+ z +", "+ t);
        i++;
    }

    return values;
}



function search() {
    var N = 1000;
    var solutions = [];
    var besCost = [];
    for (var s = 0; s < N; s++) {
        var Input = CreateRandomXYZ();
        var is = reverse(Input);
        var arrayString = ConvertToDecimal(is);
        var Initializer = CreateInitializer(arrayString);
        var solution = {x: Initializer.x, y: Initializer.y, z: Initializer.z, T: Initializer.T};
        var cost = evaluate(Initializer.x,Initializer.y,Initializer.z,Initializer.T);
        var evals = 1;
        var neighborhood = generateneighbors(Input);
        var next = nextsolution(neighborhood);
            if(next.cost<cost){
                solution = {x:next.x,y:next.y,z:next.z,T:next.T};
                cost = next.cost;
                evals = s*next.evals;
            }
        console.log("<"+evals+">,<"+cost+">,<"+solution.x+">,<"+solution.y+">,<"+solution.z+">,<"+solution.T+">,Counter: "+s);
        solutions.push({cost: cost,evals: evals,point: solution});
        besCost.push(cost);
    }
    Array.prototype.min = function () {
        return Math.min.apply(null, this);
    };
    var best;
        var minCost = besCost.min();
    for(var k=0;k<solutions.length;k++){
        if(solutions[k].cost === minCost){
            best = solutions[k];
        }
    }
    return best;
}

function printSolutions(solutions){
    for(var solution in solutions){
        $("#printSpan").text("<"+solution.evals+">,<"+solution.cost+">,<"+solution.point.x+">,<"+solution.point.y+">,<"+solution.point.z+">,<"+solution.point.T+">");
    }
    
}

function evaluate(x, y, z, T) {
    var cost = 0;
    var evals = 0;
    var evaluation = [];
    var jumpPoint = {x: x, y: y, z: z};
    var initialPoint = {x: 0.0, y: 0.0, z: 0.0};
    var targetPoint = {x: 18.0, y: 20.0, z: 45.0};
    var surface = simulate(x, y, z, T);
    var exitObject = surface[surface.length - 1];
    var exitPoint = {x: exitObject.x, y: exitObject.y, z: exitObject.z};
    var entrance = euclidianDistance(initialPoint, jumpPoint);
    var exit = euclidianDistance(exitPoint, targetPoint);
    cost = entrance + exit;
    //console.log("COST----> " + entrance);
    return cost;
}

function nextsolution(neighborhood) {
    var next = {};
    var output;
    var nextArray = [];
    var costArray = [];
    var cost = 0;
    Array.prototype.min = function () {
        return Math.min.apply(null, this);
    };
    for (var i = 0; i < neighborhood.length; i++) {
        var is = reverse(neighborhood[i]);
        var arrayString = ConvertToDecimal(is);
        var Initializer = CreateInitializer(arrayString);
        var point = Initializer;
        cost = evaluate(point.x,point.y,point.z,point.T);
        next = {cost: cost, evals: i, x: point.x, y: point.y, z: point.z, T: point.T};
        nextArray.push(next);
        costArray.push(cost);
    }
    var minCost = costArray.min();
    for(var k=0;k<nextArray.length;k++){
        if(nextArray[k].cost === minCost){
            output = nextArray[k];
        }
    }
    return output;
}

function euclidianDistance(pointA, pointB) {
    dx = pointB.x - pointA.x;
    dy = pointB.y - pointA.y;
    dz = pointB.z - pointA.z;
    var distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2) + Math.pow(dz, 2));
    //console.log("distance: " + distance);
    return distance;
}
function reverse(s) {
    var o = '';
    for (var i = s.length - 1; i >= 0; i--)
        o += s[i];
    return o;
}

function ConvertToDecimal(string) {
    var x = '';
    var y = '';
    var z = '';
    var T = '';
    for (i = 0; i <= string.length - 49; i++)
        T += string[i];
    for (i = string.length - 48; i <= string.length - 33; i++)
        z += string[i];
    for (i = string.length - 32; i <= string.length - 17; i++)
        y += string[i];
    for (i = string.length - 16; i <= string.length - 1; i++)
        x += string[i];
    var xdec = parseInt(x, 2).toString(10);
    var ydec = parseInt(y, 2).toString(10);
    var zdec = parseInt(z, 2).toString(10);
    var Tdec = parseInt(T, 2).toString(10);
    var inputObject = {x: xdec, y: ydec, z: zdec, T: Tdec};
    return inputObject;
}

function CreateInitializer(inputObject)
{
    var fx = 40 * (inputObject.x / 65535) - 20;
    var fy = 60 * (inputObject.y / 65535) - 30;
    var fz = 50 * (inputObject.z / 65535);
    var fT = 5 * (inputObject.T / 255);
    //var inputObject=
    var output = {x: fx, y: fy, z: fz, T: fT};
    //console.log ("fx"+fx+"fy"+fy+"fz"+fz+"fT"+fT);
    return output;
}
function CreateRandomXYZ()
{
    var d = new Date();
    var n = d.getMilliseconds();
    var RandomX = parseInt((Math.random(n) * 65534) + 1, 10).toString(2);
    for (var i = RandomX.length; i < 16; i++) {
        var RandomX = "0" + RandomX;
    }

    var RandomY = parseInt((Math.random(n) * 65534) + 1, 10).toString(2);
    for (var i = RandomY.length; i < 16; i++) {
        var RandomY = "0" + RandomY;
    }
    var RandomZ = parseInt((Math.random(n) * 65534) + 1, 10).toString(2);
    for (var i = RandomZ.length; i < 16; i++) {
        var RandomZ = "0" + RandomZ;
    }

    var RandomT = parseInt((Math.random(n) * 254) + 1, 10).toString(2);
    for (var i = RandomT.length; i < 8; i++) {
        var RandomT = "0" + RandomT;
    }
    var RandomNumber = RandomX + RandomY + RandomZ + RandomT;
    //console.log("RandomNumber------->"+RandomNumber);
    return RandomNumber;

}

function generateneighbors(number)
{
    String.prototype.replaceAt = function (index, character) {
        return this.substr(0, index) + character + this.substr(index + character.length);
    };
    var neighborsArray = [];
    var neighbor="";
    for (var i=0; i<number.length;i++){
        if (number.charAt(i) === 0) {
            neighbor = number.replaceAt(i,"1");
        }
        else {
            neighbor = number.replaceAt(i,"0");
        }
        
        neighborsArray.push(neighbor);
    }
    // I think that the following solution for generating neighbours is better solution because it creates more neighbours but its slow 
    /*var str = number.toString(2);
    var x = '';
    var y = '';
    var z = '';
    var T = '';
    for (i = 0; i <= str.length - 49; i++)
        T += str[i];
    for (i = str.length - 48; i <= str.length - 33; i++)
        z += str[i];
    for (i = str.length - 32; i <= str.length - 17; i++)
        y += str[i];
    for (i = str.length - 16; i <= str.length - 1; i++)
        x += str[i];
    //console.log("X===>"+x);


    var neighborsArray = [];
    for (var j = 0; j < 16; j++) {


        var newX;
        if (x.charAt(j) === 0) {
            newX = x.replaceAt(j, "1");
        }
        else {
            newX = x.replaceAt(j, "0");
        }
        var Numx = newX + y + z + T + "";
        neighborsArray.push(Numx);

        //console.log("Numxxxxx: " + Numx);

        for (var k = 0; k < 16; k++) {

            var newY;
            if (y.charAt(k) === 0) {
                newY = y.replaceAt(k, "1");
            }
            else {
                newY = y.replaceAt(k, "0");
            }
            var NumY = newX + newY + z + T + "";
            neighborsArray.push(NumY);


            for (var m = 0; m < 16; m++) {

                var newZ;
                if (z.charAt(m) === 0) {
                    newZ = z.replaceAt(m, "1");
                }
                else {
                    newZ = z.replaceAt(m, "0");
                }
                var NumZ = newX + newY + newZ + T + "";
                neighborsArray.push(NumZ);

                for (var n = 0; n < 8; n++) {

                    var newT;
                    if (T.charAt(n) === 0) {
                        newT = T.replaceAt(n, "1");
                    }
                    else {
                        newT = T.replaceAt(n, "0");
                    }
                    var NumT = newX + newY + newZ + newT + "";
                    neighborsArray.push(NumT);


                }

            }


        }


    }*/
    // for(var n=0;n<neighborsArray.length;n++){
    //     console.log(neighborsArray[n]);
    // }

    return neighborsArray;


}     