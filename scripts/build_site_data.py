#!/usr/bin/env python3
"""Export player report JSON from Modelo - IDP v2.pbix for the static site."""

from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PBIX_PATH = ROOT / "Modelo - IDP v2.pbix"
OUT_PATH = ROOT / "data" / "report.json"

GRADE_COLORS: dict[str, str] = {
    "Below Level": "#a1343c",
    "Average": "#ad5129",
    "Good": "#05712D",
    "Above Level": "#094780",
}

MIN_IMPROVEMENTS = 4
MAX_IMPROVEMENTS = 6


def _row_for_player(df, player: str):
    if df is None or df.empty:
        return None
    if "Player" in df.columns:
        matches = df[df["Player"].astype(str) == player]
        if not matches.empty:
            return matches.iloc[0].to_dict()
    if "Jogador" in df.columns:
        matches = df[df["Jogador"].astype(str) == player]
        if not matches.empty:
            return matches.iloc[0].to_dict()
    return df.iloc[0].to_dict()


def _load_tables():
    try:
        from pbixray import PBIXRay
    except ImportError as exc:
        raise SystemExit("Instale pbixray: pip install pbixray") from exc

    if not PBIX_PATH.exists():
        raise SystemExit(f"Arquivo não encontrado: {PBIX_PATH}")

    pbix = PBIXRay(str(PBIX_PATH))
    return {name: pbix.get_table(name) for name in pbix.tables}


def build_report(player_name: str | None = None) -> dict:
    tables = _load_tables()
    atletas = tables["Atletas"]
    if player_name is None:
        player_name = str(atletas.iloc[0]["Player"])

    athlete = _row_for_player(atletas, player_name)
    grades = _row_for_player(tables["Player_Grades"], player_name)
    psi_labels = _row_for_player(tables["Tb_PSI"], player_name)
    psi_grades = _row_for_player(tables["Tb_PSIGrades"], player_name)
    improve = _row_for_player(tables["Tb_Improve"], player_name)

    technical_fields = [
        "General Passing",
        "Crossing",
        "1st Touch",
        "1v1 Attacking",
        "Shoting",
        "Heading",
        "1v1 Defending",
        "Off Ball Defending",
    ]
    psi_fields = ["1st PSI", "2nd PSI", "3rd PSI", "4th PSI"]

    def grade_entry(field: str, source: dict) -> dict:
        label = str(source.get(field, "") or "").strip()
        return {
            "field": field,
            "grade": label,
            "color": GRADE_COLORS.get(label, "#c8c8c8"),
        }

    improvements = [str(improve.get(str(i), "") or "").strip() for i in range(1, MAX_IMPROVEMENTS + 1)]
    improvements = [text for text in improvements if text]
    while len(improvements) < MIN_IMPROVEMENTS:
        improvements.append("")

    psi = [
        {
            "label": str(psi_labels.get(field, "") or "").strip(),
            **grade_entry(field, psi_grades),
        }
        for field in psi_fields
    ]

    return {
        "meta": {
            "source": PBIX_PATH.name,
            "page": "Duplicata de Duplicata de Capa",
            "gradeColors": GRADE_COLORS,
            "improvementLimits": {"min": MIN_IMPROVEMENTS, "max": MAX_IMPROVEMENTS},
        },
        "player": {
            "id": int(athlete.get("Player_ID")),
            "name": athlete.get("Player"),
            "position": athlete.get("Position") or grades.get("Position"),
            "birth": athlete.get("Birth"),
            "height": athlete.get("Height"),
            "club": athlete.get("Club"),
            "instagram": athlete.get("Instagram"),
            "transfermarkt": athlete.get("Transfermark"),
        },
        "technicalGrades": [grade_entry(f, grades) for f in technical_fields],
        "playerSpecificIndicators": [entry for entry in psi if entry["label"] or entry["grade"]],
        "improvements": improvements,
    }


def main() -> None:
    player = sys.argv[1] if len(sys.argv) > 1 else None
    report = build_report(player)
    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUT_PATH.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wrote {OUT_PATH} for player {report['player']['name']}")


if __name__ == "__main__":
    main()
