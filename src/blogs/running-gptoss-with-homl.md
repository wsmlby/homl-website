---
title: "Running OpenAI's new GPT-OSS Models with HoML"
date: "2025-08-10"
author: "HoLM Team"
---

The AI world is buzzing, and for good reason! In a significant move for the open-source community, OpenAI has released its first open-weight models since GPT-2, dubbed "GPT-OSS". You can read their official announcement [here](https://openai.com/blog/gpt-oss).

At HoML, our goal is to blend the power of high-performance inference with a simple, intuitive experience. True to that mission, we've integrated these new models, and this post will guide you through getting them running on your own hardware.

The new release includes two models: a 20-billion parameter model and a massive 120-billion parameter model for more demanding tasks.

### Hardware Requirements

Before you dive in, let's talk about what you'll need.

*   **GPU:** Currently, running these models with HoML requires an **NVIDIA GPU**.
*   **VRAM:** These are powerful models, so they require a good amount of GPU memory.
    *   For the **20B model**, we recommend at least **16GB of VRAM** for a good experience.
    *   For the **120B model**, you'll need a datacenter-grade setup with at least **80GB of VRAM**.

### Getting Started

Ready to go? First, you'll need to install our experimental server image which contains all the necessary components. You can do this with a single command using the `--gptoss` flag:

```bash
homl install --gptoss
```

The vLLM support for GPT-OSS models is still experimental, so you need to use the `--gptoss` flag to enable it. This command downloads and sets up the environment required to run the GPT-OSS models efficiently.

Once the installation is complete, you can pull and run the models just like any other model in HoML.

To run the 20B parameter model, which is great for getting started:

```bash
homl pull gpt-oss:20b
homl run gpt-oss:20b
```

If you have the hardware to handle it and want to leverage the full capabilities of the larger model, you can run the 120B version:

```bash
homl pull gpt-oss:120b
homl run gpt-oss:120b
```

Please be patient! The first time you run a model, it may take **several minutes** to initialize.

That's all there is to it! You are now running a state-of-the-art open-weight model from OpenAI, right from your own machine with HoML. We're incredibly excited to see what the community builds with these new tools. Happy coding!

If you encounter any issues or wish to switch back to the stable version, you can always revert by running:

```bash
homl install
```
This will install the latest stable version of HoML without the experimental GPT-OSS support.


The vLLM support for GPT-OSS models are still experimental, so you need to use the `--gptoss` flag to enable it.

This command downloads and sets up the environment required to run the GPT-OSS models efficiently.

Once the installation is complete, you can pull and run the models just like any other model in HoML.

To run the 20B parameter model, which is great for getting started quickly:

```bash
homl pull gpt-oss:20b
homl run gpt-oss:20b
```

If you have more powerful hardware and want to leverage the full capabilities of the larger model, you can run the 120B version:

```bash
homl pull gpt-oss:120b
homl run gpt-oss:120b
```

That's all there is to it! You are now running a state-of-the-art open-weight model from OpenAI, right from your own machine with HoML. We're excited to see what the community builds with these new tools. Happy coding!


If you encounter any issues with other models running on the gpt-oss version of the server, you can always revert to the previous version by running:

```bash
homl install
```
This will install the latest stable version of HoML without the experimental GPT-OSS support.