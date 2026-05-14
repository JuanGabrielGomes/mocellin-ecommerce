import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { DeleteProductButton } from '@/components/admin/DeleteProductButton'
import { FeaturedToggle } from '@/components/admin/FeaturedToggle'
import type { ProductType } from '@/types'
import { PlusCircle, Pencil } from 'lucide-react'

const CATEGORY_LABEL: Record<string, string> = {
  brincos: 'Brincos',
  aneis: 'Anéis',
  relogios: 'Relógios',
  colares: 'Colares',
  oculos: 'Óculos',
  masculino: 'Masculino',
  pulseiras: 'Pulseiras e Braceletes',
  berloques: 'Berloques',
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
      <p className="font-mulish text-sm text-red-500">
        Erro ao carregar produtos: {error.message}
      </p>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-julius text-3xl tracking-wider text-mj-black">Produtos</h1>
          <p className="mt-1 font-mulish text-sm text-mj-taupe">
            {products.length} {products.length === 1 ? 'produto cadastrado' : 'produtos cadastrados'}
          </p>
        </div>
        <Link
          href="/admin/produtos/novo"
          className="flex items-center gap-2 bg-mj-black px-4 py-2.5 font-mulish text-sm text-white transition-all hover:bg-mj-brown active:scale-[.98]"
        >
          <PlusCircle size={16} />
          Adicionar produto
        </Link>
      </div>

      {/* Table */}
      {products.length === 0 ? (
        <div className="border border-mj-border bg-mj-white py-16 text-center">
          <p className="font-mulish text-sm text-mj-taupe">Nenhum produto cadastrado.</p>
        </div>
      ) : (
        <div className="overflow-hidden border border-mj-border bg-mj-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-mj-border">
                  <th className="px-4 py-3 font-mulish text-[10px] uppercase tracking-[0.15em] text-mj-taupe">
                    Produto
                  </th>
                  <th className="px-4 py-3 font-mulish text-[10px] uppercase tracking-[0.15em] text-mj-taupe">
                    Categoria
                  </th>
                  <th className="px-4 py-3 font-mulish text-[10px] uppercase tracking-[0.15em] text-mj-taupe">
                    Preço
                  </th>
                  <th className="px-4 py-3 font-mulish text-[10px] uppercase tracking-[0.15em] text-mj-taupe">
                    Status
                  </th>
                  <th className="px-4 py-3 font-mulish text-[10px] uppercase tracking-[0.15em] text-mj-taupe">
                    Destaque
                  </th>
                  <th className="px-4 py-3 font-mulish text-[10px] uppercase tracking-[0.15em] text-mj-taupe">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-mj-border">
                {products.map((product) => (
                  <tr key={product.id} className="transition-colors hover:bg-mj-cream/50">
                    {/* Imagem + nome */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden bg-mj-beige/30">
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
                        <span className="font-mulish text-sm font-medium text-mj-black line-clamp-2 max-w-[200px]">
                          {product.name}
                        </span>
                      </div>
                    </td>

                    {/* Categoria */}
                    <td className="px-4 py-3 font-mulish text-sm text-mj-taupe">
                      {CATEGORY_LABEL[product.category] ?? product.category}
                    </td>

                    {/* Preço */}
                    <td className="px-4 py-3 font-mulish text-sm text-mj-black">
                      {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2.5 py-1 font-mulish text-xs font-medium ${STATUS_STYLE[product.status] ?? ''}`}
                      >
                        {STATUS_LABEL[product.status] ?? product.status}
                      </span>
                    </td>

                    {/* Destaque */}
                    <td className="px-4 py-3">
                      <FeaturedToggle id={product.id} featured={product.featured} />
                    </td>

                    {/* Ações */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/admin/produtos/${product.id}`}
                          aria-label={`Editar ${product.name}`}
                          className="p-2 text-mj-taupe transition-colors hover:bg-mj-border hover:text-mj-black"
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
