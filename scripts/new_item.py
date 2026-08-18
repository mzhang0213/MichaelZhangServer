import json
import textwrap

PROJECT_PATH = "/Users/mzhang/Documents/0b_cs_projects/MichaelZhangServer/app/projects_data.json"
TECHNOLOGY_PATH = "/Users/mzhang/Documents/0b_cs_projects/MichaelZhangServer/app/technologies_data.json"
EXPERIENCES_PATH = "/Users/mzhang/Documents/0b_cs_projects/MichaelZhangServer/app/experiences_data.json"


# ---------------------------------------------------------------------------
# Prompt helpers
# ---------------------------------------------------------------------------
def required(label):
    """Always-included field. Whatever is typed (even empty) is kept."""
    return input(f"{label}: ")


def yes_no(label):
    while True:
        ans = input(f"{label} (y/n): ").strip().lower()
        if ans in ("y", "yes"):
            return True
        if ans in ("n", "no"):
            return False
        print("  please answer y or n")


def optional(item, key, label):
    """Ask whether to include an optional string field; only add it if accepted."""
    if yes_no(f"include '{label}'?"):
        item[key] = input(f"  {label}: ")


def choice(label, options):
    opts = "/".join(options)
    while True:
        ans = input(f"{label} ({opts}): ").strip()
        if ans in options:
            return ans
        print(f"  must be one of: {opts}")


# ---------------------------------------------------------------------------
# Field collectors
# ---------------------------------------------------------------------------
def collect_technology_entries():
    """Required `technology` array on a project: list of {id, description|null}."""
    tech = []
    print("\n-- technologies (leave id blank to finish) --")
    while True:
        tid = input("  technology id: ").strip()
        if not tid:
            break
        entry = {"id": tid}
        if yes_no("    add a description for this technology?"):
            entry["description"] = input("    description: ")
        else:
            entry["description"] = None
        tech.append(entry)
    return tech


def collect_object_list(label, fields, optional_fields):
    """Generic optional array of objects (sections / gallery / timeline)."""
    items = []
    print(f"\n-- {label} (leave first field blank to finish) --")
    while True:
        first = input(f"  {fields[0]}: ").strip()
        if not first:
            break
        obj = {fields[0]: first}
        for f in fields[1:]:
            obj[f] = input(f"  {f}: ")
        for f in optional_fields:
            if yes_no(f"    include '{f}'?"):
                obj[f] = input(f"    {f}: ")
        items.append(obj)
    return items


# ---------------------------------------------------------------------------
# Item builders
# ---------------------------------------------------------------------------
def build_project():
    item = {}
    item["id"] = required("id")
    item["title"] = required("title")
    item["description"] = required("description")
    item["icon"] = required("icon (e.g. /icons/foo.png)")
    item["technology"] = collect_technology_entries()

    print("\n-- link (required) --")
    item["link"] = {
        "title": required("  link title"),
        "link": required("  link url"),
    }

    print("\n-- optional fields --")
    optional(item, "detailsDefault", "detailsDefault")
    optional(item, "color", "color")
    optional(item, "github", "github")
    optional(item, "preview", "preview (png path or url)")

    if yes_no("include 'sections'?"):
        item["sections"] = collect_object_list("sections", ["title", "body"], [])
    if yes_no("include 'gallery'?"):
        item["gallery"] = collect_object_list("gallery", ["src"], ["caption"])
    if yes_no("include 'timeline'?"):
        item["timeline"] = collect_object_list("timeline", ["date", "label"], ["body"])

    return item, PROJECT_PATH


def build_technology():
    item = {}
    item["id"] = required("id")
    item["title"] = required("title")
    item["color"] = required("color (hex or css color, e.g. #33ccff or white)")
    item["description"] = required("description (may be empty)")
    item["icon"] = required("icon (e.g. /icons/foo.png)")
    return item, TECHNOLOGY_PATH


def build_experience():
    item = {}
    item["id"] = required("id")
    item["title"] = required("title")
    item["role"] = required("role")
    item["location"] = required("location")
    item["duration"] = required("duration (e.g. 'June 2026 - Aug 2026')")
    item["description"] = required("description (may be empty)")
    item["icon"] = required("icon (e.g. /icons/foo.png)")
    item["bgIcon"] = required("bgIcon (may be empty)")
    item["type"] = choice("type", ["work", "volunteer"])
    item["link"] = required("link (applied on the title)")

    print("\n-- optional fields --")
    optional(item, "locationLink", "locationLink")
    optional(item, "bgColor", "bgColor")
    optional(item, "bgImage", "bgImage")

    return item, EXPERIENCES_PATH


# ---------------------------------------------------------------------------
# Write-back: textual insert so JSONC comments / trailing commas are preserved
# ---------------------------------------------------------------------------
def insert_item(path, item):
    with open(path, "r") as f:
        content = f.read()

    block = textwrap.indent(json.dumps(item, indent=2, ensure_ascii=False), "  ")

    open_idx = content.index("[")
    new_content = content[:open_idx + 1] + "\n" + block + "," + content[open_idx + 1:]

    with open(path, "w") as f:
        f.write(new_content)

    print(f"\nAdded '{item['id']}' to {path}")


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
builders = {
    "1": build_project,
    "2": build_technology,
    "3": build_experience,
}

opt = input("What do you want to add?\n  1) project\n  2) technology\n  3) experience\n> ").strip()
if opt not in builders:
    print("invalid choice")
    raise SystemExit(1)

item, path = builders[opt]()
insert_item(path, item)
