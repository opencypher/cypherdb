add_library(kuzu_storage_index
        OBJECT
        hash_index.cpp
        in_mem_hash_index.cpp
        index.cpp)

if(MSVC)
    target_compile_options(kuzu_storage_index PUBLIC "/bigobj")
endif()

set(ALL_OBJECT_FILES
        ${ALL_OBJECT_FILES} $<TARGET_OBJECTS:kuzu_storage_index>
        PARENT_SCOPE)
