let
  secrets = import ./secrets.nix;
in
{ pkgs, ... }: {
  env = pkgs.lib.recursiveUpdate
    {
     ## env
    }
    secrets;
  channel = "stable-24.11";
  packages = [
    pkgs.corepack_latest
    pkgs.nodejs_latest
  ];
  idx.extensions = [
    "svelte.svelte-vscode"
    "vue.volar"
  ];
  idx.previews = {
    previews = {
      web = {
        command = [
          "pnpm"
          "run"
          "dev"
          "--"
          "--port"
          "$PORT"
          "--host"
          "0.0.0.0"
        ];
        manager = "web";
      };
    };
  };
  idx.workspace = {
    # Runs when a workspace is first created
    onCreate = {
      pnpm-install = "pnpm install";
    };
  };
}
