# Simple Web HID Tool

A simple graphical HID debugger for the browser. Use it to inspect and send HID reports without extra native apps.

---

## English

This project is a **graphical HID debugger** built to make it easy for **Mac users** to debug HID devices in the browser. On macOS, native HID tooling can be limited; this web-based tool uses the [WebHID API](https://developer.mozilla.org/en-US/docs/Web/API/WebHID_API) so you can connect to devices, view device info and report descriptors, receive input reports, and send output reports—all from a single page.

We hope every Mac user can use it to develop and debug HID applications more easily.

**Features:**

- Select and connect to HID devices (with browser permission)
- View device info (product name, Vendor ID, Product ID, usage pages, report IDs)
- Receive and display HID input reports (Hex / Dec, configurable separator)
- Send HID output reports (hex bytes, auto-formatted with spaces)

**Run locally:** `pnpm install` then `pnpm dev`.  
**Demo:** [https://web-hid-tool.vercel.app/](https://web-hid-tool.vercel.app/)

---

## 中文

本项目是一个**图形化 HID 调试器**，主要为 **Mac 用户**在浏览器中方便地调试 HID 设备而写。在 macOS 上，系统自带的 HID 调试手段往往有限；本工具基于 [WebHID API](https://developer.mozilla.org/zh-CN/docs/Web/API/WebHID_API)，可以在同一页面完成设备选择与连接、查看设备信息与报表描述、接收输入报表以及发送输出报表。

希望所有 Mac 用户都能借助它更顺畅地开发和调试 HID 应用。

**功能概览：**

- 选择并连接 HID 设备（需浏览器授权）
- 查看设备信息（产品名、Vendor ID、Product ID、Usage Page、Report ID 等）
- 接收并显示 HID 输入报表（支持 Hex / Dec 显示，分隔符可配置）
- 发送 HID 输出报表（十六进制字节，自动按字节加空格）

**本地运行：** 执行 `pnpm install` 后运行 `pnpm dev`。  
**在线演示：** [https://web-hid-tool.vercel.app/](https://web-hid-tool.vercel.app/)
