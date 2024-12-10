#include "Game.h"

int main() {
    Game Toroidal(2500, 1500);
    Toroidal.Run();
}

/*
Things to change :

1.
Currently the physics and graphics both use the same vertices for collisions and rendering.
Make it so that we have a Shape object that we can apply vertices for rendering and also apply a shape/hitbox for collisions.
This way we can easily modify the hitbox if necessary (like make it a sphere).
Also this way might look a little nicer once you add AABB.

2.
Currently the camera matrix comes from functions in the Player.
Make a separate Camera object and keep it as a member of the Player, might be easier to add multiple cameras this way.

3.
Wrap more of the OpenGL functions and add them to Graphics.

*/