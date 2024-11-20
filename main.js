// CONTEXT STUFF
const canvas = document.getElementById("canvas")
gl = canvas.getContext("webgl2")
const width = gl.canvas.clientWidth;
const height = gl.canvas.clientHeight;

gl.canvas.width = width;
gl.canvas.height = height;
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

gl.enable(gl.DEPTH_TEST);
gl.enable(gl.CULL_FACE);

const Player = {
    HEIGHT:40,
    POSITION : new Vector3(0,50,0),
    LOOKINGAT : new Vector3(0,0,0),
    STEPSIZE : 10,
    ANGLESTEPSIZE : Math.PI/360,
    ACC : -0.15, // gravity
    VELOCITY : 0, // gravity
    CAMERA_MATRIX : function(){
        T =    [   [1,0,0,0],
                    [0,1,0,0],
                    [0,0,1,0],
                    [-this.POSITION.X,-this.POSITION.Y-this.HEIGHT,-this.POSITION.Z,1] ]
        
        let Rx = [  [1,0,0,0],
                [0,Math.cos(Player.LOOKINGAT.X),-Math.sin(Player.LOOKINGAT.X),0],
                [0,Math.sin(Player.LOOKINGAT.X),Math.cos(Player.LOOKINGAT.X),0],
                [0,0,0,1]   ]
        let Ry = [[Math.cos(-Player.LOOKINGAT.Y),0,Math.sin(-Player.LOOKINGAT.Y),0],
                [0,1,0,0],
                [-Math.sin(-Player.LOOKINGAT.Y),0,Math.cos(-Player.LOOKINGAT.Y),0],
                [0,0,0,1]]
        let R = MatrixMultiplication(Ry,Rx)

        return Matrix2Array(
           MatrixMultiplication(T,R))
        }
}

const PerspectiveProjection = {
    ASPECT : width / height,
    FOV:    Math.tan(Math.PI * 0.5 - 0.5 * Math.PI/2.5),
    near:   2,
    far:    2500,
    MATRIX :    function(){
        return [
                this.FOV / this.ASPECT, 0, 0, 0,
                0, this.FOV, 0, 0,
                0, 0, (this.near + this.far) / (this.near-this.far), -1,
                0, 0, this.near * this.far  * 2 / (this.near-this.far), 0
                ]
            }
}


// CREATING SCENE
const Scene = [
    //centre platform
    new Cuboid(gl,300,20,100),
    new Cuboid(gl,100,20,100,0,0,100),
    new Cuboid(gl,100,20,100,0,0,-100),

    // upslopes
    new Cuboid(gl,300,20,100, 150+150*Math.cos(Math.PI/6),75,0 ,0,0,Math.PI/6),
    new Cuboid(gl,300,20,100, -150-150*Math.cos(Math.PI/6),75,0 ,0,0,-Math.PI/6),
    //downslopes
    new Cuboid(gl,100,20,300, 0,-75,150+150*Math.cos(Math.PI/6) ,Math.PI/6,0,0),
    new Cuboid(gl,100,20,300, 0,-75,-150-150*Math.cos(Math.PI/6) ,-Math.PI/6,0,0),
    //upslope landing
    new Cuboid(gl,140,20,100,220+300*Math.cos(Math.PI/6),150,0),
    new Cuboid(gl,140,20,100,-220-300*Math.cos(Math.PI/6),150,0),
    //downslope landing
    new Cuboid(gl,100,20,140,0,-150,220+300*Math.cos(Math.PI/6)),
    new Cuboid(gl,100,20,140,0,-150,-220-300*Math.cos(Math.PI/6)),
    //wall-1
    new Cuboid(gl,20,1160,100,300+300*Math.cos(Math.PI/6),-420,0),
    new Cuboid(gl,20,740,100,300+300*Math.cos(Math.PI/6),630,0),
    new Cuboid(gl,20,2000,240 + 300*Math.cos(Math.PI/6),300 + 300*Math.cos(Math.PI/6),0,170 + 150*Math.cos(Math.PI/6)),
    new Cuboid(gl,20,2000,240 + 300*Math.cos(Math.PI/6),300 + 300*Math.cos(Math.PI/6),0,-170 - 150*Math.cos(Math.PI/6)),

    //wall-2
    new Cuboid(gl,20,1160,100,-300-300*Math.cos(Math.PI/6),-420,0),
    new Cuboid(gl,20,740,100,-300-300*Math.cos(Math.PI/6),630,0),
    new Cuboid(gl,20,2000,240 + 300*Math.cos(Math.PI/6),-300 - 300*Math.cos(Math.PI/6),0,170 + 150*Math.cos(Math.PI/6)),
    new Cuboid(gl,20,2000,240 + 300*Math.cos(Math.PI/6),-300 - 300*Math.cos(Math.PI/6),0,-170 - 150*Math.cos(Math.PI/6)),

    //wall-3
    new Cuboid(gl,100,860,20,0,-570,300+300*Math.cos(Math.PI/6)),
    new Cuboid(gl,100,1040,20,0,480,300+300*Math.cos(Math.PI/6)),
    new Cuboid(gl,240 + 300*Math.cos(Math.PI/6),2000,20,170 + 150*Math.cos(Math.PI/6),0,-300 - 300*Math.cos(Math.PI/6)),
    new Cuboid(gl,240 + 300*Math.cos(Math.PI/6),2000,20,-170 - 150*Math.cos(Math.PI/6),0,-300 - 300*Math.cos(Math.PI/6)),

    // wall -4
    new Cuboid(gl,100,860,20,0,-570,-300-300*Math.cos(Math.PI/6)),
    new Cuboid(gl,100,1040,20,0,480,-300-300*Math.cos(Math.PI/6)),
    new Cuboid(gl,240 + 300*Math.cos(Math.PI/6),2000,20,170 + 150*Math.cos(Math.PI/6),0,300 + 300*Math.cos(Math.PI/6)),
    new Cuboid(gl,240 + 300*Math.cos(Math.PI/6),2000,20,-170 - 150*Math.cos(Math.PI/6),0,300 + 300*Math.cos(Math.PI/6)),

]

// CREATING PROGRAM
vertexShader = createShaderFromSource(gl,gl.VERTEX_SHADER,VertexShaderSource)
fragmentShader = createShaderFromSource(gl,gl.FRAGMENT_SHADER,SunsetFragmentShaderSource)
program = createGLProgram(gl,[vertexShader,fragmentShader],true)

// DEFINING GEOMETRY (?)
for(SHAPE of Scene){
    gl.bindVertexArray(SHAPE.VAO)
    // combine the normal and positon Info later, so you dont have to do this
    let vertexBufferObject = gl.createBuffer()
    let normalBufferObject = gl.createBuffer()

    let positionAttribLocation = gl.getAttribLocation(program, "vertPosition")
    let normalAttribLocation = gl.getAttribLocation(program, "vertNormal")

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject)
    gl.enableVertexAttribArray(positionAttribLocation)
    gl.vertexAttribPointer(
        positionAttribLocation,
        4,
        gl.FLOAT,
        gl.FALSE,
        4 * Float32Array.BYTES_PER_ELEMENT,
        0
    )
    gl.bufferData(gl.ARRAY_BUFFER, SHAPE.getVertexInformation(), gl.STATIC_DRAW)
     
    
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBufferObject)
    gl.enableVertexAttribArray(normalAttribLocation)
    gl.vertexAttribPointer(
        normalAttribLocation,
        3,
        gl.FLOAT,
        gl.FALSE,
        3 * Float32Array.BYTES_PER_ELEMENT,
        0
    )
    gl.bufferData(gl.ARRAY_BUFFER, SHAPE.getNormalInformation(), gl.STATIC_DRAW)
    
    for(uniform_name in SHAPE.UNIFORMS){
        SHAPE.UNIFORMS[uniform_name].LOCATION = gl.getUniformLocation(program,uniform_name)
    }
    
}


// only one program
gl.useProgram(program)

function screenUpdate(time){
    // PHYSICS
    Player.VELOCITY = Math.max(Player.VELOCITY + Player.ACC,-10) // capping at -50
    nextPosition = new Vector3( Player.POSITION.X,
                                Player.POSITION.Y+Player.VELOCITY,
                                Player.POSITION.Z)
    
    Player.POSITION = Physics.FindNextPosition(nextPosition)
    
    // PORTAL LOGIC
    const BOUNDARY = 300 + 300*Math.cos(Math.PI/6)
        // if either X or Z hits the boundary
    if( (Math.abs(Player.POSITION.X)>BOUNDARY) || (Math.abs(Player.POSITION.Z)>BOUNDARY) )
    {
        // Mirror across XZ plane 
        Player.POSITION.Y = -Player.POSITION.Y+20;

        // Rotate around Y axis 90deg and a tiny scale down so we dont keep on flying around
        newX = -Player.POSITION.Z
        Player.POSITION.Z = Player.POSITION.X * (1-Player.STEPSIZE/BOUNDARY) * 0.99
        Player.POSITION.X = newX * (1-Player.STEPSIZE/BOUNDARY) * 0.99

        // also rotate look around y axis by 90deg
        Player.LOOKINGAT.Y -= Math.PI/2
    }
        // if Y = -1000 then flip it
    if ( Player.POSITION.Y <= -1000){
        Player.POSITION.Y = 995
    }

    clearAll(gl,0.3,0.3,0.3,1.0)
    
    for(SHAPE of Scene){
        gl.bindVertexArray(SHAPE.VAO)

        gl.uniformMatrix4fv(SHAPE.UNIFORMS.u_projection.LOCATION,false,PerspectiveProjection.MATRIX())
        gl.uniformMatrix4fv(SHAPE.UNIFORMS.u_camera.LOCATION,false,Player.CAMERA_MATRIX())

        gl.drawArrays(gl.TRIANGLES, 0, SHAPE.VERTEXCOUNT)

    }

    //TEST FOR INTERSECTION
    //RESOLVE/PUSH OUT SELF IF IT IS

    //CREATE 6 DOOR FRAMEBUFFERS + 6DOOR NORMAL FRAMEBUFFER
    // CREATE BUFFERS FOR MAIN + NORMAL FOR MAIN
    // RENDER ALL
    
    //console.log(Player.POSITION)

    requestAnimationFrame(screenUpdate)
}
requestAnimationFrame(screenUpdate)


document.addEventListener("keydown",function(event){
    // making a new one like this to be safe i guess
    nextPosition = new Vector3(Player.POSITION.X,Player.POSITION.Y,Player.POSITION.Z)
    switch(event.key){
        case "w" :  nextPosition.Z -= Player.STEPSIZE * Math.cos(Player.LOOKINGAT.Y) * Math.cos(Player.LOOKINGAT.X);
                    nextPosition.X += Player.STEPSIZE * Math.sin(Player.LOOKINGAT.Y) * Math.cos(Player.LOOKINGAT.X);    break;
        case "s" :  nextPosition.Z += Player.STEPSIZE * Math.cos(Player.LOOKINGAT.Y) * Math.cos(Player.LOOKINGAT.X);
                    nextPosition.X -= Player.STEPSIZE * Math.sin(Player.LOOKINGAT.Y) * Math.cos(Player.LOOKINGAT.X);    break;
        case "a" :  nextPosition.Z += Player.STEPSIZE * Math.cos(Math.PI/2 + Player.LOOKINGAT.Y);
                    nextPosition.X -= Player.STEPSIZE * Math.sin(Math.PI/2 + Player.LOOKINGAT.Y);   break;
        case "d" :  nextPosition.Z -= Player.STEPSIZE * Math.cos(Math.PI/2 + Player.LOOKINGAT.Y);
                    nextPosition.X += Player.STEPSIZE * Math.sin(Math.PI/2 + Player.LOOKINGAT.Y);   break;
        case "r" :  nextPosition.Y += Player.STEPSIZE;  break; //UP
        case "f" :  nextPosition.Y -= Player.STEPSIZE;  break; //DOWN

        case "p" :  Player.VELOCITY = 0;    break;

        case " " :  Player.POSITION.Y += 0.000001;
                    nextPosition.Y += 0.0000011;
                    Player.VELOCITY = 8;
                    if(Player.POSITION.Y>1200){
                        console.log("stop jumping whats wrong with you");
                    }
                    break;
    }
    Player.POSITION = Physics.FindNextPosition(nextPosition)}
)

document.body.addEventListener("mousemove", function (event) {
    if(document.pointerLockElement !== null){
        Player.LOOKINGAT.Y = (Player.LOOKINGAT.Y + event.movementX*Player.ANGLESTEPSIZE + 2*Math.PI)%(2*Math.PI);
        // clamping angleX
        Player.LOOKINGAT.X = Math.max(Math.min((Player.LOOKINGAT.X + -event.movementY*Player.ANGLESTEPSIZE),Math.PI/4.5),-Math.PI/4.5)
}});

document.addEventListener("click", function (e) {
    document.body.requestPointerLock();
    });