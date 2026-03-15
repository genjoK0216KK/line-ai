import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const instruction = process.env.INSTRUCTION;
const siteName = process.env.SITE_NAME;

console.log(`🚀 生成開始: "${instruction}"`);

const systemPrompt = `あなたはプロのWebデザイナーです。
ユーザーの指示に基づいて、美しく実用的なホームページを1ファイルのHTML（CSS・JS込み）で生成してください。

# 要件
- 完全な1ファイルHTML（外部リソース不要、CDNは可）
- モバイル対応（レスポンシブデザイン）
- 日本語対応
- プロフェッショナルなデザイン
- 業種に合った配色・レイアウト

# 含めるべきセクション
- ヒーローセクション（会社名・キャッチコピー）
- サービス/商品紹介
- 会社概要 or 特徴
- お問い合わせCTA
- フッター

必ず完全なHTMLコードのみを返してください。
\`\`\`html から始めて \`\`\` で終わるフォーマットで返してください。`;

async function generateHomepage() {
  const response = await client.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 8192,
    system: systemPrompt,
    messages: [{ role: 'user', content: instruction }],
  });

  const content = response.content[0].text;
  const htmlMatch = content.match(/```html\n([\s\S]+?)\n```/);
  const html = htmlMatch ? htmlMatch[1] : content.trim();

  const distDir = path.join(process.cwd(), 'dist');
  fs.mkdirSync(distDir, { recursive: true });
  fs.writeFileSync(path.join(distDir, 'index.html'), html, 'utf-8');

  console.log(`✅ HTML生成完了 (${html.length}文字)`);
}

generateHomepage().catch((err) => {
  console.error('エラー:', err.message);
  process.exit(1);
});