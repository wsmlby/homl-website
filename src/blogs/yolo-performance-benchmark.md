---
title: "YOLOv8s Performance Benchmarks: A Data-Driven GPU Comparison"
date: "2025-08-20"
author: "The HoML Team"
---

When evaluating hardware for computer vision tasks, concrete data is often hard to come by. How much faster is a data center GPU like an H100 compared to a consumer-grade RTX 4000 for a real-world workload? Is it worth upgrading from a T4 to an L4? And what is the true performance gap between a GPU and a CPU?

This post aims to provide clear, data-driven answers to these questions. We've benchmarked a range of modern NVIDIA GPUs and CPU configurations on a common object detection task: running a **YOLOv8s** model with an **image size of 320**. Our goal is to provide a valuable reference point that is missing from the public domain, helping you make more informed hardware decisions.

All GPU benchmarks were conducted using the PyTorch version of YOLOv8s. The NVIDIA drivers used were version 570 for the EC2 instances (T4, A10G, L4), 565 for the H100, and 575 for the RTX 4000 SFF Ada workstation card. For the CPU, we compare the performance of PyTorch and OpenVINO.

## Peak Performance: A Hardware Showdown

Let's start with a simple question: what's the fastest hardware for a typical YOLOv8s workload? We ran benchmarks across several NVIDIA GPUs and a multi-core CPU to find the maximum achievable Frames Per Second (FPS).

<svg id="peakPerformanceChart" class="my-8"></svg>

The data reveals two crucial insights. First, even the slowest GPU we tested (the NVIDIA T4 on AWS g4dn) is **over 30 times faster** than a single vCPU running an optimized OpenVINO workload (360 FPS vs. ~11 FPS). Second, the data quantifies the massive performance gap between hardware tiers. A top-tier H100, when fully saturated with concurrent workloads, is **~7.3x faster** than a highly capable RTX 4000 SFF Ada (a 70W workstation GPU) and **~11x faster** than an L4, providing a clear picture of the performance you get for the money.

## The Concurrency Advantage: More Throughput on Modern GPUs

Achieving high FPS with a single, batched process is a great start, but what happens when you need to serve multiple video streams or users at once? For smaller models like YOLO on large, modern GPUs, you can often achieve significantly higher total throughput by running multiple processes concurrently.

A single inference process, even with batching, often can't saturate a powerful GPU. The key to unlocking its full potential is to serve multiple workloads in parallel. However, simply running multiple processes that target the same GPU can lead to contention and unpredictable performance.

The solution is **NVIDIA's Multi-Process Service (MPS)**. Unlike the default GPU behavior which time-slices access for each process, MPS allows CUDA kernels from different processes to be processed truly concurrently on the GPU's hardware. This cooperative multi-tasking avoids the overhead of context switching, leading to higher overall throughput and more predictable performance.

Let's look at the NVIDIA H100. A single process achieves an impressive 1,184 FPS. But by using MPS to partition the GPU into independent "splits," we can serve more processes and drive the total throughput way up.

| Concurrent Runs (Splits) | Avg. FPS per Run | Total Combined FPS |
|:--- |:--- |:---:|
| 1 | 1184 | 1184 |
| 2 | 1025 | 2050 |
| 4 | 870 | 3480 |
| 8 | 628 | 5024 |
| 16 | 370 | 5920 |
| 24 | 260 | 6240 |
| **32** | **210** | **6720** |
| 48 | 120 | 5760 |

<svg id="h100ScalingChart" class="my-8"></svg>

As the chart shows, the total throughput on the H100 scales almost linearly before peaking at an incredible **6,720 FPS** with 32 concurrent processes. This is the key insight for deploying models like YOLO at scale: **more concurrency leads to more throughput**, as long as it's managed correctly with a tool like MPS.

We saw similar, albeit less dramatic, benefits on the NVIDIA L4. Two concurrent runs without MPS caused contention, with each process achieving ~164 FPS. With MPS isolating the two processes into 50% compute slices, each achieved a stable ~176 FPS, improving total throughput and providing predictable performance.

## CPU Inference: Getting the Most from PyTorch and OpenVINO

While GPUs are king, sometimes you're limited to a CPU. We tested both PyTorch and OpenVINO on a 4-vCPU instance to see which framework performed better.

| Framework | vCPUs | Inference FPS |
|:--- |:---:|:---:|
| PyTorch | 4 | 22.73 |
| **OpenVINO**| **4** | **28.96** |

For CPU-bound inference, a properly configured **OpenVINO is the clear winner**, delivering a **27% performance improvement** over native PyTorch. If you must run on a CPU, optimizing your software stack is critical, and OpenVINO is the right tool for the job.

## Conclusion & Key Takeaways

*   **The GPU Imperative:** Even a last-generation data center GPU like the T4 is over 30x faster than a single vCPU for YOLOv8s inference.
*   **Quantifying the Tiers:** An H100 isn't just faster—it's a different class of machine, offering 7-11x more throughput than powerful workstation GPUs like the RTX 4000 SFF Ada and L4.
*   **Concurrency is King:** For smaller models like YOLO, maximizing the performance of modern GPUs requires running multiple workloads in parallel with a tool like NVIDIA MPS.
*   **CPU Choice Matters:** If you must use a CPU, OpenVINO provides a significant ~27% performance lift over a standard PyTorch setup.

## Raw Benchmark Data

### NVIDIA H100 (with MPS)
| Concurrent Runs (Splits) | Avg. FPS per Run | Total Combined FPS |
|:--- |:--- |:---:|
| 1 | 1184 | 1184 |
| 2 | 1025 | 2050 |
| 4 | 870 | 3480 |
| 8 | 628 | 5024 |
| 16 | 370 | 5920 |
| 24 | 260 | 6240 |
| 32 | 210 | 6720 |
| 48 | 120 | 5760 |

### NVIDIA L4 (g6.xlarge)
| Metric | Batch 1 | Batch 32 |
|:--- |:---:|:---:|
| Inference FPS | 151.20 | 607.25 |

### NVIDIA A10G (g5.xlarge)
| Metric | Batch 1 | Batch 32 |
|:--- |:---:|:---:|
| Inference FPS | 140.34 | 463.46 |

### RTX 4000 SFF Ada
| Metric | Batch 1 | Batch 32 |
|:--- |:---:|:---:|
| Inference FPS | 145.28 | 527.93 |

#### RTX 4000 SFF Ada (Concurrency with MPS)
| Concurrent Runs | Avg. FPS per Run | Total Combined FPS |
|:--- |:---:|:---:|
| 1 | 680 | 680 |
| 2 | 450 | 900 |
| 4 | 230 | 920 |

### NVIDIA T4 (g4dn.xlarge)
| Metric | Batch 1 | Batch 32 |
|:--- |:---:|:---:|
| Inference FPS | 130.20 | 360 |

### CPU Baseline (c5.xlarge)
| Framework | vCPUs | Inference FPS |
|:--- |:---:|:---:|
| PyTorch | 1 | 11.37 |
| OpenVINO| 1 | 11.32 |
| PyTorch | 4 | 22.73 |
| OpenVINO| 4 | 28.96 |

<script src="https://cdn.jsdelivr.net/npm/chart.xkcd@1.1/dist/chart.xkcd.min.js"></script>
<script>
document.addEventListener('DOMContentLoaded', function () {
    // Peak Performance Chart
    const peakPerfLabels = ['CPU (4-vCPU, OpenVINO)', 'T4', 'A10G', 'RTX 4000 SFF Ada (4 runs)', 'L4', 'H100 (32 runs)'];
    const peakPerfData = [28.96, 360, 463.46, 920, 607.25, 6720];

    new chartXkcd.Bar(document.getElementById('peakPerformanceChart'), {
        title: 'Peak YOLOv5 Throughput (FPS)',
        xLabel: 'Hardware',
        yLabel: 'Frames Per Second',
        data: {
            labels: peakPerfLabels,
            datasets: [{
                data: peakPerfData,
            }]
        },
        options: {
            yTickCount: 6,
        }
    });

    // H100 Scaling Chart
    const h100Concurrency = [1, 2, 4, 8, 16, 24, 32, 48];
    const h100TotalFps = [1184, 2050, 3480, 5024, 5920, 6240, 6720, 5760];

    new chartXkcd.XY(document.getElementById('h100ScalingChart'), {
        title: 'H100 Total Throughput vs. Concurrency (with MPS)',
        xLabel: 'Number of Concurrent Runs',
        yLabel: 'Total Combined FPS',
        data: {
            datasets: [{
                label: 'Total FPS',
                data: h100Concurrency.map((c, i) => ({ x: c, y: h100TotalFps[i] }))
            }]
        },
        options: {
            xTickCount: 8,
            yTickCount: 7,
            legendPosition: chartXkcd.config.positionType.upRight,
            showLine: true,
            timeFormat: undefined,
            dotSize: 1,
        }
    });
});
</script>
