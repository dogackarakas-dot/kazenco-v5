const NUMBERS = [
  ["20+", "Years of experience"],
  ["2004", "Established in Atyrau"],
  ["10", "Recognised client organisations"],
  ["6", "Key operating regions"],
];

export function KazencoNumbers() {
  return (
    <section className="kazenco-v5-numbers" aria-label="KAZENCO at a glance">
      {NUMBERS.map(([value, label]) => (
        <div key={label}>
          <strong>{value}</strong>
          <span>{label}</span>
        </div>
      ))}
    </section>
  );
}
