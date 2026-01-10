# from motor.motor_asyncio import AsyncIOMotorClient # type: ignore
# from dotenv import load_dotenv # type: ignore
# import os


# load_dotenv()


# MONGO_URL = os.getenv("MONGO_DATABASE_URL")
# client = AsyncIOMotorClient(MONGO_URL)


# mongo_db = client["new_test"]  

from motor.motor_asyncio import AsyncIOMotorClient # type: ignore
from dotenv import load_dotenv # type: ignore
import os
import certifi # <--- ADD THIS IMPORT

load_dotenv()

MONGO_URL = os.getenv("MONGO_DATABASE_URL")

# Update this line to use the certifi certificates
ca = certifi.where()
client = AsyncIOMotorClient(MONGO_URL, tlsCAFile=ca)

mongo_db = client["new_test"]
