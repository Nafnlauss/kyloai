// Email headers optimization to avoid spam filters

export const getOptimizedHeaders = (domain: string = 'kylo.video') => {
  const entityId = `kylo-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  
  return {
    'List-Unsubscribe': `<https://${domain}/unsubscribe>`,
    'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    'X-Entity-Ref-ID': entityId,
    'X-Priority': '3',
    'X-MSMail-Priority': 'Normal',
    'Importance': 'Normal',
    'X-Mailer': 'Kylo Platform 1.0',
    'MIME-Version': '1.0',
    'X-Campaign': 'transactional',
    'Precedence': 'bulk',
  };
}


// SPF, DKIM and DMARC instructions
export const EMAIL_AUTHENTICATION_GUIDE = `
DNS Records needed for email authentication:

1. SPF Record:
   Type: TXT
   Name: @
   Value: v=spf1 include:zoho.com ~all

2. DKIM Record:
   Type: TXT
   Name: zmail._domainkey
   Value: [Get from Zoho Mail Admin Console]

3. DMARC Record:
   Type: TXT
   Name: _dmarc
   Value: v=DMARC1; p=quarantine; rua=mailto:dmarc@kylo.video; pct=100; adkim=s; aspf=s

4. MX Records:
   Priority 10: mx.zoho.com
   Priority 20: mx2.zoho.com
   Priority 50: mx3.zoho.com

5. Return-Path Domain:
   Type: TXT
   Name: mail
   Value: v=spf1 include:zoho.com ~all
`