

    // Get the stop sign


let stopSign;
let linePoints;
let objects =[];
let lamp;
let car;
let street;
let bunny;
let ambient = false;

    var lightPosition = vec4(1.0, 1.0, 1.0, 0.0 );
    var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
    var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
    var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

    var gl;

    var materialAmbient = vec4( 1.0, 0.0, 1.0, 1.0 );
    var materialDiffuse = vec4( 1.0, 0.8, 0.0, 1.0 );
    var materialSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
    var materialShininess = 20.0;

    var program;

    var modelViewMatrix, projectionMatrix;
    var modelViewMatrixLoc, projectionMatrixLoc;

    var eye;
    var at = vec3(0.0, 0.0, 0.0);
    var up = vec3(0.0, 1.0, 0.0);
    //
    //
    //
    //
    // function main() {
    //     // Retrieve <canvas> element
    //     let canvas = document.getElementById('webgl');
    //
    //     // Get the rendering context for WebGL
    //     gl = WebGLUtils.setupWebGL(canvas, undefined);
    //
    //     //Check that the return value is not null.
    //     if (!gl) {
    //         console.log('Failed to get the rendering context for WebGL');
    //         return;
    //     }
    //
    //     program = initShaders(gl, "vshader", "fshader");
    //
    //     gl.uniform4fv(gl.getUniformLocation(program, "lightDiffuse"), flatten(lightDiffuse));
    //     gl.uniform4fv(gl.getUniformLocation(program, "lightSpecular"), flatten(lightSpecular));
    //     gl.uniform4fv(gl.getUniformLocation(program, "lightAmbient"), flatten(lightAmbient));
    //
    //     projectionMatrix = perspective (60, canvas.width/canvas.height, 0.01, 200.0);
    //     projectionMatrixLoc = gl.getUniformLocation(program, 'projMatrix');
    //     gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
    //
    //     // Set viewport
    //     gl.viewport(0, 0, canvas.width, canvas.height);
    //
    //     // Set clear color
    //     gl.clearColor(0.0, 0.0, 0.0, 1.0);
    //
    //     // Initialize shaders
    //
    //     gl.useProgram(program);
    //     //set uo projection matrices and view matrices
    //     let stopSign = new Model(
    //         "https://web.cs.wpi.edu/~jmcuneo/cs4731/project3/stopsign.obj",
    //         "https://web.cs.wpi.edu/~jmcuneo/cs4731/project3/stopsign.mtl");
    //
    //
    //
    //     //stopSign.onload = function(){
    //
    //     var fVertices= stopSign.faces.faceVertices
    //     console.log(stopSign);
    //     var normals = stopSign.faces.faceNormals;
    //
    //     render(fVertices, normals, stopSign);
    //     //}
    //
    // }
    // function render(fVertices, normals, stopSign){
    //     console.log("rendering");
    //     console.log(fVertices);
    //     var vBuffer = gl.createBuffer();
    //     gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    //     gl.bufferData(gl.ARRAY_BUFFER, flatten(fVertices), gl.STATIC_DRAW);
    //
    //     var vPosition = gl.getAttribLocation( program, "vPosition");
    //     gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    //     gl.enableVertexAttribArray(vPosition);
    //
    //     var vNormal = gl.createBuffer();
    //     gl.bindBuffer(gl.ARRAY_BUFFER, vNormal);
    //     gl.bufferData(gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW);
    //
    //     var vNormalPosition = gl.getAttribLocation( program, "vNormal");
    //     gl.vertexAttribPointer(vNormalPosition, 4, gl.FLOAT, false, 0, 0);
    //     gl.enableVertexAttribArray(vNormalPosition);
    //
    //     for( var i=0; i< stopSign.faces.length; i+=3){
    //         gl.drawArrays( gl.TRIANGLES, i, 3 );
    //     }
    //
    // }

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

        gl.uniform4fv(gl.getUniformLocation(program, "lightDiffuse"), flatten(lightDiffuse));
            gl.uniform4fv(gl.getUniformLocation(program, "lightSpecular"), flatten(lightSpecular));
             gl.uniform4fv(gl.getUniformLocation(program, "lightAmbient"), flatten(lightAmbient));

        eye = vec3(0, 2, 5);
        modelViewMatrix = lookAt(eye, at , up);

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

        console.log(stopSign);

        objData(stopSign);
        objData(lamp);
        objData(car);
        objData(street);
        objData(bunny);


        canRender();




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


    function render(object){
        console.log(object.diffuse);
        console.log(object.specular);
        /*gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
        gl.clearColor(0, 0, 0, 1.0);*/

            //console.log(linePoints)
        var vBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(object.vertices), gl.STATIC_DRAW);

        var vPosition = gl.getAttribLocation(program, "vPosition");
        gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vPosition);

        var dBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, dBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(flatten(object.diffuse)), gl.STATIC_DRAW);

        var vMaterialDiffuse = gl.getAttribLocation(program, "vMaterialDiffuse");
        gl.vertexAttribPointer(vMaterialDiffuse, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vMaterialDiffuse);

        var sBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, sBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(flatten(object.specular)), gl.STATIC_DRAW);

        var vMaterialSpecular = gl.getAttribLocation(program, "vMaterialSpecular");
        gl.vertexAttribPointer(vMaterialSpecular, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vMaterialSpecular);

        // Draw line (loop to close the end)
        console.log("in render");
        gl.drawArrays(gl.TRIANGLES, 0, object.vertices.length);


    }

    function draw(){
        render(stopSign);
        render(lamp);
        render(car);
        render(street);
        render(bunny);
    }

    function objData(obj){
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
            }

            //console.log(linePoints);

            //console.log(linePoints)
            objects.push(obj);

        }else{

            requestAnimationFrame(function() {
                objData(obj);
            });
        }


    }









