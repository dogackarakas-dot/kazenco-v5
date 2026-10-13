/** seconds=0 is a persistent reservation; it must not reopen on calendar rollover. */
export interface RfqBudget {
  name: string;
  amount: number;
  limit: number;
  seconds: number;
  /**
   * Capacity ceiling (reserved storage bytes), not a request-rate limit. On
   * exhaustion this must fail as 503 with the manual email fallback, never a
   * timed 429 retry -- the window can be the full daily/persistent duration,
   * not "a few minutes". Rate-limit budgets (session/mail counts) leave this
   * unset and keep the ordinary 429 path.
   */
  capacity?: true;
}

/** Shared, atomic storage contract. An adapter must enforce limits across instances. */
export interface RfqSecurityStore {
  configured(): boolean;
  consume(budgets: RfqBudget[]): Promise<boolean>;
  get(key: string): Promise<string | null>;
  setOnce(key: string, value: string, seconds: number): Promise<boolean>;
}

export const RFQ_BUDGET_SCRIPT = `
for i = 1, #KEYS do
  local current = tonumber(redis.call('GET', KEYS[i]) or '0')
  local amount = tonumber(ARGV[(i-1)*3+1])
  local limit = tonumber(ARGV[(i-1)*3+2])
  if current + amount > limit then return 0 end
end
for i = 1, #KEYS do
  local amount = tonumber(ARGV[(i-1)*3+1])
  local ttl = tonumber(ARGV[(i-1)*3+3])
  redis.call('INCRBY', KEYS[i], amount)
  if ttl == 0 then
    redis.call('PERSIST', KEYS[i])
  elseif redis.call('TTL', KEYS[i]) < 0 then
    redis.call('EXPIRE', KEYS[i], ttl)
  end
end
return 1`;

/** Optional REST Redis adapter; no connection is opened until a protected request. */
export const rfqSecurityStore: RfqSecurityStore = {
  configured: () => {
    const connection = redisConnection();
    return Boolean(connection.url?.startsWith("https://") && connection.token);
  },
  async consume(budgets) {
    const result = await command(["EVAL", RFQ_BUDGET_SCRIPT, budgets.length,
      ...budgets.map((budget) => budget.name),
      ...budgets.flatMap((budget) => [budget.amount, budget.limit, budget.seconds]),
    ]);
    if (result !== 0 && result !== 1) throw new Error("Unexpected RFQ budget response");
    return result === 1;
  },
  async get(key) {
    const value = await command(["GET", key]);
    if (value !== null && typeof value !== "string") throw new Error("Unexpected RFQ session response");
    return value;
  },
  async setOnce(key, value, seconds) {
    const result = await command(["SET", key, value, "EX", seconds, "NX"]);
    if (result !== null && result !== "OK") throw new Error("Unexpected RFQ reservation response");
    return result === "OK";
  },
};

function redisConnection() {
  // Select complete pairs; never combine credentials from different stores.
  if (process.env.RFQ_REDIS_REST_URL || process.env.RFQ_REDIS_REST_TOKEN) {
    return { url: process.env.RFQ_REDIS_REST_URL, token: process.env.RFQ_REDIS_REST_TOKEN };
  }
  return { url: process.env.KV_REST_API_URL, token: process.env.KV_REST_API_TOKEN };
}

async function command(values: (string | number)[]): Promise<unknown> {
  if (!rfqSecurityStore.configured()) throw new Error("RFQ shared storage is not configured");
  const connection = redisConnection();
  const response = await fetch(connection.url!, {
    method: "POST", cache: "no-store", redirect: "error",
    headers: { Authorization: `Bearer ${connection.token}`, "Content-Type": "application/json" },
    body: JSON.stringify(values), signal: AbortSignal.timeout(5000),
  });
  const data = await response.json() as { result?: unknown; error?: unknown };
  if (!response.ok || data.error || !("result" in data)) throw new Error("RFQ shared storage is unavailable");
  return data.result;
}
