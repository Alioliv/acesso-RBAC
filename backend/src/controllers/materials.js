// Lista materiais para qualquer usuario autenticado.
export async function listMaterials(req, res) {
  const [rows] = await req.app.locals.db.execute(
    "SELECT id, name, category FROM materials ORDER BY id",
  );
  res.json(rows);
}

// Exclui material
export async function deleteMaterial(req, res) {
  const id = Number(req.params.id);

  if (!Number.isSafeInteger(id) || id <= 0) {
    return res.status(400).json({ message: "ID invalido." });
  }

  await req.app.locals.db.execute(
    "DELETE FROM material_comments WHERE material_id = ?",
    [id],
  );

  const [result] = await req.app.locals.db.execute(
    "DELETE FROM materials WHERE id = ?",
    [id],
  );

  if (!result.affectedRows) {
    return res.status(404).json({ message: "Material nao encontrado." });
  }

  res.status(204).end();
}
