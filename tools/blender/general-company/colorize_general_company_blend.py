import bpy
from pathlib import Path


ROOT = Path(__file__).resolve().parents[3]
BLEND_PATH = ROOT / "blender" / "sources" / "GeneralCompany_colored.blend"
EXPORT_GLB = ROOT / "GeneralCompany.glb"


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
    "wall": material("Game_Office_Wall_Soft_Grey", (0.55, 0.62, 0.62, 1), 0.86),
    "floor": material("Game_Office_Floor_Blue_Grey", (0.22, 0.38, 0.44, 1), 0.9),
    "wood": material("Game_Office_Desk_Muted_Wood", (0.45, 0.37, 0.25, 1), 0.74),
    "chair": material("Game_Office_Chair_Charcoal", (0.06, 0.07, 0.08, 1), 0.76),
    "metal": material("Game_Office_Matte_Metal", (0.20, 0.29, 0.32, 1), 0.68, 0.04),
    "device": material("Game_IT_Device_Deep_Slate", (0.05, 0.12, 0.17, 1), 0.62, 0.05),
    "panel": material("Game_IT_Device_Teal_Panel", (0.13, 0.27, 0.32, 1), 0.66, 0.03),
    "light_device": material("Game_IT_Light_Device_Grey", (0.42, 0.52, 0.52, 1), 0.78),
    "screen": material("Game_IT_Screen_Black", (0.01, 0.015, 0.025, 1), 0.48),
    "cyan": material("Game_IT_Cyan_Glow", (0.04, 0.48, 0.62, 1), 0.4, 0.0, (0.04, 0.75, 0.95, 1), 0.8),
    "green": material("Game_IT_LED_Green", (0.18, 0.86, 0.36, 1), 0.36, 0.0, (0.18, 1.0, 0.36, 1), 0.9),
    "amber": material("Game_IT_LED_Amber", (1.0, 0.62, 0.14, 1), 0.36, 0.0, (1.0, 0.56, 0.1, 1), 0.75),
}


def normalized(name):
    return name.lower().replace(" ", "").replace("-", "_")


def pick_by_name(obj_name, mat_name=""):
    text = normalized(f"{obj_name} {mat_name}")
    if "room_floor" in text or "floor" in text:
        return MATS["floor"]
    if text.startswith("wall_") or "wall" in text or "officeroomshell" in text:
        return MATS["wall"]
    if "desk_wood" in text or "desk_top" in text or "table" in text or "counter" in text:
        return MATS["wood"]
    if "chair" in text:
        return MATS["chair"]
    if "screen_on" in text or "screen_glow" in text or "monglow" in text or "holo" in text:
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

bpy.ops.wm.save_as_mainfile(filepath=str(BLEND_PATH))
bpy.ops.export_scene.gltf(
    filepath=str(EXPORT_GLB),
    export_format="GLB",
    export_materials="EXPORT",
)

print(f"Colored {changed} material slots")
print(f"Saved blend: {BLEND_PATH}")
print(f"Exported GLB: {EXPORT_GLB}")
