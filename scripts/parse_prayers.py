import pypdf, re, json, sys

SRC = "/Users/wade-admin/Downloads/wsc-childrens-prayers.md.pdf"
OUT = "assets/prayers.json"
TYPES = {"Thanksgiving", "Petition", "Confession"}

def fix_ligatures(s):
    return (s.replace("ﬁ", "fi").replace("ﬂ", "fl")
             .replace("ﬀ", "ff").replace("ﬃ", "ffi")
             .replace("ﬄ", "ffl"))

r = pypdf.PdfReader(SRC)
txt = "\n".join(p.extract_text() for p in r.pages)
txt = fix_ligatures(txt)

parts = re.split(r'(Q\d+\.)', txt)  # parts[0] = header
prayers = []
for i in range(1, len(parts), 2):
    qnum = int(parts[i][1:-1])
    body_lines = [l.strip() for l in parts[i+1].strip().split("\n") if l.strip()]
    # find the type marker line; everything before = question, after = prayer
    tidx = next((j for j, l in enumerate(body_lines) if l in TYPES), None)
    if tidx is None:
        print(f"NO TYPE for Q{qnum}: {body_lines[:3]}", file=sys.stderr); sys.exit(1)
    question = " ".join(body_lines[:tidx])
    prayer = " ".join(body_lines[tidx+1:])
    prayers.append({"q": qnum, "question": question, "prayer": prayer})

# Strip attribution footer from last prayer
last = prayers[-1]
m = re.search(r'(.*?Amen\.)\s*Based on the Westminster', last["prayer"])
if m:
    last["prayer"] = m.group(1)

assert len(prayers) == 107, f"expected 107, got {len(prayers)}"
assert all(p["prayer"].rstrip().endswith("Amen.") for p in prayers), "a prayer doesn't end in Amen."
assert [p["q"] for p in prayers] == list(range(1, 108)), "q numbers not 1..107 in order"

json.dump(prayers, open(OUT, "w"), indent=2, ensure_ascii=False)
print(f"Wrote {len(prayers)} prayers to {OUT}")
