import ssl
import asyncio

from aiohttp import web

from . import app


ssl_context = ssl.create_default_context(ssl.Purpose.CLIENT_AUTH)
ssl_context.load_cert_chain('domain_srv.crt', 'domain_srv.key')
# ssl_context.load_default_certs()
web.run_app(
    app,
    ssl_context=ssl_context
)
