#include "Player.h"

Player::Player() {
	_location = glm::vec3(0.0f, 0.0f, 0.0f);
	_lookingAt = glm::vec3(0.0f, 0.0f, 1.0f);
}

void Player::setLookingAtDirection(glm::vec3 newDirection)
{
	_lookingAt = newDirection;
}

glm::vec3 Player::getLookingAtDirection()
{
	return _lookingAt;
}

glm::mat4x4 Player::getCameraMatrix()
{
	glm::vec3 playerHeight(0.0f, 50.0f, 0.0f);

	glm::mat4 cameraMatrix = 
		glm::lookAt(
			_location + playerHeight,
			_location + playerHeight - _lookingAt,
			glm::vec3(0, 1, 0)
		);

	return cameraMatrix;
}

void Player::addMovement(glm::vec3 movement)
{
	float boundary = 300 + 300 * cos(3.141592 / 6);
	_location += movement;

	if (_location.y < -500)
		_location *= glm::vec3(1.0f, -1.0f, 1.0f);
	
	// If we have moved outside the boundary
	if (abs(_location.x) > boundary || abs(_location.z) > boundary)
	{
		if(_location.y>0)
			_location += glm::vec3(0.0f, -300.0f, 0.0f);
		else
			_location += glm::vec3(0.0f, 300.0f, 0.0f);

		// Flipping to the right side of the door
		if (abs(_location.x) > boundary)
			_location *= glm::vec3(1.0f, 1.0f, -1.0f);
		if (abs(_location.z) > boundary)
			_location *= glm::vec3(-1.0f, 1.0f, 1.0f);

		// Rotating 90deg
		float newX = -_location.z;
		_location.z = _location.x;
		_location.x = newX;

		// Rotating lookat -90deg
		float newlookX = _lookingAt.z;
		_lookingAt.z = -_lookingAt.x;
		_lookingAt.x = newlookX;

		// Moving inwards a bit
		_location *= glm::vec3(0.99f, 1.0f, 0.99f);
	}
}
