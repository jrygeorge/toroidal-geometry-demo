#pragma once

#include <glm/glm.hpp>
#include <glm/ext/matrix_transform.hpp>
#include <cmath>

class Player
{
public:
	Player();
	void addMovement(glm::vec3 movement);
	void setLookingAtDirection(glm::vec3);
	glm::vec3 getLookingAtDirection();
	glm::mat4x4 getCameraMatrix();

	// TODO :	Split Player into Player and Camera.
	//			Feels a bit weird doing it like this,
	//			Or maybe change the name of the class to something that fits a bit better?

private:
	glm::vec3 _location;
	glm::vec3 _lookingAt; // This is a direction vector
};	


