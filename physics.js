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
             return [
                [new Vector3(...this.VERTICES[0]),new Vector3(...this.VERTICES[1]),new Vector3(...this.VERTICES[2]),new Vector3(...this.VERTICES[3])],
                [new Vector3(...this.VERTICES[1]),new Vector3(...this.VERTICES[5]),new Vector3(...this.VERTICES[6]),new Vector3(...this.VERTICES[2])],
                [new Vector3(...this.VERTICES[5]),new Vector3(...this.VERTICES[4]),new Vector3(...this.VERTICES[7]),new Vector3(...this.VERTICES[6])],
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
    
    distanceToCollision = Infinity
    chosenIntersection = null 

    currentPosition = Player.POSITION
    isVerticalMovement = (currentPosition.Y != nextPosition.Y)
    currentToNext = nextPosition.minus(currentPosition)

    //TODO:
    //IF WE'RE INTERSECTING AN EDGE(LINE) THEN CONTINUE
    // THEN WE CAN REMOVETHE CODE BELOW

    //OR IF STARTING IS ON THE PLANE, INTESECT BUT IF ON EDGE TOO,CONTINUE
    // howver if its on a plane and Ys are same, then intersect NOOOO

    // also if Ys are not the same, then stop movemenat shart a bit, like moving into a wall

    /*
    if(!((nextPosition.X==currentPosition.X)&&(nextPosition.Z==currentPosition.Z)))
        {
        reverseDirectionMoved = Player.POSITION.minus(nextPosition);
        currentPosition = nextPosition.add(reverseDirectionMoved.scale(1-10**(-6)));
    }*/
    
    for(shape of Scene){
        for(face of shape.getFaceInformation()){
            
            faceNormal = Vertices2PlaneNormal(face[0],face[1],face[2])

            // if these two values have different signs
            // then the path intersects the plane
            D = -faceNormal.dot(face[0])
            value1 = faceNormal.dot(nextPosition) + D
            value2 = faceNormal.dot(currentPosition) + D

            if( Math.sign(value1) != Math.sign(value2) ){
                console.log("plane intersected",currentPosition)
                

                lineDirection = currentToNext.normalise()
                d_numerator = face[0].minus(currentPosition).dot(faceNormal)
                d_denominator = lineDirection.dot(faceNormal)

                if(d_denominator==0){
                    console.log("denominator = 0 : parallel")
                    //if(d_numerator==0){return Player.POSITION }
                    continue;
                }
                d = d_numerator / d_denominator;
                intersectionPoint = currentPosition.add(lineDirection.scale(d))

                // now we need to check if the starting is an edge (if it is, continue)
                ABmag = face[1].minus(face[0]).magnitude()
                BCmag = face[2].minus(face[1]).magnitude()
                CDmag = face[3].minus(face[2]).magnitude()
                DAmag = face[0].minus(face[3]).magnitude()
                
                if(!isVerticalMovement){
                AImag = currentPosition.minus(face[0]).magnitude()
                BImag = currentPosition.minus(face[1]).magnitude()
                CImag = currentPosition.minus(face[2]).magnitude()
                DImag = currentPosition.minus(face[3]).magnitude()

                if(AImag + BImag == ABmag){continue;}
                if(BImag + CImag == BCmag){continue;}
                if(CImag + DImag == CDmag){continue;}
                if(DImag + AImag == DAmag){continue;}
                }

                // now to find if the intersection is in the face

                AB = face[1].minus(face[0])
                BC = face[2].minus(face[1])
                AM = intersectionPoint.minus(face[0])
                BM = intersectionPoint.minus(face[1])

                if ((0 <= AB.dot(AM) && AB.dot(AM) <= AB.dot(AB) && 0 <= BC.dot(BM) && BC.dot(BM) <= BC.dot(BC))){
                    //console.log("intersect")
                    verticalscaler = 1
                    if(!isVerticalMovement){console.log("WWWWWWWWWWWWWWWWW");verticalscaler=0.99}
                    intersectionPoint = currentPosition.add(intersectionPoint.minus(currentPosition).scale(verticalscaler))
                    Player.VELOCITY = 0;
                    //if((nextPosition.X==currentPosition.X)&&(nextPosition.Z==currentPosition.Z)){
                        if(intersectionPoint.minus(currentPosition).magnitude()<distanceToCollision){
                            distanceToCollision=intersectionPoint.minus(currentPosition).magnitude();
                            chosenIntersection=intersectionPoint}
                    //}
                    /*
                    T = faceNormal.dot(face[0]) - faceNormal.dot(intersectionPoint)
                    projectedPoint = intersectionPoint.add(faceNormal.scale(T))

                    if(projectedPoint.minus(currentPosition).magnitude()<distanceToCollision){
                        distanceToCollision=projectedPoint.minus(currentPosition).magnitude();
                        //projectedPoint.Y += 0.5
                        chosenIntersection=projectedPoint}*/
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

const Physics = {
    FindNextPosition : function(nextPosition){
            distanceToCollision = Infinity
        chosenIntersection = null 

        currentPosition = Player.POSITION
        isVerticalMovement = (currentPosition.Y != nextPosition.Y)
        currentToNext = nextPosition.minus(currentPosition)
        for(shape of Scene){
            for(face of shape.getFaceInformation()){
                
                faceNormal = Vertices2PlaneNormal(face[0],face[1],face[2])

                // if these two values have different signs
                // then the path intersects the plane
                D = -faceNormal.dot(face[0])
                value1 = faceNormal.dot(nextPosition) + D
                value2 = faceNormal.dot(currentPosition) + D

                if( Math.sign(value1) != Math.sign(value2) ){
                    console.log("plane intersected",currentPosition)
                    

                    lineDirection = currentToNext.normalise()
                    d_numerator = face[0].minus(currentPosition).dot(faceNormal)
                    d_denominator = lineDirection.dot(faceNormal)

                    if(d_denominator==0){
                        console.log("denominator = 0 : parallel")
                        //if(d_numerator==0){return Player.POSITION }
                        continue;
                    }
                    d = d_numerator / d_denominator;
                    intersectionPoint = currentPosition.add(lineDirection.scale(d))

                    // now we need to check if the starting is an edge (if it is, continue)
                    ABmag = face[1].minus(face[0]).magnitude()
                    BCmag = face[2].minus(face[1]).magnitude()
                    CDmag = face[3].minus(face[2]).magnitude()
                    DAmag = face[0].minus(face[3]).magnitude()
                    
                    if(!isVerticalMovement){
                    AImag = currentPosition.minus(face[0]).magnitude()
                    BImag = currentPosition.minus(face[1]).magnitude()
                    CImag = currentPosition.minus(face[2]).magnitude()
                    DImag = currentPosition.minus(face[3]).magnitude()

                    if(AImag + BImag == ABmag){continue;}
                    if(BImag + CImag == BCmag){continue;}
                    if(CImag + DImag == CDmag){continue;}
                    if(DImag + AImag == DAmag){continue;}
                    }

                    // now to find if the intersection is in the face

                    AB = face[1].minus(face[0])
                    BC = face[2].minus(face[1])
                    AM = intersectionPoint.minus(face[0])
                    BM = intersectionPoint.minus(face[1])

                    if ((0 <= AB.dot(AM) && AB.dot(AM) <= AB.dot(AB) && 0 <= BC.dot(BM) && BC.dot(BM) <= BC.dot(BC))){
                        //console.log("intersect")
                        verticalscaler = 1
                        if(!isVerticalMovement){console.log("WWWWWWWWWWWWWWWWW");verticalscaler=0.99}
                        intersectionPoint = currentPosition.add(intersectionPoint.minus(currentPosition).scale(verticalscaler))
                        Player.VELOCITY = 0;
                        //if((nextPosition.X==currentPosition.X)&&(nextPosition.Z==currentPosition.Z)){
                            if(intersectionPoint.minus(currentPosition).magnitude()<distanceToCollision){
                                distanceToCollision=intersectionPoint.minus(currentPosition).magnitude();
                                chosenIntersection=intersectionPoint}
                        //}
                        /*
                        T = faceNormal.dot(face[0]) - faceNormal.dot(intersectionPoint)
                        projectedPoint = intersectionPoint.add(faceNormal.scale(T))

                        if(projectedPoint.minus(currentPosition).magnitude()<distanceToCollision){
                            distanceToCollision=projectedPoint.minus(currentPosition).magnitude();
                            //projectedPoint.Y += 0.5
                            chosenIntersection=projectedPoint}*/
                    }
                                }
                            }
                        }
        //console.log(distanceToCollision,chosenIntersection)
        if(distanceToCollision==Infinity){return nextPosition}
        //cwonsole.log("using intersect",chosenIntersection)
        return chosenIntersection 
                
    },
    IsInRectangle : function(Rectangle,Position){
        // returns true if a point is inside a rectangle
        // if this is true, then IsOntheEdges() = true is implied

    },
    IsInBetween : function(Point1,Point2,ToCheck){
        // returns true if a point is located on the line connecting two other points
        // i.e. if a point is on the edge between two vertices
        D12 =   Point1.minus(Point2).magnitude()
        D1  =   Point1.minus(ToCheck).magnitude()
        D2  =   Point2.minus(ToCheck).magnitude()
        return D12 <= D1 + D2;  
    },
    IsOntheEdges : function(Rectangle,Position){
        // returns true if a point is located on the edges of a shape
        // Not inside it or outside it
        return this.IsInBetween(PLANE[0],PLANE[1],Position) ||
                this.IsInBetween(PLANE[1],PLANE[2],Position) ||
                this.IsInBetween(PLANE[2],PLANE[3],Position) ||
                this.IsInBetween(PLANE[3],PLANE[0],Position)
    }
}