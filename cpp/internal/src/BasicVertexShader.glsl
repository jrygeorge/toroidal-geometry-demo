#version 330 core

layout (location = 0) in vec4 a_vertPos;
layout (location = 1) in vec4 a_instanceTransform;

out float Z;

layout (std140) uniform global_matrices
{
    mat4 u_projection;
    mat4 u_camera;
};

void main()
{

    // Rotation around Y-axis using a_instanceTransform.w
    mat4 instanceRotation =
            mat4(
                    vec4(cos(a_instanceTransform.w), 0,  sin(a_instanceTransform.w),  0   ),
                    vec4(0,             1,  0,              0   ),
                    vec4(-sin(a_instanceTransform.w),0,  cos(a_instanceTransform.w),  0   ),
                    vec4(0,             0,  0,              1   )
                );

    // Translation using a_instanceTransform.xyz
    mat4 instanceTranslation =
            mat4(
                    vec4(1,0,0,0),
                    vec4(0,1,0,0),
                    vec4(0,0,1,0),
                    vec4(a_instanceTransform.xyz,1)
                );

	gl_Position = u_projection * u_camera * instanceTranslation * instanceRotation * a_vertPos ;

	Z = gl_Position.z;
};