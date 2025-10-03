#!/usr/bin/env bash
set -euo pipefail

# Wait for Postgres
python - <<'PY'
import os, time, socket
host = os.environ.get('DB_HOST', 'db')
port = int(os.environ.get('DB_PORT', '5432'))
s = socket.socket()
print(f"Waiting for database at {host}:{port}")
for i in range(60):
    try:
        s.connect((host, port))
        s.close()
        print(f"Database connection successful!")
        break
    except Exception as e:
        print(f"Attempt {i+1}/60: Database not ready yet ({e})")
        time.sleep(1)
else:
    print("Database connection failed after 60 attempts")
    raise SystemExit('Database not available')
PY

# Run migrations and start server
python manage.py makemigrations users listings bookings || true
python manage.py migrate --noinput || true
python manage.py collectstatic --noinput || true

# Create superuser if not exists
python - <<'PY'
import os
from django.core.management import execute_from_command_line
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
try:
    from django.contrib.auth import get_user_model
    import django
    django.setup()
    User = get_user_model()
    email = os.environ.get('DJANGO_SUPERUSER_EMAIL')
    password = os.environ.get('DJANGO_SUPERUSER_PASSWORD')
    if email and password and not User.objects.filter(email=email).exists():
        User.objects.create_superuser(email=email, password=password)
except Exception as e:
    print(f"Superuser creation skipped: {e}")
PY

exec python manage.py runserver 0.0.0.0:8000 