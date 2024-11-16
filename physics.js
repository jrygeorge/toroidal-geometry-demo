class Vector3 {
    constructor(x,y,z){
        // maybe x,y,z isnt totally correct, but it makes sense
        this.X = x
        this.Y = y
        this.Z = z
    }

    dot(other){
        return this.X*other.X + this.Y*other.Y + this.Z*other.Z
    }

    cross(other){
        return new Vector3(
                this.Y*other.Z - this.Z*other.Y,
                this.Z*other.X - this.X*other.Z,
                this.X*other.Y - this.Y*other.X
            )
    }

    magnitude(){
        return ( this.X*this.X + this.Y*this.Y + this.Z*this.Z ) ** 0.5
    }

    normalise(){
        let mg = this.magnitude()
        if(mg){
        this.X /= mg
        this.Y /= mg
        this.Z /= mg
        }
    }
}

class Cuboid {
    constructor(ctx,x,y,z,xT=0,yT=0,zT=0,xR=0,yR=0,zR=0){
        /*
        Just creating the shape and then Rotating+Translating it right away
        coz we're not gonna move them again
        */
        let originalVertices =
            [   
                [-x/2,  -y/2,   -z/2,   1],
                [x/2,   -y/2,   -z/2,   1],
                [x/2,   y/2,    -z/2,   1],
                [-x/2,  y/2,    -z/2,   1],
                [-x/2,  -y/2,   z/2,    1],
                [x/2,   -y/2,   z/2,    1],
                [x/2,   y/2,    z/2,    1],
                [-x/2,  y/2,    z/2,    1]    
            ]

        let affineTransformationMatrix = 
            [
                [Math.cos(yR)*Math.cos(zR),                                             Math.cos(yR)*Math.sin(zR),                                          -Math.sin(yR),              0],
                [Math.sin(xR)*Math.sin(yR)*Math.cos(zR) - Math.cos(xR)*Math.sin(zR),    Math.sin(xR)*Math.sin(yR)*Math.sin(zR) + Math.cos(xR)*Math.cos(zR), Math.sin(xR)*Math.cos(yR),  0],
                [Math.cos(xR)*Math.sin(yR)*Math.cos(zR) + Math.sin(xR)*Math.sin(zR),    Math.cos(xR)*Math.sin(yR)*Math.sin(zR) - Math.sin(xR)*Math.cos(zR), Math.cos(xR)*Math.cos(yR),  0],
                [xT,yT,zT,1]
            ]
        
        this.VERTICES = MatrixMultiplication(originalVertices,affineTransformationMatrix)
        
        this.FACES = [1,2,3,4,5,6] // full of vec3's of the plane equation

        this.VAO = ctx.createVertexArray()

        this.VERTEXCOUNT = 36 // tris * 3
        
        // i should use enums for the type, but we'll do that later
        // also make some way to read the uniform type right out of the shader
        this.UNIFORMS = {
            "u_projection":{"LOCATION":null,"TYPE":"m4f"},
            "u_camera":{"LOCATION":null,"TYPE":"m4f"},
            "u_colour":{"LOCATION":null,"TYPE":"v3f"}
        }
    }
    translateAndRotate(){
        return;
    }
    createVertexInformation(){
        // whhat a mess
        return new Float32Array(
                [
                ...this.VERTICES[1],...this.VERTICES[0],...this.VERTICES[2],
                ...this.VERTICES[2],...this.VERTICES[0],...this.VERTICES[3],
                ...this.VERTICES[5],...this.VERTICES[1],...this.VERTICES[6],
                ...this.VERTICES[6],...this.VERTICES[1],...this.VERTICES[2],
                ...this.VERTICES[4],...this.VERTICES[5],...this.VERTICES[7],
                ...this.VERTICES[7],...this.VERTICES[5],...this.VERTICES[6],
                ...this.VERTICES[0],...this.VERTICES[4],...this.VERTICES[3],
                ...this.VERTICES[3],...this.VERTICES[4],...this.VERTICES[7],
                ...this.VERTICES[2],...this.VERTICES[3],...this.VERTICES[6],
                ...this.VERTICES[6],...this.VERTICES[3],...this.VERTICES[7],
                ...this.VERTICES[5],...this.VERTICES[4],...this.VERTICES[1],
                ...this.VERTICES[1],...this.VERTICES[4],...this.VERTICES[0],
            ])
    }

}

function MatrixMultiplication(A,B){
    /*
    Taken from https://stackoverflow.com/a/27205510
    Actual source is not accessible anymore.
    */
    var result = [];
    for (var i = 0; i < A.length; i++) {
        result[i] = [];
        for (var j = 0; j < B[0].length; j++) {
            var sum = 0;
            for (var k = 0; k < A[0].length; k++) {
                sum += A[i][k] * B[k][j];
            }
            result[i][j] = sum;
        }
    }
    return result;
}



function ResolveCollisions(nextPosition){
    return nextPosition
    distanceToCollision = Infinity
    for(shape of Scene){
        for(face of shape.FACES){
            // https://math.stackexchange.com/a/2744309
            // if path intersects the plane, then check if the intersection is in the rectangle
            // if it is, project the final point onto the plane
            // and update nextPosition IF that nextPositions distance to our
            // Player.POSITION is less than the current distance
            // then make velocity 0
        }
        console.log(cuboid)
    }
    return nextPosition
}

function Matrix2Array(array){
    result = []
    for(col of array){
        result.push(...col)
    }
    return result
}