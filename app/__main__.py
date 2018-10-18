import argparse
import asyncio

from aiohttp import web

from . import app_async, app_sync


def create_parser():
    parser = argparse.ArgumentParser(
        description=("Launch asynchronous (aiohttp) or "
                     "synchronous (flask) planettracker server"))

    parser.add_argument("-s", "--sync", action="store_true")
    parser.add_argument("--host", default="localhost", type=str)
    parser.add_argument("--port", default=8000, type=int)

    return parser


def main():
    parsed = create_parser().parse_args()
    if parsed.sync:
        print("Starting Flask app")
        app_sync.run(
            host=parsed.host,
            port=parsed.port,
            threaded=True
        )
    else:
        print("Starting aiohttp app")

        async def start_async_app():
            runner = web.AppRunner(app_async)
            await runner.setup()
            site = web.TCPSite(
                runner, parsed.host, parsed.port)
            await site.start()
            print(f"Serving up app on {parsed.host}:{parsed.port}")
            return runner, site

        loop = asyncio.get_event_loop()
        runner, site = loop.run_until_complete(start_async_app())
        try:
            loop.run_forever()
        except KeyboardInterrupt:
            loop.run_until_complete(runner.cleanup())



main()
