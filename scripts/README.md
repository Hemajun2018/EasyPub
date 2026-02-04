# 生成预览样本

这个脚本用于生成所有 9 种排版风格的真实预览内容。

## 使用方法

### 1. 确保环境变量已配置

脚本需要调用 AI API,请确保以下环境变量已设置:

```bash
# .env.development 或 .env.local
GEMINI_API_KEY=your_api_key_here
# 或者你使用的其他 AI 服务的 API 密钥
```

### 2. 运行生成脚本

```bash
pnpm preview:generate
```

### 3. 等待完成

脚本会:
- 读取 `scripts/sample-article.txt` 中的示例文章
- 依次为 9 种风格生成排版结果
- 保存到 `public/preview-samples.json`

整个过程大约需要 1-2 分钟(取决于 API 响应速度)。

### 4. 查看结果

生成完成后,`public/preview-samples.json` 文件会包含:
- 原始文章内容
- 生成时间戳
- 所有 9 种风格的排版结果

### 5. 预览组件会自动使用

Hero 预览组件会自动加载这个文件并展示真实的排版效果。

## 注意事项

- ⚠️ 每次运行会调用 9 次 AI API,请注意 API 使用配额
- 💡 建议只在文章内容更新时重新生成
- 📦 生成的文件会被提交到 git,其他开发者无需重新生成

## 自定义示例文章

如果想使用不同的示例文章:

1. 编辑 `scripts/sample-article.txt`
2. 重新运行 `pnpm preview:generate`
