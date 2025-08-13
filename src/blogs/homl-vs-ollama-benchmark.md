---
title: "HoML vs. Ollama: A Deep Dive into Performance"
date: "2025-08-13"
author: "The HoML Team"
---

At HoML, our goal is to merge the high-performance inference of vLLM with a user-friendly experience similar to Ollama. But how does HoML stack up in a head-to-head comparison? In this post, we'll dive into a detailed performance benchmark between HoML and Ollama to help you understand the strengths of each tool.

## Benchmark Setup
All tests were conducted on a machine with an **RTX 4000 Ada SFF** GPU, using the `qwen3:0.6b` model. We measured performance with a larger prompt (around 630 input tokens), generating 512 output tokens.

## Generation Throughput
Generation throughput (tokens/second) measures how quickly the model can produce output after processing the prompt. This is a critical metric for applications where response speed is key.

<svg id="genThroughputLargePromptChart" class="my-8"></svg>

The chart clearly shows that **HoML's generation throughput scales significantly better with increasing concurrency**. While Ollama is very fast for a single user, its throughput remains relatively flat as more concurrent requests are added. In contrast, HoML's throughput continues to climb, making it ideal for serving multiple users simultaneously.

## Startup Time
One area where Ollama currently has an advantage is startup time. In our tests, Ollama started in just **2 seconds**. HoML's default mode takes **22 seconds** to start, as it does some pre-computation to optimize for inference speed. However, we've introduced an **Eager Mode** which brings the startup time down to just **8 seconds**, making it much more competitive for scenarios where you need to get up and running quickly.

## A Note on CPU Usage
Another important observation from our testing relates to CPU usage. During inference, Ollama's CPU usage consistently reached 100% on a single core. In contrast, HoML's CPU usage was barely noticeable. This is because HoML is designed to offload the heavy lifting to the GPU, leaving your CPU free for other tasks. This makes HoML a better choice for environments where the host machine is also used for other activities, which is common in a homelab setup.

## Conclusion: Which Tool is Right for You?

### Choose Ollama if:
*   You are running models for personal use or local development on your workstation.
*   You need to start and stop the server frequently.
*   Your application has low concurrency requirements (e.g., a single user).

### Choose HoML if:
*   You are a homelab user who wants to host a central LLM service for yourself, family, or friends.
*   You are building an application to serve multiple users concurrently.
*   High generation throughput under load is a critical requirement.
*   You want to minimize CPU usage during inference.
*   You need a balance between fast startup and high performance (with Eager Mode).

We are committed to making HoML the best platform for running local AI at scale. These benchmark results highlight the power of the vLLM engine for high-concurrency workloads, and we are excited to continue improving HoML's performance and usability.

## Raw Benchmark Data
### HoML
#### Input Tokens: ~630, Output Tokens: 512
| Concurrency | Generation Throughput (tokens/s) |
|-------------|----------------------------------|
| 1           | 110.79                           |
| 2           | 198.14                           |
| 4           | 341.47                           |
| 8           | 551.57                           |
| 16          | 822.37                           |
| 32          | 1101.57                          |
| 64          | 1301.82                          |

### HoML (Eager Mode)
#### Input Tokens: ~600, Output Tokens: 512
| Concurrency | Generation Throughput (tokens/s) |
|-------------|----------------------------------|
| 1           | 64.78                            |
| 2           | 114.71                           |
| 4           | 225.15                           |
| 8           | 421.19                           |
| 16          | 753.52                           |
| 32          | 1116.45                          |
| 64          | 1325.67                          |

### Ollama
#### Input Tokens: ~625, Output Tokens: 512
| Concurrency | Generation Throughput (tokens/s) |
|-------------|----------------------------------|
| 1           | 171.77                           |
| 2           | 272.75                           |
| 4           | 264.26                           |
| 8           | 256.17                           |
| 16          | 243.04                           |
| 32          | 232.40                           |
| 64          | 237.09                           |

<script src="https://cdn.jsdelivr.net/npm/chart.xkcd@1.1/dist/chart.xkcd.min.js"></script>
<script>
document.addEventListener('DOMContentLoaded', function () {
    const concurrency = [1, 2, 4, 8, 16, 32, 64];

    // Generation Throughput Data
    const genThroughputHoMLLarge = [110.79, 198.14, 341.47, 551.57, 822.37, 1101.57, 1301.82];
    const genThroughputHoMLEagerLarge = [64.78, 114.71, 225.15, 421.19, 753.52, 1116.45, 1325.67];
    const genThroughputOllamaLarge = [171.77, 272.75, 264.26, 256.17, 243.04, 232.40, 237.09];

    new chartXkcd.XY(document.getElementById('genThroughputLargePromptChart'), {
        title: 'Generation Throughput (Large Prompt)',
        xLabel: 'Concurrency',
        yLabel: 'Tokens/Second',
        data: {
            datasets: [{
                label: 'HoML',
                data: concurrency.map((c, i) => ({ x: c, y: genThroughputHoMLLarge[i] }))
            }, {
                label: 'HoML Eager',
                data: concurrency.map((c, i) => ({ x: c, y: genThroughputHoMLEagerLarge[i] }))
            }, {
                label: 'Ollama',
                data: concurrency.map((c, i) => ({ x: c, y: genThroughputOllamaLarge[i] }))
            }]
        },
        options: {
            xTickCount: 8,
            yTickCount: 5,
            legendPosition: chartXkcd.config.positionType.upRight,
            showLine: true,
            timeFormat: undefined,
            dotSize: 1,
        }
    });
});
</script>