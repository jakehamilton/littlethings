{
  mkShell,
  bun,
  nodejs,
}:
mkShell {
  packages = [bun nodejs];
}
