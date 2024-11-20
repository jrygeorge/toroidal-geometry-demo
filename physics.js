class Vector3 {
    constructor(x,y,z){
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

    scale(factor){
        return new Vector3(
            this.X * factor,
            this.Y * factor,
            this.Z * factor
        )
    }

    add(other){
        return new Vector3(
            this.X + other.X,
            this.Y + other.Y,
            this.Z + other.Z
        )
    }

    minus(other){
        return new Vector3(
            this.X - other.X,
            this.Y - other.Y,
            this.Z - other.Z
        )
    }

    magnitude(){
        return this.dot(this)**0.5
    }

    normalise(){
        let mg = this.magnitude()
        if(mg){
        return new Vector3(
            this.X / mg,
            this.Y / mg,
            this.Z / mg
        )
        } else {return this}
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
        
        this.VAO = ctx.createVertexArray()

        this.VERTEXCOUNT = 36 // tris * 3
        
        // i should use enums for the type, but we'll do that later
        // also make some way to read the uniform type right out of the shader
        this.UNIFORMS = {
            "u_projection":{"LOCATION":null,"TYPE":"m4f"},
            "u_camera":{"LOCATION":null,"TYPE":"m4f"}
        }
    }
    translateAndRotate(){
        return;
    }
    getVertexInformation(){
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

    getNormalInformation(){
        return new Float32Array(
            [   
                ...Array(6).fill([0,0,-1]).flat(),
                ...Array(6).fill([1,0,0]).flat(),
                ...Array(6).fill([0,0,1]).flat(),
                ...Array(6).fill([-1,0,0]).flat(),
                ...Array(6).fill([0,1,0]).flat(),
                ...Array(6).fill([0,-1,0]).flat()
            ]
        )
    }
    getFaceInformation(){
        /*
        return [
            [new Vector3(...this.VERTICES[1]),new Vector3(...this.VERTICES[0]),new Vector3(...this.VERTICES[2]),new Vector3(...this.VERTICES[3])],
            [new Vector3(...this.VERTICES[5]),new Vector3(...this.VERTICES[1]),new Vector3(...this.VERTICES[6]),new Vector3(...this.VERTICES[2])],
            [new Vector3(...this.VERTICES[4]),new Vector3(...this.VERTICES[5]),new Vector3(...this.VERTICES[7]),new Vector3(...this.VERTICES[6])],
            [new Vector3(...this.VERTICES[0]),new Vector3(...this.VERTICES[4]),new Vector3(...this.VERTICES[3]),new Vector3(...this.VERTICES[7])],
            [new Vector3(...this.VERTICES[2]),new Vector3(...this.VERTICES[3]),new Vector3(...this.VERTICES[6]),new Vector3(...this.VERTICES[7])],
            [new Vector3(...this.VERTICES[5]),new Vector3(...this.VERTICES[4]),new Vector3(...this.VERTICES[1]),new Vector3(...this.VERTICES[0])]
        ]
        */
       /*
        return [
            [new Vector3(...this.VERTICES[0]),new Vector3(...this.VERTICES[1]),new Vector3(...this.VERTICES[2]),new Vector3(...this.VERTICES[3])],
            [new Vector3(...this.VERTICES[1]),new Vector3(...this.VERTICES[5]),new Vector3(...this.VERTICES[6]),new Vector3(...this.VERTICES[2])],
            [new Vector3(...this.VERTICES[5]),new Vector3(...this.VERTICES[4]),new Vector3(...this.VERTICES[7]),new Vector3(...this.VERTICES[6])],
            [new Vector3(...this.VERTICES[4]),new Vector3(...this.VERTICES[0]),new Vector3(...this.VERTICES[3]),new Vector3(...this.VERTICES[7])],
             [new Vector3(...this.VERTICES[3]),new Vector3(...this.VERTICES[2]),new Vector3(...this.VERTICES[6]),new Vector3(...this.VERTICES[7])],
             [new Vector3(...this.VERTICES[4]),new Vector3(...this.VERTICES[5]),new Vector3(...this.VERTICES[1]),new Vector3(...this.VERTICES[0])]
        ]*/
             return [
                [new Vector3(...this.VERTICES[3]),new Vector3(...this.VERTICES[2]),new Vector3(...this.VERTICES[0]),new Vector3(...this.VERTICES[1])],
                 [new Vector3(...this.VERTICES[1]),new Vector3(...this.VERTICES[5]),new Vector3(...this.VERTICES[6]),new Vector3(...this.VERTICES[2])],
                [new Vector3(...this.VERTICES[6]),new Vector3(...this.VERTICES[7]),new Vector3(...this.VERTICES[5]),new Vector3(...this.VERTICES[4])],
                 [new Vector3(...this.VERTICES[4]),new Vector3(...this.VERTICES[0]),new Vector3(...this.VERTICES[3]),new Vector3(...this.VERTICES[7])],
                 [new Vector3(...this.VERTICES[3]),new Vector3(...this.VERTICES[2]),new Vector3(...this.VERTICES[6]),new Vector3(...this.VERTICES[7])],
                 [new Vector3(...this.VERTICES[4]),new Vector3(...this.VERTICES[5]),new Vector3(...this.VERTICES[1]),new Vector3(...this.VERTICES[0])]
            ]

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
    


    currentPosition = Player.POSITION

    //TODO:
    //IF WE'RE INTERSECTING AN EDGE(LINE) THEN CONTINUE
    // THEN WE CAN REMOVETHE CODE BELOW

    //OR IF STARTING IS ON THE PLANE, INTESECT BUT IF ON EDGE TOO,CONTINUE
    // howver if its on a plane and Ys are same, then intersect

    // also if Ys are not the same, then stop movemenat shart a bit, like moving into a wall
    
    if(!((nextPosition.X==currentPosition.X)&&(nextPosition.Z==currentPosition.Z)))
        {
        reverseDirectionMoved = Player.POSITION.minus(nextPosition);
        currentPosition = nextPosition.add(reverseDirectionMoved.scale(1-10**(-6)));
    }
    
    distanceToCollision = Infinity
    chosenIntersection = null 
    for(shape of Scene){
        for(face of shape.getFaceInformation()){
            
            planeNormal = Vertices2PlaneNormal(face[0],face[1],face[2])
            D = -planeNormal.dot(face[0])
            v1 = planeNormal.dot(nextPosition) + D
            v2 = planeNormal.dot(currentPosition) + D
            if( Math.sign(v1) != Math.sign(v2) ){
                console.log("hit!")
                lineDirection = nextPosition.minus(Player.POSITION).normalise()
                
                d_numerator = face[0].minus(nextPosition).dot(planeNormal)
                d_denominator = lineDirection.dot(planeNormal)
                if(d_denominator==0){
                    console.log("parallel")
                    //if(d_numerator==0){return Player.POSITION }
                    continue;
                }
                d = d_numerator / d_denominator
                intersectionPoint = nextPosition.add(lineDirection.scale(d))
                // now to find if the intersection is in the face

                AB = face[1].minus(face[0])
                BC = face[2].minus(face[1])
                AM = intersectionPoint.minus(face[0])
                BM = intersectionPoint.minus(face[1])

                if ((0 <= AB.dot(AM) && AB.dot(AM) <= AB.dot(AB) && 0 <= BC.dot(BM) && BC.dot(BM) <= BC.dot(BC))){
                    //console.log("intersect")
                    Player.VELOCITY = 0;
                    if((nextPosition.X==currentPosition.X)&&(nextPosition.Z==currentPosition.Z)){
                        if(intersectionPoint.minus(currentPosition).magnitude()<distanceToCollision){
                            distanceToCollision=intersectionPoint.minus(currentPosition).magnitude();
                            chosenIntersection=intersectionPoint}
                    }
                    
                    T = planeNormal.dot(face[0]) - planeNormal.dot(intersectionPoint)
                    projectedPoint = intersectionPoint.add(planeNormal.scale(T))

                    if(projectedPoint.minus(currentPosition).magnitude()<distanceToCollision){
                        distanceToCollision=projectedPoint.minus(currentPosition).magnitude();
                        //projectedPoint.Y += 0.5
                        chosenIntersection=projectedPoint}
                }
                            }
                        }
                    }
    //console.log(distanceToCollision,chosenIntersection)
    if(distanceToCollision==Infinity){return nextPosition}
    //onsole.log("using intersect",chosenIntersection)
    return chosenIntersection 
            
    return nextPosition
}

function Matrix2Array(array){
    result = []
    for(col of array){
        result.push(...col)
    }
    return result
}

function Vertices2PlaneNormal(A,B,C){
    // takes three directional Vec3s and
    // gives you the normal vector of the plane that contains them
    AB = B.minus(A)
    AC = C.minus(A)
    norm = AB.cross(AC)
    //k = -norm.dot(A)
    return norm
}