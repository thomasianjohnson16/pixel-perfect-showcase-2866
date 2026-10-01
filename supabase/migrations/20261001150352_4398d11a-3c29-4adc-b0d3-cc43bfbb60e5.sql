CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  paddle_transaction_id text NOT NULL UNIQUE,
  email text,
  created_at timestamptz NOT NULL DEFAULT now(),
  consent_ticked boolean NOT NULL DEFAULT false,
  download_count integer NOT NULL DEFAULT 0,
  environment text NOT NULL DEFAULT 'sandbox'
);
CREATE INDEX idx_orders_email ON public.orders (lower(email));
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;