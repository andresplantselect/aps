-- ============================================================
-- 1. REALTIME: включить таблицу orders
-- ============================================================
alter publication supabase_realtime add table orders;


-- ============================================================
-- 2. EMAIL: письмо юзеру при создании заказа
-- ============================================================
create or replace function notify_new_order()
returns trigger
language plpgsql
security definer
as $$
begin
  perform net.http_post(
    url     := 'https://kxcfeoiafbezsgcpyzss.supabase.co/functions/v1/send-user-new-order-email',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body    := json_build_object('order', row_to_json(NEW))::text
  );
  return NEW;
end;
$$;

drop trigger if exists on_order_created on orders;
create trigger on_order_created
  after insert on orders
  for each row execute function notify_new_order();


-- ============================================================
-- 3. EMAIL: письмо юзеру при смене статуса заказа (approved/cancelled)
-- ============================================================
create or replace function notify_order_status_changed()
returns trigger
language plpgsql
security definer
as $$
begin
  if NEW.status <> OLD.status and NEW.status in ('approved', 'cancelled') then
    perform net.http_post(
      url     := 'https://kxcfeoiafbezsgcpyzss.supabase.co/functions/v1/send-user-order-status-email',
      headers := '{"Content-Type": "application/json"}'::jsonb,
      body    := json_build_object('order', row_to_json(NEW))::text
    );
  end if;
  return NEW;
end;
$$;

drop trigger if exists on_order_status_changed on orders;
create trigger on_order_status_changed
  after update on orders
  for each row execute function notify_order_status_changed();


-- ============================================================
-- 4. EMAIL: письмо юзеру при смене статуса доставки (delivered/failed)
-- ============================================================
create or replace function notify_delivery_status_changed()
returns trigger
language plpgsql
security definer
as $$
begin
  if NEW.delivery_status <> OLD.delivery_status
     and NEW.delivery_status in ('delivered', 'failed') then
    perform net.http_post(
      url     := 'https://kxcfeoiafbezsgcpyzss.supabase.co/functions/v1/send-user-delivery-status-email',
      headers := '{"Content-Type": "application/json"}'::jsonb,
      body    := json_build_object('order', row_to_json(NEW))::text
    );
  end if;
  return NEW;
end;
$$;

drop trigger if exists on_delivery_status_changed on orders;
create trigger on_delivery_status_changed
  after update on orders
  for each row execute function notify_delivery_status_changed();
