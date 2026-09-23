# VS Code 与 Codex 四轮迭代记录

本文件用于复现课程要求的 VS Code + Codex 多轮开发过程。每轮完成后应先在 VS Code 源代码管理面板提交，再进入下一轮，以便保留清晰的阶段性版本。

## 准备工作

1. 使用 VS Code 打开 `html5-login-register` 文件夹。
2. 在扩展面板确认 OpenAI ChatGPT/Codex 扩展已启用。
3. 打开 VS Code 源代码管理面板和 Codex 对话面板。
4. 每轮提交前把页面预览与 Codex 对话窗口放在同一屏幕中截图。
5. 截图不要包含账号令牌、邮箱验证码或其他隐私信息。

## 第 1 轮：页面基础结构

输入提示词：

> 请在当前工作区创建 AI 助教答疑平台的基础登录页和注册页。使用语义化 HTML5 搭建 header、main、section、nav 和 form 结构，采用蓝紫渐变、玻璃卡片的现代科技风，并完成桌面双栏与移动端基础响应式布局。不要使用前端框架。

验收结果：`index.html`、`register.html`、`css/style.css` 和基础脚本形成第一次可浏览版本，Git 标签为 `v1-basic`。

## 第 2 轮：HTML 表单增强

输入提示词：

> 继续增强当前注册和登录页面。尽量使用 HTML5 表单新能力，包括 email、tel、date、number、file 输入类型，required、pattern、minlength、min/max，autocomplete、inputmode、datalist、fieldset、progress 和 output。使用 Constraint Validation API 实现中文错误提示，并通过 localStorage 完成纯前端注册和登录演示。

验收结果：表单覆盖输入类型、约束、自动填充、数据列表、密码强度以及本地注册登录流程，Git 标签为 `v2-forms`。

## 第 3 轮：个性化体验

输入提示词：

> 为学习档案加入个性化能力，包括头像本地预览、昵称与资料实时预览、兴趣标签、深海蓝/星云紫/薄荷青主题选择，以及登录后的专属欢迎卡片。继续优化手机端布局。

验收结果：注册信息可以形成可视化档案并影响登录后的欢迎状态，Git 标签为 `v3-personalization`。

## 第 4 轮：校验、无障碍和最终完善

输入提示词：

> 最后完善页面：测试邮箱、手机号、密码、年级、日期和协议校验；加入错误摘要、aria-describedby、aria-live、可见键盘焦点和 prefers-reduced-motion。使用原生 dialog 展示注册成功反馈，并整理桌面端与移动端截图。

验收结果：错误信息、无障碍提示、成功弹窗、响应式截图和最终 README 均完成，Git 标签为 `v4-final`。

## 截图建议

- 第 1 张：VS Code 资源管理器显示双页面结构，Codex 面板显示第一轮提示词和完成说明。
- 第 2 张：打开注册页源码中的表单字段，Codex 面板显示第二轮提示词和表单能力总结。
- 第 3 张：显示个性化预览区域与 Codex 面板第三轮提示词。
- 第 4 张：显示表单校验代码、Git 历史标签和 Codex 面板第四轮提示词。
