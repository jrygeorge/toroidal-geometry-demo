## Small puzzle that makes use of toroidal geometry, like Manifold Garden
<p align="center" width="100%">
  <img alt="screenshot of the game" src="assets/screen.jpg">
</p>

<p align=center>
WASD to move. Mouse to look around. Go through the doors in the right order to win :)
</p>


Uses Instancing to make duplicates of the room for the toroidal geometry effect.<br>
There are 35 including the main room.<br>


### Javascript version
Clone the repo and open `js/toroidal.html`.<br>
Alternatively just click that link over there ↗<br>
Uses WebGL.

### C++ version
Clone the repo, the files are in [`/cpp`](/cpp)<br>
The things I've written are in [`/cpp/internal`](/cpp/internal)<br>
Open `toroidal.sln` in Visual Studio.<br>
Uses OpenGL.<br>

(no CMAKE coz I genuinely have no idea how to do it properly,<br>
also ive got the external dependencies right here in the repo)


This version is a little easier to read because I've split it up a little better.<br>
I want to use proper collision checking (not my hacky way) for this one, but I havent done it yet soooooo

---

#### Notes for future me :
1. Placed all the boxes manually by just specifying their location and dimension in `scene.js`,
took some time but thats the fun bit :P
2. I could have written something to generate the locations of the instances instead of writing those manually, but I just had to copy paste 4 lines around five times, not a big deal
3. Theres a lot of code thats repeated here as in some places I'm writing the GL code directly instead of calling something that wraps around it.
So make a better way to wrap those things later and use that.
4. Physics gets stuck here and there and you might even phase through the floor sometimes. fix that too. plus make it so that you move to the location projected onto the plane, to go up slopes. (or just use SAT like you planned originally)
5. Fix the tiny little ledges on the top of slopes by finding the right offsets.
6. Somehow clean up the way you make the scene, its very ugly