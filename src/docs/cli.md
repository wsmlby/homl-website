---
title: "CLI Reference"
page: "docs/cli.md"
---

## HoML CLI Documentation

### Install HoML
Go to the [download page](/download.html) to get the HoML CLI for your system. Once installed, run the following command to set up the HoML server:
```bash
homl server install
```

### Pull a model from Hugging Face Hub
Download a model to your local machine. You can use a shorthand alias for curated models.
```bash
homl pull qwen3:0.6b
```
Or use the full Hugging Face model ID:
```bash
homl pull Qwen/Qwen3-0.6B
```
To refresh the model's configuration and override any local changes, use the `--config` flag. This is useful if you've made changes to the launch parameters and want to revert to the defaults.
```bash
homl pull qwen3:0.6b --config
```

### Run a model
Run a downloaded model. This will start the model and make it available for chat and API access.
```bash
homl run qwen3:0.6b
```
For a faster startup, you can use eager mode. This mode has slower latency but similar throughput.
```bash
homl run qwen3:0.6b --eager
```

### Run a model in interactive chat mode
Start a conversation with a model.
```bash
homl chat qwen3:0.6b
```

### Run a model in complete mode
Ask the model for text completion. This will work for models that doesn't have a chat template.
```bash
homl complete gemma-3:270m-it "3.1415926"
```

### Eager Mode for Faster Model Loading
To improve your experience, HoML now uses **Eager Mode** by default for interactive sessions and automatic model switching. This significantly reduces model startup times.

Specifically:
*   The `homl chat` command automatically starts the model in Eager Mode.
*   When the server switches models due to an API request, the new model is also loaded in Eager Mode.

This results in much faster model loading. For example, we've observed startup time improvements from **38s to 18s** for `gpt-oss:20b` and from **22s to 8s** for `qwen3:0.6b`.

If you need the lowest possible latency for individual requests and don't mind a longer initial startup, you can still use the standard `homl run <model_name>` command without the `--eager` flag.

### List local models
List all models that are available locally.
```bash
homl list
```

### Check running models
Check the status of models that are currently running.
```bash
homl ps
```

### Stop a model
Stop a running model to free up resources.
```bash
homl stop qwen3:0.6b
```

### Automatic GPU Memory Management
HoML is designed to manage your GPU resources efficiently. When you make a request to the OpenAI-compatible API for a specific model, HoML automatically loads it into memory.
Currently, only one model can run at a time. If you make a request for a different model, HoML will unload the previous one and load the new one.

To free up your GPU for other applications, models are automatically unloaded after a period of inactivity. The default idle timeout is **10 minutes**. You can configure this timeout using the `homl config set model_unload_idle_time <seconds>` command.

### Authenticate with Hugging Face
Set your Hugging Face token to pull private or gated models. You can provide the token directly or load it automatically from the default Hugging Face cache.
```bash
homl auth hugging-face <your-token>
```
Or load it automatically:
```bash
homl auth hugging-face --auto
```

### Manage HoML Server
You can manage the HoML server with the following commands:
```bash
homl server stop
homl server restart
homl server log
```

### Manage HoML Configuration
You can manage the HoML configuration with the following commands:
```bash
homl config list
```
Get a config value:
```bash
homl config get port
```
Set a config value:
```bash
homl config set port 8080
```

### Manage Model-Specific Configuration
You can manage model-specific configurations, such as launch parameters, with the following commands:
```bash
homl config model <model_name> --params <launch_params>
```
Get a model's config:
```bash
homl config model <model_name> --get
```
