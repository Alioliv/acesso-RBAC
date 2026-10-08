import rateLimit from "express-rate-limit";

const JANELA_MS = 15 * 60 * 1000; // Janela de tempo de 15 minutos (em milissegundos)

export const loginRateLimit = rateLimit({
  windowMs: JANELA_MS,
  limit: 5, // no máximo 5 tentativas, como pede no item 3a 
  skipSuccessfulRequests: true, // só conta tentativas que falharam
  standardHeaders: "draft-7",
  legacyHeaders: false,
  handler: (req, res) => {
    const liberaEm = req.rateLimit.resetTime; // Momento exato em que o bloqueio termina
    const segundos = Math.max(1, Math.ceil((liberaEm - Date.now()) / 1000));
    const minutos = Math.ceil(segundos / 60);

    res.set("Retry-After", String(segundos));
    res.status(429).json({
      message: `Muitas tentativas de login. Você poderá tentar novamente em ${minutos} minuto(s), às ${liberaEm.toLocaleTimeString("pt-BR", { timeZone: "America/Sao_Paulo" })}.`,
      tentarNovamenteEm: liberaEm.toISOString(), // Data/hora de liberação 
      segundosRestantes: segundos,
    });
  },
});