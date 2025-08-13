---
title: "HoML v0.2.0: Blazing Fast Speeds"
date: "2025-08-12"
---

We are thrilled to announce the release of HoML v0.2.0, a landmark update focused on dramatically improving model startup times through significant architectural changes and a powerful new feature: Eager Mode.

### 🚀 Architectural Overhaul for Faster Model Loading

This architectural overhaul provides a massive boost to startup speeds right out of the box.

For example, the startup time for `qwen3:0.6b` has been slashed from 40 seconds to just 22 seconds—making it nearly **1.8x faster** even without any special flags.

### 🔥 Introducing Eager Mode: An Extra Gear for Instantaneous Startup

On top of the new architectural baseline, we're introducing **Eager Mode**, a loading mechanism that prioritizes getting you to your first token even faster.

With Eager Mode, the results are staggering:

-   **qwen3:0.6b:** Startup time plummets from 22 seconds to a mere **8 seconds**.
-   **gpt-oss:20b:** We've clocked a drop from 38 seconds to just **18 seconds**.

### CLI Enhancements

To put this power in your hands, we've updated the HoML CLI:

-   **New `--eager` flag for `homl run`:** Manually start any model in Eager Mode for the fastest possible launch.
    ```bash
    homl run qwen3:0.6b --eager
    ```
-   **Smarter Defaults for a Seamless Experience:**
    -   The `homl chat` command now uses Eager Mode by default, letting you start conversations almost instantly.
    -   The server also defaults to Eager Mode when automatically switching models, ensuring a smooth and rapid transition between different API requests.

### Our Commitment to Speed

We believe that performance is a core feature. This update, with its two-pronged approach of deep architectural improvements and the user-facing Eager Mode, reaffirms our commitment to providing a high-performance, easy-to-use local AI experience.

Upgrade to HoML v0.2.0 today to experience this new era of speed. We're excited for you to try it and welcome your feedback.

```bash
curl -sSL https://homl.dev/install.sh | sh
homl server install --upgrade
```

