type BossNodeProps = {
  href: string;
  locked?: boolean;
};

export default function BossNode({ href, locked = false }: BossNodeProps) {
  const content = (
    <div
      className={`
        w-24 h-24 rounded-full
        flex items-center justify-center
        text-4xl
        my-4
        transition-transform duration-150
        ${
          locked
            ? "bg-gray-700 text-gray-400 opacity-60 cursor-not-allowed"
            : "bg-gradient-to-br from-red-500 to-red-700 shadow-[0_8px_0_#7f1d1d] animate-bounce"
        }
      `}
    >
      {locked ? "🔒" : "👹"}
    </div>
  );

  if (locked) return content;

  return <a href={href}>{content}</a>;
}
