# import os
# from dotenv import load_dotenv # type: ignore
# from typing import Optional
# import smtplib
# from email.message import EmailMessage

# load_dotenv()

# SMTP_HOST = os.getenv("SMTP_HOST")
# SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
# SMTP_USER = os.getenv("SMTP_USER")
# SMTP_PASS = os.getenv("SMTP_PASS")
# DEFAULT_FROM = os.getenv("EMAIL_FROM", "no-reply@example.com")
# FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

# def send_password_reset_email(to_email: str, token: str, path: Optional[str] = "/auth/reset-password"):
#     """
#     Builds a reset link using FRONTEND_URL and prints it. If SMTP config present, attempts to send an email.
#     path: the frontend route that accepts the reset token (e.g. /auth/reset-password)
#     """
#     reset_link = f"{FRONTEND_URL}{path}?token={token}"

#     subject = "Password reset request"
#     body = f"Hello,\n\nWe received a request to reset your password. Use the following link to reset it. The link will expire shortly.\n\n{reset_link}\n\nIf you did not request a password reset, please ignore this email.\n"

#     print(f"[PASSWORD RESET] To: {to_email}\nLink: {reset_link}\n")

#     if SMTP_HOST and SMTP_USER and SMTP_PASS:
#         try:
#             msg = EmailMessage()
#             msg["Subject"] = subject
#             msg["From"] = DEFAULT_FROM
#             msg["To"] = to_email
#             msg.set_content(body)

#             with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=10) as server:
#                 server.starttls()
#                 server.login(SMTP_USER, SMTP_PASS)
#                 server.send_message(msg)
#             print(f"[PASSWORD RESET] Email sent to {to_email} via SMTP.")
#         except Exception as e:
#             print(f"[PASSWORD RESET] Failed to send email via SMTP: {e}")
#     else:
#         print("[PASSWORD RESET] SMTP not configured, printed reset link instead.")

import os
import logging
from fastapi import APIRouter, BackgroundTasks, Depends, Form
from pydantic import EmailStr
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv  # type: ignore
import aiosmtplib  # type: ignore

load_dotenv()

# SMTP Credentials
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SMTP_USER = os.getenv("EMAIL_USER")
SMTP_PASSWORD = os.getenv("EMAIL_PASS")


async def send_email_background(subject: str, recipient: str, body: str):
    try:
        # Create email object
        message = MIMEMultipart("alternative")  # supports both plain + HTML
        message["From"] = SMTP_USER
        message["To"] = recipient
        message["Subject"] = subject

        # Plain text fallback
        text_content = f"{body}\n\n--\nThis is an automated message."

        # HTML version
        html_content = f"""
        <html>
        <head>
        <style>
            body {{
                font-family: Arial, Helvetica, sans-serif;
                background-color: #f4f4f7;
                padding: 20px;
                margin: 0;
            }}
            .container {{
                max-width: 600px;
                margin: 0 auto;
                background: #ffffff;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 3px 10px rgba(0,0,0,0.12);
            }}
            .header {{
                text-align: center;
                padding-bottom: 15px;
                border-bottom: 1px solid #eee;
            }}
            .header h2 {{
                color: #4CAF50;
                margin: 0;
            }}
            .message-box {{
                background-color: #f1fdf3;
                border-left: 5px solid #4CAF50;
                padding: 15px;
                margin: 20px 0;
                border-radius: 8px;
                color: #2d662d;
                font-size: 15px;
            }}
            p {{
                font-size: 15px;
                color: #444;
                line-height: 1.6;
            }}
            .btn {{
                display: inline-block;
                padding: 12px 20px;
                margin-top: 15px;
                background-color: #4CAF50;
                color: white !important;
                text-decoration: none;
                border-radius: 6px;
                font-weight: bold;
            }}
            .footer {{
                margin-top: 30px;
                text-align: center;
                font-size: 12px;
                color: #777;
            }}
        </style>
        </head>
        <body>
            <div class="container">
                
                <div class="header">
                    <h2>Password Updated Successfully</h2>
                </div>

                <div class="message-box">
                    Your password has been changed successfully.
                </div>

                <p>{body}</p>

                <p>If you did NOT request this change, please reset your password immediately and contact support.</p>

                <div class="footer">
                    This is an automated message — please do not reply.
                </div>

            </div>
        </body>
        </html>
        """


        # Attach plain + HTML versions
        message.attach(MIMEText(text_content, "plain"))
        message.attach(MIMEText(html_content, "html"))

        # Send the email
        await aiosmtplib.send(
            message,
            hostname=SMTP_SERVER,
            port=SMTP_PORT,
            start_tls=True,
            username=SMTP_USER,
            password=SMTP_PASSWORD,
        )

        logging.info(f"✅ Email sent to {recipient}")

    except Exception as e:
        logging.error(f"❌ Failed to send email to {recipient}: {e}")
        # Optionally update DB/email logs here