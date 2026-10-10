"use client";

import { useEffect, useState } from "react";
import { api, errorMessage } from "../services/api";
import type { Session } from "../services/login";

type Comment = {
  id: number;
  content: string;
  created_at: string;
  author: string;
};
type Props = {
  session: Session;
  material: { id: number; name: string };
  onBack: () => void;
};

const MAX = 500;

export default function Comments({ session, material, onBack }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [revision, setRevision] = useState(0);

  const headers = { Authorization: `Bearer ${session.token}` };

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const response = await api.get<Comment[]>(
          `/materials/${material.id}/comments`,
          { headers },
        );
        if (active) setComments(response.data);
      } catch (err) {
        if (active) setError(errorMessage(err));
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [material.id, session.token, revision]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setSending(true);
    try {
      await api.post(
        `/materials/${material.id}/comments`,
        { content: text },
        { headers },
      );
      setText("");
      setRevision((current) => current + 1);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="panel" aria-labelledby="comments-title">
      <button className="secondary back" onClick={onBack}>
        <img src="/icons/arrow-back.svg" alt="" width={16} height={16} />
        Voltar aos materiais
      </button>{" "}
      <h1 id="comments-title">Comentários · {material.name}</h1>
      <form onSubmit={submit}>
        <label htmlFor="comment">Novo comentário</label>
        <textarea
          id="comment"
          value={text}
          maxLength={MAX}
          rows={3}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escreva seu comentário"
        />
        <span className="muted">
          {text.length}/{MAX}
        </span>
        <button disabled={sending || text.trim().length === 0}>
          {sending ? "Enviando..." : "Comentar"}
        </button>
      </form>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      {loading ? (
        <p role="status">Carregando comentários...</p>
      ) : comments.length === 0 ? (
        <p>Nenhum comentário ainda.</p>
      ) : (
        <ul className="materials">
          {comments.map((c) => (
            <li key={c.id} className="comment">
              <div>
                <strong>{c.author}</strong>{" "}
                <span className="muted">
                  {new Date(c.created_at).toLocaleString("pt-BR")}
                </span>
                <p>{c.content}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
