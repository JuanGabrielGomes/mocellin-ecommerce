-- Adiciona o valor 'pre_venda' ao enum de status dos produtos.
-- Execute no SQL Editor do Supabase Dashboard.
--
-- Se o status for um tipo ENUM:
ALTER TYPE product_status ADD VALUE IF NOT EXISTS 'pre_venda';
--
-- Se for uma coluna TEXT com CHECK constraint, substitua pelo bloco abaixo:
-- ALTER TABLE products DROP CONSTRAINT IF EXISTS products_status_check;
-- ALTER TABLE products ADD CONSTRAINT products_status_check
--   CHECK (status IN ('disponivel', 'esgotado', 'pre_venda'));
