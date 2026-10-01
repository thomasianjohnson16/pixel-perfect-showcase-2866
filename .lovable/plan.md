# Purchase flow: findings and fixes

## How it works today
- **What's for sale:** one product, the "28-Day Senior Mobility Plan", €14 one-time, test mode. It's added to live mode automatically when you publish.
- **Accounts:** none. Buyers don't sign up or log in. Their order is found by the payment number (ID) on their thank-you link, or by their email. Only /admin needs a password.
- **Paying:** buy button → tick box → checkout pop-up → payment provider (handles VAT) → thank-you page.
- **Access:** a paid order unlocks the download link. The guide sits in private storage and each download makes a new 24-hour link.
- **Renewals and billing periods:** none. It's a one-off purchase, so nothing renews and there's nothing to cancel.
- **Order saving:** saved two ways, by the payment provider's notice and by the thank-you page asking the provider directly. Whichever arrives first saves it.

## Gaps found
1. **Double email risk:** if both ways of saving the order arrive at the same moment, the buyer could get two emails (once email is switched on).
2. **Unlimited downloads:** a shared link works for ever. You chose a limit of 10.
3. **Refunds invisible:** /admin can't tell you an order was refunded. The link keeps working after a refund (your choice).
4. **Thank-you page fallback:** if the buyer's browser closes the pop-up in an unusual way, they can land on the thank-you page without their order number and see no button.
5. **No way to help someone who hits the limit:** needs a reset button on /admin.
6. **Still waiting on you:** email domain, Meta Pixel ID, legal pages, payment provider approval. Not fixed here.

## What I'll build
- **One email per order:** the order is saved only once, and only that save sends the email.
- **10-download limit:** after 10 downloads the link shows a friendly page asking the buyer to email you. /admin gets a "Reset downloads" button per order.
- **Refunded orders on /admin:** /admin asks the payment provider for refunds when the list loads and shows a "Refunded" label. Downloads are not blocked.
- **Order number fallback:** the thank-you page also reads the order number the payment provider adds to its own return link.
- **Small tidy-ups:** the payment notice stays harmless for events we don't use, and the code stays commented.

## How to test in the preview
1. Open the preview. The orange bar confirms test mode. Click any buy button and tick the box.
2. In the pop-up, pay with card **4242 4242 4242 4242**, any future date, CVC **123**, any name, any email you can read.
3. You land on "You're in…". Within a few seconds the amber Download button appears. Click it and the guide opens.
4. Open /admin and enter your password. The order shows with downloads = 1 and Test mode.
5. **To test the limit:** click Download 10 more times. The 11th shows the limit page. Then click "Reset downloads" on /admin and try again.
6. **To test a refund:** refund the order in the payments dashboard (test refunds are approved within about 10 minutes), then click Refresh on /admin and look for "Refunded".
7. **To test a failed payment:** use card **4000 0000 0000 0002**. Checkout says it was declined and no order appears.

## Technical details
- `saveOrder`: plain insert. On a duplicate-key error, return false; send email only when the insert succeeds.
- Migration: `orders.refunded` is not stored. Refunds are read live via `GET /adjustments?transaction_id=…&action=refund`, grouped by environment, 50 at a time.
- Download route: if `download_count >= 10`, return the HTML limit page (status 403). Constant `DOWNLOAD_LIMIT = 10`.
- New server fn `adminResetDownloads(password, orderId)` sets `download_count = 0`. Shares an `assertAdmin` helper with the other admin functions.
- Thank-you: `txn = search.txn ?? search._ptxn`.
