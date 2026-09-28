# AI助教答疑平台注册与登录页面

本项目是 HTML5 课程课后任务，用原生 HTML、CSS 和 JavaScript 实现 AI 助教答疑平台的个性化注册页与登录页。所有演示数据仅保存在浏览器 `localStorage`，不连接真实后端。

## VS Code 开发

使用 VS Code 打开项目后，可运行任务“启动 AI 助教答疑平台”，并在 OpenAI ChatGPT/Codex 扩展中按照 `docs/vscode/VS-Code-Codex四轮迭代记录.md` 依次完成四轮迭代。`.vscode/tasks.json` 已配置等价的本地服务启动命令。
## 本地运行

```powershell
cd work/html5-login-register
python -m http.server 8080
```

浏览器访问 `http://127.0.0.1:8080/`。请通过 HTTP 访问，以便密码摘要 API 正常工作。

## 页面与功能

- `index.html`：邮箱与密码登录、记住账号、密码显示切换、个性化欢迎状态。
- `register.html`：昵称、邮箱、手机号、身份、学校、年级、生日、头像、兴趣及主题设置。
- `css/style.css`：蓝紫渐变、玻璃卡片、响应式布局、高对比焦点和减少动画支持。
- `js/auth.js`：HTML5 Constraint Validation API、实时校验、密码强度、SHA-256 演示摘要和本地账户流程。

## HTML5 表单增强

| 能力 | 使用位置 |
| --- | --- |
| `email` / `tel` / `date` / `number` / `file` | 注册页各类资料输入 |
| `required` / `pattern` / `minlength` / `min` / `max` | 必填、手机号、密码和年级约束 |
| `autocomplete` / `inputmode` / `enterkeyhint` | 改善移动端和浏览器自动填充体验 |
| `datalist` | 学校或学习机构建议 |
| `fieldset` / `legend` | 学习兴趣和主题分组 |
| `progress` / `output` | 密码强度反馈 |
| Constraint Validation API | 自定义中文校验和错误提示 |
| `dialog` | 注册成功后的原生反馈弹窗 |

## 其他 HTML5 与 CSS3 能力

- `header`、`main`、`section`、`aside`、`nav`、`fieldset` 等语义化结构。
- `localStorage` 模拟用户资料持久化，密码以浏览器 Web Crypto 摘要保存。
- CSS 自定义属性、`:has()`、渐变、玻璃质感、媒体查询和 `prefers-reduced-motion`。
- `aria-describedby`、`aria-live`、`:focus-visible` 和错误摘要增强可访问性。

## 版本记录

| 标签 | 内容 |
| --- | --- |
| `v1-basic` | 语义化页面骨架和基础响应式视觉 |
| `v2-forms` | HTML5 表单类型、约束校验和本地账户流程 |
| `v3-personalization` | 头像、兴趣、主题和登录欢迎卡片 |
| `v4-final` | 无障碍、错误摘要、成功弹窗和最终交付 |

## 过程截图

- `docs/process/01-basic.png`：基础结构迭代
- `docs/process/02-forms.png`：表单增强迭代
- `docs/process/03-personalization.png`：个性化迭代
- `docs/process/04-final.png`：最终完善迭代
- `docs/screenshots/desktop-login.png`：桌面端登录页
- `docs/screenshots/desktop-register.png`：桌面端注册页
- `docs/screenshots/mobile-login-top.png`：移动端登录页上半部分
- `docs/screenshots/mobile-login-bottom.png`：移动端登录页下半部分
- `docs/screenshots/mobile-register-top.png`：移动端注册页上半部分
- `docs/screenshots/mobile-register-bottom.png`：移动端注册页下半部分

过程图依据本轮实际四阶段开发内容和 Git 提交记录整理，提交哈希可直接用 `git show` 核验。

## 仓库地址

<https://github.com/2712889/html5-login-register>
