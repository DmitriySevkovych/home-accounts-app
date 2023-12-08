---
'frontend': patch
---

Allow for dynamic updates of env variables by replacing NEXT*PUBLIC* with a ClientContext (which is populated server-side and thus can be set at runtime instead of build time)
