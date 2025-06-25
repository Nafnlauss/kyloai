export const baseStyles = `
  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
  .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
  .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
  .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
  .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
  .order-details { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
  .item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
  .feature { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; }
`

export const baseTemplate = (content: {
  title: string
  body: string
  year?: string
}) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${baseStyles}</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${content.title}</h1>
    </div>
    <div class="content">
      ${content.body}
    </div>
    <div class="footer">
      <p>© ${content.year || new Date().getFullYear()} Kylo. All rights reserved.</p>
      <p>This is an automated email. For support, please email support@kylo.video</p>
    </div>
  </div>
</body>
</html>
`