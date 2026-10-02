/** @type {import('next').NextConfig} */

// Detecta se a compilação está rodando no GitHub Actions para definir o basePath automaticamente
const isGithubActions = Boolean(process.env.GITHUB_ACTIONS);
let autoBasePath = "";

if (process.env.GITHUB_REPOSITORY) {
  const repo = process.env.GITHUB_REPOSITORY.split("/")[1] || "";
  // Se o repositório não for a página raiz (username.github.io), usa o nome do repositório como subpasta
  if (repo && !repo.endsWith(".github.io")) {
    autoBasePath = `/${repo}`;
  }
}

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? (isGithubActions ? autoBasePath : "");

const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  trailingSlash: true,
};

export default nextConfig;
