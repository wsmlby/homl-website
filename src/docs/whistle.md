---
title: "Whistle AI CLI Reference"
page: "docs/whistle.md"
---

# Whistle AI CLI Reference
A complete guide to the Whistle AI command-line interface.

## Configuration Commands
These commands allow you to configure Whistle AI's connection to your LLM, set up alert channels, and define which logs to monitor.

#### Configure the LLM
Set the AI language model endpoint and credentials.
```bash
whistle config llm --base_url <openai_api_url> --api_key <your_api_key> --model <model_name>
```

#### Configure Alerts
Set up the notification channel. Currently supports Slack.
```bash
whistle config alert --slack <slack-webhook-url>
```

#### Configure Log Sources
Specify which logs Whistle AI should monitor.
```bash
# Watch only kernel messages (default)
whistle config log --kernel_only true

# Watch a specific systemd service unit (can be used multiple times)
whistle config log --service_unit <service_unit_name>
```

## Service Management
Commands for managing the Whistle AI monitoring service.

#### Install the Systemd Service
Installs and configures the `whistle-ai` systemd service for continuous background monitoring.
```bash
whistle service install
```
After installation, you can manage the service with standard `systemctl` commands (e.g., `sudo systemctl start whistle-ai`, `sudo systemctl enable whistle-ai`).

## Analysis and Testing
Commands for on-demand log analysis and testing your configuration.

#### Analyze Historical Logs
Perform a one-time analysis of logs from a specific time period.
```bash
whistle analyze --since <time>
```
Example: `whistle analyze --since "1 hour ago"`

#### Test Configuration
Run a test with example log messages to ensure your LLM and alert configurations are working correctly.
```bash
whistle test [--alert]
```
If the `--alert` flag is used, a test notification will be sent to your configured channel.

## Ignore Rules
Manage patterns to exclude certain log messages from triggering alerts.
Usually you don't need to modify these rules as it is automatically maintained by the LLM. However, if there are things that the LLM consider critical issues but not actually relevant, you can add ignore rules to prevent false positives.

#### List Ignore Rules
```bash
whistle ignore list
```

#### Add an Ignore Rule
```bash
whistle ignore add <name> <regex> [--comment <comment>]
```

## Example Usage Flow
1.  **Configure LLM and Alerts:**
    ```bash
    # Point to your local HoML instance
    whistle config llm --base_url http://localhost:8000/v1 --model my-local-model

    # Configure Slack notifications
    whistle config alert --slack https://hooks.slack.com/services/XXX/YYY/ZZZ
    ```
2.  **(Optional) Analyze recent logs to fine-tune:**
    ```bash
    whistle analyze --since "30 minutes ago"
    ```
3.  **Install and start the service:**
    ```bash
    whistle service install
    sudo systemctl start whistle-ai
    sudo systemctl enable whistle-ai
    ```
