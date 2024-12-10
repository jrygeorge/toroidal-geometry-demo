#pragma once

#include <glad/glad.h>
#include <GLFW/glfw3.h>

#include <iostream>
#include <glm/gtc/type_ptr.hpp>
#include <glm/ext/matrix_transform.hpp>
#include <cmath>
#include <format>

#include "Graphics.h"
#include "Cuboid.h"
#include "Scene.h"
#include "Player.h"

#define LOG(message) std::cout<<message<<std::endl

class Game
{
public:
	Game(int width, int height);
	~Game();
	void Run();

private:
	unsigned int _globalUBO;
	int _screenWidth;
	int _screenHeight;
	float _currentTime = 0.0f;
	double _xMousePosition = 0;
	double _yMousePosition = 0;
	const float _PI = 3.141592653589793;
	GLFWwindow* _window;
	Player MyPlayer;

	// For some reason I can't get M_PI out of cmath even after doing that #define thing,
	// so we're doing it like this for now :(

private:
	/*
	Callback functions

	The actual call back functions have to be static because inputs are global, not for a specific
	instance. Inside the call back function, we get the location of the specific instance,
	then pass all the arguments to its (the instances) callback function.
	*/

	static void framebuffer_size_CALLBACK(GLFWwindow* window, int width, int height);
	static void mouse_button_CALLBACK(GLFWwindow* window, int button, int action, int mods);
	static void cursor_position_CALLBACK(GLFWwindow* window, double xpos, double ypos);

	void framebuffer_size_CALLBACK(int width, int height);
	void mouse_button_CALLBACK(int button, int action, int mods);
	void cursor_position_CALLBACK(double xpos, double ypos);
	
	void initialiseEverything(int WIDTH, int HEIGHT, const char* windowName);

	// I'm just checking if keys are pressed down rather than using callbacks
	// as its easier to account for multiple inputs this way.
	// i.e diagonal movement
	void processKeyboardInputs(GLFWwindow* window, float timeElapsed);

	glm::mat4x4 getProjectionMatrix();

};