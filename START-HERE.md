# VS Code 截图与提交清单

本文件放在项目根目录，用于完成课程要求中的 VS Code + Codex 多轮对话截图。

## 第一步：正确打开项目

1. 关闭旧的 `html5-layout-main` 工作区窗口。
2. 双击 `ai-teaching-platform.code-workspace`，或在 VS Code 中选择“文件 -> 打开文件夹”，打开当前目录。
3. 等待左下角工作区加载完成，确认资源管理器根目录直接显示 `index.html`、`register.html`、`css`、`js` 和 `docs`。
4. 在扩展面板确认 Codex 扩展已启用。

## 第二步：准备页面预览

1. 按 `Ctrl+Shift+P`。
2. 输入并执行 `Tasks: Run Task`。
3. 选择“启动 AI 助教答疑平台”。
4. 浏览器访问 `http://127.0.0.1:8080/`。
5. 如果端口被占用，可在任务命令中把 `8080` 改为 `8081`。

## 第三步：截取四轮对话

每轮都把 Codex 对话面板、资源管理器和对应源码放在同一张截图中。使用 `Win+Shift+S` 截取 VS Code 窗口，不需要截取整个桌面。

### 截图 1：基础结构
- 打开文件：`index.html`
- Codex 输入：

> 请在当前工作区创建 AI 助教答疑平台的基础登录页和注册页。使用语义化 HTML5 搭建 header、main、section、nav 和 form 结构，采用蓝紫渐变、玻璃卡片的现代科技风，并完成桌面双栏与移动端基础响应式布局。不要使用前端框架。

- 建议截图内容：资源管理器、`auth-shell` 结构代码、Codex 本轮回复。

### 截图 2：表单增强
- 打开文件：`register.html`
- Codex 输入：

> 继续增强当前注册和登录页面。尽量使用 HTML5 表单新能力，包括 email、tel、date、number、file 输入类型，required、pattern、minlength、min/max，autocomplete、inputmode、datalist、fieldset、progress 和 output。使用 Constraint Validation API 实现中文错误提示，并通过 localStorage 完成纯前端注册和登录演示。

- 建议截图内容：手机号、日期、年级、文件、密码强度等字段，以及 Codex 本轮回复。

### 截图 3：个性化体验
- 打开文件：`register.html`
- Codex 输入：

> 为学习档案加入个性化能力，包括头像本地预览、昵称与资料实时预览、兴趣标签、深海蓝/星云紫/薄荷青主题选择，以及登录后的专属欢迎卡片。继续优化手机端布局。

- 建议截图内容：学习档案预览、兴趣选项、主题选项，以及 Codex 本轮回复。

### 截图 4：校验和无障碍
- 打开文件：`js/auth.js`
- Codex 输入：

> 最后完善页面：测试邮箱、手机号、密码、年级、日期和协议校验；加入错误摘要、aria-describedby、aria-live、可见键盘焦点和 prefers-reduced-motion。使用原生 dialog 展示注册成功反馈，并整理桌面端与移动端截图。

- 建议截图内容：`showError`、`updateErrorSummary`、`dialog` 相关代码，以及 Codex 本轮回复。

## 第四步：保存截图

把四张截图按顺序保存为：

1. `01-basic.png`
2. `02-forms.png`
3. `03-personalization.png`
4. `04-final.png`

可以放到 `docs/process/` 覆盖现有整理图，也可以新建 `docs/vscode-screenshots/` 保存。截图完成后把四张图片发给我，我会替换进最终 DOCX 和 PDF 报告。
