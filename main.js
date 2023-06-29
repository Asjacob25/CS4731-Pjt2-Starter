

var cubeMap;
var stack = [];
let stopSign;
let cameraAnimation = false;
let objects =[];
let lamp;
let car;
let street;
let bunny;
let justAmbient = false;
let angle =0;
let xAngle = 0;
let moveCar = false;
let movex = 0.1;
let ifShadow = false;
let a;
theta = 0;
let close = false;

    var lightPosition = vec4(1.0, 6.0, 1.0, 0.0 );
    var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
    var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
    var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

    var gl;


    var program;

    var modelViewMatrix, projectionMatrix;
    var modelViewMatrixLoc, projectionMatrixLoc;
    var dtranslateMatrix, translationMatrix;

    var eye;
    var at = vec3(0.0, 0.0, 0.0);
    var up = vec3(0.0, 1.0, 0.0);

    function main() {

        // Retrieve <canvas> element
        var canvas = document.getElementById('webgl');

        // Get the rendering context for WebGL
        gl = WebGLUtils.setupWebGL(canvas, undefined);

        //Check that the return value is not null.
        if (!gl) {
            console.log('Failed to get the rendering context for WebGL');
            return;
        }


        // Initialize shaders
        program = initShaders(gl, "vshader", "fshader");
        gl.useProgram(program);

        projectionMatrix = perspective (90, canvas.width/canvas.height, 0.1, 100.0);
        projectionMatrixLoc = gl.getUniformLocation(program, 'projectionMatrix');
        gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

        gl.uniform4fv(gl.getUniformLocation(program, "diffuseLight"), flatten(lightDiffuse));
        gl.uniform4fv(gl.getUniformLocation(program, "specularLight"), flatten(lightSpecular));
        gl.uniform4fv(gl.getUniformLocation(program, "ambientLight"), flatten(lightAmbient));
        gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"), flatten(lightPosition));

        eye = vec3(0, 4, 5);
        modelViewMatrix = lookAt(eye, at , up);

        a = mat4();
        a[3][3] = 0;
        a[3][2] = -1/lightPosition[2];
        a[3][1] = 0;

        modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));



        // Set up the viewport
        gl.viewport(0, 0, canvas.width, canvas.height);

        // Enable depth testing
        gl.enable(gl.DEPTH_TEST);

        // Set clear color
        gl.clearColor(0.0, 0.0, 0.0, 1.0);

        // Clear canvas by clearing the color buffer
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        //set uo projection matrices and view matrices
        stopSign = new Model(
            "https://web.cs.wpi.edu/~jmcuneo/cs4731/project3/stopsign.obj",
            "https://web.cs.wpi.edu/~jmcuneo/cs4731/project3/stopsign.mtl");

        lamp = new Model(
            "https://web.cs.wpi.edu/~jmcuneo/cs4731/project3/lamp.obj",
            "https://web.cs.wpi.edu/~jmcuneo/cs4731/project3/lamp.mtl");

        car = new Model(
            "https://web.cs.wpi.edu/~jmcuneo/cs4731/project3/car.obj",
            "https://web.cs.wpi.edu/~jmcuneo/cs4731/project3/car.mtl");

        street = new Model(
            "https://web.cs.wpi.edu/~jmcuneo/cs4731/project3/street.obj",
            "https://web.cs.wpi.edu/~jmcuneo/cs4731/project3/street.mtl");


        bunny = new Model(
            "https://web.cs.wpi.edu/~jmcuneo/cs4731/project3/bunny.obj",
            "https://web.cs.wpi.edu/~jmcuneo/cs4731/project3/bunny.mtl");

        stopSign.num = 1;
        lamp.num = 2;
        car.num=3;
        street.num=4;
        bunny.num=5;

        var image = new Image();
        image.crossOrigin = "";
        image.src = "https://web.cs.wpi.edu/~jmcuneo/cs4731/project2/stop.png";
        image.onload = function() {
            configureTexture( image );
        }

        console.log(stopSign);

        objData(stopSign, 1);
        objData(lamp, 2);
        objData(car, 3);
        objData(street, 4);
        objData(bunny, 5);

        var image = new Image();
        image.crossOrigin = "";
        image.src = "http://web.cs.wpi.edu/~jmcuneo/a.jpg";
        image.onload = function() {
            configureCubeMapImage(image);
        }

        canRender();

        window.onkeypress = function(event) {
            let key = event.key;

            switch (key.toLowerCase()) {
                case 'l':
                    if (justAmbient) {
                        justAmbient = false;
                        canRender();
                    } else {
                        justAmbient = true;
                        canRender();
                    }
                    break;
                case 'c':
                    if (cameraAnimation) {
                        cameraAnimation = false;
                        canRender();
                    } else {
                        cameraAnimation = true;
                        canRender();
                    }
                    break;
                case 'm':
                    if (moveCar) {
                        moveCar = false;
                        canRender();
                    } else {
                        moveCar = true;
                        canRender();
                    }
                    break;
                case 's':

                    ifShadow= !ifShadow;
                    if(ifShadow) {
                        let fColor = gl.getUniformLocation(program, "fColor");

                        let mMatrix = translate(lightPosition[0], lightPosition[1], lightPosition[2]);
                        mMatrix = mult(mMatrix, a);
                        mMatrix = mult(mMatrix, translate(-lightPosition[0], -lightPosition[1], -lightPosition[2]));

                        modelViewMatrix = mult(modelViewMatrix, mMatrix);

                        modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
                        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
                        gl.uniform4fv(fColor, flatten(vec4(0,0,0,1)));
                        gl.drawArrays(gl.TRIANGLES, 0, car.vertices.length);
                        canRender();
                    }
                    else
                    {
                        modelViewMatrix = lookAt(eye, at, up);
                        modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
                        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
                        canRender();

                    }
                    break;

                    //Works sometimes but can also break code
                /*case 'D':
                    close = !close;
                    if(close)
                    {
                        modelViewMatrix = lookAt(vec3(3.0, 1.4, -1.2), vec3(2.5, 0.8, -1.2), vec3(0.0, 1.0, 0.0));
                        modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
                        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
                    }
                    else
                    {
                        modelViewMatrix = lookAt(eye, at, up);
                        modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
                        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
                    }
                    canRender();
                    break;*/



            }
        }

    }

    function canRender(){
        if(objects.length == 5){
            console.log("draw")
            gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
            gl.clearColor(0, 0, 0, 1.0);

            draw()
        }else{
            requestAnimationFrame(function() {
                canRender();
            });
        }
    }
    function treeRoot(root) {
    this.root = root;
    }

//create a node
    function Node(transform, model) {
        this.transform = transform;
        this.model = model;
        this.children = [];
    }



    function render(object, num){
        //console.log(object.diffuse);
        console.log(object.specular);
        /*gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
        gl.clearColor(0, 0, 0, 1.0);*/

            //console.log(linePoints)

        //let ambientOnlyBoolLoc = gl.getUniformLocation(program, "justAmbient");
        if(justAmbient){
            gl.uniform1i(gl.getUniformLocation(program, "justAmbient"), 1);
        }else{
            gl.uniform1i(gl.getUniformLocation(program, "justAmbient"), 0);
        }





        var vBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(object.vertices), gl.STATIC_DRAW);

        var vPosition = gl.getAttribLocation(program, "vPosition");
        gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vPosition);

        var dBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, dBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(object.diffuse), gl.STATIC_DRAW);

        var vMaterialDiffuse = gl.getAttribLocation(program, "vMaterialDiffuse");
        gl.vertexAttribPointer(vMaterialDiffuse, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vMaterialDiffuse);

        var vNormal = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vNormal);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(object.normals), gl.STATIC_DRAW);

        var vNormalPosition = gl.getAttribLocation( program, "vNormal");
        gl.vertexAttribPointer(vNormalPosition, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vNormalPosition);

        var sBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, sBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(object.specular), gl.STATIC_DRAW);

        var vMaterialSpecular = gl.getAttribLocation(program, "vMaterialSpecular");
        gl.vertexAttribPointer(vMaterialSpecular, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vMaterialSpecular);



        if(num === 1)
        {
            gl.uniform1i(gl.getUniformLocation(program, "isStopSign"), 1);
            //StopText(object);
            var tBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer );
            gl.bufferData(gl.ARRAY_BUFFER, flatten(object.text), gl.STATIC_DRAW );

            var vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
            gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 0, 0 );
            gl.enableVertexAttribArray(vTexCoord);
        }
        else
        {
            gl.uniform1i(gl.getUniformLocation(program, "isStopSign"), 0);
        }

        // Draw line (loop to close the end)
        console.log("in render");
        gl.drawArrays(gl.TRIANGLES, 0, object.vertices.length);



    }


function configureTexture(image)
{
    var tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image)

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
}


function hierarchy(dtranslateMatrix, root) {
    stack.push(dtranslateMatrix);
    dtranslateMatrix = mult(dtranslateMatrix, root.transform);
    gl.uniformMatrix4fv( translationMatrix, false, flatten(dtranslateMatrix) );
    draw(root.model, root.model.num);
    for(let i = 0; i < root.children.length; i++) {
        hierarchy(dtranslateMatrix, root.children[i]);
    }
    dtranslateMatrix = stack.pop();
}

function draw(){

        let rotateMatrix = rotate(270, [0, 1, 0]);
        const rotationMatrix = gl.getUniformLocation(program, "rotationMatrix");
        gl.uniformMatrix4fv(rotationMatrix, false, flatten(rotateMatrix));
        dtranslateMatrix = translate(3.0, 0, -2.5);
        translationMatrix = gl.getUniformLocation(program, "translationMatrix");
        gl.uniformMatrix4fv(translationMatrix, false, flatten(dtranslateMatrix));
        render(stopSign, 1);

        gl.uniformMatrix4fv(rotationMatrix, false, flatten(mat4()))
        gl.uniformMatrix4fv(translationMatrix, false, flatten(mat4()))
        render(lamp, 2);



        rotateMatrix = rotate(180, [0, 1, 0]);
        gl.uniformMatrix4fv(rotationMatrix, false, flatten(rotateMatrix));
        dtranslateMatrix = translate(2.75, 0, 0);
        gl.uniformMatrix4fv(translationMatrix, false, flatten(dtranslateMatrix));
        if(moveCar){
            theta++;
            let rotCar = rotate(theta, [0,1,0])

            dtranslateMatrix = mult(rotCar, dtranslateMatrix);

            gl.uniformMatrix4fv(translationMatrix, false, flatten(dtranslateMatrix));

        }
    stack.push(dtranslateMatrix)
    let val = stack[0];
        render(car, 3);

        gl.uniformMatrix4fv(rotationMatrix, false, flatten(mat4()))
        dtranslateMatrix = mult(stack.pop(), translate(0, 1, -1));
        gl.uniformMatrix4fv(translationMatrix, false, flatten(dtranslateMatrix));
        render(bunny, 5);

        gl.uniformMatrix4fv(rotationMatrix, false, flatten(mat4()))
        gl.uniformMatrix4fv(translationMatrix, false, flatten(mat4()))
        render(street, 4);

        if (cameraAnimation) {
            if(angle===360){
                angle = 0;
            }else{
                angle++;
            }

            if((angle < 90) || ((angle > 180) && (angle < 270 ))) {
                xAngle +=0.01;
            }
            if(((angle > 90) && (angle < 180)) || ((angle > 270) && (angle < 360))) {
                xAngle-=0.01;
            }
            let wobTranslate = translate(0,xAngle,0);

            let rotMatrix = rotate(angle, [0, 1, 0]);

            //let fMatrix = mult(rotMatrix, vec4(eye));
            let fMatrix = mult(wobTranslate, rotMatrix);
            fMatrix = mult(fMatrix, vec4(eye))

            modelViewMatrix = lookAt(vec3(fMatrix), at, up);
            gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
            //requestAnimationFrame(draw);
        }



        /*if(moveCar){
            movex= movex +0.1;

            var moveingCar = new Node(translate(movex, 0, 0), car);
            var moveingBunny = new Node(translate(0,0,0), bunny);
            moveingCar.children.push(moveingBunny);

            var thisTree = new treeRoot(moveingCar);
            hierarchy(dtranslateMatrix, thisTree.root);
            gl.uniformMatrix4fv(translationMatrix, false, flatten(dtranslateMatrix));
            requestAnimationFrame(draw);
        }*/
    requestAnimationFrame(draw);


    }

    function objData(obj, num){
        if(obj.objParsed && obj.mtlParsed) {

            //let linePoints = stopSign.faces.faceVertices;

            for(let a=0; a<obj.faces.length; a++){
                let dMap = obj.diffuseMap.get(obj.faces[a].material);
                let sMap = obj.specularMap.get(obj.faces[a].material);
                for (let j = 0; j < obj.faces[a].faceVertices.length; j++){
                    obj.vertices.push(obj.faces[a].faceVertices[j]);
                   obj.normals.push(obj.faces[a]. faceNormals[j]);
                    obj.diffuse.push(dMap);
                    obj.specular.push(sMap);
                }

                for (let s = 0; s < obj.faces[a].faceTexCoords.length; s++) {
                    obj.text.push(obj.faces[a].faceTexCoords[s]);
                }

            }

            //console.log(linePoints);

            //console.log(linePoints)
            objects.push(obj);

        }else{

            requestAnimationFrame(function() {
                objData(obj, num);
            });
        }


    }
function configureCubeMapImage(image) {
    cubeMap = gl.createTexture();
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubeMap);

    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

    gl.uniform1i(gl.getUniformLocation(program, "texMap"), 1);
}









