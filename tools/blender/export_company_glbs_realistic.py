import re
from pathlib import Path

import bpy


ROOT = Path(__file__).resolve().parents[2]
EXPORTS = [
    ("GeneralCompany_Root", ROOT / "game" / "models" / "GeneralCompany.glb", "General"),
    ("SecurityCompany_Root", ROOT / "game" / "models" / "SecurityCompany.glb", "Security"),
    ("DataCenter_Root", ROOT / "game" / "models" / "DataCenterCompany.glb", "DataCenter"),
    ("Web_Serbice_Company", ROOT / "game" / "models" / "WebServiceCompany.glb", "WebService"),
]


def principled_node(mat):
    for node in mat.node_tree.nodes:
        if node.type == "BSDF_PRINCIPLED":
            return node
    return None


def set_input(node, name, value):
    socket = node.inputs.get(name)
    if socket is not None:
        socket.default_value = value


def make_material(name, color, roughness=0.72, metallic=0.0, emission=None, strength=0.0, alpha=1.0):
    mat = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    mat.use_nodes = True
    mat.use_backface_culling = False
    mat.diffuse_color = (color[0], color[1], color[2], alpha)
    if alpha < 1:
        mat.blend_method = "BLEND"
        mat.use_screen_refraction = True
    node = principled_node(mat)
    if node:
        set_input(node, "Base Color", (color[0], color[1], color[2], alpha))
        set_input(node, "Roughness", roughness)
        set_input(node, "Metallic", metallic)
        set_input(node, "Alpha", alpha)
        if emission:
            set_input(node, "Emission Color", emission)
            set_input(node, "Emission Strength", strength)
    return mat


MATS = {
    "wall": make_material("Real_Office_Warm_White_Grey_Wall", (0.80, 0.80, 0.76), 0.93),
    "floor": make_material("Real_Office_Neutral_Grey_Carpet", (0.48, 0.50, 0.49), 0.96),
    "floor_dark": make_material("Real_Office_Dark_Raised_Floor", (0.31, 0.34, 0.35), 0.88, 0.02),
    "wood": make_material("Real_Office_Light_Oak_Desk", (0.58, 0.48, 0.34), 0.76),
    "wood_dark": make_material("Real_Office_Dark_Walnut_Surface", (0.34, 0.27, 0.20), 0.78),
    "chair": make_material("Real_Office_Black_Fabric_Chair", (0.035, 0.037, 0.040), 0.86),
    "metal": make_material("Real_Office_Satin_Dark_Metal", (0.23, 0.25, 0.25), 0.58, 0.16),
    "light_device": make_material("Real_IT_Off_White_Plastic", (0.70, 0.70, 0.66), 0.82),
    "device": make_material("Real_IT_Black_Plastic_Device", (0.045, 0.050, 0.055), 0.66, 0.03),
    "rack": make_material("Real_IT_Server_Rack_Gunmetal", (0.08, 0.095, 0.105), 0.56, 0.18),
    "panel": make_material("Real_IT_Perforated_Dark_Panel", (0.14, 0.16, 0.165), 0.64, 0.08),
    "monitor_frame": make_material("Real_IT_Monitor_Matte_Black_Frame", (0.012, 0.014, 0.016), 0.62, 0.03),
    "screen": make_material("Real_IT_Glass_Black_Screen", (0.004, 0.006, 0.009), 0.28, 0.0),
    "screen_on": make_material(
        "Real_IT_Soft_Blue_White_LCD",
        (0.58, 0.76, 0.79),
        0.38,
        0.0,
        (0.26, 0.55, 0.62, 1),
        0.32,
    ),
    "cyan": make_material(
        "Real_IT_Subtle_Cyan_Indicator",
        (0.08, 0.42, 0.48),
        0.42,
        0.0,
        (0.05, 0.48, 0.56, 1),
        0.38,
    ),
    "green": make_material(
        "Real_IT_Small_Green_LED",
        (0.12, 0.62, 0.22),
        0.38,
        0.0,
        (0.10, 0.72, 0.20, 1),
        0.55,
    ),
    "amber": make_material(
        "Real_IT_Small_Amber_LED",
        (0.92, 0.50, 0.12),
        0.38,
        0.0,
        (0.90, 0.42, 0.08, 1),
        0.48,
    ),
    "glass": make_material("Real_Office_Clear_Glass", (0.58, 0.75, 0.78), 0.18, 0.0, alpha=0.36),
}


def normalized(name):
    return re.sub(r"[\s\-.]+", "_", name.lower())


def collection_objects_recursive(collection):
    objects = list(collection.objects)
    for child in collection.children:
        objects.extend(collection_objects_recursive(child))
    return objects


def pick_material(obj_name, mat_name=""):
    text = normalized(f"{obj_name} {mat_name}")
    if "glass" in text:
        return MATS["glass"]
    if "floor" in text or "room_floor" in text:
        if any(token in text for token in ("server_room", "datacenter", "data_center", "raised")):
            return MATS["floor_dark"]
        return MATS["floor"]
    if any(token in text for token in ("wall", "roomshell", "room_shell", "divider", "partition", "outer")):
        return MATS["wall"]
    if any(token in text for token in ("desk_wood", "desk_top", "table", "counter", "workbench", "wood")):
        return MATS["wood"]
    if "chair" in text:
        return MATS["chair"]
    if any(token in text for token in ("screen_on", "screen_glow", "monitor_glow", "mon_glow", "monglow", "holo", "controlscreen")):
        return MATS["screen_on"]
    if any(token in text for token in ("monitor_base", "monbase", "monitor_neck", "monneck")):
        return MATS["metal"]
    if any(token in text for token in ("monitor_bezel", "monitor_casing", "screencasing", "screen_casing", "casing", "bezel")):
        return MATS["monitor_frame"]
    if "monitor_screen" in text or "screen_black" in text or text.endswith("_screen"):
        return MATS["screen"]
    if "led_green" in text:
        return MATS["green"]
    if "led" in text or "alert" in text or "lockaccent" in text:
        return MATS["amber"]
    if any(token in text for token in ("led_blue", "accent_blue", "wifiarc", "wifidot", "statusring", "glow")):
        return MATS["cyan"]
    if any(token in text for token in ("frontpanel", "panel", "bay", "port", "grille", "vent")):
        return MATS["panel"]
    if any(token in text for token in ("mfp_", "ap_", "printer", "wifi")):
        return MATS["light_device"]
    if any(token in text for token in ("leg", "stand", "neck", "base", "pole", "rail")):
        return MATS["metal"]
    if any(
        token in text
        for token in (
            "rack",
            "server",
            "database",
            "storage",
            "router",
            "switch",
            "firewall",
            "ids",
            "siem",
            "soc",
            "terminal",
            "gateway",
            "edr",
            "malware",
            "forensic",
            "threat",
            "vuln",
            "ups",
            "cooling",
            "loadbalancer",
            "api",
            "cloud",
            "cdn",
            "queue",
            "auth",
            "container",
            "cicd",
            "dashboard",
            "developer",
            "payment",
            "vpn",
            "backup",
            "pc_tower",
            "keyboard",
            "mouse",
            "body",
        )
    ):
        if any(token in text for token in ("rack", "server", "storage", "database", "db", "ups")):
            return MATS["rack"]
        return MATS["device"]
    return None


def recolor_objects(objects):
    changed = 0
    for obj in objects:
        if obj.type != "MESH":
            continue
        if obj.data.materials:
            for index, mat in enumerate(list(obj.data.materials)):
                chosen = pick_material(obj.name, mat.name if mat else "")
                if chosen:
                    obj.data.materials[index] = chosen
                    changed += 1
        else:
            chosen = pick_material(obj.name)
            if chosen:
                obj.data.materials.append(chosen)
                changed += 1
    return changed


def export_objects_for_collection(collection_name, objects):
    if collection_name != "SecurityCompany_Root":
        return objects

    filtered = []
    for obj in objects:
        if obj.type != "MESH":
            filtered.append(obj)
            continue
        world_x = obj.matrix_world.translation.x
        world_y = obj.matrix_world.translation.y
        if 60 <= world_x <= 130 and 5 <= world_y <= 55:
            filtered.append(obj)
    return filtered


def export_collection(collection_name, export_path):
    collection = bpy.data.collections.get(collection_name)
    if collection is None:
        available = ", ".join(sorted(c.name for c in bpy.data.collections))
        raise RuntimeError(f"Collection not found: {collection_name}. Available: {available}")

    bpy.ops.object.select_all(action="DESELECT")
    objects = collection_objects_recursive(collection)
    if not objects:
        raise RuntimeError(f"Collection has no exportable objects: {collection_name}")

    objects = export_objects_for_collection(collection_name, objects)
    if not objects:
        raise RuntimeError(f"Collection has no objects after export filtering: {collection_name}")

    changed = recolor_objects(objects)
    export_path.parent.mkdir(parents=True, exist_ok=True)
    for obj in objects:
        obj.select_set(True)
    bpy.context.view_layer.objects.active = objects[0]
    bpy.ops.export_scene.gltf(
        filepath=str(export_path),
        export_format="GLB",
        export_materials="EXPORT",
        use_selection=True,
    )
    print(f"Exported {collection_name} to {export_path}")
    print(f"Selected objects: {len(objects)}")
    print(f"Recolored material slots: {changed}")


for source_collection, export_glb, label in EXPORTS:
    export_collection(source_collection, export_glb)
