<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

# Project rules

- Orders table is server-only (RLS on, no policies); all reads/writes go through server functions or `/api/public/*` routes using the admin client — keeps buyer emails private.
- The PDF lives in the private `products` bucket and is only reachable via `/api/public/download?txn=…`, which issues a 24h signed URL and counts downloads — file must never be public.
- Orders are saved by both the payment webhook and the thank-you page's provider check (idempotent on transaction id) — the page works even if the webhook is late.
- Every buy button goes through `useCheckout().buy`, which requires the withdrawal-consent tick before opening the overlay — consent is stored with the order via checkout customData.
- Meta Pixel code in `src/lib/pixel.ts` loads only after explicit cookie acceptance and does nothing while the Pixel ID is empty.
- Download email sending is centralised in `sendDownloadEmail` (orders.server.ts) — currently a logging stub until an email domain is set up.

- Admin video uploads go through adminCreateVideoUpload (password-checked signed upload URL) into the public `videos` bucket; browser uploads directly to storage so large files skip the server.
