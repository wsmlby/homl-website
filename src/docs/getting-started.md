---
title: "Getting Started"
page: "docs/getting-started.md"
---

## Getting Started with HoML
This guide will walk you through setting up HoML, running your first model, and interacting with it through the command line and the OpenAI-compatible API.

### Step 1: Install HoML
First, head over to the [download page](/download.html) to get the HoML CLI for your system. Once it's installed, you need to set up the HoML server. This one-time command will download and configure the necessary components.
```bash
homl server install
```
This will start a OpenAI compatible API server on the port you configured, default to 7456

Even better: Install the [Open WebUI](https://github.com/open-webui/open-webui) (since v0.2.2)
```bash
homl server install --webui
```
This will start a open-webui server on port 7457

### Step 2: Pull a Model
Next, download a model to run on your local machine. We'll use a small, efficient model for this example. The server will start automatically in the background.
```bash
homl pull qwen3:0.6b
```

### Step 3: Chat with Your Model
If you installed with the --webui option, head over to [http://localhost:7457](http://localhost:7457) to access the web interface.

You also can start a conversation directly from your terminal. This is the easiest way to interact with your model.
```bash
homl chat qwen3:0.6b
```

### Step 4: Use the OpenAI-Compatible API
HoML exposes an API that is compatible with OpenAI's tools and libraries. The server runs by default on port 7456. You don't need to run the model separately; the server loads it automatically when it receives a request.

#### Using `curl`
You can send a request to the API using `curl` from your terminal.
```bash
curl -X POST http://localhost:7456/v1/chat/completions \
-H "Content-Type: application/json" \
-d 
{
  "model": "qwen3:0.6b",
  "messages": [
    {
      "role": "user",
      "content": "Explain the importance of low-latency LLMs"
    }
  ]
}
```

#### Using Python
You can also use the official OpenAI Python client to interact with the API. First, install the library:
```bash
pip install openai
```
Then, use the following Python script:
```python
from openai import OpenAI

client = OpenAI(
    base_url='http://localhost:7456/v1',
    api_key='homl' # required, but unused
)

response = client.chat.completions.create(
    model="qwen3:0.6b",
    messages=[
        {"role": "user", "content": "Explain the importance of low-latency LLMs"}
    ]
)

print(response.choices[0].message.content)
```

### Step 5: Use the OpenAI-Compatible Completion API
HoML also supports the standard OpenAI `/v1/completions` endpoint for text completion tasks. 
You can use this endpoint with tools like `curl` or the OpenAI Python client.

#### Using `curl`
Send a completion request from your terminal:
```bash
curl -X POST http://localhost:7456/v1/completions \
-H "Content-Type: application/json" \
-d 
{
  "model": "qwen3:0.6b",
  "prompt": "What is the capital of France?",
  "max_tokens": 32
}
```

#### Using Python
You can also use the OpenAI Python client for completions:
```python
from openai import OpenAI

client = OpenAI(
    base_url='http://localhost:7456/v1',
    api_key='homl' # required, but unused
)

response = client.completions.create(
    model="qwen3:0.6b",
    prompt="What is the capital of France?",
    max_tokens=32
)

print(response.choices[0].text)
```
