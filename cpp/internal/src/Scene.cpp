#include "Scene.h"

Scene::Scene()
{
	ShapeList.reserve(28);
}

void Scene::addCuboid(Cuboid &entry)
{
	ShapeList.push_back(entry);
}