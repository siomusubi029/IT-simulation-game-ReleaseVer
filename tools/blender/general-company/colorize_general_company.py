import bpy
from pathlib import Path


ROOT = Path(__file__).resolve().parents[3]
EXPORT_GLB = ROOT / "game" / "models" / "GeneralCompany.glb"
EXPORT_BLEND = ROOT / "blender" / "sources" / "GeneralCompany_colored.blend"

OFFICE_EXPORT_ROOTS = [
    "OfficeRoomShell_Root",
    "Wall_Divider_Admin_Server",
    "Wall_Divider_TopBottom",
    "Wall_Divider_Workspace_Meeting",
    "Passage_Admin_ServerRoom",
    "Passage_Meeting_Admin",
    "Passage_Workspace_Meeting",
    "PCDeskArea_Root",
    "ServerRack_Root",
    "ServerRoom_DecoRack_01 ",
    "ServerRoom_DecoRack_02",
    "MFP_Root",
    "WifiAP_Root",
    "FileServerStack_Root",
    "AT_Root",
    "Conference_Root",
    "BackupDevice_Root",
    "PT_Root",
    "VPNGateway_Root",
    "MailServerStack_Root",
    "AM_Root",
]


def material(name, color, roughness=0.62, metallic=0.0, emission=None, strength=0.0):
    mat = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    mat.use_nodes = True
    mat.use_backface_culling = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    if bsdf:
        bsdf.inputs["Base Color"].default_value = color
        bsdf.inputs["Roughness"].default_value = roughness
        bsdf.inputs["Metallic"].default_value = metallic
        if emission:
            bsdf.inputs["Emission Color"].default_value = emission
            bsdf.inputs["Emission Strength"].default_value = strength
    mat.diffuse_color = color
    return mat


MATS = {
    "wall": material("Office_Warm_White_Wall", (0.62, 0.66, 0.66, 1), 0.78),
    "floor": material("Office_Blue_Grey_Floor", (0.22, 0.42, 0.50, 1), 0.86),
    "floor_alt": material("Office_Server_Grey_Floor", (0.20, 0.25, 0.28, 1), 0.82),
    "wood": material("Office_Light_Wood", (0.64, 0.43, 0.24, 1), 0.68),
    "wood_dark": material("Office_Dark_Wood", (0.38, 0.24, 0.14, 1), 0.7),
    "chair": material("Office_Chair_Charcoal", (0.08, 0.10, 0.12, 1), 0.7),
    "metal": material("Office_Matte_Metal", (0.34, 0.39, 0.43, 1), 0.58, 0.05),
    "device": material("IT_Device_Dark_Slate", (0.10, 0.15, 0.19, 1), 0.55, 0.08),
    "panel": material("IT_Device_Front_Panel", (0.20, 0.27, 0.32, 1), 0.58, 0.05),
    "light_device": material("IT_Light_Device_Body", (0.62, 0.68, 0.68, 1), 0.65),
    "monitor_frame": material("IT_Monitor_Frame_Charcoal", (0.015, 0.022, 0.028, 1), 0.58, 0.02),
    "screen": material("IT_Screen_Black", (0.01, 0.02, 0.03, 1), 0.45),
    "screen_on": material("IT_Screen_Cyan_Glow", (0.08, 0.42, 0.58, 1), 0.35, 0.0, (0.08, 0.62, 0.82, 1), 0.9),
    "accent": material("IT_Cyan_Accent", (0.04, 0.68, 0.82, 1), 0.42, 0.0, (0.04, 0.38, 0.48, 1), 0.25),
    "led_green": material("IT_LED_Green", (0.20, 0.92, 0.42, 1), 0.35, 0.0, (0.20, 1.0, 0.42, 1), 0.85),
    "led_blue": material("IT_LED_Blue", (0.13, 0.62, 1.0, 1), 0.35, 0.0, (0.13, 0.62, 1.0, 1), 0.8),
    "led_amber": material("IT_LED_Amber", (1.0, 0.67, 0.18, 1), 0.35, 0.0, (1.0, 0.58, 0.08, 1), 0.75),
    "plant": material("Office_Plant_Green", (0.16, 0.42, 0.22, 1), 0.75),
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
    if "floor" in name and ("server" in name or "rack" in name):
        return MATS["floor_alt"]
    if "desk_top" in name or "counter" in name or "table" in name:
        return MATS["wood"]
    if "desk_leg" in name or "stand" in name or "neck" in name or "base" in name:
        return MATS["metal"]
    if "chair" in name or name.startswith("ac_"):
        return MATS["chair"]
    if "screen_glow" in name or "mon_glow" in name or "monitorglow" in name or "monglow" in name or "controlscreen" in name or "vwglow" in name:
        return MATS["screen_on"]
    if "monitor_base" in name or "monbase" in name or "monitor_neck" in name or "monneck" in name:
        return MATS["metal"]
    if "monitor_bezel" in name or "monitor_casing" in name or "moncasing" in name or "screen_casing" in name or "screencasing" in name:
        return MATS["monitor_frame"]
    if "monitor_screen" in name or "screen" in name:
        return MATS["screen"]
    if "keyboard" in name or "mouse" in name:
        return MATS["device"]
    if "led" in name:
        if "amber" in name:
            return MATS["led_amber"]
        if "blue" in name:
            return MATS["led_blue"]
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


selected_objects = set()


def collect_with_children(obj):
    selected_objects.add(obj)
    for child in obj.children:
        collect_with_children(child)


for root_name in OFFICE_EXPORT_ROOTS:
    root_obj = bpy.data.objects.get(root_name)
    if root_obj:
        collect_with_children(root_obj)


for obj in selected_objects:
    if obj.type != "MESH":
        continue
    mat = pick_material(obj.name)
    if not mat:
        continue
    obj.data.materials.clear()
    obj.data.materials.append(mat)


for obj in bpy.data.objects:
    obj.select_set(obj in selected_objects)

EXPORT_GLB.parent.mkdir(parents=True, exist_ok=True)
bpy.ops.wm.save_as_mainfile(filepath=str(EXPORT_BLEND))
bpy.ops.export_scene.gltf(
    filepath=str(EXPORT_GLB),
    export_format="GLB",
    use_selection=True,
    export_apply=True,
    export_materials="EXPORT",
)

print(f"Exported colored office GLB: {EXPORT_GLB}")
