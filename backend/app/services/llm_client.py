import os
import json
import requests
from typing import Tuple, Optional
from app.core.config import settings


def _env(name: str, fallback: str = "") -> str:
    v = os.getenv(name)
    if v:
        return v
    try:
        v2 = getattr(settings, name)
        if v2:
            return str(v2)
    except Exception:
        pass
    return os.getenv(f"DASHSCOPE_{name.split('AI_')[-1]}", fallback)


def _load_system_prompt() -> Optional[str]:
    try:
        prompt_env = os.getenv("AI_SYSTEM_PROMPT")
        if prompt_env:
            return prompt_env
        prompt_file = os.getenv("AI_PROMPT_FILE") or os.path.join(os.path.dirname(os.path.dirname(__file__)), "resources", "prompts", "assistant.txt")
        if os.path.exists(prompt_file):
            with open(prompt_file, "r", encoding="utf-8") as f:
                return f.read()
    except Exception:
        pass
    return None


def chat(message: str) -> Tuple[str, bool]:
    base = _env("AI_BASE_URL")
    key = _env("AI_API_KEY")
    model = _env("AI_MODEL")
    timeout_s = _env("AI_TIMEOUT_SECONDS", "20")
    try:
        if not base or not key or not model:
            return (f"已收到：{message}\n目前为示范回复。", False)
        url = base.rstrip("/") + "/chat/completions"
        headers = {"Authorization": f"Bearer {key}", "Content-Type": "application/json"}
        sys_prompt = _load_system_prompt()
        msgs = []
        if sys_prompt:
            msgs.append({"role": "system", "content": sys_prompt})
        msgs.append({"role": "user", "content": message})
        data = {"model": model, "messages": msgs}
        r = requests.post(url, headers=headers, data=json.dumps(data), timeout=int(timeout_s))
        if r.status_code != 200:
            alt_model = "qwen-max"
            if model != alt_model:
                data["model"] = alt_model
                r2 = requests.post(url, headers=headers, data=json.dumps(data), timeout=int(timeout_s))
                if r2.status_code == 200:
                    j = r2.json()
                    c = j.get("choices") or []
                    if not c:
                        return (f"已收到：{message}", True)
                    m = c[0].get("message") or {}
                    content = m.get("content") or ""
                    if not content:
                        content = f"已收到：{message}"
                    return (content, True)
            return (f"已收到：{message}\n服务暂不可用。", False)
        j = r.json()
        c = j.get("choices") or []
        if not c:
            return (f"已收到：{message}", True)
        m = c[0].get("message") or {}
        content = m.get("content") or ""
        if not content:
            content = f"已收到：{message}"
        return (content, True)
    except Exception:
        return (f"已收到：{message}\n服务暂不可用。", False)


def chat_stream(message: str):
    base = _env("AI_BASE_URL")
    key = _env("AI_API_KEY")
    model = _env("AI_MODEL")
    timeout_s = _env("AI_TIMEOUT_SECONDS", "20")
    sys_prompt = _load_system_prompt()
    if not base or not key or not model:
        def gen_fallback():
            content, _ = chat(message)
            for i in range(0, len(content), 40):
                yield content[i:i+40]
        return gen_fallback()
    url = base.rstrip("/") + "/chat/completions"
    headers = {"Authorization": f"Bearer {key}", "Content-Type": "application/json"}
    msgs = []
    if sys_prompt:
        msgs.append({"role": "system", "content": sys_prompt})
    msgs.append({"role": "user", "content": message})
    data = {"model": model, "messages": msgs, "stream": True}
    try:
        r = requests.post(url, headers=headers, data=json.dumps(data), timeout=int(timeout_s), stream=True)
        if r.status_code != 200:
            alt_model = "qwen-max"
            if model != alt_model:
                data["model"] = alt_model
                r = requests.post(url, headers=headers, data=json.dumps(data), timeout=int(timeout_s), stream=True)
            if r.status_code != 200:
                def gen_err():
                    content, _ = chat(message)
                    for i in range(0, len(content), 40):
                        yield content[i:i+40]
                return gen_err()
        def gen_stream():
            for line in r.iter_lines(decode_unicode=True):
                if not line:
                    continue
                s = line.strip()
                if s.startswith("data:"):
                    s = s[5:].strip()
                if s in ("", "[DONE]"):
                    break
                try:
                    j = json.loads(s)
                except Exception:
                    continue
                try:
                    ch = (j.get("choices") or [{}])[0]
                    delta = ch.get("delta") or {}
                    content = delta.get("content")
                    if content:
                        yield content
                except Exception:
                    continue
        return gen_stream()
    except Exception:
        def gen_exc():
            content, _ = chat(message)
            for i in range(0, len(content), 40):
                yield content[i:i+40]
        return gen_exc()


def plan(message: str) -> dict:
    base = _env("AI_BASE_URL")
    key = _env("AI_API_KEY")
    model = _env("AI_MODEL")
    timeout_s = _env("AI_TIMEOUT_SECONDS", "20")
    sys_prompt = (
        "你是旅行助手。根据用户输入，先进行简要分析，然后在 JSON 中列出需要调用的工具。"
        "仅返回一个 JSON 对象，不要包含其他文本。"
        "JSON schema: {\"analysis\": string, \"actions\": [{\"tool\": string, \"args\": object}] }。"
        "可用工具: get_my_orders({limit:int}), get_order_by_no({order_no:string}), get_order_stats({}), search_flights({departure_city:string, arrival_city:string, departure_date:string, cabin_class?:string})."
        "当无需工具时可返回空 actions。"
    )
    try:
        if not base or not key or not model:
            return {"analysis": "示范：无模型，返回空计划", "actions": []}
        url = base.rstrip("/") + "/chat/completions"
        headers = {"Authorization": f"Bearer {key}", "Content-Type": "application/json"}
        msgs = [{"role": "system", "content": sys_prompt}, {"role": "user", "content": message}]
        data = {"model": model, "messages": msgs, "response_format": {"type": "json_object"}}
        r = requests.post(url, headers=headers, data=json.dumps(data), timeout=int(timeout_s))
        if r.status_code != 200:
            alt_model = "qwen-max"
            if model != alt_model:
                data["model"] = alt_model
                r = requests.post(url, headers=headers, data=json.dumps(data), timeout=int(timeout_s))
        if r.status_code != 200:
            return {"analysis": "调用失败，返回兜底计划", "actions": []}
        j = r.json()
        c = j.get("choices") or []
        if not c:
            return {"analysis": "空输出", "actions": []}
        m = c[0].get("message") or {}
        content = m.get("content") or "{}"
        try:
            return json.loads(content)
        except Exception:
            return {"analysis": content, "actions": []}
    except Exception:
        return {"analysis": "异常兜底", "actions": []}
