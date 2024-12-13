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
    constructor(ctx,render=true,x,y,z,xT=0,yT=0,zT=0,xR=0,yR=0,zR=0){
        /*
        Just creating the shape and then Rotating+Translating it right away
        coz we're not gonna move them again
        */
        this.xT = xT;
        this.yT = yT;
        this.zT = zT;
        this.xR = xR;
        this.yR = yR;
        this.zR = zR;

        this.RENDER = render

        this.originalVertices =
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
        
        this.VERTICES = MatrixMultiplication(this.originalVertices,this.getAffineTransformationMatrix())
        
        this.VAO = ctx.createVertexArray()

        this.VERTEXCOUNT = 36 // tris * 3
        
        // i should use enums for the type, but we'll do that later
        // also make some way to read the uniform type right out of the shader
        this.UNIFORMS = {
            "u_projection":{"LOCATION":null,"TYPE":"m4f"},
            "u_camera":{"LOCATION":null,"TYPE":"m4f"}
        }
    }
    changeAffineTransformation(xT,yT,zT,xR,yR,zR){
        this.xT += xT;   this.yT += yT;   this.zT += zT;
        this.xR += xR;   this.yR += yR;   this.zR += zR;
        this.VERTICES = MatrixMultiplication(this.originalVertices,this.getAffineTransformationMatrix())

    }
    getAffineTransformationMatrix(){
            return [
                [Math.cos(this.yR)*Math.cos(this.zR),                                             Math.cos(this.yR)*Math.sin(this.zR),                                          -Math.sin(this.yR),              0],
                [Math.sin(this.xR)*Math.sin(this.yR)*Math.cos(this.zR) - Math.cos(this.xR)*Math.sin(this.zR),    Math.sin(this.xR)*Math.sin(this.yR)*Math.sin(this.zR) + Math.cos(this.xR)*Math.cos(this.zR), Math.sin(this.xR)*Math.cos(this.yR),  0],
                [Math.cos(this.xR)*Math.sin(this.yR)*Math.cos(this.zR) + Math.sin(this.xR)*Math.sin(this.zR),    Math.cos(this.xR)*Math.sin(this.yR)*Math.sin(this.zR) - Math.sin(this.xR)*Math.cos(this.zR), Math.cos(this.xR)*Math.cos(this.yR),  0],
                [this.xT,this.yT,this.zT,1]
            ]
    }     
    getVertexInformation(){
        // whhat a mess
        // replace this with indices later
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

const Physics = {
    FindNextPosition : function(nextPosition){

        distanceToCollision = Infinity
        chosenIntersection = nextPosition 
        
        currentPosition = Player.POSITION
        isVerticalMovement = (currentPosition.Y != nextPosition.Y)
        isDownwardMovement = (currentPosition.Y > nextPosition.Y)
        currentToNext = nextPosition.minus(currentPosition)

        for(shape of Scene){
            for(face of shape.getFaceInformation()){
                
                if( this.IsLineIntersectingPlane(face,currentPosition,nextPosition) ){
                    
                    directionAB = face[1].minus(face[0])
                    directionAC = face[2].minus(face[0])
                    faceNormal = directionAB.cross(directionAC)

                    // en.wikipedia.org/wiki/Line%E2%80%93plane_intersection#Algebraic_form
                    lineDirection = currentToNext.normalise()
                    d_numerator = face[0].minus(currentPosition).dot(faceNormal)
                    d_denominator = lineDirection.dot(faceNormal)

                    // If the denominator is 0,
                    // either the plane contains the whole line
                    // or it is parallel and does not intersect
                    // both cases do not count as an intersection here.
                    if(d_denominator==0)
                        continue;
                    
                    d = d_numerator / d_denominator;
                    intersectionPoint = currentPosition.add(lineDirection.scale(d))

                    // Imagine you're on a cliff, right at the edge trying to move off going forward
                    // the cliff face is not parallel to you and you are technically in contact
                    // with it right at the edge where the ground meets the cliff face
                    // so this will count as a collision/intersection.
                    // To prevent this we will skip the collision if we're on an edge.
                    if(!isVerticalMovement && this.IsOntheEdges(face,currentPosition) )
                        continue;
                    //if(!isDownwardMovement && this.IsInRectangle(face,currentPosition) )
                        //continue;

                    if(this.IsInRectangle(face,intersectionPoint)){
                        
                        //if(isVerticalMovement)
                            Player.VELOCITY = 0;

                        distanceToCurrentCollison = intersectionPoint.minus(currentPosition).magnitude()
                            if( distanceToCurrentCollison < distanceToCollision ){
                                distanceToCollision = distanceToCurrentCollison
                                chosenIntersection = intersectionPoint

                                if(!isVerticalMovement){
                                    //chosenIntersection = currentPosition
                                }

                            }
                    }
                }
                }
                }
        //if(distanceToCollision==Infinity){return nextPosition}
        return chosenIntersection 
                
    },
    IsInRectangle : function(Rectangle,Position){
        // returns true if a point is inside a rectangle
        // if this is true, then IsOntheEdges()=true is implied
        // This function assumes Position is on the same plane that contains Rectangle

        directionAB = Rectangle[1].minus(Rectangle[0])
        directionBC = Rectangle[2].minus(Rectangle[1])
        directionAM = Position.minus(Rectangle[0])
        directionBM = Position.minus(Rectangle[1])

        return (
            0 <= directionAB.dot(directionAM)
            && directionAB.dot(directionAM) <= directionAB.dot(directionAB)
            && 0 <= directionBC.dot(directionBM)
            && directionBC.dot(directionBM) <= directionBC.dot(directionBC)
        )

    },
    IsInBetween : function(Point1,Point2,ToCheck){
        // returns true if a point is located on the line connecting two other points
        // i.e. if a point is on the edge between two vertices
        D12 =   Point1.minus(Point2).magnitude()
        D1  =   Point1.minus(ToCheck).magnitude()
        D2  =   Point2.minus(ToCheck).magnitude()
        return D12 == D1 + D2;  
    },
    IsOntheEdges : function(Rectangle,Position){
        // returns true if a point is located on the edges of a rectangle
        // Not inside it or outside it
        return this.IsInBetween(Rectangle[0],Rectangle[1],Position) ||
                this.IsInBetween(Rectangle[1],Rectangle[2],Position) ||
                this.IsInBetween(Rectangle[2],Rectangle[3],Position) ||
                this.IsInBetween(Rectangle[3],Rectangle[0],Position)
    },
    IsLineIntersectingPlane(Rectangle,Start,End){
        // returns true if the line connecting Start and End
        // passes through the plane that contains Rectangle

        directionAB = Rectangle[1].minus(Rectangle[0])
        directionAC = Rectangle[2].minus(Rectangle[0])
        planeNormalVector = directionAB.cross(directionAC)

        planeD = -planeNormalVector.dot(Rectangle[0])

        value1 = planeNormalVector.dot(Start) + planeD
        value2 = planeNormalVector.dot(End) + planeD

        return Math.sign(value1) != Math.sign(value2)

    }
}

// MATRIX HELPER FUNCTIONS
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

function Matrix2Array(array){
    result = []
    for(col of array){
        result.push(...col)
    }
    return result
}