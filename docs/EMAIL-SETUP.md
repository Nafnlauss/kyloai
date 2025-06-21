# Email Configuration Guide - Avoiding Spam

## DNS Records Configuration

To ensure your emails reach the inbox instead of spam, you need to configure the following DNS records for kylo.video:

### 1. SPF Record (Sender Policy Framework)
```
Type: TXT
Name: @ (or leave blank)
Value: v=spf1 include:zoho.com ~all
TTL: 3600
```

### 2. DKIM Record (DomainKeys Identified Mail)
1. Log into Zoho Mail Admin Console
2. Go to Email Authentication → DKIM
3. Generate DKIM for kylo.video
4. Add the provided record:
```
Type: TXT  
Name: zmail._domainkey
Value: [Value provided by Zoho]
TTL: 3600
```

### 3. DMARC Record (Domain-based Message Authentication)
```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:dmarc@kylo.video; pct=100; adkim=r; aspf=r
TTL: 3600
```

Start with `p=none` and gradually move to `p=quarantine` then `p=reject` as your reputation builds.

### 4. MX Records (Mail Exchange)
```
Priority 10: mx.zoho.com
Priority 20: mx2.zoho.com  
Priority 50: mx3.zoho.com
```

### 5. Return-Path Domain
```
Type: TXT
Name: mail
Value: v=spf1 include:zoho.com ~all
TTL: 3600
```

## Zoho Mail Configuration

### Configure noreply@kylo.video as Alias
1. Log into Zoho Mail (leonardo@kylo.video)
2. Go to Settings → Mail → Send mail as
3. Click "Add From Address"
4. Add: noreply@kylo.video
5. Verify the alias

## Best Practices to Avoid Spam

### 1. Email Content
- ✅ Always include both HTML and plain text versions
- ✅ Maintain 60/40 text-to-image ratio
- ✅ Avoid spam trigger words (FREE, CLICK NOW, LIMITED TIME)
- ✅ Use proper spelling and grammar
- ✅ Include physical address in footer
- ✅ Add unsubscribe link

### 2. Technical Implementation
- ✅ Use proper email headers
- ✅ Include List-Unsubscribe header
- ✅ Set appropriate priority (Normal)
- ✅ Use valid From and Reply-To addresses
- ✅ Generate unique Message-IDs

### 3. Sending Practices
- ✅ Start with low volume (10-20 emails/day)
- ✅ Gradually increase volume over 4-6 weeks
- ✅ Maintain consistent sending patterns
- ✅ Remove bounced emails immediately
- ✅ Honor unsubscribe requests within 24h

### 4. Domain Reputation
- ✅ Use a subdomain for transactional emails (mail.kylo.video)
- ✅ Separate marketing from transactional emails
- ✅ Monitor blacklists regularly
- ✅ Keep complaint rate below 0.1%

## Testing Tools

### 1. Mail-Tester.com
Send a test email to the provided address and get a spam score.

### 2. MXToolbox
- Check blacklists: https://mxtoolbox.com/blacklists.aspx
- Verify SPF: https://mxtoolbox.com/spf.aspx
- Test DKIM: https://mxtoolbox.com/dkim.aspx

### 3. Google Postmaster Tools
Monitor your domain reputation with Gmail.

## Monitoring

### Key Metrics to Track
1. **Delivery Rate**: Should be above 95%
2. **Open Rate**: 20-30% for transactional emails
3. **Bounce Rate**: Keep below 2%
4. **Complaint Rate**: Keep below 0.1%
5. **Blacklist Status**: Check weekly

### Weekly Checklist
- [ ] Check blacklist status
- [ ] Review bounce reports
- [ ] Monitor complaint rate
- [ ] Verify DNS records are intact
- [ ] Test email delivery

## Troubleshooting

### If Emails Still Go to Spam:
1. **Check Authentication**: Verify SPF, DKIM, DMARC pass
2. **Review Content**: Remove suspicious links or attachments
3. **Check Reputation**: Use mail-tester.com
4. **Warm Up Domain**: Reduce volume, build gradually
5. **Contact ISPs**: Submit whitelist requests to major providers

### Common Issues:
- **550 5.7.1 Error**: SPF/DKIM failure
- **High Bounce Rate**: Clean your email list
- **Low Open Rate**: Improve subject lines
- **Blacklisted**: Check content and sending practices

## Implementation Code

The email system is already configured with anti-spam measures in:
- `/src/lib/email/zoho-mail.ts`
- `/src/lib/email/email-headers.ts`

All transactional emails include:
- Proper headers
- Text and HTML versions
- Unsubscribe links
- Valid authentication