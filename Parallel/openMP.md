# OpenMP

## Why

- parallel pragraming 
  - is hard
  - is platform-dependent
- OpenMP
  - easy to use  (`#pragma`)
  - cross platform



## What

The OpenMP® API is a portable, scalable model that gives parallel programmers a simple and flexible interface for developing portable parallel applications in C/C++ and Fortran. OpenMP is suitable for a wide range of algorithms running on multicore nodes and chips, NUMA systems, GPUs, and other such devices attached to a CPU. 



- Directives and Constructs
  - Variant directives
  - Informational and utility directives
  - parallel construct
  - teams construct
  - masked construct
  - scope construct
  - Worksharing constructs
  - Worksharing-loop construct
  - SIMD directives and constructs
  - distribute loop constructs
  - loop construct
  - scan directive
  - Loop transformation constructs
  - Tasking constructs
  - Memory management directives
  - Device directives and construct
  - Interoperability construct
  - Combined constructs
  - Synchronization constructs
  - Cancellation constructs
  - Data environment directives
- Runtime Library Routines
  - Thread team routines
  - Device information routines
  - Teams region routines
  - Tasking routines
  - Resource relinquishing routines
  - Device information routines
  - Device memory routines
  - Timing routines
  - Event routine
  - Memory management routines
  - Tool control routine
  - Environment display routine



## How (Internal)

- `#pragma` pass to compiler
- [llvm openMP](https://github.com/llvm/llvm-project/tree/main/openmp)  



## How to use

### Install

```shell
sudo apt-get install libomp-dev
```

### Build with CMake

```cmake
find_package(OpenMP)
if(OpenMP_CXX_FOUND)
    target_link_libraries({MyTarget} PUBLIC OpenMP::OpenMP_CXX)
endif()
```

### simple example

```cpp
  #include <cmath>
  int main()
  {
    const int size = 256;
    double sinTable[size];
    
    #pragma omp parallel for
    for(int n=0; n<size; ++n)
      sinTable[n] = std::sin(2 * M_PI * n / size);
  
    // the table is now initialized
  }
```



## Reference

https://www.openmp.org/
https://www.openmp.org/resources/
https://github.com/llvm/llvm-project/tree/main/openmp
https://www.openmp.org/wp-content/uploads/OpenMPRefCard-5.1-web.pdf

