const userId = process.env.LINE_USER_ID;
const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
const siteName = process.env.SITE_NAME;
const url = process.env.GITHUB_PAGES_URL;

async function notifyLine() {
  const res = await fetch('https://api.line.me/v2/bot/message/push', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to: userId,
      messages: [
        {
          type: 'flex',
          altText: 'ホームページが完成しました！',
          contents: {
            type: 'bubble',
            header: {
              type: 'box',
              layout: 'vertical',
              backgroundColor: '#06C755',
              paddingAll: '16px',
              contents: [
                { type: 'text', text: '✅ HP生成完了', weight: 'bold', color: '#ffffff', size: 'lg' }
              ],
            },
            body: {
              type: 'box',
              layout: 'vertical',
              spacing: 'md',
              contents: [
                { type: 'text', text: siteName, weight: 'bold', size: 'xl', wrap: true },
                { type: 'text', text: url, color: '#0066CC', wrap: true, size: 'sm' },
              ],
            },
            footer: {
              type: 'box',
              layout: 'vertical',
              contents: [
                {
                  type: 'button',
                  style: 'primary',
                  color: '#06C755',
                  action: { type: 'uri', label: 'サイトを確認する', uri: url },
                },
              ],
            },
          },
        },
      ],
    }),
  });

  if (!res.ok) {
    console.error('LINE通知エラー:', await res.text());
    process.exit(1);
  }
  console.log('✅ LINE通知送信完了');
}

notifyLine().catch(console.error);