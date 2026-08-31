import bpy
from pathlib import Path


ROOT = Path(__file__).resolve().parents[3]
SOURCE_GLB = ROOT / "blender" / "sources" / "GeneralCompany_before_color.glb"
EXPORT_GLB = ROOT / "GeneralCompany.glb"
SOURCE_BLEND = ROOT / "blender" / "sources" / "PC.blend"
WIFI_ROOT_NAME = "WifiAP_Root.001"


def clear_scene():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete()


def principled_node(mat):
    for node in mat.node_tree.nodes:
        if node.type == "BSDF_PRINCIPLED":
            return node
    return None


def set_input(node, name, value):
    socket = node.inputs.get(name)
    if socket is not None:
        socket.default_value = value


def material(name, color, roughness=0.62, metallic=0.0, emission=None, strength=0.0):
    mat = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    mat.use_nodes = True
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


def load_blend_object_tree(filepath, root_name):
    with bpy.data.libraries.load(str(filepath), link=False) as (data_from, data_to):
        wanted = {root_name}
        for name in data_from.objects:
            if name.startswith("AP_") and name.endswith(".001"):
                wanted.add(name)
        data_to.objects = [name for name in data_from.objects if name in wanted]

    loaded = [obj for obj in data_to.objects if obj]
    for obj in loaded:
        if obj.name not in bpy.context.scene.objects:
            bpy.context.scene.collection.objects.link(obj)
    root = bpy.data.objects.get(root_name)
    if root:
        root.name = "WifiAP_Root"
    return loaded


MATS = {
    "wall": material("Office_Background_Tinted_Wall", (0.34, 0.43, 0.44, 1), 0.84),
    "floor": material("Office_Background_Tinted_Floor", (0.10, 0.31, 0.39, 1), 0.9),
    "wood": material("Office_Muted_Wood", (0.42, 0.35, 0.24, 1), 0.74),
    "chair": material("Office_Chair_Charcoal", (0.07, 0.08, 0.10, 1), 0.74),
    "metal": material("Office_Matte_Blue_Metal", (0.20, 0.30, 0.34, 1), 0.64, 0.04),
    "device": material("IT_Device_Deep_Slate", (0.06, 0.13, 0.18, 1), 0.6, 0.06),
    "panel": material("IT_Device_Teal_Panel", (0.13, 0.27, 0.32, 1), 0.62, 0.04),
    "light_device": material("IT_Muted_Light_Device", (0.36, 0.50, 0.52, 1), 0.72),
    "screen": material("IT_Screen_Black", (0.01, 0.015, 0.025, 1), 0.42),
    "screen_on": material("IT_Screen_Cyan_Glow", (0.04, 0.35, 0.50, 1), 0.35, 0.0, (0.04, 0.65, 0.88, 1), 0.95),
    "accent": material("IT_Cyan_Accent", (0.03, 0.62, 0.78, 1), 0.45, 0.0, (0.03, 0.42, 0.55, 1), 0.3),
    "led_green": material("IT_LED_Green", (0.18, 0.86, 0.36, 1), 0.35, 0.0, (0.18, 1.0, 0.36, 1), 0.9),
    "led_amber": material("IT_LED_Amber", (1.0, 0.58, 0.12, 1), 0.35, 0.0, (1.0, 0.52, 0.08, 1), 0.8),
}


SERVER_PREFIXES = (
    "Rack_", "FS_", "BkDev_", "Mail_", "VPN_", "DB_", "DCB_", "DCM_", "Storage_",
    "Router_", "Sw_", "Web_", "WA_", "API_", "Auth_", "ZT_", "LS_", "VS_",
)


def pick_material(obj_name):
    name = obj_name.lower()
    if name.startswith("wall_") or name.startswith("officeroomshell"):
        return MATS["wall"]
    if name.startswith("room_floor"):
        return MATS["floor"]
    if "desk_top" in name or "counter" in name or "table" in name:
        return MATS["wood"]
    if "desk_leg" in name or "stand" in name or "neck" in name or "base" in name:
        return MATS["metal"]
    if "chair" in name or name.startswith("ac_"):
        return MATS["chair"]
    if "screen_glow" in name or "mon_glow" in name:
        return MATS["screen_on"]
    if "screen" in name or "monitor" in name or "moncasing" in name or "bezel" in name:
        return MATS["screen"]
    if "keyboard" in name or "mouse" in name:
        return MATS["device"]
    if "led" in name:
        if "amber" in name:
            return MATS["led_amber"]
        return MATS["led_green"]
    if "accent" in name or "statusring" in name or "wifiarc" in name or "wifidot" in name:
        return MATS["accent"]
    if name.startswith("mfp_") or name.startswith("ap_"):
        return MATS["light_device"]
    if obj_name.startswith(SERVER_PREFIXES) or "server" in name or "rack" in name:
        if "frontpanel" in name or "bay" in name or "port" in name:
            return MATS["panel"]
        return MATS["device"]
    if "pc_tower" in name:
        return MATS["device"]
    if "panel" in name or "bay" in name or "port" in name:
        return MATS["panel"]
    if "body" in name or "casing" in name:
        return MATS["device"]
    return None


clear_scene()
bpy.ops.import_scene.gltf(filepath=str(SOURCE_GLB))
load_blend_object_tree(SOURCE_BLEND, WIFI_ROOT_NAME)

for obj in bpy.data.objects:
    if obj.type != "MESH":
        continue
    mat = pick_material(obj.name)
    if mat is None:
        continue
    obj.data.materials.clear()
    obj.data.materials.append(mat)

bpy.ops.export_scene.gltf(
    filepath=str(EXPORT_GLB),
    export_format="GLB",
    export_materials="EXPORT",
)

print(f"Colored existing office GLB: {EXPORT_GLB}")
