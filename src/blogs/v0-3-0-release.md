---
title: "HoML v0.3.0: Customize Your Model Launch Options"
date: "August 16, 2025"
author: "The HoML Team"
---

We're excited to announce the release of HoML v0.3.0! This release introduces a powerful new feature that gives you more control over your models: customizable launch options.

## Take Control of Your Models

With the new `homl config model` command, you can now specify custom launch parameters for each of your models. This means you can fine-tune how your models are loaded and run, optimizing for your specific needs. Whether you want to enable specific features, adjust memory usage, or pass any other supported parameter, you now have the power to do so.

### How it Works

It's simple to use. Just run the following command:

```bash
homl config model <model_name> --params "<your_custom_params>"
```

For example, if you want to launch a model with a specific tensor-parallel size, you can do:

```bash
homl config model qwen3:0.6b --params "--tensor-parallel-size 2"
```

You can also view the current configuration for a model:

```bash
homl config model qwen3:0.6b --get
```

### Resetting to Default Configuration

If you've made changes to a model's launch parameters and want to revert to the default settings, you can use the `--config` flag with the `homl pull` command. This will refresh the model's configuration, overriding any local changes.

```bash
homl pull qwen3:0.6b --config
```

## Why This Matters

This new feature is all about giving you more flexibility and control. Advanced users can now experiment with different configurations to get the best performance out of their hardware. It also opens the door for supporting a wider range of models and features in the future.

## Get Started Today

Update to HoML v0.3.0 to start using customizable launch options. As always, we'd love to hear your feedback. Let us know what you think and what other features you'd like to see!
