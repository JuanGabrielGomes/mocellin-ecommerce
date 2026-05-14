import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { DeleteProductButton } from '@/components/admin/DeleteProductButton'
import type { ProductType } from '@/types'
import { PlusCircle, Pencil } from 'lucide-react'

const CATEGORY_LABEL: Record<string, string> = {
  brincos: 'Brincos',
  aneis: 'Anéis',
  relogios: 'Relógios',
  colares: 'Colares',
  oculos: 'Óculos',
}

const STATUS_STYLE: Record<string, string> = {
  disponivel: 'bg-emerald-50 text-emerald-700',
  esgotado: 'bg-red-50 text-red-600',
}

const STATUS_LABEL: Record<string, string> = {
  disponivel: 'Disponível',
  esgotado: 'Esgotado',
}

export const metadata = { title: 'Produtos — Admin Mocellin' }

export default async function AdminProductsPage() {
  const supabase = await createClient()
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
    .returns<ProductType[]>()

  if (error) {
    return (
      <p className="font-dm-sans text-sm text-red-500">
        Erro ao carregar produtos: {error.message}
      </p>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-cormorant text-3xl font-semibold text-mocellin-dark">Produtos</h1>
          <p className="mt-1 font-dm-sans text-sm text-mocellin-dark/50">
            {products.length} {products.length === 1 ? 'produto cadastrado' : 'produtos cadastrados'}
          </p>
        </div>
        <Link
          href="/admin/produtos/novo"
          className="flex items-center gap-2 rounded-xl bg-mocellin-gold px-4 py-2.5 font-dm-sans text-sm font-medium text-white transition-all hover:bg-mocellin-gold-light active:scale-[.98]"
        >
          <PlusCircle size={16} />
          Adicionar produto
        </Link>
      </div>

      {/* Table */}
      {products.length === 0 ? (
        <div className="rounded-2xl border border-mocellin-beige bg-mocellin-white py-16 text-center">
          <p className="font-dm-sans text-sm text-mocellin-dark/40">Nenhum produto cadastrado.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-mocellin-beige bg-mocellin-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-mocellin-beige">
                  <th className="px-4 py-3 font-dm-sans text-xs font-medium uppercase tracking-wider text-mocellin-dark/40">
                    Produto
                  </th>
                  <th className="px-4 py-3 font-dm-sans text-xs font-medium uppercase tracking-wider text-mocellin-dark/40">
                    Categoria
                  </th>
                  <th className="px-4 py-3 font-dm-sans text-xs font-medium uppercase tracking-wider text-mocellin-dark/40">
                    Preço
                  </th>
                  <th className="px-4 py-3 font-dm-sans text-xs font-medium uppercase tracking-wider text-mocellin-dark/40">
                    Status
                  </th>
                  <th className="px-4 py-3 font-dm-sans text-xs font-medium uppercase tracking-wider text-mocellin-dark/40">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-mocellin-beige">
                {products.map((product) => (
                  <tr key={product.id} className="group transition-colors hover:bg-mocellin-cream/50">
                    {/* Imagem + nome */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-mocellin-beige">
                          {product.images[0] ? (
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          ) : (
                            <div className="h-full w-full" />
                          )}
                        </div>
                        <span className="font-dm-sans text-sm font-medium text-mocellin-dark line-clamp-2 max-w-[200px]">
                          {product.name}
                        </span>
                      </div>
                    </td>

                    {/* Categoria */}
                    <td className="px-4 py-3 font-dm-sans text-sm text-mocellin-dark/70">
                      {CATEGORY_LABEL[product.category] ?? product.category}
                    </td>

                    {/* Preço */}
                    <td className="px-4 py-3 font-dm-sans text-sm text-mocellin-dark">
                      {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 font-dm-sans text-xs font-medium ${STATUS_STYLE[product.status] ?? ''}`}
                      >
                        {STATUS_LABEL[product.status] ?? product.status}
                      </span>
                    </td>

                    {/* Ações */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/admin/produtos/${product.id}`}
                          aria-label={`Editar ${product.name}`}
                          className="rounded-lg p-2 text-mocellin-dark/40 transition-colors hover:bg-mocellin-beige hover:text-mocellin-dark"
                        >
                          <Pencil size={16} />
                        </Link>
                        <DeleteProductButton id={product.id} name={product.name} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
