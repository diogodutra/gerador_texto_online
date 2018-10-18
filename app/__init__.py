from aiohttp import web

from .app_async import app as app_async
from .app_sync import app as app_sync

__all__ = ["app_sync", "app_async"]
