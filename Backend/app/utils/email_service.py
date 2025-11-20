import os
from dotenv import load_dotenv # type: ignore
from typing import Optional
import smtplib
from email.message import EmailMessage

load_dotenv()

SMTP_HOST = os.getenv("SMTP_HOST")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASS = os.getenv("SMTP_PASS")
DEFAULT_FROM = os.getenv("EMAIL_FROM", "no-reply@example.com")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

def send_password_reset_email(to_email: str, token: str, path: Optional[str] = "/auth/reset-password"):
    """
    Builds a reset link using FRONTEND_URL and prints it. If SMTP config present, attempts to send an email.
    path: the frontend route that accepts the reset token (e.g. /auth/reset-password)
    """
    reset_link = f"{FRONTEND_URL}{path}?token={token}"

    subject = "Password reset request"
    body = f"Hello,\n\nWe received a request to reset your password. Use the following link to reset it. The link will expire shortly.\n\n{reset_link}\n\nIf you did not request a password reset, please ignore this email.\n"

    print(f"[PASSWORD RESET] To: {to_email}\nLink: {reset_link}\n")

    if SMTP_HOST and SMTP_USER and SMTP_PASS:
        try:
            msg = EmailMessage()
            msg["Subject"] = subject
            msg["From"] = DEFAULT_FROM
            msg["To"] = to_email
            msg.set_content(body)

            with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=10) as server:
                server.starttls()
                server.login(SMTP_USER, SMTP_PASS)
                server.send_message(msg)
            print(f"[PASSWORD RESET] Email sent to {to_email} via SMTP.")
        except Exception as e:
            print(f"[PASSWORD RESET] Failed to send email via SMTP: {e}")
    else:
        print("[PASSWORD RESET] SMTP not configured, printed reset link instead.")
