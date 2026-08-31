import bpy
from pathlib import Path


ROOT = Path(__file__).resolve().parents[3]
BLEND_PATH = ROOT / "blender" / "sources" / "GeneralCompany_colored.blend"


def principled_node(mat):
    for node in mat.node_tree.nodes:
        if node.type == "BSDF_PRINCIPLED":
            return node
    return None


def set_input(node, name, value):
    socket = node.inputs.get(name)
    if socket is not None:
        socket.default_value = value


def make_material(name, color, roughness=0.7, metallic=0.0, emission=None, strength=0.0):
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


MATS = {
    "wall": make_material("Realistic_Office_Warm_Grey_Wall", (0.68, 0.69, 0.66, 1), 0.88),
    "floor": make_material("Realistic_Office_Blue_Grey_Carpet", (0.24, 0.32, 0.37, 1), 0.94),
    "wood": make_material("Realistic_Office_Light_Oak_Desk", (0.56, 0.43, 0.27, 1), 0.72),
    "chair": make_material("Realistic_Office_Black_Fabric_Chair", (0.035, 0.037, 0.04, 1), 0.82),
    "metal": make_material("Realistic_Office_Brushed_Dark_Metal", (0.24, 0.27, 0.28, 1), 0.62, 0.12),
    "device": make_material("Realistic_IT_Black_Plastic_Device", (0.025, 0.03, 0.035, 1), 0.58, 0.03),
    "panel": make_material("Realistic_IT_Dark_Grey_Panel", (0.12, 0.14, 0.15, 1), 0.64, 0.04),
    "light_device": make_material("Realistic_IT_Off_White_Device", (0.72, 0.73, 0.70, 1), 0.8),
    "screen": make_material("Realistic_IT_Glass_Black_Screen", (0.005, 0.007, 0.01, 1), 0.32, 0.02),
    "cyan": make_material("Realistic_IT_Soft_Screen_Glow", (0.12, 0.42, 0.50, 1), 0.36, 0.0, (0.10, 0.58, 0.70, 1), 0.45),
    "green": make_material("Realistic_IT_Small_Green_LED", (0.14, 0.78, 0.25, 1), 0.34, 0.0, (0.12, 0.9, 0.24, 1), 0.65),
    "amber": make_material("Realistic_IT_Small_Amber_LED", (0.95, 0.54, 0.12, 1), 0.34, 0.0, (0.95, 0.46, 0.08, 1), 0.55),
}


def text_key(*parts):
    return " ".join(parts).lower().replace("-", "_")


def choose_material(obj_name, mat_name=""):
    text = text_key(obj_name, mat_name)
    if "room_floor" in text or "floor" in text:
        return MATS["floor"]
    if text.startswith("wall_") or "wall" in text or "officeroomshell" in text:
        return MATS["wall"]
    if "desk_wood" in text or "desk_top" in text or "table" in text or "counter" in text:
        return MATS["wood"]
    if "chair" in text:
        return MATS["chair"]
    if (
        "screen_on" in text
        or "screen_glow" in text
        or "screenglow" in text
        or "monitor_glow" in text
        or "monitor_screen" in text
        or "monglow" in text
        or "holo" in text
    ):
        return MATS["cyan"]
    if "screen_black" in text or "screen" in text or "monitor" in text or "moncasing" in text:
        return MATS["screen"]
    if "led_green" in text:
        return MATS["green"]
    if "led_amber" in text:
        return MATS["amber"]
    if "led_blue" in text or "accent_blue" in text or "wifiarc" in text or "wifidot" in text or "statusring" in text:
        return MATS["cyan"]
    if "panel_grey" in text or "frontpanel" in text or "bay" in text or "port" in text:
        return MATS["panel"]
    if "mfp_" in text or "ap_" in text:
        return MATS["light_device"]
    if (
        "rack_" in text
        or "server" in text
        or "vpn" in text
        or "backup" in text
        or "body_darkgrey" in text
        or "pc_tower" in text
        or "keyboard" in text
        or "mouse" in text
    ):
        return MATS["device"]
    if "stand" in text or "neck" in text or "base" in text or "leg" in text:
        return MATS["metal"]
    return None


changed = 0
for obj in bpy.data.objects:
    if obj.type != "MESH":
        continue
    if obj.data.materials:
        for index, existing in enumerate(list(obj.data.materials)):
            chosen = choose_material(obj.name, existing.name if existing else "")
            if chosen:
                obj.data.materials[index] = chosen
                changed += 1
    else:
        chosen = choose_material(obj.name)
        if chosen:
            obj.data.materials.append(chosen)
            changed += 1

bpy.context.preferences.filepaths.save_version = 0
bpy.ops.wm.save_as_mainfile(filepath=str(BLEND_PATH))

print(f"Colored material slots: {changed}")
print(f"Saved blend only: {BLEND_PATH}")
