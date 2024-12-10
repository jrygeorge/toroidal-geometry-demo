#pragma once
#include <vector>

#include "Cuboid.h"

class Scene
{
// Currently just holds Cuboids because thats all we need
// Later make Cuboid a child of "Shape" or something like that
public:
	Scene();
	void addCuboid(Cuboid &entry);
public:
	std::vector<Cuboid> ShapeList;
};

