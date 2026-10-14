"use client";

import { useEffect, useState } from "react";
import { errorMessage } from "../services/api";
import type { Session } from "../services/login";
import { listProducts, type Product } from "../services/products";

type Props = { session: Session; onLogout: () => void };


function formatPrice(price: string | number) {
  return Number(price).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function Products({ session, onLogout }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [revision, setRevision] = useState(0);

  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");


  useEffect(() => {
    const timer = setTimeout(() => setQuery(search.trim()), 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Busca ao entrar, quando a pesquisa muda e quando Atualizar muda revision.
  useEffect(() => {
    // Ignora respostas antigas se a pessoa digitar de novo ou sair da tela.
    let active = true;
    async function load() {
      try {
        const data = await listProducts(session.token, query);
        if (active) {
          setProducts(data);
          setError("");
        }
      } catch (error) {
        if (active) setError(errorMessage(error));
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, [session.token, query, revision]);

  function refresh() {
    setLoading(true);
    setError("");
    setRevision(current => current + 1);
  }

  return (
    <section className="panel" aria-labelledby="products-title">
      <div className="actions">
        <p><strong>{session.user.name}</strong> · {session.user.email}</p>
        <button className="secondary" onClick={onLogout}>Sair</button>
      </div>
      <h1 id="products-title">Produtos</h1>

      <div className="search">
        <label htmlFor="product-search">Pesquisar produto</label>
        <div className="actions">
          <input
            id="product-search"
            type="search"
            maxLength={100}
            placeholder="Digite o nome ou a categoria"
            value={search}
            onChange={event => setSearch(event.target.value)}
          />
          {search && (
            <button className="secondary" onClick={() => setSearch("")}>Limpar</button>
          )}
        </div>
      </div>

      <button className="secondary" disabled={loading} onClick={refresh}>
        Atualizar produtos
      </button>
      {error && <p className="error" role="alert">{error}</p>}

      {loading ? (
        <p role="status">Carregando produtos...</p>
      ) : (
        <ul className="materials" aria-label="Lista de produtos">
          {products.map(product => (
            <li key={product.id}>
              <span><strong>{product.name}</strong> · {product.category}</span>
              <span className="muted">
                {formatPrice(product.price)} · Estoque: {product.stock}
              </span>
            </li>
          ))}
        </ul>
      )}
      {!loading && !error && products.length === 0 && (
        <p>{query ? `Nenhum produto encontrado para "${query}".` : "Nenhum produto cadastrado."}</p>
      )}
    </section>
  );
}

