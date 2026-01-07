# app/websocket_manager.py
from typing import Dict, Set, Any
import asyncio
import json
import uuid
import logging
from fastapi import WebSocket
from redis_maneger import redis_manager


logger = logging.getLogger(__name__)

class ConnectionManager:
    def __init__(self):
        # Store active connections: connection_id -> (websocket, user_id)
        self.active_connections: Dict[str, tuple[WebSocket, str]] = {}
        
    async def connect(self, websocket: WebSocket, user_id: str):
        """Accept WebSocket connection and store it"""
        await websocket.accept()
        connection_id = str(uuid.uuid4())
        self.active_connections[connection_id] = (websocket, user_id)
        
        # Store in Redis
        await redis_manager.set_user_online(user_id, connection_id)
        
        logger.info(f"User {user_id} connected with ID {connection_id}")
        return connection_id

    async def disconnect(self, connection_id: str):
        """Remove WebSocket connection"""
        if connection_id in self.active_connections:
            websocket, user_id = self.active_connections[connection_id]
            
            # Remove from Redis
            from redis_maneger import redis_manager
            await redis_manager.set_user_offline(connection_id)
            
            # Close WebSocket
            try:
                await websocket.close()
            except Exception:
                pass
            
            del self.active_connections[connection_id]
            logger.info(f"User {user_id} disconnected (connection {connection_id})")

    async def send_personal_message(self, message: dict, user_id: str):
        """Send message to specific user's all connections"""
        from redis_maneger import redis_manager
        
        # Get all connections for this user
        connection_ids = await redis_manager.get_user_connections(user_id)
        
        for connection_id in connection_ids:
            if connection_id in self.active_connections:
                websocket, _ = self.active_connections[connection_id]
                try:
                    await websocket.send_json(message)
                    logger.debug(f"Sent message to user {user_id} via connection {connection_id}")
                except Exception as e:
                    logger.error(f"Failed to send to {connection_id}: {e}")
                    await self.disconnect(connection_id)

    async def broadcast(self, message: dict):
        """Send message to all connected clients"""
        disconnected = []
        
        for connection_id, (websocket, user_id) in self.active_connections.items():
            try:
                await websocket.send_json(message)
            except Exception as e:
                logger.error(f"Failed to broadcast to {connection_id}: {e}")
                disconnected.append(connection_id)
        
        # Clean up disconnected clients
        for connection_id in disconnected:
            await self.disconnect(connection_id)

    def get_online_users(self) -> Set[str]:
        """Get set of currently online user IDs"""
        return {user_id for _, user_id in self.active_connections.values()}

# Global WebSocket manager instance
connection_manager = ConnectionManager()