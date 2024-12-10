#pragma once
#include <vector>
#include <glm/glm.hpp>
#include <glm/ext/matrix_transform.hpp> 

class Cuboid
{
public:
	Cuboid(float X, float Y, float Z, float tX, float tY, float tZ, float rX, float rY, float rZ);
	void setVAO(int vao);
	int getVAO();
	//void setUBO(int ubo);
	//int getUBO();
public:
	glm::vec3 vertices[8];
	unsigned int indices[36] = {
		1,0,2,
		2,0,3,
		5,1,6,
		6,1,2,
		4,5,7,
		7,5,6,
		0,4,3,
		3,4,7,
		2,3,6,
		6,3,7,
		5,4,1,
		1,4,0
	};
	int vertexCount = 36;
private:
	glm::vec4 generatePlaneCoefficients();
private:
	int _VAO = 0;
	// int UBO = 0;
	// assign programs and UBOs for each model in the future
};

