import os
import redis
import json
import logging
from typing import Any, Optional

logger = logging.getLogger(__name__)

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

class RedisClient:
    def __init__(self):
        self.redis_url = REDIS_URL
        self.client = None
        self.is_connected = False
        self._connect()

    def _connect(self):
        try:
            # For Azure Redis, the URL often starts with rediss:// (SSL)
            # redis.from_url handles this automatically.
            self.client = redis.from_url(
                self.redis_url, 
                decode_responses=True,
                socket_timeout=2,       # Don't hang forever if Redis is down
                socket_connect_timeout=2
            )
            # Ping to verify connection
            self.client.ping()
            self.is_connected = True
            logger.info("Successfully connected to Redis.")
        except redis.exceptions.ConnectionError as e:
            self.is_connected = False
            logger.warning(f"Redis connection failed: {e}. Application will fallback to DB/APIs.")
        except Exception as e:
            self.is_connected = False
            logger.error(f"Unexpected error connecting to Redis: {e}")

    def get(self, key: str) -> Optional[Any]:
        """Fetch a value from Redis and deserialize it."""
        if not self.is_connected:
            return None
        try:
            val = self.client.get(key)
            if val:
                return json.loads(val)
            return None
        except Exception as e:
            logger.warning(f"Redis GET error for key {key}: {e}")
            return None

    def set(self, key: str, value: Any, ttl_seconds: int = 3600) -> bool:
        """Serialize a value and store it in Redis with an expiration."""
        if not self.is_connected:
            return False
        try:
            self.client.setex(key, ttl_seconds, json.dumps(value))
            return True
        except Exception as e:
            logger.warning(f"Redis SET error for key {key}: {e}")
            return False

    def delete(self, key: str) -> bool:
        """Delete a specific key from Redis."""
        if not self.is_connected:
            return False
        try:
            self.client.delete(key)
            return True
        except Exception as e:
            logger.warning(f"Redis DELETE error for key {key}: {e}")
            return False

    def delete_pattern(self, pattern: str) -> bool:
        """Delete all keys matching a specific pattern (e.g. user:15:*)."""
        if not self.is_connected:
            return False
        try:
            keys = self.client.keys(pattern)
            if keys:
                self.client.delete(*keys)
            return True
        except Exception as e:
            logger.warning(f"Redis DELETE_PATTERN error for {pattern}: {e}")
            return False

# Create a singleton instance to be imported across the application
redis_cache = RedisClient()
