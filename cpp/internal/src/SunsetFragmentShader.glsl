#version 330 core
in vec3 normal;
    in float Z;
    out vec4 outColour;

    const vec3 sunset1 = vec3(160,109,186)/256.0;
    const vec3 sunset2 = vec3(254,184,89)/256.0;
    const vec3 sunset3 = vec3(255,228,27)/256.0;

    void main()
    {   
        float zScaled = (Z+1.0)*0.002;
        float ramp_blend = smoothstep(0.2,0.7,zScaled);

        // fwidth(Z) gives us this fresnel-y look, helps define the corners
        // clamping with min so its less sharp
        float whiteblendfactor = min(fwidth(Z)*0.3,0.8)-pow(zScaled*0.8,0.8);
    
        vec3 blendedColour = sunset2*(1.0-ramp_blend) + sunset1*(ramp_blend);
        vec3 finalColour = blendedColour* (1.0 - whiteblendfactor) + vec3(whiteblendfactor);

        outColour = vec4( finalColour ,1.0);
    };