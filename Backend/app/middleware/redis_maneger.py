import redis.asyncio as redis
import json
from typing import Optional, Dict, Any
import logging


logger = logging.getLogger(__name__)


class RedisManager:
    def __init__(self, host: str = "localhost", port: int = 6379, db: int = 0):
        self.redis_client: Optional[redis.Redis] = None
        self.host = host
        self.port = port
        self.db = db
        self.pubsub: Optional[redis.Redis.pubsub] = None

    async def connect(self):
        try:
            self.redis_client = await redis.Redis(
                host=self.host,
                port=self.port,
                db=self.db,
                decode_responses=True,
                socket_keepalive=True
            )
            await self.redis_client.ping()
            
            logger.info("Connected to Redis successfully")
            
        except Exception as e:
            logger.error(f"Failed to connect to Redis: {e}")
            raise

    async def disconnect(self):
        if self.redis_client:
            await self.redis_client.close()
            logger.info("Disconnected from Redis")
            

    async def publish_notification(self, channel: str, notification: Dict[str, Any]):
        if self.redis_client:
            await self.redis_client.publish(
                channel, 
                json.dumps(notification)
            )
            logger.debug(f"Published notification to channel {channel}")

    async def subscribe_to_channel(self, channel: str):
        if self.redis_client:
            self.pubsub = self.redis_client.pubsub()
            await self.pubsub.subscribe(channel)
            return self.pubsub

    async def set_user_online(self, user_id: str, connection_id: str):
        """Store user's active WebSocket connection"""
        if self.redis_client:
            key = f"user:{user_id}:connections"
            await self.redis_client.sadd(key, connection_id)
            await self.redis_client.setex(
                f"connection:{connection_id}:user", 
                3600,  # 1 hour TTL
                user_id
            )

    async def set_user_offline(self, connection_id: str):
        """Remove user's WebSocket connection"""
        if self.redis_client:
            user_id = await self.redis_client.get(f"connection:{connection_id}:user")
            if user_id:
                key = f"user:{user_id}:connections"
                await self.redis_client.srem(key, connection_id)
            await self.redis_client.delete(f"connection:{connection_id}:user")

    async def get_user_connections(self, user_id: str):
        """Get all active connections for a user"""
        if self.redis_client:
            key = f"user:{user_id}:connections"
            return await self.redis_client.smembers(key)
        return set()

    async def store_notification(self, user_id: str, notification: Dict[str, Any]):
        """Store notification in Redis for persistence"""
        if self.redis_client:
            key = f"user:{user_id}:notifications"
            notification_id = await self.redis_client.incr("notification:id")
            notification["id"] = notification_id
            notification["created_at"] = notification.get("created_at")
            
            # Store in list (limit to last 100 notifications)
            await self.redis_client.lpush(key, json.dumps(notification))
            await self.redis_client.ltrim(key, 0, 99)
            
            # Also store in hash for individual access
            hash_key = f"notification:{notification_id}"
            await self.redis_client.hset(hash_key, mapping=notification)
            await self.redis_client.expire(hash_key, 86400 * 7)  # 7 days
            
            return notification_id

    async def get_user_notifications(self, user_id: str, limit: int = 50):
        """Get recent notifications for a user"""
        if self.redis_client:
            key = f"user:{user_id}:notifications"
            notifications = await self.redis_client.lrange(key, 0, limit - 1)
            return [json.loads(n) for n in notifications]
        return []


redis_manager = RedisManager()