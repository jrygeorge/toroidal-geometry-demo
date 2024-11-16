// yeah i know the way the if statements are structured here is a bit weird,
// i wrote it a while ago and i wasnt really thinking clearly then
// or maybe im just dumb

function clearAll(ctx,R,G,B,A){
    // Setting the "clear" colour
    // COLOR_BUFFER is the colour value
    // DEPTH_BUFFER is how far the point is from our projection surface
        ctx.clearColor(R,G,B,A)
        ctx.clear(ctx.COLOR_BUFFER_BIT | ctx.DEPTH_BUFFER_BIT)
    }

function createShaderFromSource(ctx,type,source){
    // creating the sahder
    let shader = ctx.createShader(type)
    // adding the content/source
    ctx.shaderSource(shader,source)
    ctx.compileShader(shader)

    // error checking
    if(ctx.getShaderParameter(shader,ctx.COMPILE_STATUS)){
        return shader
    }
    console.log(ctx.getShaderInfoLog(shader))
}

function createGLProgram(ctx,shaderList,validate=false){
    // Creates a "program"
    // this is essentially a pipeline that starts with our 3D points/vertices,
    // and ends with the image drawn on our screen
    let program = ctx.createProgram()
    // Putting the shaders in the program/pipeline
    for(let shader of shaderList){
        ctx.attachShader(program,shader)
    }
    // linking, you know, what comes after compiling
    ctx.linkProgram(program)
    // Error Checking
    if(!ctx.getProgramParameter(program,ctx.LINK_STATUS)){
        console.log(ctx.getProgramInfoLog(program))
        ctx.deleteProgram(program);
        return ;
    }
    // Validation, turn this to False in the end as its a bit expensive (apparently)
    if(validate){
        ctx.validateProgram(program)
        if(!ctx.getProgramParameter(program,ctx.VALIDATE_STATUS)){
            console.log(gl.getProgramInfoLog(program))
            ctx.deleteProgram(program);
            return ;
        }
    }
    return program
}

function setUniformInformation(ctx,shape,arrays){
    // make this later hoho
}