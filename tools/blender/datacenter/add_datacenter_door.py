import bpy
from pathlib import Path


ROOT = Path(__file__).resolve().parents[3]
BLEND_PATH = ROOT / "blender" / "sources" / "PC.blend"
COLLECTION_NAME = "DataCenter_Root"
SOURCE_WALL_NAME = "Wall_Outer_South.002"
DOOR_PREFIX = "Door_Opening_South_DataCenter"


def box_geometry(bounds, start_index):
    min_x, max_x, min_y, max_y, min_z, max_z = bounds
    verts = [
        (min_x, min_y, min_z),
        (max_x, min_y, min_z),
        (max_x, max_y, min_z),
        (min_x, max_y, min_z),
        (min_x, min_y, max_z),
        (max_x, min_y, max_z),
        (max_x, max_y, max_z),
        (min_x, max_y, max_z),
    ]
    i = start_index
    faces = [
        (i + 0, i + 1, i + 2, i + 3),
        (i + 4, i + 7, i + 6, i + 5),
        (i + 0, i + 4, i + 5, i + 1),
        (i + 1, i + 5, i + 6, i + 2),
        (i + 2, i + 6, i + 7, i + 3),
        (i + 3, i + 7, i + 4, i + 0),
    ]
    return verts, faces


def make_u_wall_mesh(name, door_width, door_height, scale):
    local_door_width = door_width / max(abs(scale.x), 0.001)
    local_door_height = door_height / max(abs(scale.z), 0.001)
    half_door = local_door_width / 2
    door_top = -1 + local_door_height
    segments = [
        (-1, -half_door, -1, 1, -1, 1),
        (half_door, 1, -1, 1, -1, 1),
        (-half_door, half_door, -1, 1, door_top, 1),
    ]
    verts = []
    faces = []
    for bounds in segments:
        next_verts, next_faces = box_geometry(bounds, len(verts))
        verts.extend(next_verts)
        faces.extend(next_faces)
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    return mesh


collection = bpy.data.collections.get(COLLECTION_NAME)
if collection is None:
    raise RuntimeError(f"Collection not found: {COLLECTION_NAME}")

wall = bpy.data.objects.get(SOURCE_WALL_NAME)
if wall is None:
    existing_parts = [obj for obj in collection.objects if obj.name.startswith(DOOR_PREFIX)]
    if existing_parts:
        print(f"Door opening already exists: {len(existing_parts)} parts")
        bpy.ops.wm.save_as_mainfile(filepath=str(BLEND_PATH))
        raise SystemExit(0)
    raise RuntimeError(f"Wall not found: {SOURCE_WALL_NAME}")

wall_materials = list(wall.data.materials) if wall.type == "MESH" else []
size = wall.dimensions.copy()

door_width = min(6.0, float(size.x) * 0.18)
door_height = min(5.8, float(size.z) * 0.75)

for obj in list(bpy.data.objects):
    if obj.name.startswith(DOOR_PREFIX):
        bpy.data.objects.remove(obj, do_unlink=True)

old_mesh = wall.data
wall.data = make_u_wall_mesh(f"{SOURCE_WALL_NAME}_DoorCutMesh", door_width, door_height, wall.scale)
for mat in wall_materials:
    wall.data.materials.append(mat)
if old_mesh.users == 0:
    bpy.data.meshes.remove(old_mesh)
wall["door_opening_width"] = door_width
wall["door_opening_height"] = door_height
bpy.ops.wm.save_as_mainfile(filepath=str(BLEND_PATH))

print(f"Created door opening in {COLLECTION_NAME}: {door_width:.2f} x {door_height:.2f}")
