export function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    // \p{Mn}: marcas de acento combinantes, restam depois do NFD (ex: "ação" -> "acao").
    .replace(/\p{Mn}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
