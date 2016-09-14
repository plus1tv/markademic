# VulkanToy - Porting ShaderToy to Vulkan

Let's build VulkanToy, a clone of [ShaderToy](http://shadertoy.com) that renders 2 triangles and applies a shader to it with a bunch of uniforms like resolution, time, etc.

## Vulkan Architecture

![Vulkan Logo](https://libcinder.org/static/images/notes/vulkan/Vulkan_Mar15.svg)

**Vulkan** was designed to interface directly with how GPUs normally work, pulling in ideas the Khronos Group learned from *Metal*, *OpenGL*, and *OpenCL*. It works on Windows, Linux, and Android with OSX and iOS coming soon.

Since it's a low level API, it gives you the freedom to integrate other technologies like multithreading, custom memory management algorithms, and building your own abstractions. 

### History

**OpenGL** was first released in 1992 and at the time featured a fixed pipeline of functions to control things. It wasn't until 2001 that the Nvidia Geforce 3 brought programmable GPUs (but back then they could only support programs of 12 instructions or less[^moller2008]). At 2002, DirectX 9 brought fully programmable shaders along with the High Level Shader Language **HLSL**. Soon after, OpenGL 2.0 was released which offered the same features along with **GLSL**, their shader language.

Thus after 24 years of using an API with outdated features, Vulkan was born from the Work Valve and AMD did on the Mantle API, and is seeing adoption across all areas of industry. 

## Graphics Fundamentals

Fundamentally, a Graphics Renderer is responsible for managing sets of arbitrary *data*, such as arrays of tuples of **position**, **normal**, and/or **color** information encoded in *any arbitrary way*, processing that data with some sort of function(s) on the GPU, and outputting some data, such as raster images (frames) to be displayed on the window(s).

\[Renderer(data, Kernel) \rightarrow Kernel(data)\]

**Kernels** - programs that execute on the graphics card. Synonymous with **Function** or **Shader**.

The GPU has a lot of bandwidth but also a lot of latency, which means you need to send a lot of `data` and `kernels` at the same time, since it's designed to process big sets of data. This data would be encoded really tightly for efficiency, and the kernels would be queued so as to processes them immediately after another is finished. 

```js
// Data would be encoded
var arr = [
//  (  position )  (    color    )   ( normal )    (and anything else you want)
    0.5, 0.5, 0.5, 0.333, 0.1, 0.4, 1.0, 0.0, 0.0,
    0.1, 0.0, 0.0, 0.333, 0.1, 0.4, 1.0, 0.0, 0.0,
    // ...
]
```

### Execution Model

![Execution Model]()

In Vulkan, everything starts when you have an object **vk::Instance**. From there you can get access to physical devices, load layers that can handle things like debugging, and set some global states. 

Like *OpenCL*, Vulkan lets you set up devices, which can create queues of that can handle pools of kernels, but each queue can now belong to a family denoting its type. 

- Graphics
- Compute
- Transfer
- Sparse Memory Management

Device queues take groups of kernels called **command buffers** that can do things like: 

- **Action Commands** - Draw triangles, clear surface, modify framebuffers, etc.
- **Set State** - set global states like binding pipelines.
- **Synchronization** - Use mutexes, semephores, monads/promises for more control over concurency. 

Devices can create **memory heaps** that are *device local*, *device local, host visible*, and *device local*. 

For more details check out the Vulkan Specification[^vulkanspec] or the book Vulkan Essentials[^singh2016]. 

## VulkanToy - Setup

First thing you'll need to do is install Vulkan, you can do this with the [Conan Package Manager](http://conan.io/). If you're familiar with `npm` or `pip` it's the same idea.

Then run the following in the command line.

```bash
conan install glm/0.9.8.0@TimSimpson/testing --build --save
conan install glfw/3.2@GavinNL/testing --build --save
conan install vulkan-sdk/1.0.21.0@alaingalvan/testing --build --save
conan install vulkan-hpp/1.0.21.0@alaingalvan/testing --build --save
```

We'll be using `vulkan.hpp` for the majority of our code, since it is more intuitive then the c implementation of Vulkan and has some nice things like not having to worry too much about allocation (thanks to RAII) and type checks.

##  Our Abstraction

Our abstraction will build off the **Entity-Component System** adopted by game engines like Unreal, Unity, Game Maker, etc. combining that with functional views. 

> Every view can be described as `(props, state) => NodeFunction | void`. 

A pretty standard configuration, and seems easy to expand too. What we need to do is:

1. Create our Vulkan instance.

2. Attach all the layers available to us since this is a debugging setup.

3. Create a Window to attach our Vulkan Instance to.

4. Get the physical devices we have access to on this machine and use the best one.

5. Setup queues that we'll be sending command buffers to. 

6. Setup some data (In this case 2 triangles).

7. Create a shader and compile it.

8. Create a kernel to render the quad with the shader.


#### Create your Vulkan Instance

Here's a simple program that just exposes a Vulkan instance, not much but it's a start!

```cpp
// Let's define exactly what our instance will consist of...
auto appInfo = vk::ApplicationInfo("VulkanToy", 0, "VulkanToy", VK_API_VERSION_1_0, VK_API_VERSION_1_0);
auto instanceInfo = vk::InstanceCreateInfo();

// Init Extension/Validation layers
int extensionLayerCount = 2;
const char * extensionLayerNames[] = {
  "VK_KHR_surface",
  "VK_KHR_win32_surface"
};

int validationLayerCount = 1;
const char *validationLayerNames[] =
{
  // This is a meta layer that enables all of the standard
  // validation layers in the correct order :
  // threading, parameter_validation, device_limits, object_tracker, image, core_validation, swapchain, and unique_objects
  "VK_LAYER_LUNARG_standard_validation"
};

instanceInfo.setPApplicationInfo(&appInfo);
instanceInfo.enabledExtensionCount = extensionLayerCount;
instanceInfo.ppEnabledExtensionNames = extensionLayerNames;
instanceInfo.enabledLayerCount = validationLayerCount;
instanceInfo.ppEnabledLayerNames = validationLayerNames;

auto instance = vk::createInstance(instanceInfo);

// ...
```

So one possible abstraction on top of this is a function can pull the application info from some config.hpp file, automatically determine what layers should be added to the instance according to that same config file.

#### Create your Devices

```cpp
// Now that we have our instance:

// Init Device Extension/Validation layers
int deviceExtensionLayerCount = 1;
const char * deviceExtensionLayerNames[] = {
  "VK_KHR_swapchain"
};

int deviceValidationLayerCount = 1;
const char *deviceValidationLayerNames[] =
{
  "VK_LAYER_LUNARG_standard_validation"
};

auto deviceInfo = vk::DeviceCreateInfo();
deviceInfo.enabledExtensionCount = extensionLayerCount;
deviceInfo.ppEnabledExtensionNames = extensionLayerNames;
deviceInfo.enabledLayerCount = validationLayerCount;
deviceInfo.ppEnabledLayerNames = validationLayerNames;

auto device = gpu.createDevice(deviceInfo);

```