type Tone = "primary" | "accent" | "primary-light";

const toneMap: Record<Tone, { from: string; to: string; icon: string }> = {
  primary: { from: "#1E3A5F", to: "#142943", icon: "#E8D9B5" },
  accent: { from: "#B8862E", to: "#8C6521", icon: "#FAF7F1" },
  "primary-light": { from: "#2E5280", to: "#1E3A5F", icon: "#E8D9B5" },
};

interface ImagePanelProps {
  tone?: Tone;
  icon?: "livro" | "cruz" | "pomba" | "pessoas";
  label?: string;
  className?: string;
}

/**
 * Painel ilustrado que substitui uma fotografia real. Nenhuma imagem
 * de terceiros é usada — este é um placeholder original em SVG/CSS,
 * pensado para ser trocado por fotos reais da igreja via painel
 * administrativo no futuro.
 */
export default function ImagePanel({
  tone = "primary",
  icon = "cruz",
  label,
  className = "",
}: ImagePanelProps) {
  const { from, to, icon: iconColor } = toneMap[tone];

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${className}`}
      style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
      role="img"
      aria-label={label ?? "Imagem ilustrativa"}
    >
      <svg
        width="96"
        height="96"
        viewBox="0 0 96 96"
        fill="none"
        className="opacity-90"
        aria-hidden="true"
      >
        {icon === "cruz" && (
          <path d="M48 14v68M22 40h52" stroke={iconColor} strokeWidth="5" strokeLinecap="round" />
        )}
        {icon === "livro" && (
          <>
            <path
              d="M16 24c10-4 22-4 32 2v40c-10-6-22-6-32-2V24z"
              stroke={iconColor}
              strokeWidth="4"
              strokeLinejoin="round"
            />
            <path
              d="M80 24c-10-4-22-4-32 2v40c10-6 22-6 32-2V24z"
              stroke={iconColor}
              strokeWidth="4"
              strokeLinejoin="round"
            />
          </>
        )}
        {icon === "pomba" && (
          <path
            d="M20 52c8-18 26-28 44-24-4 4-6 8-6 14 10 0 16 4 18 10-10 2-16 0-20-4-6 10-18 16-30 14 6-4 9-8 9-14-6 4-11 4-15 4z"
            stroke={iconColor}
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
        )}
        {icon === "pessoas" && (
          <>
            <circle cx="34" cy="30" r="9" stroke={iconColor} strokeWidth="4" />
            <circle cx="62" cy="30" r="9" stroke={iconColor} strokeWidth="4" />
            <path
              d="M16 74c2-14 12-22 18-22s16 8 18 22M46 74c2-14 12-22 18-22s16 8 18 22"
              stroke={iconColor}
              strokeWidth="4"
              strokeLinecap="round"
            />
          </>
        )}
      </svg>
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.10), transparent 45%)",
        }}
      />
    </div>
  );
}
