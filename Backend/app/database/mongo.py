# # from motor.motor_asyncio import AsyncIOMotorClient # type: ignore
# # from dotenv import load_dotenv # type: ignore
# # import os


# # load_dotenv()


# # MONGO_URL = os.getenv("MONGO_DATABASE_URL")
# # client = AsyncIOMotorClient(MONGO_URL)


# # mongo_db = client["new_test"]  

# from motor.motor_asyncio import AsyncIOMotorClient # type: ignore
# from dotenv import load_dotenv # type: ignore
# import os
# import certifi # <--- ADD THIS IMPORT

# load_dotenv()

# MONGO_URL = os.getenv("MONGO_DATABASE_URL")

# # Update this line to use the certifi certificates
# ca = certifi.where()
# client = AsyncIOMotorClient(MONGO_URL, tlsCAFile=ca)

# mongo_db = client["new_test"]


from motor.motor_asyncio import AsyncIOMotorClient  # type: ignore
from dotenv import load_dotenv  # type: ignore
import os
import certifi

load_dotenv()

MONGO_URL = os.getenv("MONGO_DATABASE_URL")

if not MONGO_URL:
    raise ValueError("MONGO_DATABASE_URL is not set")

# Use TLS only for MongoDB Atlas
if "mongodb+srv://" in MONGO_URL:
    client = AsyncIOMotorClient(
        MONGO_URL,
        tls=True,
        tlsCAFile=certifi.where()
    )
else:
    client = AsyncIOMotorClient(
        MONGO_URL,
        serverSelectionTimeoutMS=30000
    )

mongo_db = client["new_test"]
