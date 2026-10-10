function getUserId(req) {
  return req.user?.id ?? req.user?.sub ?? req.user?.userId;
}

// Lista os comentários de um material
export async function listComments(req, res) {
  const materialId = Number(req.params.id);
  if (!Number.isSafeInteger(materialId) || materialId <= 0) {
    return res.status(400).json({ message: "ID invalido." });
  }

  const [rows] = await req.app.locals.db.execute(
    `SELECT c.id, c.content, c.created_at, u.name AS author
       FROM material_comments c
       JOIN users u ON u.id = c.user_id
      WHERE c.material_id = ?
      ORDER BY c.created_at DESC, c.id DESC`,
    [materialId]
  );
  res.json(rows);
}

// Cadastra um comentário (texto com 1 a 500 caracteres)
export async function createComment(req, res) {
  const materialId = Number(req.params.id);
  if (!Number.isSafeInteger(materialId) || materialId <= 0) {
    return res.status(400).json({ message: "ID invalido." });
  }

  const content = req.body?.content;

  //precisa ser string e ter entre 1 e 500 caracteres.
  if (typeof content !== "string") {
    return res.status(400).json({ message: "O comentario deve ser um texto." });
  }
  const text = content.trim();
  if (text.length < 1 || text.length > 500) {
    return res.status(400).json({ message: "O comentario deve ter entre 1 e 500 caracteres." });
  }

  const userId = getUserId(req);
  if (!userId) {
    console.log("Conteudo de req.user:", req.user);
    return res.status(401).json({ message: "Usuario nao identificado." });
  }

  const db = req.app.locals.db;

  const [materials] = await db.execute("SELECT id FROM materials WHERE id = ?", [materialId]);
  if (materials.length === 0) {
    return res.status(404).json({ message: "Material nao encontrado." });
  }

  // O ? evita SQL injection
  const [result] = await db.execute(
    "INSERT INTO material_comments (material_id, user_id, content) VALUES (?, ?, ?)",
    [materialId, userId, text]
  );

  res.status(201).json({ id: result.insertId });
}