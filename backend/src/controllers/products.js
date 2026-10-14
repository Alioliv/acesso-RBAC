
export async function listProducts(req, res) {
  const raw = req.query.search;
  const search = typeof raw === "string" ? raw.trim().slice(0, 100) : "";

  if (!search) {
    const [rows] = await req.app.locals.db.execute(
      "SELECT id, name, category, price, stock FROM products ORDER BY name"
    );
    return res.json(rows);
  }

  const term = `%${search.replace(/[\\%_]/g, "\\$&")}%`;

  const [rows] = await req.app.locals.db.execute(
    "SELECT id, name, category, price, stock FROM products WHERE name LIKE ? OR category LIKE ? ORDER BY name",
    [term, term]
  );
  res.json(rows);
}