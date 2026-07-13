export function Header({ title, kicker }: { title: string; kicker?: string }) {
  return <header className="mb-6"><p className="text-sm font-semibold text-zinc-500">{kicker}</p><h1 className="mt-1 text-3xl font-black tracking-tight md:text-5xl">{title}</h1></header>;
}
