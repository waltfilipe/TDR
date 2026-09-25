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
    "Above Level": "#044f80",
}

MIN_IMPROVEMENTS = 4
MAX_IMPROVEMENTS = 6

# Rótulo no site → coluna em Player_Grades (até o PBIX trazer colunas dedicadas)
TECHNICAL_INDICATORS: list[tuple[str, str | None]] = [
    ("Link-Up Play (Lay-offs)", "General Passing"),
    ("Final Pass", "Crossing"),
    ("Ball Protection", "1st Touch"),
    ("Finishing Touches", "1v1 Attacking"),
    ("Finishing", "Shoting"),
    ("Heading", "Heading"),
    ("Pressing Triggers", "1v1 Defending"),
    ("Defensive Positioning", "Off Ball Defending"),
]


def _optional_str(value) -> str | None:
    if value is None:
        return None
    text = str(value).strip()
    if not text or text.lower() in {"<na>", "nan", "none"}:
        return None
    return text


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

    psi_fields = ["1st PSI", "2nd PSI", "3rd PSI", "4th PSI"]

    def grade_entry(field: str, source: dict) -> dict:
        label = str(source.get(field, "") or "").strip()
        return {
            "field": field,
            "grade": label,
            "color": GRADE_COLORS.get(label, "#c8c8c8"),
        }

    def technical_entry(display_label: str, pbix_column: str | None) -> dict:
        if pbix_column and grades:
            raw = str(grades.get(pbix_column, "") or "").strip()
        else:
            raw = ""
        return {
            "field": display_label,
            "grade": raw,
            "color": GRADE_COLORS.get(raw, "#c8c8c8"),
        }

    improvements = [""] * MIN_IMPROVEMENTS

    return {
        "meta": {
            "source": PBIX_PATH.name,
            "page": "Duplicata de Duplicata de Capa",
            "gradeColors": GRADE_COLORS,
            "improvementLimits": {"min": MIN_IMPROVEMENTS, "max": MAX_IMPROVEMENTS},
        },
        "player": {
            "id": int(athlete.get("Player_ID") or 1),
            "name": "Athlete Name",
            "position": "",
            "birth": 0,
            "height": 0,
            "club": "",
            "photo": None,
        },
        "technicalGrades": [technical_entry(label, col) for label, col in TECHNICAL_INDICATORS],
        "playerSpecificIndicators": [],
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
