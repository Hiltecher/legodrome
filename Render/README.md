## Inspiration

Attached are sketches and inspiration pictures we used to come up with our diorama.

<img src="../Snapshots/insp1.png"   width="400"/>
<img src="../Snapshots/insp2.png"   width="400"/>
<img src="../Snapshots/insp3.png"   width="400"/>
<img src="../Snapshots/insp4.png"   width="400"/>
<img src="../Snapshots/insp5.png"   width="400"/>
<img src="../Snapshots/insp6.png"   width="400"/>

## Complete Formula 1 Lego Car with driver (by Ivan)

Every race track needs a race car and as we are following a lego brick theme I wanted to design the car out of Lego bricks.

Created a single lego piece to be used later in constructing the lego car.

<img src="../Snapshots/legobrick.png"   width="400"/>

Used a reference model of the F1 car to test out how geometry nodes work with individual lego pieces.

<img src="../Snapshots/referencecar.png"   width="400"/>

After using geometry nodes tutorial was able to create a nodes structure to work with lego pieces.

<img src="../Snapshots/geometrynodes.png"   width="400"/>

First prototype of F1 Lego car using the reference model.

<img src="../Snapshots/prototype.png"   width="400"/>

Combined materials and geometry nodes to paint lego pieces on the prototype model.
<img src="../Snapshots/paintedprototype.png"   width="400"/>

After learning how geometry nodes interact with models to transfer mesh into inidividual lego pieces, I started on my own model of F1 car

<img src="../Snapshots/model1.png"  width="400"/>

Incremental work on how my model of F1 car came about:

<img src="../Snapshots/model2.png" width="400"/>
<img src="../Snapshots/model3.png" width="400"/>

Used mirror modifier to mirror one side of the car and have both sides identical and symmetrical

<img src="../Snapshots/model4.png" width="400"/>
<img src="../Snapshots/model5.png" width="400"/>
<img src="../Snapshots/model6.png" width="400"/>
<img src="../Snapshots/model7.png" width="400"/>
<img src="../Snapshots/model8.png" width="400"/>
<img src="../Snapshots/model9.png" width="400"/>
<img src="../Snapshots/model10.png" width="400"/>

F1 model of the car is done

<img src="../Snapshots/model11.png" width="400"/>

Applying geometry node Lego setup to the model I created

<img src="../Snapshots/model12.png" width="400"/>

Fixing model to have Lego geometry node setup properly displaying each aspect of the car
<img src="../Snapshots/model13.png" width="400"/>
<img src="../Snapshots/model14.png" width="400"/>
<img src="../Snapshots/model15.png" width="400"/>

Moving onto creating UV map of the car to start painting process

<img src="../Snapshots/model16.png" width="400"/>

Painted the car black for now and imported minifig object (design for this seen later in the doc) to fit into the car

<img src="../Snapshots/model17.png" width="400"/>

Created model for the steering wheel and fit into the car into the hands of the driver

<img src="../Snapshots/model18.png" width="400"/>

Made helmet for the driver

<img src="../Snapshots/model19.png" width="400"/>

Moved on to the tyres, used a reference image to get the appropriate shape

<img src="../Snapshots/tyre1.png" width="400"/>

After getting the correct dimensions, moved on to modelling the complete tyre

<img src="../Snapshots/tyre2.png" width="400"/>
<img src="../Snapshots/tyre3.png" width="400"/>

Used mirror modifier to give the tyre folume and smoothed rough edges to give the impression of it being inflated

<img src="../Snapshots/tyre4.png" width="400"/>
<img src="../Snapshots/tyre5.png" width="400"/>

Made my own texture in Photoshop for the tyres before applying it in blender

<img src="../Snapshots/tyretexture.png" width="400"/>

Applied the texture I made onto the tyre

<img src="../Snapshots/tyre6.png" width="400"/>

Creating wheel hubs for tyre to fit onto

<img src="../Snapshots/tyre7.png" width="400"/>
<img src="../Snapshots/tyre8.png" width="400"/>

Painted the wheel hubs 

<img src="../Snapshots/tyre9.png" width="400"/>

Fit the tyres onto the car

<img src="../Snapshots/model20.png" width="400"/>
<img src="../Snapshots/tyre5.png" width="400"/>

Made my own texture in Photoshop for the helmet before applying it in blender

<img src="../Snapshots/helmet1.png" width="400"/>

Applied the texture I made onto the helmet

<img src="../Snapshots/helmet2.png" width="400"/>

Fixing the UV map of the car for it to work with lego pieces before starting to paint the car with special livery

<img src="../Snapshots/model21.png" width="400"/>

Applying the UV Map of the special livery in proper colors and transforming model to legos using geometry nodes

<img src="../Snapshots/model22.png" width="400"/>

Final model of the car is complete

<img src="../Snapshots/model23.png" width="400"/>

## Minifig (By Mano)

As we are following a lego theme, I sought to design minifigs so that one could be our driver and the rest spectators.

Following a tutorial and some reference images I begun my modelling of the minifigure with the torso, making subdivisions and moving in the edges, then adding bevel

<img src="../Snapshots/Minifig1.png" width="400"/>

I then created the waist which was just a simple stretched cube, and then created the leg holder out of a cylinder. I cut a gap out of the waist using the cylinder before shaping it down to its intended size

<img src="../Snapshots/Minifig2.png" width="400"/>

I then created the leg by cloning the leg holder, stretching it to intended size and then extruding the faces at the bottom. After some cleanup, a bit of bevel and removal of unneeded edges, this was the result:

<img src="../Snapshots/Minifig3.png" width="400"/>
<img src="../Snapshots/Minifig4.png" width="400"/>

I used a mirror modifier for the other leg before working on the head. Another cylinder, I first used bevel with more cuts for a smoother shape before insetting the top and bottom faces of the head to extrude the top stud and the bottom joining stud.

<img src="../Snapshots/Minifig5.png" width="400"/>

The arms were the most difficult part. I used edge loops to begin shaping out the arm via ref image before filling all the vertices.

<img src="../Snapshots/MinifigE.png" width="400"/>

I then used a sphere which I cut the bottom of and attached to the arm as a shoulder, before using another cylinder of which I removed the caps and used the solidify modifier to give it a lego cup hand shape. I then extruded faces behind the hand to join it to the arm. After this I used the mirror modifier to give the minifig its other arm as well.

<img src="../Snapshots/Minifig6.png" width="400"/>

Lastly I added materials and designed a texture for the face.

<img src="../Snapshots/Minifig7.png" width="400"/>

## Stopwatch (by Mano)

It is a common hobby to log your own laptimes while at the racetrack, so I decided to make a simple stopwatch model.

Using a tutorial and SVG reference image I begun work by designing the body of the stopwatch. This was done by adding a cylinder and then modelling the front variety of loop cuts, insets and extrusions. As well as some mandatory bevel for a smooth finish.

<img src="../Snapshots/Watch1.png" width="400"/>

I then quickly made the buttons by joining cylinders together and giving them bevel.

<img src="../Snapshots/Watch2.png" width="400"/>

The top button followed a similar design but was made larger, had a torus object and extruded every 2nd face inwards to give the button a grip.

<img src="../Snapshots/Watch3.png" width="400"/>
<img src="../Snapshots/Watch4.png" width="400"/>

I then gave materials to the watch, a shiny metallic finish on the outside and a matte white finish for the watch face.

<img src="../Snapshots/Watch5.png" width="400"/>

I then used the watch face from the SVG reference image and put it into blender as a curve object before converting it into a mesh object.

<img src="../Snapshots/Watch6.png" width="400"/>

I then modelled the needle seperately as this will be used for animation. The needle was made using a cylinder and a plane object which edges were squeezed towards the top to make it pointy.

<img src="../Snapshots/Watch7.png" width="400"/>



## F1 Track Version 1 (by Ivan)

First draft of F1 track to be made out of lego pieces

<img src="../Snapshots/track1.png" width="400"/>
<img src="../Snapshots/track2.png" width="400"/>
<img src="../Snapshots/track3.png" width="400"/>
<img src="../Snapshots/track4.png" width="400"/>

Creating UV map of the track to paint each piece with its own texture

<img src="../Snapshots/track5.png" width="400"/>
<img src="../Snapshots/track6.png" width="400"/>

Final F1 track out of lego

<img src="../Snapshots/track7.png" width="400"/>
<img src="../Snapshots/track8.png" width="400"/>

We ended up abandoning idea of F1 track out of legos in favour of a more realistic track in order to use a variety of textures and materials.

I created the custom texture for the realistic tarmac on the F1 track

<img src="../Snapshots/tarmac1.png" width="400"/>
<img src="../Snapshots/tarmac2.png" width="400"/>
<img src="../Snapshots/tarmac3.png" width="400"/>
<img src="../Snapshots/tarmac4.png" width="400"/>
<img src="../Snapshots/tarmac5.png" width="400"/>

## F1 Track Version 2 (by Mano)

Started by modelling out the track as a stretched cube. Used bevel vertex tool and loop cuts in order to map out a curve in a track. I extruded kerbs out of the track after marking them out with the knife tool.

<img src="../Snapshots/Baseplate1.png" width="400"/>

I then placed a grass texture off of ambientCG (textures I used from this website are under Creative Commons CC0 1.0 Universal License).

<img src="../Snapshots/Baseplate2.png" width="400"/>

To give the track more character I added a Rolex sponsor board. This was just a cube with a texture I designed myself using Photoshop.

<img src="../Snapshots/Baseplate3.png" width="400"/>

I then desided to make a jumbotron. The support was simply a cube with the wireframe and solidify operator to give it its look, I then layered multiple using the array modifier to create a pillar, before giving it a diamond plate texture.
The jumbotron was designed as a cube which I inset both faces to pop out the back and extrude the front.

<img src="../Snapshots/Baseplate4.png" width="400"/>

I then gave the TV a texture that I designed off photoshop.

<img src="../Snapshots/Baseplate5.png" width="400"/>

I then begun making the seating area. The chair was designed as a cube that I removed the front and top sides off, before solidifying and subdividing the faces in order to shape the seat.
I then raised a section of the ground and changed the material to concrete. I placed a wall which I gave a Emirates sponsor texture before arraying this wall to cover off the seating.
I then used array to make a ton of seats span the concrete section, and then sat a lego man down to check the scale.

<img src="../Snapshots/Baseplate6.png" width="400"/>

I then raised two walls to see how I would go about making the sides of the diorama. Since this was an outside environment I was a little stuck as to how to work with this requirement, but then decided to create the illusion of walls by creating objects to cover up these side walls and then remove the walls all together.

<img src="../Snapshots/Baseplate7.png" width="400"/>

First I made a set of minifigs doing different things in the stands. I gave one minifig the stopwatch object and gave another a phone object. The phone was created by making a cuboid, bevelling the edges and adding a cylinder on the back as a camera module.

<img src="../Snapshots/Baseplate8.png" width="400"/>

I then joined these minifigs together and used array modifier to place them across the seats.

<img src="../Snapshots/Baseplate9.png" width="400"/>

I then begun making a grandstand cover. This was achieved in a similar way to the seat - I removed front and bottom faces of the cube, subdivided the side faces and pushed the edges in to shape the cover. I then used solidify and bevel. The cover would also have the same support pillars as the jumbotron but for the roof. This grandstand cover would act as one of the side walls.

<img src="../Snapshots/Baseplate10.png" width="400"/>

I then decided to make the jumbotron even bigger so it could act as the other side wall. First I toggled visibility of all objects so I could work on the baseplate. I made some knife cuts and raised the grass section to make a hill.

<img src="../Snapshots/Baseplate11.png" width="400"/>

The Rolex sign would now need to be rearranged, so I made it smaller and used array to have multiple signs covering the slope of the hill.
I then resized my jumbotron and adjusted the textures and faces to accomodate this new size. I also provided the jumbotron with another support.

<img src="../Snapshots/Baseplate12.png" width="400"/>

I then added a bollard on the corner which was done by adding loop cuts to a cylinder, bevelling the top and then colouring it with orange and white accordingly.

<img src="../Snapshots/Baseplate13.png" width="400"/>

I wanted to add a sign to the stand cover, so I created a cube, made it a cuboid, brought in the bottom edges to create a wedge shape. I once again used the support pillar concept to suspend the sign from the roof and also worked on a cylinder wire to connect the sign to the sides, but as seen in our render we later scrapped this wire.

<img src="../Snapshots/Baseplate14.png" width="400"/>

Finally, I added a lightbox model which was modelled in a very similar fashion to the jumbotron. I used a small spotlight to make the lightbox appear to emit light, and I then added a point light to shine light on the track.
The lightbox was then mounted to the top of the jumbotron and mirrored so there was two.

<img src="../Snapshots/Baseplate15.png" width="400"/>
