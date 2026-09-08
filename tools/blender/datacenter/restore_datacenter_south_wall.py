import bpy
from pathlib import Path


ROOT = Path(__file__).resolve().parents[3]
BLEND_PATH = ROOT / "blender" / "sources" / "PC.blend"
WALL_NAME = "Wall_Outer_South.002"


def make_cube_mesh(name):
    verts = [
        (-1, -1, -1),
        (1, -1, -1),
        (1, 1, -1),
        (-1, 1, -1),
        (-1, -1, 1),
        (1, -1, 1),
        (1, 1, 1),
        (-1, 1, 1),
    ]
    faces = [
        (0, 1, 2, 3),
        (4, 7, 6, 5),
        (0, 4, 5, 1),
        (1, 5, 6, 2),
        (2, 6, 7, 3),
        (3, 7, 4, 0),
    ]
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    return mesh


wall = bpy.data.objects.get(WALL_NAME)
if wall is None:
    raise RuntimeError(f"Wall not found: {WALL_NAME}")

materials = list(wall.data.materials) if wall.type == "MESH" else []
old_mesh = wall.data
wall.data = make_cube_mesh("Wall_Outer_South.002_SolidMesh")
for mat in materials:
    wall.data.materials.append(mat)

for key in ["door_opening_width", "door_opening_height"]:
    if key in wall:
        del wall[key]

if old_mesh.users == 0:
    bpy.data.meshes.remove(old_mesh)

bpy.ops.wm.save_as_mainfile(filepath=str(BLEND_PATH))

print(f"Restored solid wall: {WALL_NAME}")
