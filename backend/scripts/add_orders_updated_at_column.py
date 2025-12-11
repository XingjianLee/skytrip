import sys
from pathlib import Path
from sqlalchemy import create_engine, text

# ensure backend package in path
project_root = Path(__file__).resolve().parents[1]
if str(project_root) not in sys.path:
    sys.path.insert(0, str(project_root))

try:
    from app.config import settings
except Exception as e:
    print("[ERROR] load settings failed:", e)
    sys.exit(1)


def run():
    engine = create_engine(settings.DATABASE_URL)
    with engine.connect() as conn:
        trans = conn.begin()
        try:
            # add updated_at column if not exists
            # MySQL lacks IF NOT EXISTS for ADD COLUMN prior to 8.0.21 in all cases; attempt and catch
            try:
                conn.execute(text(
                    "ALTER TABLE orders ADD COLUMN updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
                ))
                print("[OK] added orders.updated_at column")
            except Exception as e:
                # likely already exists
                print("[WARN] add column failed (maybe exists):", e)

            trans.commit()
        except Exception as e:
            trans.rollback()
            print("[ERROR] migration failed:", e)
            sys.exit(1)


if __name__ == "__main__":
    run()