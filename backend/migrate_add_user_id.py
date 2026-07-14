"""One-off migration: add 'user_id' column to 'app_state' table if missing."""

from sqlalchemy import inspect, text

from app.core.database import engine


def migrate():
    inspector = inspect(engine)
    columns = [c["name"] for c in inspector.get_columns("app_state")]

    if "user_id" in columns:
        print("[OK] 'user_id' column already exists - nothing to do.")
        return

    with engine.begin() as conn:
        # Add the column (nullable first so existing rows don't break)
        conn.execute(text("ALTER TABLE app_state ADD COLUMN user_id VARCHAR"))
        # Backfill: copy 'id' into 'user_id' for existing rows
        conn.execute(text("UPDATE app_state SET user_id = id WHERE user_id IS NULL"))
        # Now make it NOT NULL
        conn.execute(text("ALTER TABLE app_state ALTER COLUMN user_id SET NOT NULL"))
        # Add an index for performance
        conn.execute(text("CREATE INDEX IF NOT EXISTS ix_app_state_user_id ON app_state (user_id)"))

    print("[OK] 'user_id' column added and backfilled successfully.")


if __name__ == "__main__":
    migrate()
