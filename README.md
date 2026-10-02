# DevOps / SRE request form — demo

A clickable demo of the Telegram Mini App form that files requests to the DevOps / SRE team: deploys, hotfixes,
rollbacks, infrastructure, access, incidents, mobile releases.

**Demo only:** the projects and repositories are fictional and nothing is sent anywhere. After «Отправить» the last
screen shows what the form would have sent to the bot.

## Try it

| What | Link |
| --- | --- |
| Pick a request type | [https://nasibulloh.github.io/devops-sre-form-demo/](https://nasibulloh.github.io/devops-sre-form-demo/) |
| Opened by `/hotfix` (type preselected) | [?startapp=type_hotfix](https://nasibulloh.github.io/devops-sre-form-demo/?startapp=type_hotfix) |
| Incident: severity, time | [?startapp=type_incident](https://nasibulloh.github.io/devops-sre-form-demo/?startapp=type_incident) |
| Access: date, role suggestions | [?startapp=type_access](https://nasibulloh.github.io/devops-sre-form-demo/?startapp=type_access) |
| A returned request being fixed | [?startapp=fix_demo](https://nasibulloh.github.io/devops-sre-form-demo/?startapp=fix_demo) |
| Dark theme (outside Telegram) | [?theme=dark](https://nasibulloh.github.io/devops-sre-form-demo/?theme=dark) |

Inside Telegram the page uses the native Main and Back buttons and the chat's theme; in a browser it shows its own
send button.

## Build

`index.html` is generated — the bot's page with `demo-shim.js` (fake API over `fixture.json`) injected:

```sh
python3 build.py [path/to/devops-sre-bot/src/main/resources/static/miniapp/index.html]
```
