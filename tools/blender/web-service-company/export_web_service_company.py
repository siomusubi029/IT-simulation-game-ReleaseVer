import bpy
from pathlib import Path


ROOT = Path(__file__).resolve().parents[3]
SOURCE_COLLECTION = "Web_Serbice_Company"
EXPORT_GLB = ROOT / "game" / "models" / "WebServiceCompany.glb"


def principled_node(mat):
    for node in mat.node_tree.nodes:
        if node.type == "BSDF_PRINCIPLED":
            return node
    return None


def set_input(node, name, value):
    socket = node.inputs.get(name)
    if socket is not None:
        socket.default_value = value


def material(name, color, roughness=0.68, metallic=0.0, emission=None, strength=0.0):
    mat = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    mat.use_nodes = True
    mat.use_backface_culling = True
    node = principled_node(mat)
    if node:
        set_input(node, "Base Color", color)
        set_input(node, "Roughness", roughness)
        set_input(node, "Metallic", metallic)
        if emission:
            set_input(node, "Emission Color", emission)
            set_input(node, "Emission Strength", strength)
    mat.diffuse_color = color
    return mat


MATS = {
    "wall": material("Game_WebService_Wall_Office_White_Grey", (0.84, 0.84, 0.81, 1), 0.9),
    "floor": material("Game_WebService_Floor_Neutral_Carpet", (0.55, 0.56, 0.54, 1), 0.92),
    "wood": material("Game_WebService_Desk_Muted_Wood", (0.45, 0.37, 0.25, 1), 0.74),
    "chair": material("Game_WebService_Chair_Charcoal", (0.06, 0.07, 0.08, 1), 0.76),
    "metal": material("Game_WebService_Matte_Metal", (0.20, 0.29, 0.32, 1), 0.68, 0.04),
    "device": material("Game_WebService_Device_Deep_Slate", (0.05, 0.12, 0.17, 1), 0.62, 0.05),
    "panel": material("Game_WebService_Device_Teal_Panel", (0.13, 0.27, 0.32, 1), 0.66, 0.03),
    "monitor_frame": material("Game_WebService_Monitor_Frame_Charcoal", (0.015, 0.022, 0.028, 1), 0.58, 0.02),
    "screen": material("Game_WebService_Screen_Black", (0.01, 0.015, 0.025, 1), 0.48),
    "cyan": material("Game_WebService_Cyan_Glow", (0.04, 0.48, 0.62, 1), 0.4, 0.0, (0.04, 0.75, 0.95, 1), 0.8),
    "green": material("Game_WebService_LED_Green", (0.18, 0.86, 0.36, 1), 0.36, 0.0, (0.18, 1.0, 0.36, 1), 0.9),
    "amber": material("Game_WebService_LED_Amber", (1.0, 0.62, 0.14, 1), 0.36, 0.0, (1.0, 0.56, 0.1, 1), 0.75),
}


def collection_objects_recursive(collection):
    objects = list(collection.objects)
    for child in collection.children:
        objects.extend(collection_objects_recursive(child))
    return objects


def normalized(name):
    return name.lower().replace(" ", "").replace("-", "_")


def pick_by_name(obj_name, mat_name=""):
    text = normalized(f"{obj_name} {mat_name}")
    if "floor" in text or "room_floor" in text:
        return MATS["floor"]
    if (
        "wall" in text
        or "roomshell" in text
        or "divider" in text
        or "partition" in text
        or "outer" in text
    ):
        return MATS["wall"]
    if "desk" in text or "table" in text or "counter" in text or "wood" in text:
        return MATS["wood"]
    if "chair" in text:
        return MATS["chair"]
    if (
        "screen_on" in text
        or "screen_glow" in text
        or "monitor_glow" in text
        or "holo" in text
        or "glow" in text
    ):
        return MATS["cyan"]
    if "monitor_base" in text or "monitor_neck" in text:
        return MATS["metal"]
    if "casing" in text or "bezel" in text or "screencasing" in text:
        return MATS["monitor_frame"]
    if "monitor_screen" in text or "screen_black" in text or "screen" in text:
        return MATS["screen"]
    if "led_green" in text:
        return MATS["green"]
    if "led" in text or "alert" in text:
        return MATS["amber"]
    if "frontpanel" in text or "panel" in text or "bay" in text or "port" in text:
        return MATS["panel"]
    if "base" in text or "neck" in text or "stand" in text or "leg" in text:
        return MATS["metal"]
    if (
        "server" in text
        or "database" in text
        or "db" in text
        or "api" in text
        or "cloud" in text
        or "cdn" in text
        or "queue" in text
        or "auth" in text
        or "container" in text
        or "cicd" in text
        or "dashboard" in text
        or "developer" in text
        or "payment" in text
        or "body" in text
        or "keyboard" in text
        or "mouse" in text
    ):
        return MATS["device"]
    return None


def recolor_objects(objects):
    changed = 0
    for obj in objects:
        if obj.type != "MESH":
            continue
        if obj.data.materials:
            for index, mat in enumerate(list(obj.data.materials)):
                chosen = pick_by_name(obj.name, mat.name if mat else "")
                if chosen:
                    obj.data.materials[index] = chosen
                    changed += 1
        else:
            chosen = pick_by_name(obj.name)
            if chosen:
                obj.data.materials.append(chosen)
                changed += 1
    return changed


collection = bpy.data.collections.get(SOURCE_COLLECTION)
if collection is None:
    available = ", ".join(sorted(c.name for c in bpy.data.collections))
    raise RuntimeError(f"Collection not found: {SOURCE_COLLECTION}. Available: {available}")

bpy.ops.object.select_all(action="DESELECT")

objects = collection_objects_recursive(collection)
if not objects:
    raise RuntimeError(f"Collection has no exportable objects: {SOURCE_COLLECTION}")

changed = recolor_objects(objects)
EXPORT_GLB.parent.mkdir(parents=True, exist_ok=True)

for obj in objects:
    obj.select_set(True)

bpy.context.view_layer.objects.active = objects[0]

bpy.ops.export_scene.gltf(
    filepath=str(EXPORT_GLB),
    export_format="GLB",
    export_materials="EXPORT",
    use_selection=True,
)

print(f"Exported {SOURCE_COLLECTION} to {EXPORT_GLB}")
print(f"Selected objects: {len(objects)}")
print(f"Recolored material slots: {changed}")
