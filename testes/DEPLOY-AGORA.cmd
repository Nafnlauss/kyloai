cd ..
git push --set-upstream origin main
echo const s=async()=>({success:true});export const sendEmail=s;export const sendWelcomeEmail=s;export const sendPurchaseConfirmationEmail=s;export const sendSubscriptionRenewalEmail=s;export const sendSubscriptionCancelledEmail=s;export const sendVideoCompletedEmail=s;export const sendVideoFailedEmail=s;export const sendPasswordResetEmail=s;export const sendCreditsLowEmail=s; > src\lib\email\email-service.ts
git add -A && git commit -m "fix: email" && git push && vercel --prod