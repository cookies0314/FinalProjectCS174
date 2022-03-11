import {defs, tiny} from './examples/common.js';
// Pull these names into this module's scope for convenience:
const {vec3, vec4, vec, color, Matrix, Mat4, Light, Shape, Material, Shader, Texture, Scene} = tiny;
const {Cube, Axis_Arrows, Textured_Phong, Phong_Shader, Basic_Shader, Subdivision_Sphere} = defs

import {Shape_From_File} from './examples/obj-file-demo.js'
import {Color_Phong_Shader, Shadow_Textured_Phong_Shader,
    Depth_Texture_Shader_2D, Buffered_Texture, LIGHT_DEPTH_TEX_SIZE} from './examples/shadow-demo-shaders.js'

// 2D shape, to display the texture buffer
const Square =
    class Square extends tiny.Vertex_Buffer {
        constructor() {
            super("position", "normal", "texture_coord");
            this.arrays.position = [
                vec3(0, 0, 0), vec3(1, 0, 0), vec3(0, 1, 0),
                vec3(1, 1, 0), vec3(1, 0, 0), vec3(0, 1, 0)
            ];
            this.arrays.normal = [
                vec3(0, 0, 1), vec3(0, 0, 1), vec3(0, 0, 1),
                vec3(0, 0, 1), vec3(0, 0, 1), vec3(0, 0, 1),
            ];
            this.arrays.texture_coord = [
                vec(0, 0), vec(1, 0), vec(0, 1),
                vec(1, 1), vec(1, 0), vec(0, 1)
            ]
        }
    }

// The scene
export class BeachScene extends Scene {
    constructor() {
        super();

        const initial_corner_point = vec3(-15, -5, 0);
        const row_operation = (s, p) => p ? Mat4.translation(0, .2, 0).times(p.to4(1)).to3()
            : initial_corner_point;
        const column_operation = (t, p) => Mat4.translation(.2, 0, 0).times(p.to4(1)).to3();

        // Load the model file:
        this.shapes = {
            "teapot": new Shape_From_File("assets/teapot.obj"),
            "sphere": new Subdivision_Sphere(6),
            "cube": new Cube(),
            "square_2d": new Square(),
            sun: new defs.Subdivision_Sphere(4),
            beachBall: new defs.Subdivision_Sphere(5),
            cubeSand: new Cube(),
            sky: new defs.Grid_Patch(200, 225, row_operation, column_operation, [[0, 10], [0, 1]]),
            cloud: new Shape_From_File("assets/uploads_files_721601_cloud.obj"),
            cloud1: new Shape_From_File("assets/island-cloud-mod.obj"),
            cloud2: new Shape_From_File("assets/island-cloud-c.obj"),
            umbrella: new Shape_From_File("assets/umbrella_2.obj"),
            beachChair: new Shape_From_File("assets/BeachChair.obj"),
        };

        const bump = new defs.Fake_Bump_Map(1);
        this.materials = {
            sun: new Material(new defs.Phong_Shader(),{ambient: 1, diffusivity: 0, specularity: 0, color: color(1,1,0,1)}),
            //old texturedSand (didn't work)
            // texturedSand: new Material(new Textured_Phong(), {
            //     color: hex_color("#FFFFFF"),
            //     ambient: 1, diffusivity: 0.6, specularity: 0.2,
            //     texture: new Texture("assets/textured_sand.jpg")
            // }),
            texturedSand: new Material(bump, {ambient: 1, specularity: 0, texture: new Texture("assets/textured_sand.jpg")}),
            shadow_textured_sand: new Material(new Shadow_Textured_Phong_Shader(1), {
                color: color(1, 1, 1, 1), ambient: .3, diffusivity: 0.6, specularity: 0.4, smoothness: 64,
                color_texture: new Texture("assets/textured_sand.jpg"),
                light_depth_texture: null
            }),
            // texturedSand: new Material(new defs.Phong_Shader(), {diffusivity: 0.5, color: color(0.761, 0.698, 0.502, 1.0)}),
            texturedWater:  new Material(bump, {ambient: 1, specularity: 0.3, texture: new Texture("assets/textured_water.jpeg")}),

            shadow_text_water: new Material(new Shadow_Textured_Phong_Shader(1),{
                color: color(0,.4,.9,1),
                ambient: .3, specularity: 0.5,
                color_texture: new Texture("assets/textured_water.jpeg"),
                light_depth_texture: null
            }),

            texturedSky:  new Material(bump, {ambient: 1, specularity: 0.2, texture: new Texture("assets/textured_sky.jpg")}),
            oldWater: new Material(new Textured_Phong(), {
                color: color(0,0,0,1),
                ambient: 1, diffusivity: 0.1, specularity: 0.1,
                texture: new Texture("assets/textured_water.jpeg")
            }),
            cloudMat: new Material(bump, {ambient: 1, specularity: 0, texture: new Texture("assets/cloud.jpg")}),

            shadow_cloud_mat: new Material(new Shadow_Textured_Phong_Shader(1),
                {
                    color: color(1,1,1,1),
                    ambient: 0.5, specularity: 0,
                    color_texture: new Texture("assets/cloud.jpg"),
                    light_depth_texture: null
                }),

            shadow_rain_cloud_mat: new Material(new Shadow_Textured_Phong_Shader(1),
                {
                    color: color(0.5,0.5,0.5,1),
                    ambient: 0.3, specularity: 0,
                    color_texture: new Texture("assets/rainclouds.jpg"),
                    light_depth_texture: null
                }),

            texturedBeachBall:  new Material(bump, {ambient: 1, texture: new Texture("assets/beachball.jpg")}),

            shadow_text_Ball: new Material(new Shadow_Textured_Phong_Shader(1),{
                color: color(.5,.5,.5,1),
                ambient: .5, diffusivity: .5, specularity: 0.5,
                color_texture: new Texture("assets/beachball.jpg"),
                light_depth_texture: null
            }),

            umbrellaMat: new Material(bump, {ambient: 1, specularity: 0, texture: new Texture("assets/umbrella.jpg")}),

            shadow_umbrella_mat: new Material(new Shadow_Textured_Phong_Shader(1),{
                color: color(.5,.5,.5,1),
                ambient: .5, diffusivity: .5, specularity: .5,
                color_texture: new Texture("assets/umbrella.jpg"),
                light_depth_texture: null
            }),
            chairMat: new Material(bump, {ambient: 1, specularity: 0, texture: new Texture("assets/chairtexture.jpg")}),

            shadow_chair_mat: new Material(new Shadow_Textured_Phong_Shader(1), {
                color: color(.5,.5,.5,1),
                ambient: .5, diffusivity: .5, specularity: .5,
                color_texture: new Texture("assets/chairtexture.jpg"),
                light_depth_texture: null
            }),



            nighttexturedSand: new Material(bump, {ambient: 0.5, specularity: 0, texture: new Texture("assets/textured_sand.jpg")}),
            // texturedSand: new Material(new defs.Phong_Shader(), {diffusivity: 0.5, color: color(0.761, 0.698, 0.502, 1.0)}),
            nighttexturedWater:  new Material(bump, {ambient: 0.7, specularity: 0.2, texture: new Texture("assets/textured_water.jpeg")}),
            nighttexturedSky:  new Material(bump, {ambient: 0.5, specularity: 0.1, texture: new Texture("assets/night.jpg")}),
            nightcloudMat: new Material(bump, {ambient: 0.6, specularity: 0, texture: new Texture("assets/cloud.jpg")}),
            nighttexturedBeachBall:  new Material(bump, {ambient: 0.6, specularity: 0.5, texture: new Texture("assets/beachball.jpg")}),
            nightumbrellaMat: new Material(bump, {ambient: 0.6, specularity: 0, texture: new Texture("assets/umbrella.jpg")}),
            nightchairMat: new Material(bump, {ambient: 0.6, specularity: 0, texture: new Texture("assets/chairtexture.jpg")}),
            moonMat: new Material(bump, {ambient: 0.9, specularity: 0, texture: new Texture("assets/moon_2.jpg")}),
            raincloudMat: new Material(bump, {ambient: 0.8, specularity: 0, texture: new Texture("assets/rainclouds.jpg")}),
            nightraincloudMat: new Material(bump, {ambient: 0.6, specularity: 0, texture: new Texture("assets/rainclouds.jpg")}),
            raintexturedSky:  new Material(bump, {ambient: 0.6, specularity: 0.1, texture: new Texture("assets/textured_sky.jpg")}),
            rain: new Material(new defs.Phong_Shader(),{ambient: 1, diffusivity: 0, specularity: 0, color: color(0.157, 0.573, 0.761, 1)}),
        }

        this.initial_camera_location = Mat4.look_at(vec3(1, 0, 0), vec3(0, 0, 1), vec3(0, 1, 0));
        this.light_position = 0;
        this.sun_move = false;
        this.wind = false;
        this.cloud1_pos = -13
        this.cloud2_pos = -6.5
        this.cloud3_pos = -1
        this.cloud4_pos = 3.5
        this.cloud5_pos = 9
        this.cloud6_pos = 15.0
        this.cloud7_pos = -15
        this.cloud8_pos = -9.75
        this.cloud9_pos = -3.75
        this.cloud10_pos = 1
        this.cloud11_pos = 6.25
        this.cloud12_pos = 11.5
        this.prev_t = 0
        this.prev_prev_t = 0
        this.wind_cloud_time = 0
        this.ball_roll = 0
        this.waves = false
        this.prev_wave_t = 0
        this.night = false
        this.rain = false

        // For the first pass
        this.pure = new Material(new Color_Phong_Shader(), {
        })
        // For light source
        this.light_src = new Material(new Phong_Shader(), {
            color: color(1, 1, 1, 1), ambient: 1, diffusivity: 0, specularity: 0
        });
        // For depth texture display
        this.depth_tex =  new Material(new Depth_Texture_Shader_2D(), {
            color: color(0, 0, .0, 1),
            ambient: 1, diffusivity: 0, specularity: 0, texture: null
        });

        // To make sure texture initialization only does once
        this.init_ok = false;
    }

    make_control_panel() {
        // // make_control_panel(): Sets up a panel of interactive HTML elements, including
        // // buttons with key bindings for affecting this scene, and live info readouts.
        // this.control_panel.innerHTML += "Dragonfly rotation angle: ";
        // // The next line adds a live text readout of a data member of our Scene.
        // this.live_string(box => {
        //     box.textContent = (this.hover ? 0 : (this.t % (2 * Math.PI)).toFixed(2)) + " radians"
        // });
        // this.new_line();
        // this.new_line();
        // // Add buttons so the user can actively toggle data members of our Scene:
        // this.key_triggered_button("Hover dragonfly in place", ["h"], function () {
        //     this.hover ^= 1;
        // });
        // this.new_line();
        // this.key_triggered_button("Swarm mode", ["m"], function () {
        //     this.swarm ^= 1;
        // });
        this.control_panel.innerHTML += "Change the weather and time of the scene.<br>";

        this.new_line()

        this.key_triggered_button("Toggle Wind", ["w"], () => {
            this.wind = !this.wind
        })

        this.key_triggered_button("Toggle Waves", ["a"], () => {
            this.waves = !this.waves
        })

        this.new_line()
        this.new_line()

        this.key_triggered_button("Toggle Night/Day", ["n"], () => {
            this.night = !this.night
        })

        this.key_triggered_button("Toggle Rain", ["i"], () => {
            this.rain = !this.rain
        })

        this.new_line()
        this.new_line()

        this.key_triggered_button("Reset", ["r"], () => {
            this.wind = false
            this.rain = false
            this.waves = false
            this.night = false
        });
    }

    texture_buffer_init(gl) {
        // Depth Texture
        this.lightDepthTexture = gl.createTexture();
        // Bind it to TinyGraphics
        this.light_depth_texture = new Buffered_Texture(this.lightDepthTexture);
        this.materials.shadow_text_Ball.light_depth_texture = this.light_depth_texture
        this.materials.shadow_textured_sand.light_depth_texture = this.light_depth_texture
        this.materials.shadow_chair_mat.light_depth_texture = this.light_depth_texture
        this.materials.shadow_umbrella_mat.light_depth_texture = this.light_depth_texture
        this.materials.shadow_cloud_mat.light_depth_texture = this.light_depth_texture
        this.materials.shadow_text_water.light_depth_texture = this.light_depth_texture

        this.lightDepthTextureSize = LIGHT_DEPTH_TEX_SIZE;
        gl.bindTexture(gl.TEXTURE_2D, this.lightDepthTexture);
        gl.texImage2D(
            gl.TEXTURE_2D,      // target
            0,                  // mip level
            gl.DEPTH_COMPONENT, // internal format
            this.lightDepthTextureSize,   // width
            this.lightDepthTextureSize,   // height
            0,                  // border
            gl.DEPTH_COMPONENT, // format
            gl.UNSIGNED_INT,    // type
            null);              // data
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        // Depth Texture Buffer
        this.lightDepthFramebuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.lightDepthFramebuffer);
        gl.framebufferTexture2D(
            gl.FRAMEBUFFER,       // target
            gl.DEPTH_ATTACHMENT,  // attachment point
            gl.TEXTURE_2D,        // texture target
            this.lightDepthTexture,         // texture
            0);                   // mip level
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        // create a color texture of the same size as the depth texture
        // see article why this is needed_
        this.unusedTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.unusedTexture);
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            this.lightDepthTextureSize,
            this.lightDepthTextureSize,
            0,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            null,
        );
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        // attach it to the framebuffer
        gl.framebufferTexture2D(
            gl.FRAMEBUFFER,        // target
            gl.COLOR_ATTACHMENT0,  // attachment point
            gl.TEXTURE_2D,         // texture target
            this.unusedTexture,         // texture
            0);                    // mip level
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    /*
    draw_sand(context, program_state, sand_transform) {
        const t = this.t = program_state.animation_time / 1000;
        let rotation_angle = 0;

        sand_transform = sand_transform.times(Mat4.translation(2,0,0));
        if (this.night) {
            this.shapes.cubeSand.draw(context, program_state, sand_transform, this.materials.nighttexturedSand);
        }
        else {
            if (this.rain) {
                this.shapes.cubeSand.draw(context, program_state, sand_transform, this.materials.texturedSand.override({ambient: 0.9}));
            } else {
                this.shapes.cubeSand.draw(context, program_state, sand_transform, this.materials.texturedSand);
            }
        }
        // this.shapes.cubeSand.draw(context, program_state, sand_transform, this.floor);
        return sand_transform;
    }

    //Draws a single block of water and moves the water_transform to the next block
    draw_water(context, program_state, water_transform) {
        const t = this.t = program_state.animation_time / 1000;
        let rotation_angle = 0;

        water_transform = water_transform.times(Mat4.translation(2,0,0));
        if (this.night) {
            this.shapes.cube.draw(context, program_state, water_transform, this.materials.nighttexturedWater);
        }
        else {
            if (this.rain) {
                this.shapes.cube.draw(context, program_state, water_transform, this.materials.texturedWater.override({ambient: 0.9}));
            } else {
                this.shapes.cube.draw(context, program_state, water_transform, this.materials.texturedWater);
            }

        }
        // this.shapes.cube.draw(context, program_state, water_transform, this.floor);
        return water_transform;
    }

     */

    move_clouds(position, t) {
        if (position < -18) {
            while (position < -18) {
                position += 33.5
            }

            return position
        }
        else {
            return position
        }
    }

    move_rain(position) {
        if (position < -2) {
            while (position < -2) {
                position += 17
            }

            return position
        }
        else {
            return position
        }
    }

    render_scene(context, program_state, shadow_pass, draw_light_source=false, draw_shadow=false) {
        // shadow_pass: true if this is the second pass that draw the shadow.
        // draw_light_source: true if we want to draw the light source.
        // draw_shadow: true if we want to draw the shadow

        let light_position = this.light_position;
        let light_color = this.light_color;
        const t = program_state.animation_time/1000;

        program_state.draw_shadow = draw_shadow;

        //Drawing Sun/Moon/Light Source
        /*
        //  Create Sun
        let sun_transform = Mat4.identity();
        let sun_angle = -2*t;
        // let sun_scale = 2*Math.cos(t);
        let sun_scale = 1.5
        //need to find better rotation

        if(!this.sun_move)
        {
            sun_angle = 0;
            sun_scale = 1.5;
            //implement pause at current position
        }

        sun_transform = sun_transform.times(Mat4.rotation(sun_angle,0,0,1));
        sun_transform = sun_transform.times(Mat4.translation(0,8,0));

        if (this.night) {
            sun_transform = sun_transform.times(Mat4.scale(1.2,1.2,1.2));
        } else {
            sun_transform = sun_transform.times(Mat4.scale(sun_scale,sun_scale,sun_scale));
        }
        // program_state.lights = [new Light(vec4(0, 0, 0, 1), color(1.0, Math.abs((Math.sin(Math.PI*(t/20)))), Math.abs((Math.sin(Math.PI*(t/20)))), 1.0), 10)];
        // const light_position = Mat4.rotation(angle, 1, 0, 0).times(vec4(0, 0, 1, 0));
        // program_state.lights = [new Light(light_position, color(1, 1, 1, 1), 1000000)];

        if (this.night) {
            this.shapes.sun.draw(context, program_state, sun_transform, this.materials.moonMat);
        } else {
            this.shapes.sun.draw(context, program_state, sun_transform, this.materials.sun);
        }
        */
        //MAKE SUN MORE REALISTIC
        if(!this.night)
        {
            if (draw_light_source && shadow_pass) {
                this.shapes.sun.draw(context, program_state,
                    Mat4.translation(light_position[0], light_position[1], light_position[2]).times(Mat4.scale(1.5,1.5,1.5)),
                    this.light_src.override({color: light_color}));
            }
        }
        else
        {
            this.shapes.sun.draw(context, program_state, Mat4.translation(light_position[0], light_position[1], light_position[2]), this.materials.moonMat);
        }


        //Wind Implementation
        let wind_time = 0
        if (this.wind) {
            wind_time = t - this.prev_t
            this.wind_cloud_time += t - this.prev_prev_t
        } else {
            this.prev_t = t
            this.ball_roll = 0
        }

        this.prev_prev_t = t


        //Constructing Sky
        let sky_transform = Mat4.identity();
        sky_transform = sky_transform.times(Mat4.translation(0,4,-5.2));
        sky_transform = sky_transform.times(Mat4.scale(20,10,.33));

        if (this.night) {
            this.shapes.cube.draw(context, program_state, sky_transform, this.materials.nighttexturedSky);
        } else {
            if (this.rain) {
                this.shapes.cube.draw(context, program_state, sky_transform, this.materials.texturedSky.override({ambient: 0.6, specularity: 0.1}));
            } else {
                this.shapes.cube.draw(context, program_state, sky_transform, this.materials.texturedSky);
            }
        }

        //Sand floor transform
        let sand_transform = Mat4.scale(20, .1, 5);
        sand_transform = sand_transform.times(Mat4.translation(0,-25,0));
        sand_transform = sand_transform.times(Mat4.scale(1,20,10));

        if(this.night)
        {
            this.shapes.cube.draw(context, program_state, sand_transform, shadow_pass? this.materials.shadow_textured_sand.override({ambient: 0.05, specularity: 0.02}) : this.pure);
        }
        else
        {
            if(this.rain)
            {
                this.shapes.cube.draw(context, program_state, sand_transform, shadow_pass? this.materials.shadow_textured_sand.override({ambient: 0.1, specularity: 0.05}) : this.pure);
            }
            else
            {
                this.shapes.cube.draw(context, program_state, sand_transform, shadow_pass? this.materials.shadow_textured_sand : this.pure);
            }
        }


        //Water and Waves
        let wave_time = 0
        if (this.waves) {
            wave_time = t - this.prev_wave_t
        } else {
            this.prev_wave_t = t
        }


        let water_transform = Mat4.identity();
        water_transform = water_transform.times(Mat4.scale(20,.1,5));
        water_transform = water_transform.times(Mat4.translation(1,-23.5,0));
        water_transform = water_transform.times(Mat4.scale(1,20,10.1));

        if(this.waves)
        {
            water_transform = water_transform.times(Mat4.translation((-(0.8*Math.sin(wave_time+(Math.PI*1.5))+0.8))/20, 0, 0));
        }

        if(this.night)
        {
            this.shapes.cube.draw(context, program_state, water_transform, shadow_pass? this.materials.shadow_text_water.override({ambient: 0.17}) : this.pure);
        }
        else
        {
            if(this.rain)
            {
                this.shapes.cube.draw(context, program_state, water_transform, shadow_pass? this.materials.shadow_text_water.override({ambient: 0.23}) : this.pure);
            }
            else
            {
                this.shapes.cube.draw(context, program_state, water_transform, shadow_pass? this.materials.shadow_text_water : this.pure);
            }
        }

        /*
        for (let i = 0; i < 10; i++) {
            // this.shapes.sand.draw(context, program_state, sand_transform, this.materials.texturedSand);
            sand_transform = this.draw_sand(context, program_state, sand_transform);
        }

        for (let i = 0; i < 20; i++) {
            // this.shapes.sand.draw(context, program_state, sand_transform, this.materials.texturedSand);
            water_transform = this.draw_water(context, program_state, water_transform);
        }
        */

        //Chair
        let chair_transform = Mat4.identity();
        chair_transform = chair_transform.times(Mat4.translation(-8.5, 0.75, 3)).times(Mat4.scale(0.6,0.6,0.6));
        if (this.night){
            this.shapes.beachChair.draw(context, program_state, chair_transform, shadow_pass? this.materials.shadow_chair_mat.override({ambient: 0.2}) : this.pure)
        } else {
            if (this.rain) {
                this.shapes.beachChair.draw(context, program_state, chair_transform, shadow_pass? this.materials.shadow_chair_mat.override({ambient: 0.35}) : this.pure)
            } else {
                this.shapes.beachChair.draw(context, program_state, chair_transform, shadow_pass? this.materials.shadow_chair_mat : this.pure)
            }
        }
        //BeachBall
        let beachBall_transform = Mat4.identity();
        beachBall_transform = beachBall_transform.times(Mat4.translation(-3, 0, 3)).times(Mat4.scale(0.5,0.5,0.5));

        if (this.wind) {
            if (-2*wind_time > -7.85) {
                beachBall_transform = beachBall_transform.times(Mat4.translation(-2*wind_time, 0 , 0))
                beachBall_transform = beachBall_transform.times(Mat4.rotation(2*wind_time, 0, 0, 1))
                this.ball_roll = 2*wind_time
            } else {
                beachBall_transform = beachBall_transform.times(Mat4.translation(-7.85, 0 , 0))
                beachBall_transform = beachBall_transform.times(Mat4.rotation(this.ball_roll, 0, 0, 1))
            }
        }

        if (this.night) {
            this.shapes.beachBall.draw(context, program_state, beachBall_transform, shadow_pass? this.materials.shadow_text_Ball.override({ambient : 0.2}) : this.pure);
        } else {
            if (this.rain) {
                this.shapes.beachBall.draw(context, program_state, beachBall_transform, shadow_pass? this.materials.shadow_text_Ball.override({ambient : 0.35}) : this.pure);
            } else {
                this.shapes.beachBall.draw(context, program_state, beachBall_transform, shadow_pass? this.materials.shadow_text_Ball : this.pure);
            }
        }

        //Umbrella
        let umbrella_movement = 0.5*(Math.sin(wind_time)) + 1
        let umbrella_transform = Mat4.identity()
        umbrella_transform = umbrella_transform.times(Mat4.scale(0.9, 0.9, 0.9)).times(Mat4.rotation(-Math.PI/2, 1,0, 0)).times(Mat4.translation(-12, -3, 3.35))
        umbrella_transform = umbrella_transform.times(Mat4.translation(0, 0, -4))
        if (this.wind) {
            umbrella_transform = umbrella_transform.times(Mat4.rotation(-umbrella_movement*(Math.PI/16), 0, 1, 0))
        } else {
            umbrella_transform = umbrella_transform.times(Mat4.rotation(-(Math.PI/16), 0, 1, 0))
        }

        umbrella_transform = umbrella_transform.times(Mat4.translation(0, 0, 4))
        if (this.night) {
            this.shapes.umbrella.draw(context, program_state, umbrella_transform, shadow_pass? this.materials.shadow_umbrella_mat.override({ambient : 0.2}) : this.pure);
        } else {
            if (this.rain) {
                this.shapes.umbrella.draw(context, program_state, umbrella_transform, shadow_pass? this.materials.shadow_umbrella_mat.override({ambient : 0.35}) : this.pure);
            } else {
                this.shapes.umbrella.draw(context, program_state, umbrella_transform, shadow_pass? this.materials.shadow_umbrella_mat: this.pure);
            }
        }


        //Cloud
        if (this.wind) {
            //moving clouds
            this.cloud1_pos = this.move_clouds(-13-this.wind_cloud_time)
            this.cloud2_pos = this.move_clouds(-6.5-this.wind_cloud_time)
            this.cloud3_pos = this.move_clouds(-1-this.wind_cloud_time)
            this.cloud4_pos = this.move_clouds(3.5-this.wind_cloud_time)
            this.cloud5_pos = this.move_clouds(9-this.wind_cloud_time)
            this.cloud6_pos = this.move_clouds(15-this.wind_cloud_time)
            this.cloud7_pos = this.move_clouds(-15-this.wind_cloud_time)
            this.cloud8_pos = this.move_clouds(-9.75-this.wind_cloud_time)
            this.cloud9_pos = this.move_clouds(-3.75-this.wind_cloud_time)
            this.cloud10_pos = this.move_clouds(1-this.wind_cloud_time)
            this.cloud11_pos = this.move_clouds(6.25-this.wind_cloud_time)
            this.cloud12_pos = this.move_clouds(11.5-this.wind_cloud_time)
        }
        let cloud_transform = Mat4.identity();
        cloud_transform = cloud_transform.times(Mat4.translation(this.cloud1_pos, 5.5, 0)).times(Mat4.scale(1.2, 1.2, 1.2))

        let cloud_transform1 = Mat4.identity();
        cloud_transform1 = cloud_transform1.times(Mat4.translation(this.cloud2_pos, 5.5, 0)).times(Mat4.scale(1.2, 1.2, 1.2))

        let cloud_transform2 = Mat4.identity();
        cloud_transform2 = cloud_transform2.times(Mat4.translation(this.cloud3_pos, 5.5, 0)).times(Mat4.scale(1.2, 1.2, 1.2))

        let cloud_transform3 = Mat4.identity();
        cloud_transform3 = cloud_transform3.times(Mat4.translation(this.cloud4_pos, 5.5, 0)).times(Mat4.scale(1.2, 1.2, 1.2))

        let cloud_transform4 = Mat4.identity();
        cloud_transform4 = cloud_transform4.times(Mat4.translation(this.cloud5_pos, 5.5, 0)).times(Mat4.scale(1.2, 1.2, 1.2))

        let cloud_transform5 = Mat4.identity();
        cloud_transform5 = cloud_transform5.times(Mat4.translation(this.cloud6_pos, 5.5, 0)).times(Mat4.scale(1.2, 1.2, 1.2))

        let cloud_transform6 = Mat4.identity();
        cloud_transform6 = cloud_transform6.times(Mat4.translation(this.cloud7_pos, 5.5, 0)).times(Mat4.scale(1.2, 1.2, 1.2))

        let cloud_transform7 = Mat4.identity();
        cloud_transform7 = cloud_transform7.times(Mat4.translation(this.cloud8_pos, 5.5, 0)).times(Mat4.scale(1.2, 1.2, 1.2))
        let cloud_transform8 = Mat4.identity();
        cloud_transform8 = cloud_transform8.times(Mat4.translation(this.cloud9_pos, 5.5, 0)).times(Mat4.scale(1.2, 1.2, 1.2))

        let cloud_transform9 = Mat4.identity();
        cloud_transform9 = cloud_transform9.times(Mat4.translation(this.cloud10_pos, 5.5, 0)).times(Mat4.scale(1.2, 1.2, 1.2))

        let cloud_transform10 = Mat4.identity();
        cloud_transform10 = cloud_transform10.times(Mat4.translation(this.cloud11_pos, 5.5, 0)).times(Mat4.scale(1.2, 1.2, 1.2))

        let cloud_transform11 = Mat4.identity();
        cloud_transform11 = cloud_transform11.times(Mat4.translation(this.cloud12_pos, 5.5, 0)).times(Mat4.scale(1.2, 1.2, 1.2))
        if (this.rain) {
            if (this.night) {
                this.shapes.cloud2.draw(context, program_state, cloud_transform, shadow_pass? this.materials.shadow_rain_cloud_mat.override({ambient : 0.2}) : this.pure);
                this.shapes.cloud1.draw(context, program_state, cloud_transform1, shadow_pass? this.materials.shadow_rain_cloud_mat.override({ambient : 0.2}) : this.pure);
                this.shapes.cloud2.draw(context, program_state, cloud_transform2, shadow_pass? this.materials.shadow_rain_cloud_mat.override({ambient : 0.2}) : this.pure);
                this.shapes.cloud1.draw(context, program_state, cloud_transform3, shadow_pass? this.materials.shadow_rain_cloud_mat.override({ambient : 0.2}) : this.pure);
                this.shapes.cloud2.draw(context, program_state, cloud_transform4, shadow_pass? this.materials.shadow_rain_cloud_mat.override({ambient : 0.2}) : this.pure);
                this.shapes.cloud1.draw(context, program_state, cloud_transform5, shadow_pass? this.materials.shadow_rain_cloud_mat.override({ambient : 0.2}) : this.pure);
                this.shapes.cloud2.draw(context, program_state, cloud_transform6, shadow_pass? this.materials.shadow_rain_cloud_mat.override({ambient : 0.2}) : this.pure);
                this.shapes.cloud1.draw(context, program_state, cloud_transform7, shadow_pass? this.materials.shadow_rain_cloud_mat.override({ambient : 0.2}) : this.pure);
                this.shapes.cloud2.draw(context, program_state, cloud_transform8, shadow_pass? this.materials.shadow_rain_cloud_mat.override({ambient : 0.2}) : this.pure);
                this.shapes.cloud1.draw(context, program_state, cloud_transform9, shadow_pass? this.materials.shadow_rain_cloud_mat.override({ambient : 0.2}) : this.pure);
                this.shapes.cloud2.draw(context, program_state, cloud_transform10, shadow_pass? this.materials.shadow_rain_cloud_mat.override({ambient : 0.2}) : this.pure);
                this.shapes.cloud1.draw(context, program_state, cloud_transform11, shadow_pass? this.materials.shadow_rain_cloud_mat.override({ambient : 0.2}) : this.pure);
            } else {
                this.shapes.cloud2.draw(context, program_state, cloud_transform, shadow_pass? this.materials.shadow_rain_cloud_mat : this.pure);
                this.shapes.cloud1.draw(context, program_state, cloud_transform1, shadow_pass? this.materials.shadow_rain_cloud_mat : this.pure);
                this.shapes.cloud2.draw(context, program_state, cloud_transform2, shadow_pass? this.materials.shadow_rain_cloud_mat : this.pure);
                this.shapes.cloud1.draw(context, program_state, cloud_transform3, shadow_pass? this.materials.shadow_rain_cloud_mat : this.pure);
                this.shapes.cloud2.draw(context, program_state, cloud_transform4, shadow_pass? this.materials.shadow_rain_cloud_mat : this.pure);
                this.shapes.cloud1.draw(context, program_state, cloud_transform5, shadow_pass? this.materials.shadow_rain_cloud_mat : this.pure);
                this.shapes.cloud2.draw(context, program_state, cloud_transform6, shadow_pass? this.materials.shadow_rain_cloud_mat : this.pure);
                this.shapes.cloud1.draw(context, program_state, cloud_transform7, shadow_pass? this.materials.shadow_rain_cloud_mat : this.pure);
                this.shapes.cloud2.draw(context, program_state, cloud_transform8, shadow_pass? this.materials.shadow_rain_cloud_mat : this.pure);
                this.shapes.cloud1.draw(context, program_state, cloud_transform9, shadow_pass? this.materials.shadow_rain_cloud_mat : this.pure);
                this.shapes.cloud2.draw(context, program_state, cloud_transform10, shadow_pass? this.materials.shadow_rain_cloud_mat : this.pure);
                this.shapes.cloud1.draw(context, program_state, cloud_transform11, shadow_pass? this.materials.shadow_rain_cloud_mat : this.pure);
            }
        }
        else {
            if (this.night) {
                this.shapes.cloud2.draw(context, program_state, cloud_transform, shadow_pass? this.materials.shadow_cloud_mat.override({ambient : 0.2}) : this.pure);
                this.shapes.cloud1.draw(context, program_state, cloud_transform1, shadow_pass? this.materials.shadow_cloud_mat.override({ambient : 0.2}) : this.pure);
                this.shapes.cloud2.draw(context, program_state, cloud_transform2, shadow_pass? this.materials.shadow_cloud_mat.override({ambient : 0.2}) : this.pure);
                this.shapes.cloud1.draw(context, program_state, cloud_transform3, shadow_pass? this.materials.shadow_cloud_mat.override({ambient : 0.2}) : this.pure);
                this.shapes.cloud2.draw(context, program_state, cloud_transform4, shadow_pass? this.materials.shadow_cloud_mat.override({ambient : 0.2}) : this.pure);
                this.shapes.cloud1.draw(context, program_state, cloud_transform5, shadow_pass? this.materials.shadow_cloud_mat.override({ambient : 0.2}) : this.pure);
            } else {
                this.shapes.cloud2.draw(context, program_state, cloud_transform, shadow_pass? this.materials.shadow_cloud_mat : this.pure);
                this.shapes.cloud1.draw(context, program_state, cloud_transform1,shadow_pass? this.materials.shadow_cloud_mat : this.pure);
                this.shapes.cloud2.draw(context, program_state, cloud_transform2, shadow_pass? this.materials.shadow_cloud_mat : this.pure);
                this.shapes.cloud1.draw(context, program_state, cloud_transform3, shadow_pass? this.materials.shadow_cloud_mat : this.pure);
                this.shapes.cloud2.draw(context, program_state, cloud_transform4, shadow_pass? this.materials.shadow_cloud_mat : this.pure);
                this.shapes.cloud1.draw(context, program_state, cloud_transform5, shadow_pass? this.materials.shadow_cloud_mat : this.pure);
            }
        }

        if (this.rain) {
            let rain_t = Mat4.identity()
            rain_t = rain_t.times(Mat4.scale(0.05, 0.3, 0.05)).times(Mat4.translation(-330, this.move_rain(7-(12*t)), 0))
            this.shapes.cube.draw(context, program_state, rain_t, this.materials.rain)
            let rain_t1 = Mat4.identity().times(Mat4.scale(0.05, 0.3, 0.05)).times(Mat4.translation(-330, this.move_rain(1-(12*t)), 0))
            this.shapes.cube.draw(context, program_state, rain_t1, this.materials.rain)
            let rain_t2 = Mat4.identity().times(Mat4.scale(0.05, 0.3, 0.05)).times(Mat4.translation(-330, this.move_rain(13-(12*t)), 0))
            this.shapes.cube.draw(context, program_state, rain_t2, this.materials.rain)
            let rain_t3 = Mat4.identity()
            rain_t3 = rain_t3.times(Mat4.scale(0.05, 0.3, 0.05)).times(Mat4.translation(-315, this.move_rain(8-(12*t)), 0))
            this.shapes.cube.draw(context, program_state, rain_t3, this.materials.rain)
            let rain_t4 = Mat4.identity().times(Mat4.scale(0.05, 0.3, 0.05)).times(Mat4.translation(-315, this.move_rain(2-(12*t)), 0))
            this.shapes.cube.draw(context, program_state, rain_t4, this.materials.rain)
            let rain_t5 = Mat4.identity().times(Mat4.scale(0.05, 0.3, 0.05)).times(Mat4.translation(-315, this.move_rain(14-(12*t)), 0))
            this.shapes.cube.draw(context, program_state, rain_t5, this.materials.rain)
            let rain_t6 = Mat4.identity()
            rain_t6 = rain_t6.times(Mat4.scale(0.05, 0.3, 0.05)).times(Mat4.translation(-300, this.move_rain(9-(12*t)), 0))
            this.shapes.cube.draw(context, program_state, rain_t6, this.materials.rain)
            let rain_t7 = Mat4.identity().times(Mat4.scale(0.05, 0.3, 0.05)).times(Mat4.translation(-300, this.move_rain(3-(12*t)), 0))
            this.shapes.cube.draw(context, program_state, rain_t7, this.materials.rain)
            let rain_t8 = Mat4.identity().times(Mat4.scale(0.05, 0.3, 0.05)).times(Mat4.translation(-300, this.move_rain(15-(12*t)), 0))
            this.shapes.cube.draw(context, program_state, rain_t8, this.materials.rain)
            for (let i = 0; i < 15; i++) {
                rain_t = rain_t.times(Mat4.translation(45, 0, 0))
                rain_t1 = rain_t1.times(Mat4.translation(45, 0, 0))
                rain_t2 = rain_t2.times(Mat4.translation(45, 0, 0))
                rain_t3 = rain_t3.times(Mat4.translation(45, 0, 0))
                rain_t4 = rain_t4.times(Mat4.translation(45, 0, 0))
                rain_t5 = rain_t5.times(Mat4.translation(45, 0, 0))
                rain_t6 = rain_t6.times(Mat4.translation(45, 0, 0))
                rain_t7 = rain_t7.times(Mat4.translation(45, 0, 0))
                rain_t8 = rain_t8.times(Mat4.translation(45, 0, 0))
                this.shapes.cube.draw(context, program_state, rain_t, this.materials.rain)
                this.shapes.cube.draw(context, program_state, rain_t1, this.materials.rain)
                this.shapes.cube.draw(context, program_state, rain_t2, this.materials.rain)
                this.shapes.cube.draw(context, program_state, rain_t3, this.materials.rain)
                this.shapes.cube.draw(context, program_state, rain_t4, this.materials.rain)
                this.shapes.cube.draw(context, program_state, rain_t5, this.materials.rain)
                this.shapes.cube.draw(context, program_state, rain_t6, this.materials.rain)
                this.shapes.cube.draw(context, program_state, rain_t7, this.materials.rain)
                this.shapes.cube.draw(context, program_state, rain_t8, this.materials.rain)
            }
        }

    }

    display(context, program_state) {
        const t = program_state.animation_time;
        const gl = context.context;

        if (!this.init_ok) {
            const ext = gl.getExtension('WEBGL_depth_texture');
            if (!ext) {
                return alert('need WEBGL_depth_texture');  // eslint-disable-line
            }
            this.texture_buffer_init(gl);

            this.init_ok = true;
        }

        //TODO: THIS TOO
        if (!context.scratchpad.controls) {
            this.children.push(context.scratchpad.controls = new defs.Movement_Controls());
            // Define the global camera and projection matrices, which are stored in program_state.
            /*
            program_state.set_camera(Mat4.look_at(
                vec3(0, 12, 12),
                vec3(0, 3, 0),
                vec3(0, 1, 0)
            )); // Locate the camera here
             */
            program_state.set_camera(Mat4.translation(1.33, -3.13, -20));
        }

        //TODO: THIS PART HERE!!!!
        // The position of the light --> declaring position of light
        let light_transform = Mat4.identity();

        this.light_position = Mat4.translation(0,10,0).times(vec4(1, -.5, 0, 1));

        if(!this.night)
        {
            this.light_color = color(1,1,0,1);
        }
        else
        {
            this.light_color = color(1,1,1,1);
        }
        program_state.lights = [new Light(this.light_position,this.light_color, 1000)];
        this.light_view_target = vec4(0, 0, 0, 1);
        this.light_field_of_view = 130 * Math.PI / 180; // 130 degree


        // Step 1: set the perspective and camera to the POV of light
        const light_view_mat = Mat4.look_at(
            vec3(this.light_position[0], this.light_position[1], this.light_position[2]),
            vec3(this.light_view_target[0], this.light_view_target[1], this.light_view_target[2]),
            vec3(0, 1, 0), // assume the light to target will have a up dir of +y, maybe need to change according to your case
        );
        const light_proj_mat = Mat4.perspective(this.light_field_of_view, 1, 0.5, 500);
        // Bind the Depth Texture Buffer
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.lightDepthFramebuffer);
        gl.viewport(0, 0, this.lightDepthTextureSize, this.lightDepthTextureSize);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        // Prepare uniforms
        program_state.light_view_mat = light_view_mat;
        program_state.light_proj_mat = light_proj_mat;
        program_state.light_tex_mat = light_proj_mat;
        program_state.view_mat = light_view_mat;
        program_state.projection_transform = light_proj_mat;
        this.render_scene(context, program_state, false,false, false);

        // Step 2: unbind, draw to the canvas
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        program_state.view_mat = program_state.camera_inverse;
        program_state.projection_transform = Mat4.perspective(Math.PI / 4, context.width / context.height, 0.5, 500);
        this.render_scene(context, program_state, true,true, true);

    }

}

