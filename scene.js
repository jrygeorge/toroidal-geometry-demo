// CREATING SCENE
function createScene(ctx){
    return [
    //centre platform
    new Cuboid(ctx,true,300,20,100),
    new Cuboid(ctx,true,100,20,100,0,0,100),
    new Cuboid(ctx,true,100,20,100,0,0,-100),
    // upslopes
    new Cuboid(ctx,true,300,20,100, 150+150*Math.cos(Math.PI/6),75,0 ,0,0,Math.PI/6),
    new Cuboid(ctx,true,300,20,100, -150-150*Math.cos(Math.PI/6),75,0 ,0,0,-Math.PI/6),
    //downslopes
    new Cuboid(ctx,true,100,20,300, 0,-75,150+150*Math.cos(Math.PI/6) ,Math.PI/6,0,0),
    new Cuboid(ctx,true,100,20,300, 0,-75,-150-150*Math.cos(Math.PI/6) ,-Math.PI/6,0,0),
    //upslope landing
    new Cuboid(ctx,true,140,20,100,220+300*Math.cos(Math.PI/6),150,0),
    new Cuboid(ctx,true,140,20,100,-220-300*Math.cos(Math.PI/6),150,0),
    //downslope landing
    new Cuboid(ctx,true,100,20,140,0,-150,220+300*Math.cos(Math.PI/6)),
    new Cuboid(ctx,true,100,20,140,0,-150,-220-300*Math.cos(Math.PI/6)),
    //wall-1
    new Cuboid(ctx,true,20,660,100,300+300*Math.cos(Math.PI/6),-170,0),
    new Cuboid(ctx,true,20,240,100,300+300*Math.cos(Math.PI/6),380,0),
    new Cuboid(ctx,true,20,1000,240 + 300*Math.cos(Math.PI/6),300 + 300*Math.cos(Math.PI/6),0,170 + 150*Math.cos(Math.PI/6)),
    new Cuboid(ctx,true,20,1000,240 + 300*Math.cos(Math.PI/6),300 + 300*Math.cos(Math.PI/6),0,-170 - 150*Math.cos(Math.PI/6)),
    //wall-2
    new Cuboid(ctx,true,20,660,100,-300-300*Math.cos(Math.PI/6),-170,0),
    new Cuboid(ctx,true,20,240,100,-300-300*Math.cos(Math.PI/6),380,0),
    new Cuboid(ctx,true,20,1000,240 + 300*Math.cos(Math.PI/6),-300 - 300*Math.cos(Math.PI/6),0,170 + 150*Math.cos(Math.PI/6)),
    new Cuboid(ctx,true,20,1000,240 + 300*Math.cos(Math.PI/6),-300 - 300*Math.cos(Math.PI/6),0,-170 - 150*Math.cos(Math.PI/6)),
    //wall-3
    new Cuboid(ctx,true,100,360,20,0,-320,300+300*Math.cos(Math.PI/6)),
    new Cuboid(ctx,true,100,540,20,0,230,300+300*Math.cos(Math.PI/6)),
    new Cuboid(ctx,true,240 + 300*Math.cos(Math.PI/6),1000,20,170 + 150*Math.cos(Math.PI/6),0,300 + 300*Math.cos(Math.PI/6)),
    new Cuboid(ctx,true,240 + 300*Math.cos(Math.PI/6),1000,20,-170 - 150*Math.cos(Math.PI/6),0,300 + 300*Math.cos(Math.PI/6)),
    
    // wall -4
    new Cuboid(ctx,true,100,360,20,0,-320,-300-300*Math.cos(Math.PI/6)),
    new Cuboid(ctx,true,100,540,20,0,230,-300-300*Math.cos(Math.PI/6)),
    new Cuboid(ctx,true,240 + 300*Math.cos(Math.PI/6),1000,20,170 + 150*Math.cos(Math.PI/6),0,-300 - 300*Math.cos(Math.PI/6)),
    new Cuboid(ctx,true,240 + 300*Math.cos(Math.PI/6),1000,20,-170 - 150*Math.cos(Math.PI/6),0,-300 - 300*Math.cos(Math.PI/6)),
]
}