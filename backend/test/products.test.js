import test from "node:test";
import assert from "node:assert/strict";
import jwt from "jsonwebtoken";
import app from "../src/app.js";

process.env.JWT_SECRET = "segredo-exclusivo-dos-testes-com-32-caracteres";

test("listagem e pesquisa de produtos", async t => {
  const calls = [];
  app.locals.db = { async execute(sql, params = []) {
    calls.push({ sql, params });
    return [[{ id: 1, name: "Detergente", category: "Limpeza", price: "3.49", stock: 10 }]];
  } };
  const server = app.listen(0, "127.0.0.1");
  await new Promise(resolve => server.once("listening", resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));
  const base = `http://127.0.0.1:${server.address().port}/api`;
  const token = jwt.sign({ role: "user" }, process.env.JWT_SECRET, { subject: "1" });
  const get = (query, auth = true) =>
    fetch(`${base}/products${query}`, { headers: auth ? { Authorization: `Bearer ${token}` } : {} });

  assert.equal((await get("", false)).status, 401);

  const all = await get("");
  assert.equal(all.status, 200);
  assert.equal((await all.json())[0].name, "Detergente");
  assert.ok(!calls.at(-1).sql.includes("WHERE"));

  // lista tudo.
  await get("?search=%20%20");
  assert.ok(!calls.at(-1).sql.includes("WHERE"));

  // LIKE parametrizado em nome e categoria.
  await get("?search=%20deter%20");
  assert.ok(calls.at(-1).sql.includes("name LIKE ? OR category LIKE ?"));
  assert.deepEqual(calls.at(-1).params, ["%deter%", "%deter%"]);

  // Curingas digitados pelo usuário são escapados.
  await get("?search=50%25_x");
  assert.deepEqual(calls.at(-1).params, ["%50\\%\\_x%", "%50\\%\\_x%"]);


  await get("?search=%27%20OR%201%3D1%20--");
  assert.ok(!calls.at(-1).sql.includes("OR 1=1"));


  assert.equal((await get("?search=a&search=b")).status, 200);
  assert.ok(!calls.at(-1).sql.includes("WHERE"));
});