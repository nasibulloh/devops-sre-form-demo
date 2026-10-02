#!/usr/bin/env python3
"""Builds index.html: the bot's Mini App page with demo-shim.js (a fake API over fixture.json) injected.

Usage: python3 build.py [path/to/devops-sre-bot/src/main/resources/static/miniapp/index.html]
"""
import json
import pathlib
import sys

HERE = pathlib.Path(__file__).resolve().parent
SOURCE = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else \
    pathlib.Path.home() / "IdeaProjects/devops-sre-bot/src/main/resources/static/miniapp/index.html"
TAG = '<script src="https://telegram.org/js/telegram-web-app.js"></script>'

page = SOURCE.read_text(encoding="utf-8")
if TAG not in page:
    sys.exit("telegram-web-app.js tag not found in " + str(SOURCE))
# compact JSON; "</" escaped so the data can never close the script element
fixture = json.dumps(json.loads((HERE / "fixture.json").read_text(encoding="utf-8")), ensure_ascii=False).replace("</", "<\\/")
shim = (HERE / "demo-shim.js").read_text(encoding="utf-8").replace("__FIXTURE__", fixture)
page = page.replace(TAG, TAG + "\n<script>\n" + shim + "</script>", 1)
page = page.replace("<title>Заявка в DevOps / SRE</title>", "<title>Заявка в DevOps / SRE · демо</title>", 1)
(HERE / "index.html").write_text(page, encoding="utf-8")
print("index.html built from", SOURCE)
