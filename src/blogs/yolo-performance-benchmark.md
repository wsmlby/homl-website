---
title: "YOLOv8s Performance Benchmarks: A Data-Driven GPU Comparison"
date: "2025-08-20"
author: "The HoML Team"
---

### Updates

We've recently expanded our benchmark data! This post now includes a new data point for the **AMD 8700G (Radeon 780M iGPU)** running on ROCm 7.1.1 with PyTorch, achieving 128 FPS on single concurrency. Additionally, the 'Peak Performance: A Hardware Showdown' chart has been updated to display all data points in ascending order of Frames Per Second (FPS) for easier comparison.

# Benchmarks
When evaluating hardware for computer vision tasks, concrete data is often hard to come by. How much faster is a data center GPU like an H100 compared to a consumer-grade RTX 4000 for a real-world workload? Is it worth upgrading from a T4 to an L4? And what is the true performance gap between a GPU and a CPU?

This post aims to provide clear, data-driven answers to these questions. We've benchmarked a range of modern NVIDIA GPUs and CPU configurations on a common object detection task: running a **YOLOv8s** model with an **image size of 320**. Our goal is to provide a valuable reference point that is missing from the public domain, helping you make more informed hardware decisions.

All GPU benchmarks were conducted using the PyTorch version of YOLOv8s. The NVIDIA drivers used were version 570 for the EC2 instances (T4, A10G, L4), 565 for the H100, and 575 for the RTX 4000 SFF Ada workstation card. For the CPU, we compare the performance of PyTorch and OpenVINO.

## Peak Performance: A Hardware Showdown

Let's start with a simple question: what's the fastest hardware for a typical YOLOv8s workload? We ran benchmarks across several NVIDIA GPUs and a multi-core CPU to find the maximum achievable Frames Per Second (FPS).

<svg id="peakPerformanceChart" class="my-8"></svg>
<p class="text-center text-sm text-gray-600 -mt-4">
    <strong>Note:</strong> Chart shows peak throughput. <strong>CPU:</strong> 4-vCPU w/ OpenVINO. <strong>RTX 4000:</strong> 4 concurrent runs. <strong>RTX 4060:</strong> 100W laptop GPU w/ 8 concurrent runs. <strong>H100:</strong> 32 concurrent runs. All GPUs use NVIDIA MPS.
</p>

The data reveals two crucial insights. First, even the slowest GPU we tested (the NVIDIA T4 on AWS g4dn) is **over 30 times faster** than a single vCPU running an optimized OpenVINO workload (360 FPS vs. ~11 FPS). Second, the data quantifies the massive performance gap between hardware tiers. A top-tier H100, when fully saturated with concurrent workloads, is **~6.7x faster** than a highly capable RTX 4060 and **~11x faster** than an L4, providing a clear picture of the performance you get for the money.

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

## The MPS Advantage on Consumer GPUs: A 4060 Case Study

The benefits of MPS aren't limited to data center GPUs. We tested an RTX 4060 (laptop, 100W) with a batch size of 32 to see how MPS affects performance under concurrent loads.

#### Without MPS
| Concurrency | Avg. FPS per Run | Total Combined FPS |
|:--- |:---:|:---:|
| 1 | 700 | 700 |
| 2 | 370 | 740 |
| 4 | 197 | 788 |
| 8 | 101 | 808 |

#### With MPS
| Concurrency | Avg. FPS per Run | Total Combined FPS |
|:--- |:---:|:---:|
| 1 | 700 | 700 |
| 2 | 426 | 852 |
| 4 | 228 | 912 |
| 8 | 124 | 992 |

Without MPS, performance quickly degrades due to context-switching overhead. With MPS, the GPU handles concurrent processes much more gracefully. At 8 concurrent runs, MPS delivers a **22% increase in total throughput** (992 FPS vs. 808 FPS), demonstrating its value even on consumer-grade hardware.

## Impact of Batch Size on Throughput

Batch size is another critical factor. A larger batch size generally leads to higher throughput, but the benefits diminish as the GPU becomes saturated. We tested an RTX 4060 (100W, with MPS) at batch sizes of 1, 4, and 32.

<svg id="batchSizeChart" class="my-8"></svg>

As expected, `batch 32` provides the highest peak throughput. However, `batch 4` is surprisingly competitive, reaching over 1000 FPS with 8 concurrent runs. For latency-sensitive applications, a smaller batch size like 4 might offer a better trade-off between throughput and response time. `Batch 1` performance, while lower, still scales well with concurrency, making it a viable option if real-time processing of single frames is required.

## Power Limits: 100W vs. 120W

Does supplying more power to a GPU always translate to better performance? We compared the RTX 4060 at 100W and 120W power limits using a batch size of 4 with MPS.

<svg id="powerLimitChart" class="my-8"></svg>

The extra 20W provides a modest but consistent performance uplift of **around 8-10%** across different levels of concurrency. While not a groundbreaking increase, it shows that for power-constrained environments, even a small bump in wattage can yield a noticeable improvement in throughput.

## Framework Comparison: PyTorch vs. ONNX Runtime vs. TensorRT

The hardware you run on is only half the story; the software framework you use for inference can make a massive difference in performance. To quantify this, we benchmarked the same YOLOv8s model on an RTX 4060 (100W, batch size 1) using four different inference configurations:

*   **PyTorch:** The baseline, using the standard Torch-based inference.
*   **ONNX Runtime (CUDA):** Using ONNX Runtime with its CUDA Execution Provider, which offers a good out-of-the-box speedup.
*   **ONNX Runtime (TensorRT):** Using ONNX Runtime with the more optimized TensorRT Execution Provider.
*   **TensorRT (`trtexec`):** The peak performance baseline, using NVIDIA's `trtexec` tool to run a pure, highly-optimized TensorRT engine.

<svg id="frameworkChart" class="my-8"></svg>

The results are clear: moving from PyTorch to a more specialized inference framework yields significant gains. While ONNX Runtime with CUDA provides a solid boost, leveraging its TensorRT provider unlocks even more performance. For maximum throughput, a pure TensorRT implementation is the undisputed winner, delivering **over 12% more FPS** than the next best option (ONNX with TensorRT) at 8 concurrent runs and **over 2.5x the throughput of PyTorch** at a single run.

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

### RTX 4060 (100W & 120W)

#### RTX 4060 100W Framework Comparison (Batch 1, with MPS)

**PyTorch**
| Concurrency | Avg. FPS per Run | Total Combined FPS |
|:--- |:---:|:---:|
| 1 | 250 | 250 |
| 2 | 235 | 470 |
| 4 | 169 | 676 |
| 8 | 100 | 800 |

**ONNX Runtime (CUDA)**
| Concurrency | Avg. FPS per Run | Total Combined FPS |
|:--- |:---:|:---:|
| 1 | 330 | 330 |
| 2 | 272 | 544 |
| 4 | 155 | 620 |
| 8 | 85 | 680 |

**ONNX Runtime (TensorRT)**
| Concurrency | Avg. FPS per Run | Total Combined FPS |
|:--- |:---:|:---:|
| 1 | 497 | 497 |
| 2 | 355 | 710 |
| 4 | 208 | 832 |
| 8 | 100 | 800 |

**TensorRT (trtexec)**
| Concurrency | Avg. FPS per Run | Total Combined FPS |
|:--- |:---:|:---:|
| 1 | 646 | 646 |
| 2 | 392 | 784 |
| 4 | 220 | 880 |
| 8 | 113 | 904 |

#### RTX 4060 100W (Batch 32, No MPS)
| Concurrency | Avg. FPS per Run | Total Combined FPS |
|:--- |:---:|:---:|
| 1 | 700 | 700 |
| 2 | 370 | 740 |
| 4 | 197 | 788 |
| 8 | 101 | 808 |

#### RTX 4060 100W (Batch 32, with MPS)
| Concurrency | Avg. FPS per Run | Total Combined FPS |
|:--- |:---:|:---:|
| 1 | 700 | 700 |
| 2 | 426 | 852 |
| 4 | 228 | 912 |
| 8 | 124 | 992 |

#### RTX 4060 100W (Batch 4, with MPS)
| Concurrency | Avg. FPS per Run | Total Combined FPS |
|:--- |:---:|:---:|
| 1 | 616 | 616 |
| 2 | 431 | 862 |
| 4 | 240 | 960 |
| 8 | 128 | 1024 |

#### RTX 4060 100W (Batch 1, with MPS)
| Concurrency | Avg. FPS per Run | Total Combined FPS |
|:--- |:---:|:---:|
| 1 | 250 | 250 |
| 2 | 235 | 470 |
| 4 | 169 | 676 |
| 8 | 100 | 800 |

#### RTX 4060 120W (Batch 4, with MPS)
| Concurrency | Avg. FPS per Run | Total Combined FPS |
|:--- |:---:|:---:|
| 1 | 620 | 620 |
| 2 | 440 | 880 |
| 4 | 250 | 1000 |
| 8 | 138 | 1104 |

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

### AMD 8700G (Radeon 780M iGPU)
| Metric | Configuration | Inference FPS |
|:--- |:--- |:---:|
| PyTorch | AMD 8700G (Radeon 780M iGPU) on ROCm 7.1.1, single concurrency | 128 |


<script src="https://cdn.jsdelivr.net/npm/chart.xkcd@1.1/dist/chart.xkcd.min.js"></script>
<script>
document.addEventListener('DOMContentLoaded', function () {
    // Peak Performance Chart
    const peakPerfLabels = ['CPU', '8700G (iGPU)', 'T4', 'A10G', 'L4', 'RTX 4000', 'RTX 4060', 'H100'];
    const peakPerfData = [28.96, 128, 360, 463.46, 607.25, 920, 992, 6720];

    new chartXkcd.Bar(document.getElementById('peakPerformanceChart'), {
        title: 'Peak YOLOv8s Throughput (FPS)',
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
            }, {
                label: 'invisible',
                data: [{ x: 0, y: 0 }],
                options: { showLine: false }
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

    // Batch Size Chart
    const concurrency = [1, 2, 4, 8];
    const batch1Fps = [250, 470, 676, 800];
    const batch4Fps = [616, 862, 960, 1024];
    const batch32Fps = [700, 852, 912, 992];

    new chartXkcd.XY(document.getElementById('batchSizeChart'), {
        title: 'RTX 4060 (100W) Throughput vs. Batch Size (with MPS)',
        xLabel: 'Number of Concurrent Runs',
        yLabel: 'Total Combined FPS',
        data: {
            datasets: [{
                label: 'Batch 1',
                data: concurrency.map((c, i) => ({ x: c, y: batch1Fps[i] }))
            }, {
                label: 'Batch 4',
                data: concurrency.map((c, i) => ({ x: c, y: batch4Fps[i] }))
            }, {
                label: 'Batch 32',
                data: concurrency.map((c, i) => ({ x: c, y: batch32Fps[i] }))
            }, {
                label: 'invisible',
                data: [{ x: 0, y: 0 }],
                options: { showLine: false }
            }]
        },
        options: {
            xTickCount: 4,
            yTickCount: 5,
            legendPosition: chartXkcd.config.positionType.upLeft,
            showLine: true,
            timeFormat: undefined,
            dotSize: 1,
        }
    });

    // Framework Comparison Chart
    const frameworkConcurrency = [1, 2, 4, 8];
    const pytorchFps = [250, 470, 676, 800];
    const onnxCudaFps = [330, 544, 620, 680];
    const onnxTrtFps = [497, 710, 832, 800];
    const trtExecFps = [646, 784, 880, 904];

    new chartXkcd.XY(document.getElementById('frameworkChart'), {
        title: 'Framework Throughput on RTX 4060 (100W, Batch 1)',
        xLabel: 'Number of Concurrent Runs',
        yLabel: 'Total Combined FPS',
        data: {
            datasets: [{
                label: 'PyTorch',
                data: frameworkConcurrency.map((c, i) => ({ x: c, y: pytorchFps[i] }))
            }, {
                label: 'ONNX (CUDA)',
                data: frameworkConcurrency.map((c, i) => ({ x: c, y: onnxCudaFps[i] }))
            }, {
                label: 'ONNX (TensorRT)',
                data: frameworkConcurrency.map((c, i) => ({ x: c, y: onnxTrtFps[i] }))
            }, {
                label: 'TensorRT (trtexec)',
                data: frameworkConcurrency.map((c, i) => ({ x: c, y: trtExecFps[i] }))
            }, {
                label: 'invisible',
                data: [{ x: 0, y: 0 }],
                options: { showLine: false }
            }]
        },
        options: {
            xTickCount: 4,
            yTickCount: 5,
            legendPosition: chartXkcd.config.positionType.upLeft,
            showLine: true,
            timeFormat: undefined,
            dotSize: 1,
        }
    });

    // Power Limit Chart
    const power100WFps = [616, 862, 960, 1024];
    const power120WFps = [620, 880, 1000, 1104];

    new chartXkcd.XY(document.getElementById('powerLimitChart'), {
        title: 'RTX 4060 Throughput vs. Power Limit (Batch 4, with MPS)',
        xLabel: 'Number of Concurrent Runs',
        yLabel: 'Total Combined FPS',
        data: {
            datasets: [{
                label: '100W',
                data: concurrency.map((c, i) => ({ x: c, y: power100WFps[i] }))
            }, {
                label: '120W',
                data: concurrency.map((c, i) => ({ x: c, y: power120WFps[i] }))
            }, {
                label: 'invisible',
                data: [{ x: 0, y: 0 }],
                options: { showLine: false }
            }]
        },
        options: {
            xTickCount: 4,
            yTickCount: 5,
            legendPosition: chartXkcd.config.positionType.upLeft,
            showLine: true,
            timeFormat: undefined,
            dotSize: 1,
        }
    });
});
</script>
