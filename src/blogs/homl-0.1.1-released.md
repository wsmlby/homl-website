---
title: "HoML 0.1.1 Released: Better Compatibility and Faster Model Loading/Switching"
date: "2025-08-11"
author: "The HoML Team"
---

# HoML 0.1.1 Released: Better Compatibility and Faster Model Loading/Switching

We are thrilled to announce the release of HoML version 0.1.1! This release is a significant step forward in our mission to make large language models more accessible and efficient for everyone. With this update, we've focused on two key areas: dramatically improving model loading times and enhancing API compatibility.

## Blazing-Fast Model Loading and Switching

One of the most exciting improvements in this release is a patch we've applied to the underlying vLLM engine. This optimization significantly speeds up the model loading process.

How fast? **Our benchmarks show that models now load approximately 10 seconds faster!**

This means less time waiting and more time for you to experiment, iterate, and deploy. Whether you're loading a model for the first time or switching between different models, you'll feel the difference immediately. This enhancement streamlines workflows and makes dynamic model management a breeze.

## Enhanced OpenAI API Compatibility

To make integration as seamless as possible, we've expanded our API to be more compatible with OpenAI's standards. We believe in building an open ecosystem, and that starts with making HoML a drop-in replacement for many existing tools and applications.

In version 0.1.1, we have implemented the following widely-used endpoints:

-   `POST /v1/chat/completions`: For generating chat-based responses.
-   `POST /v1/completions`: For standard text completions.
-   `GET /v1/models`: For listing the available models that HoML can serve.
-   `POST /v1/responses`: A new endpoint for response generation.

This increased compatibility allows you to leverage the vast ecosystem of tools built for the OpenAI API while benefiting from the speed and efficiency of HoML.

## How to Upgrade

You can check your current version by running:

```bash
homl version
```

You only need the server to be on v0.1.1 to take advantage of these new features.

To upgrade to the latest version and get these new features, you only need to update the HoML server. You can do this easily with the following command:

```bash
homl server install --upgrade
```

This will download and install the latest server version, giving you immediate access to the faster model loading and expanded API compatibility.

## Get Started Today

If you haven't tried HoML yet, now is the perfect time to dive in. With these enhancements, running local AI models has never been easier or faster.

Visit [https://homl.dev](https://homl.dev) to get started, and check out our documentation for more details on how to use the new features.

We are incredibly proud of this release and the progress it represents. As always, we are humbled by the support of our community and driven by the exciting possibilities that lie ahead. Stay tuned for more updates!