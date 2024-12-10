#include "Game.h"

Game::Game(int width, int height) 
{
    _screenWidth = width;
    _screenHeight = height;

    LOG("Press P to close the game.");

    const char* windowName = "Toroidal Geometry Game - Mouse + WASD + SPACE";
    initialiseEverything(_screenWidth, _screenHeight, windowName);
}

Game::~Game()
{
    glfwDestroyWindow(_window);
}

glm::mat4x4 Game::getProjectionMatrix()
{
    // We won't need this matrix often so I'm not keeping it in a member variable
    float FOV = _PI / 2;
    return glm::perspective(FOV/2, ((float)_screenWidth)/_screenHeight, 1.0f, 3000.0f);
    // for some reason this causes an exception sometimes, fix it!!
}


// GAME SETUP AND RENDER LOOP /////////////////////////////////////////

void Game::Run()
{
    Graphics::Program MyProgram("./internal/src/BasicVertexShader.glsl", "./internal/src/SunsetFragmentShader.glsl");

    // Creating Geometry

    Scene CurrentScene;

    // Why did I start at 02? Yup thats a good question.

    Cuboid c02(10, 30, 10, 25, 25, 25, 0, 0, 0);
    Cuboid c03(300.0, 20, 100, 0, 0, 0, 0, 0, 0);
    Cuboid c04(100, 20, 105, 0, 0, 102.5, 0, 0, 0);
    Cuboid c05(100, 20, 105, 0, 0, -102.5, 0, 0, 0);
    Cuboid c06(300, 20, 100, 150 + 150 * cos(_PI / 6), 75, 0, 0, 0, _PI / 6);
    Cuboid c07(300, 20, 100, -150 - 150 * cos(_PI / 6), 75, 0, 0, 0, -_PI / 6);
    Cuboid c08(100, 20, 300, 0, -75, -150 - 150 * cos(_PI / 6), _PI / 6, 0, 0);
    Cuboid c09(100, 20, 300, 0, -75, 150 + 150 * cos(_PI / 6), -_PI / 6, 0, 0);
    Cuboid c10(150, 20, 100, 220 + 300 * cos(_PI / 6), 150, 0, 0, 0, 0);
    Cuboid c11(150, 20, 100, -220 - 300 * cos(_PI / 6), 150, 0, 0, 0, 0);
    Cuboid c12(100, 20, 140, 0, -150, 220 + 300 * cos(_PI / 6), 0, 0, 0);
    Cuboid c13(100, 20, 140, 0, -150, -220 - 300 * cos(_PI / 6), 0, 0, 0);
    Cuboid c14(20, 660, 100, 300 + 300 * cos(_PI / 6), -170, 0, 0, 0, 0);
    Cuboid c15(20, 240, 100, 300 + 300 * cos(_PI / 6), 380, 0, 0, 0, 0);
    Cuboid c16(20, 1000, 240 + 300 * cos(_PI / 6), 300 + 300 * cos(_PI / 6), 0, 170 + 150 * cos(_PI / 6), 0, 0, 0);
    Cuboid c17(20, 1000, 240 + 300 * cos(_PI / 6), 300 + 300 * cos(_PI / 6), 0, -170 - 150 * cos(_PI / 6), 0, 0, 0);
    Cuboid c18(20, 660, 100, -300 - 300 * cos(_PI / 6), -170, 0, 0, 0, 0);
    Cuboid c19(20, 240, 100, -300 - 300 * cos(_PI / 6), 380, 0, 0, 0, 0);
    Cuboid c20(20, 1000, 240 + 300 * cos(_PI / 6), -300 - 300 * cos(_PI / 6), 0, 170 + 150 * cos(_PI / 6), 0, 0, 0);
    Cuboid c21(20, 1000, 240 + 300 * cos(_PI / 6), -300 - 300 * cos(_PI / 6), 0, -170 - 150 * cos(_PI / 6), 0, 0, 0);
    Cuboid c22(100, 360, 20, 0, -320, 300 + 300 * cos(_PI / 6), 0, 0, 0);
    Cuboid c23(100, 540, 20, 0, 230, 300 + 300 * cos(_PI / 6), 0, 0, 0);
    Cuboid c24(240 + 300 * cos(_PI / 6), 1000, 20, 170 + 150 * cos(_PI / 6), 0, 300 + 300 * cos(_PI / 6), 0, 0, 0);
    Cuboid c25(240 + 300 * cos(_PI / 6), 1000, 20, -170 - 150 * cos(_PI / 6), 0, 300 + 300 * cos(_PI / 6), 0, 0, 0);
    Cuboid c26(100, 360, 20, 0, -320, -300 - 300 * cos(_PI / 6), 0, 0, 0);
    Cuboid c27(100, 540, 20, 0, 230, -300 - 300 * cos(_PI / 6), 0, 0, 0);
    Cuboid c28(240 + 300 * cos(_PI / 6), 1000, 20, 170 + 150 * cos(_PI / 6), 0, -300 - 300 * cos(_PI / 6), 0, 0, 0);
    Cuboid c29(240 + 300 * cos(_PI / 6), 1000, 20, -170 - 150 * cos(_PI / 6), 0, -300 - 300 * cos(_PI / 6), 0, 0, 0);

    // aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaahhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh

    // I suppose in the future I could read this information in from a file
    // and create new Cuboid for each one 

    CurrentScene.addCuboid(c02);    CurrentScene.addCuboid(c03);    CurrentScene.addCuboid(c04);
    CurrentScene.addCuboid(c05);    CurrentScene.addCuboid(c06);    CurrentScene.addCuboid(c07);
    CurrentScene.addCuboid(c08);    CurrentScene.addCuboid(c09);    CurrentScene.addCuboid(c10);
    CurrentScene.addCuboid(c11);    CurrentScene.addCuboid(c12);    CurrentScene.addCuboid(c13);
    CurrentScene.addCuboid(c14);    CurrentScene.addCuboid(c15);    CurrentScene.addCuboid(c16);
    CurrentScene.addCuboid(c17);    CurrentScene.addCuboid(c18);    CurrentScene.addCuboid(c19);
    CurrentScene.addCuboid(c20);    CurrentScene.addCuboid(c21);    CurrentScene.addCuboid(c22);
    CurrentScene.addCuboid(c23);    CurrentScene.addCuboid(c24);    CurrentScene.addCuboid(c25);
    CurrentScene.addCuboid(c26);    CurrentScene.addCuboid(c27);    CurrentScene.addCuboid(c28);
    CurrentScene.addCuboid(c29);

    const int instanceNumber = 23;
    float roomWidth = 600 + 600 * cos(_PI / 6);

    float instance_transforms[instanceNumber *4] = {
        //  Translation                             Y-Rotation
            0.0f,       0.0f,       0.0f,           0.0f,
            0.0f,       1000.0f,    0.0f,           0.0f,
            0.0f,       2000.0f,    0.0f,           0.0f,
            0.0f,       3000.0f,    0.0f,           0.0f,
            0.0f,       -1000.0f,   0.0f,           0.0f,
            0.0f,       -2000.0f,   0.0f,           0.0f,
            0.0f,       -3000.0f,   0.0f,           0.0f,

            0.0f,       -300.0f,    -roomWidth,     _PI / 2,
            0.0f,       700.0f,     -roomWidth,     _PI / 2,
            0.0f,       1700.0f,    -roomWidth,     _PI / 2,
            0.0f,       -1300.0f,   -roomWidth,     _PI / 2,

            0.0f,       -300.0f,    roomWidth,     _PI / 2,
            0.0f,       700.0f,     roomWidth,     _PI / 2,
            0.0f,       1700.0f,    roomWidth,     _PI / 2,
            0.0f,       -1300.0f,   roomWidth,     _PI / 2,

            -roomWidth, 300.0f,     0.0f,          _PI / 2,
            -roomWidth, 1300.0f,    0.0f,          _PI / 2,
            -roomWidth, 2300.0f,    0.0f,          _PI / 2,
            -roomWidth, -700.0f,    0.0f,          _PI / 2,

            roomWidth,  300.0f,     0.0f,          _PI / 2,
            roomWidth,  1300.0f,    0.0f,          _PI / 2,
            roomWidth,  2300.0f,    0.0f,          _PI / 2,
            roomWidth,  -700.0f,    0.0f,          _PI / 2,

    };

    /*
    All the uniforms we need here are needed globally,
    So we'll just make one fat UBO (this is a member variable of the Game class)
    and just update the Camera Matrix part of it each frame.
    */

    // I took this whole UBO code right off learnopengl.com.
    // Creating UBO and also telling the program where to look essentially
    glGenBuffers(1, &_globalUBO);
    unsigned int uniformBlockIndex = glGetUniformBlockIndex(MyProgram.getProgramID(), "global_matrices");
    glUniformBlockBinding(MyProgram.getProgramID(), uniformBlockIndex, 0);

    // Allocating space, here, enough for two mat4s
    glBindBuffer(GL_UNIFORM_BUFFER, _globalUBO);
    glBufferData(GL_UNIFORM_BUFFER, 2 * sizeof(glm::mat4), NULL, GL_DYNAMIC_DRAW);

    // Binding the whole thing
    glBindBufferRange(GL_UNIFORM_BUFFER, 0, _globalUBO, 0, 2 * sizeof(glm::mat4));

    // Updating just the Projection matrix half
    glBindBuffer(GL_UNIFORM_BUFFER, _globalUBO);
    glBufferSubData(GL_UNIFORM_BUFFER, 0, sizeof(glm::mat4), glm::value_ptr(getProjectionMatrix()));

    // Initialising
    for (Cuboid& currentCuboid : CurrentScene.ShapeList)
    {
        unsigned int VBO, VAO, EBO, VBO_instancing;
        glGenVertexArrays(1, &VAO);
        glGenBuffers(1, &VBO);
        glGenBuffers(1, &EBO);

        currentCuboid.setVAO(VAO);
        glBindVertexArray(VAO);

        glBindBuffer(GL_ARRAY_BUFFER, VBO);
        glBufferData(GL_ARRAY_BUFFER, sizeof(glm::vec3) * 8, &currentCuboid.vertices, GL_STATIC_DRAW);

        glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, EBO);
        glBufferData(GL_ELEMENT_ARRAY_BUFFER, sizeof(currentCuboid.indices), &currentCuboid.indices, GL_STATIC_DRAW);

        glEnableVertexAttribArray(0);
        glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 3 * sizeof(float), (void*)0);

                                
        glGenBuffers(1, &VBO_instancing);
        glBindBuffer(GL_ARRAY_BUFFER, VBO_instancing);
        glBufferData(GL_ARRAY_BUFFER, sizeof(float) * 4 * instanceNumber, &instance_transforms, GL_STATIC_DRAW);
        glBindBuffer(GL_ARRAY_BUFFER, 0);

        glEnableVertexAttribArray(1);
        glBindBuffer(GL_ARRAY_BUFFER, VBO_instancing);
        glVertexAttribPointer(1, 4, GL_FLOAT, GL_FALSE, sizeof(glm::vec4), (void*)0);
        glVertexAttribDivisor(1, 1);
    };


    // RENDER LOOP //////////////////////////////////////////////////////

    while (!glfwWindowShouldClose(_window))
    {
        
        Graphics::clearColourAndDepth(0.0f, 0.0f, 0.0f, 1.0f);

        MyProgram.useProgram();

        float newTime = glfwGetTime();
        float timeElapsed = newTime - _currentTime;
        processKeyboardInputs(_window, timeElapsed);

        _currentTime = newTime;

        // Updating the second half of the UBO : The camera matrix

        glBindBuffer(GL_UNIFORM_BUFFER, _globalUBO);
        glBufferSubData(GL_UNIFORM_BUFFER, sizeof(glm::mat4), sizeof(glm::mat4), glm::value_ptr(MyPlayer.getCameraMatrix()));
        
        // Drawing
        //MyPlayer.addMovement(glm::vec3(0.0f, -10.0f, 0.0f));


        for (Cuboid& currentCuboid : CurrentScene.ShapeList)
        {
            glBindVertexArray(currentCuboid.getVAO());
            glDrawElementsInstanced(GL_TRIANGLES, currentCuboid.vertexCount, GL_UNSIGNED_INT, 0, instanceNumber);
        }
        glfwSwapBuffers(_window);
        glfwPollEvents();
    }
    glfwTerminate();
}


void Game::initialiseEverything(int WIDTH, int HEIGHT, const char* windowName)
{
    glfwInit();
    glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 4);
    glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 0);
    glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);
    //glfwWindowHint(GLFW_RESIZABLE, GLFW_FALSE);

    _window = glfwCreateWindow(WIDTH, HEIGHT, windowName, NULL, NULL);
    glfwSetWindowUserPointer(_window, this);
    if (_window == NULL)
    {
        LOG("GLFW window ERROR :(");
        glfwTerminate();
    }
    glfwMakeContextCurrent(_window);
    glfwSetFramebufferSizeCallback(_window, framebuffer_size_CALLBACK);
    glfwSetMouseButtonCallback(_window, mouse_button_CALLBACK);
    glfwSetCursorPosCallback(_window, cursor_position_CALLBACK);

    // Load in OpenGL
    if (!gladLoadGLLoader((GLADloadproc)glfwGetProcAddress))
    {
        LOG("GLAD ERROR :(");
    }
    glEnable(GL_DEPTH_TEST);
    glEnable(GL_CULL_FACE);
}

// CALLBACK FUNCTIONS ///////////////////////////////////////////////////

void Game::processKeyboardInputs(GLFWwindow* window, float timeElapsed)
{
    glm::vec3 movementDelta = glm::vec3(0.0);

    // Multiplying XZ movement by glm::vec3(1.0, 0.0, 1.0) so that the y-component does not affect movement
    // i.e we don't fly into the sky
    if (glfwGetKey(window, GLFW_KEY_W) == GLFW_PRESS)
        movementDelta -= MyPlayer.getLookingAtDirection() * glm::vec3(1.0, 0.0, 1.0);

    if (glfwGetKey(window, GLFW_KEY_S) == GLFW_PRESS)
        movementDelta += MyPlayer.getLookingAtDirection() * glm::vec3(1.0, 0.0, 1.0);

    if (glfwGetKey(window, GLFW_KEY_A) == GLFW_PRESS)
        movementDelta += glm::cross(MyPlayer.getLookingAtDirection(), glm::vec3(0, 1, 0));

    if (glfwGetKey(window, GLFW_KEY_D) == GLFW_PRESS)
        movementDelta -= glm::cross(MyPlayer.getLookingAtDirection(), glm::vec3(0, 1, 0));

    if (glfwGetKey(window, GLFW_KEY_R) == GLFW_PRESS)
        movementDelta += glm::vec3(0, 1, 0);

    if (glfwGetKey(window, GLFW_KEY_F) == GLFW_PRESS)
        movementDelta -= glm::vec3(0, 1, 0);

    // Normalising the vector so diagonal movement isnt "faster".
    if (glm::length(movementDelta) != 0)
        movementDelta = glm::normalize(movementDelta);

    MyPlayer.addMovement(movementDelta * timeElapsed * 600.0f);

    // P to close Window
    if (glfwGetKey(window, GLFW_KEY_P) == GLFW_PRESS)
    {
        glfwSetWindowShouldClose(window, true);
        LOG("Closing Game.");
    }

    if ((glfwGetKey(window, GLFW_KEY_ESCAPE) == GLFW_PRESS) && (glfwGetInputMode(window, GLFW_CURSOR) == GLFW_CURSOR_DISABLED))
    {
        glfwSetInputMode(window, GLFW_CURSOR, GLFW_CURSOR_NORMAL);
        LOG("Mouse unlocked.");
    }
}

void Game::framebuffer_size_CALLBACK(int width, int height)
{
    _screenWidth = width;
    _screenHeight = height;

    // Updating the Projection half of the UBO
    glBindBuffer(GL_UNIFORM_BUFFER, _globalUBO);
    glBufferSubData(GL_UNIFORM_BUFFER, 0, sizeof(glm::mat4), glm::value_ptr(getProjectionMatrix()));
    glViewport(0, 0, width, height);
}

void Game::mouse_button_CALLBACK(int button, int action, int mods)
{
    if (action == GLFW_PRESS)
    {
        LOG("Mouse locked. Press ESC to unlock.");
        glfwSetInputMode(_window, GLFW_CURSOR, GLFW_CURSOR_DISABLED);
    }
}

void Game::cursor_position_CALLBACK(double xpos, double ypos)
{
    // If the mouse is locked, allow camera movement.
    if (glfwGetInputMode(_window, GLFW_CURSOR) == GLFW_CURSOR_DISABLED)
    {
        // Change all this to use angles or those quaternion things later.
        double xMoved = _xMousePosition - xpos;
        double yMoved = _yMousePosition - ypos;

        glm::vec3 lookingAtDelta = glm::vec3(0.0f);

        // The cross product of UP and LOOKINGAT will be to the RIGHT.
        // Adding this onto where we're LOOKINGAT now will turn our head to the right (duh).
        lookingAtDelta = glm::cross(MyPlayer.getLookingAtDirection(), glm::vec3(0, -xMoved * 0.005, 0));

        // Just adding on some vertical movement.
        // Works good enough, but as expected when youre looking very high or very low,
        // it gets a bit "sticky", this is coz the angle change is lower the higher you look.
        // The good thing is, it hits 0 right at the top, so you don't need to clamp anything.
        lookingAtDelta = lookingAtDelta + glm::vec3(0, -yMoved * 0.005, 0);

        MyPlayer.setLookingAtDirection(glm::normalize(MyPlayer.getLookingAtDirection() + lookingAtDelta));
    }
    _xMousePosition = xpos;
    _yMousePosition = ypos;
}


// STATIC CALLBACK FUNCTIONS ///////////////////////////////////////////////

void Game::framebuffer_size_CALLBACK(GLFWwindow* window, int width, int height)
{
    Game* obj = (Game*)glfwGetWindowUserPointer(window);
    obj->framebuffer_size_CALLBACK(width, height);
}

void Game::mouse_button_CALLBACK(GLFWwindow* window, int button, int action, int mods)
{
    Game* obj = (Game*)glfwGetWindowUserPointer(window);
    obj->mouse_button_CALLBACK(button, action, mods);
}

void Game::cursor_position_CALLBACK(GLFWwindow* window, double xpos, double ypos)
{
    Game* obj = (Game*)glfwGetWindowUserPointer(window);
    obj->cursor_position_CALLBACK(xpos, ypos);
}
