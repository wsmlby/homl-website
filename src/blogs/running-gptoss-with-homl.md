---
title: "Running GPT-OSS Models with HoML"
date: "2025-08-10"
author: "Jules"
---

HoML now supports running GPT-OSS models. This post will guide you through the process.

First, you need to install the experimental server image using the `--gptoss` flag:

```bash
homl install --gptoss
```

This will download and install the necessary components to run the GPT-OSS models.

Once the installation is complete, you can pull and run the models as you would with any other model in HoML. For example, to run the 20B parameter model:

```bash
homl pull gpt-oss:20b
homl run gpt-oss:20b
```

That's it! You are now running a powerful open-weight model from OpenAI with HoML.
