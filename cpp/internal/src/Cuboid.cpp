#include "../include/Cuboid.h"

glm::vec4 generatePlaneCoefficients()
{
	return glm::vec4(0.0);
}

Cuboid::Cuboid(float X, float Y, float Z, float tX, float tY, float tZ, float rX, float rY, float rZ)
{

	glm::mat4x4 affineTransformationMatrix =
		glm::translate(glm::mat4(1.0), glm::vec3(tX,tY,-tZ))
		* glm::rotate(glm::mat4(1.0), rX, glm::vec3(1.0, 0.0, 0.0))
		* glm::rotate(glm::mat4(1.0), rY, glm::vec3(0.0, 1.0, 0.0))
		* glm::rotate(glm::mat4(1.0), rZ, glm::vec3(0.0, 0.0, 1.0));
	
	vertices[0] = glm::vec3(-X / 2, -Y / 2, -Z / 2);
	vertices[1] = glm::vec3(X / 2, -Y / 2, -Z / 2);
	vertices[2] = glm::vec3(X / 2, Y / 2, -Z / 2);
	vertices[3] = glm::vec3(-X / 2, Y / 2, -Z / 2);
	vertices[4] = glm::vec3(-X / 2, -Y / 2, Z / 2);
	vertices[5] = glm::vec3(X / 2, -Y / 2, Z / 2);
	vertices[6] = glm::vec3(X / 2, Y / 2, Z / 2);
	vertices[7] = glm::vec3(-X / 2, Y / 2, Z / 2); 

	for (glm::vec3& vertex : vertices) {
		glm::vec4 temp =  affineTransformationMatrix * glm::vec4(vertex,1.0);
		vertex = glm::vec3(temp.x, temp.y, temp.z);
	}
}

void Cuboid::setVAO(int vao)
{
	_VAO = vao;
}

int Cuboid::getVAO()
{
	return _VAO;
}