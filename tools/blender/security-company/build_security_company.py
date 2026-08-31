import bpy
from pathlib import Path


ROOT = Path(__file__).resolve().parents[3]
SOURCE_BLEND = ROOT / "blender" / "sources" / "PC.blend"
EXPORT_GLB = ROOT / "SecurityCompany.glb"
EXPORT_BLEND = ROOT / "blender" / "sources" / "SecurityCompany.blend"


SECURITY_ROOTS = {
    "SOCTerminal_Root": {"loc": (-2.35, -1.45, 0.08), "rot": 0.15, "scale": 1.35},
    "SIEMConsole_Root": {"loc": (-1.35, -1.45, 0.08), "rot": -0.1, "scale": 1.45},
    "Firewall_Root": {"loc": (-2.45, 0.95, 0.08), "rot": 0.2, "scale": 1.55},
    "IDSIPS_Root": {"loc": (-1.55, 0.95, 0.08), "rot": -0.08, "scale": 1.55},
    "MalwareAnalysis_Root": {"loc": (1.18, -1.45, 0.08), "rot": 0.12, "scale": 1.55},
    "IncidentResponsePC_Root": {"loc": (2.35, -1.45, 0.08), "rot": -0.18, "scale": 1.55},
    "ThreatIntel_Root": {"loc": (1.05, 0.92, 0.08), "rot": 0.05, "scale": 1.45},
    "LogStorageServer_Root": {"loc": (2.25, 0.92, 0.08), "rot": -0.1, "scale": 1.45},
    "ZeroTrustGateway_Root": {"loc": (-0.55, 0.88, 0.08), "rot": 0.05, "scale": 1.32},
    "EDRConsole_Root": {"loc": (0.95, -0.42, 0.08), "rot": -0.18, "scale": 1.18},
    "VulnScanServer_Root": {"loc": (2.05, -0.42, 0.08), "rot": 0.1, "scale": 1.18},
    "ForensicTerminal_Root": {"loc": (2.8, -0.42, 0.08), "rot": -0.15, "scale": 1.12},
}

PREFIXES = (
    "SOC_", "SIEM_", "FW_", "IDS_", "MA_", "IR_", "TI_", "LS_",
    "ZT_", "EDR_", "VS_", "FT_",
)


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


def material(name, color, roughness=0.7, metallic=0.0, emission=None, strength=0.0):
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
    "floor": material("SOC_Blue_Green_Floor", (0.08, 0.27, 0.34, 1), 0.9),
    "wall": material("SOC_Slate_Wall", (0.28, 0.39, 0.42, 1), 0.86),
    "trim": material("SOC_Dark_Trim", (0.06, 0.14, 0.18, 1), 0.72),
    "glass": material("SOC_Glass", (0.12, 0.55, 0.62, 0.38), 0.35),
    "device": material("SOC_Device_Dark", (0.05, 0.11, 0.16, 1), 0.58, 0.05),
    "panel": material("SOC_Device_Panel", (0.12, 0.25, 0.31, 1), 0.62, 0.04),
    "screen": material("SOC_Screen_Off", (0.005, 0.012, 0.02, 1), 0.4),
    "screen_on": material("SOC_Screen_Cyan", (0.02, 0.35, 0.44, 1), 0.36, 0.0, (0.04, 0.82, 0.96, 1), 0.8),
    "alert": material("SOC_Alert_Amber", (0.92, 0.55, 0.13, 1), 0.38, 0.0, (0.9, 0.45, 0.08, 1), 0.55),
}


def cube(name, loc, scale, mat):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc)
    obj = bpy.context.object
    obj.name = name
    obj.dimensions = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    if mat:
        obj.data.materials.append(mat)
    return obj


def create_shell():
    cube("SecurityRoom_Floor", (0, 0, -0.035), (7.6, 5.2, 0.07), MATS["floor"])
    wall_h = 0.72
    wall_t = 0.12
    cube("SecurityRoom_BackWall", (0, 2.6, wall_h / 2), (7.8, wall_t, wall_h), MATS["wall"])
    cube("SecurityRoom_FrontWall", (0, -2.6, wall_h / 2), (7.8, wall_t, wall_h), MATS["wall"])
    cube("SecurityRoom_LeftWall", (-3.9, 0, wall_h / 2), (wall_t, 5.2, wall_h), MATS["wall"])
    cube("SecurityRoom_RightWall", (3.9, 0, wall_h / 2), (wall_t, 5.2, wall_h), MATS["wall"])

    cube("SecurityRoom_DividerVerticalTop", (0, 1.55, wall_h / 2), (wall_t, 2.1, wall_h), MATS["wall"])
    cube("SecurityRoom_DividerVerticalBottom", (0, -1.55, wall_h / 2), (wall_t, 1.55, wall_h), MATS["wall"])
    cube("SecurityRoom_DividerHorizontalLeft", (-2.0, 0, wall_h / 2), (3.8, wall_t, wall_h), MATS["wall"])
    cube("SecurityRoom_DividerHorizontalRight", (2.15, 0, wall_h / 2), (3.3, wall_t, wall_h), MATS["wall"])

    cube("SOC_Table", (-1.85, -1.7, 0.22), (2.25, 0.55, 0.11), MATS["trim"])
    cube("SOC_Table_Leg_L", (-2.75, -1.7, 0.09), (0.09, 0.45, 0.18), MATS["trim"])
    cube("SOC_Table_Leg_R", (-0.95, -1.7, 0.09), (0.09, 0.45, 0.18), MATS["trim"])
    cube("Incident_Table", (1.88, -1.7, 0.22), (2.1, 0.55, 0.11), MATS["trim"])
    cube("Threat_Table", (1.52, 0.72, 0.22), (2.25, 0.55, 0.11), MATS["trim"])

    for x in (-3.0, -2.75, -2.5, 2.65, 2.9, 3.15):
        cube("SOC_Wall_Status_Light", (x, 2.52, 0.52), (0.09, 0.025, 0.045), MATS["screen_on"])


def load_security_assets():
    with bpy.data.libraries.load(str(SOURCE_BLEND), link=False) as (data_from, data_to):
        wanted = set(SECURITY_ROOTS)
        for name in data_from.objects:
            if name.startswith(PREFIXES):
                wanted.add(name)
        data_to.objects = [name for name in data_from.objects if name in wanted]

    loaded = [obj for obj in data_to.objects if obj]
    for obj in loaded:
        if obj.name not in bpy.context.scene.objects:
            bpy.context.scene.collection.objects.link(obj)
    return loaded


def place_assets():
    for name, config in SECURITY_ROOTS.items():
        root = bpy.data.objects.get(name)
        if not root:
            print(f"Missing security root: {name}")
            continue
        root.location = config["loc"]
        root.rotation_euler[2] = config["rot"]
        root.scale = (config["scale"], config["scale"], config["scale"])


def pick_material(obj_name):
    name = obj_name.lower()
    if "glow" in name or "screen" in name and "casing" not in name:
        return MATS["screen_on"]
    if "screen" in name or "monitor" in name or "casing" in name:
        return MATS["screen"]
    if "led" in name or "alert" in name or "lockaccent" in name:
        return MATS["alert"]
    if "frontpanel" in name or "panel" in name or "bay" in name or "port" in name:
        return MATS["panel"]
    if obj_name.startswith(PREFIXES):
        return MATS["device"]
    return None


def color_assets():
    for obj in bpy.data.objects:
        if obj.type != "MESH":
            continue
        mat = pick_material(obj.name)
        if not mat:
            continue
        obj.data.materials.clear()
        obj.data.materials.append(mat)


clear_scene()
create_shell()
load_security_assets()
place_assets()
color_assets()

bpy.ops.export_scene.gltf(
    filepath=str(EXPORT_GLB),
    export_format="GLB",
    export_materials="EXPORT",
)

bpy.ops.wm.save_as_mainfile(filepath=str(EXPORT_BLEND))

print(f"Built security company GLB: {EXPORT_GLB}")
print(f"Built security company Blender file: {EXPORT_BLEND}")
