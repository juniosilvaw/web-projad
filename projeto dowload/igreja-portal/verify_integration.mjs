const BASE = "http://localhost:3333/api";
let falhas = 0;

function checar(condicao, mensagem) {
  if (condicao) {
    console.log(`OK   - ${mensagem}`);
  } else {
    console.log(`FAIL - ${mensagem}`);
    falhas++;
  }
}

async function get(path) {
  const res = await fetch(`${BASE}${path}`);
  const dados = await res.json();
  return { status: res.status, dados };
}

async function post(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const dados = await res.json();
  return { status: res.status, dados };
}

async function main() {
  // Header/Footer/Hero/Contato/Contribua consomem /configuracoes
  {
    const { status, dados } = await get("/configuracoes");
    checar(status === 200, "GET /configuracoes -> 200");
    for (const chave of ["nome_igreja", "slogan", "endereco", "telefone", "email", "pix_chave"]) {
      checar(chave in dados, `/configuracoes contém a chave "${chave}"`);
    }
  }

  // Footer/CultosSection consomem /cultos
  {
    const { status, dados } = await get("/cultos");
    checar(status === 200 && Array.isArray(dados) && dados.length > 0, "GET /cultos -> lista não vazia");
    const c = dados[0];
    checar(
      "id" in c && "dia_semana" in c && "nome" in c && "horario" in c,
      "item de /cultos tem os campos usados pelo frontend (id, dia_semana, nome, horario)"
    );
  }

  // NewsSection/Noticias/NoticiaDetalhe consomem /noticias
  {
    const { status, dados } = await get("/noticias");
    checar(status === 200 && Array.isArray(dados) && dados.length > 0, "GET /noticias -> lista não vazia");
    const n = dados[0];
    checar(
      ["id", "slug", "categoria", "titulo", "resumo", "publicado_em"].every((k) => k in n),
      "item de /noticias tem os campos usados pelo frontend"
    );
    const detalhe = await get(`/noticias/${n.slug}`);
    checar(detalhe.status === 200 && "conteudo" in detalhe.dados, `GET /noticias/${n.slug} -> detalhe com conteudo`);
  }

  // EventsSection/Eventos/EventoDetalhe consomem /eventos
  {
    const { status, dados } = await get("/eventos");
    checar(status === 200 && Array.isArray(dados) && dados.length > 0, "GET /eventos -> lista não vazia");
    const ev = dados[0];
    checar(
      ["id", "slug", "nome", "data_inicio", "local", "descricao"].every((k) => k in ev),
      "item de /eventos tem os campos usados pelo frontend"
    );
    const detalhe = await get(`/eventos/${ev.slug}`);
    checar(detalhe.status === 200, `GET /eventos/${ev.slug} -> detalhe OK`);
  }

  // Lideranca
  {
    const { status, dados } = await get("/lideranca");
    checar(status === 200 && Array.isArray(dados) && dados.length > 0, "GET /lideranca -> lista não vazia");
    checar(
      ["id", "nome", "funcao", "categoria"].every((k) => k in dados[0]),
      "item de /lideranca tem os campos usados pelo frontend"
    );
  }

  // Ministerios
  {
    const { status, dados } = await get("/ministerios");
    checar(status === 200 && Array.isArray(dados) && dados.length > 0, "GET /ministerios -> lista não vazia");
    checar(
      ["id", "nome", "slug", "descricao", "lideranca", "horarios", "contato"].every((k) => k in dados[0]),
      "item de /ministerios tem os campos usados pelo frontend"
    );
  }

  // Congregacoes (com e sem busca)
  {
    const { status, dados } = await get("/congregacoes");
    checar(status === 200 && Array.isArray(dados) && dados.length > 0, "GET /congregacoes -> lista não vazia");
    checar(Array.isArray(dados[0].horarios), "item de /congregacoes tem horarios como array (join agregado)");

    const busca = await get("/congregacoes?q=Belo");
    checar(busca.status === 200 && busca.dados.length > 0, "GET /congregacoes?q=Belo -> encontra resultado");

    const buscaVazia = await get("/congregacoes?q=zzz-inexistente");
    checar(buscaVazia.status === 200 && buscaVazia.dados.length === 0, "GET /congregacoes?q=inexistente -> lista vazia");
  }

  // Estudos e Midias (sem seed - devem responder 200 com array, mesmo vazio)
  {
    const estudos = await get("/estudos");
    checar(estudos.status === 200 && Array.isArray(estudos.dados), "GET /estudos -> 200 com array (vazio é esperado, sem seed)");
    const midias = await get("/midias");
    checar(midias.status === 200 && Array.isArray(midias.dados), "GET /midias -> 200 com array (vazio é esperado, sem seed)");
  }

  // Formulario de contato (Contato.tsx)
  {
    const { status, dados } = await post("/contato", {
      nome: "Teste Integração",
      email: "teste@exemplo.com",
      mensagem: "Mensagem de verificação end-to-end.",
    });
    checar(status === 201 && dados.id, "POST /contato -> 201 com id");
  }

  // Formulario de pedido de oracao (PedidoOracao.tsx) - anonimo
  {
    const { status, dados } = await post("/pedidos-oracao", {
      pedido: "Pedido de verificação end-to-end.",
      anonimo: true,
    });
    checar(status === 201 && dados.id, "POST /pedidos-oracao (anônimo) -> 201 com id");
  }

  // Pedido de oracao invalido (sem nome/email, nao anonimo) deve falhar com 422
  {
    const { status } = await post("/pedidos-oracao", { pedido: "Sem identificação" });
    checar(status === 422, "POST /pedidos-oracao sem nome/email e não-anônimo -> 422 (validação)");
  }

  console.log(`\n${falhas === 0 ? "TUDO OK" : `${falhas} FALHA(S)`}`);
  process.exit(falhas === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error("Erro ao rodar verificação:", err);
  process.exit(1);
});
