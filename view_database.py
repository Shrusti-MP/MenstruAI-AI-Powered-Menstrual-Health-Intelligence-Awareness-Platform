"""
MenstruAI Database Viewer Helper
Usage:
    python view_database.py               # Lists all tables, row counts, and columns
    python view_database.py <table_name>  # Previews first 5 rows of a specific table
"""

import sys
import os

# Add backend directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "backend"))

import sqlalchemy
from sqlalchemy import text
from app.core.config import settings

def main():
    engine = sqlalchemy.create_engine(settings.DATABASE_URL)
    inspector = sqlalchemy.inspect(engine)
    tables = sorted(inspector.get_table_names())

    if len(sys.argv) > 1:
        table_name = sys.argv[1].strip()
        if table_name not in tables:
            print(f"\n[ERROR] Table '{table_name}' not found. Available tables:")
            for t in tables:
                print(f"  - {t}")
            return

        print(f"\n=== Table: {table_name} ===")
        columns = [c['name'] for c in inspector.get_columns(table_name)]
        print(f"Columns: {', '.join(columns)}\n")

        with engine.connect() as conn:
            result = conn.execute(text(f"SELECT * FROM `{table_name}` LIMIT 5"))
            rows = result.fetchall()
            if not rows:
                print("Table is currently empty.")
            else:
                for idx, row in enumerate(rows, 1):
                    print(f"--- Row {idx} ---")
                    for col, val in zip(columns, row):
                        print(f"  {col}: {val}")
        return

    print("\n" + "=" * 65)
    print(f"  MenstruAI Database Summary ({len(tables)} tables found)")
    print("=" * 65)
    print(f"  {'Table Name':<26} | {'Rows':<8} | {'Columns':<8}")
    print("-" * 65)

    with engine.connect() as conn:
        for t in tables:
            count = conn.execute(text(f"SELECT COUNT(*) FROM `{t}`")).scalar()
            cols = len(inspector.get_columns(t))
            print(f"  {t:<26} | {count:<8} | {cols:<8}")

    print("=" * 65)
    print("Tip: To view sample records for a table, run:")
    print("  python view_database.py <table_name>\n  Example: python view_database.py users\n")

if __name__ == "__main__":
    main()
