# DevForge

DevForge is a VS Code language package for simple structured DevForge and OmniVault transfer files. The repository name is `DevF6rge`; the language and extension display name are `DevForge`.

DevForge files are designed to stay readable and flexible:

- Bracket categories such as `[Profile]`
- Nested category blocks such as `[Profile]:{ ... }`
- Plain `key=value` entries
- Flexible category and key names
- `//` line comments and `/* */` block comments

## Supported File Extensions

DevForge currently maps these extensions to the same `devforge` language:

- `.Dev`, `.dev`, `.DEV`
- `.Log`, `.log`, `.LOG`
- `.Master`, `.master`
- `.Slave`, `.slave`
- `.NPC`, `.npc`
- `.Battle`, `.battle`
- `.Ships`, `.ships`
- `.Dex`, `.DEX`, `.dex`
- `.Gen`, `.GEN`, `.gen`
- `.Mail`, `.mail`, `.MAIL`
- `.Pack`, `.pack`, `.PACK`
- `.Omni`, `.omni`, `.OMNI`
- `.Vault`, `.vault`, `.VAULT`
- `.Route`, `.route`, `.ROUTE`

## OmniVault Mailman Support

Version 1.2.0 adds highlighting and snippets for readable OmniVault package and transfer files. The core DevForge format remains unchanged; OmniVault categories include `[Mailman]`, `[Package]`, `[Payload]`, `[Manifest]`, `[Hash]`, `[Transfer]`, `[Encryption]`, `[Source]`, `[Destination]`, `[Verify]`, `[Cleanup]`, and `[JacobApproval]`.

Use `examples/mailman.Mail`, `examples/package.Pack`, and `examples/omnivault-route.Route` as starting points. Cleanup examples preserve originals and require explicit Jacob approval.

## File Icons

DevForge v1.3.0 includes the **DevForge File Icons** theme. It provides a distinct icon for each supported file family: Dev, Log, Master, Slave, NPC, Battle, Ships, Dex, Gen, Mail, Pack, Omni, Vault, and Route. After installing the extension, select **DevForge File Icons** from VS Code's File Icon Theme picker.

## Syntax Basics

```Dev
[MachineProfile]:{
    Name="Example Workstation"
    Role=Development
    Cores=8
    Active=true

    [Network]:{
        Host=devforge.local
        Enabled=yes
    }
}
```

Rules are intentionally basic:

- Categories use bracket syntax.
- Nested blocks use `[Name]:{ ... }`.
- Entries use `Key=Value`.
- Strings may use double quotes or single quotes.
- Numbers and booleans are highlighted.
- Group and key names are flexible unless an application reserves them.

## Features

- Syntax highlighting for categories, block starters, keys, operators, strings, numbers, booleans, and comments
- Editor bracket configuration for `{}`, `[]`, `()`, and `<>`
- DevForge Dark theme
- DevForge snippets
- Example files in `examples/`

## Examples

The `examples/` folder contains clean reference samples:

- `examples/basic.Dev`
- `examples/log.Log`
- `examples/profile.Master`

`TEST/TEST.Dev` is a syntax and highlighting test file. It is not the final format standard.

## Install Or Update

Install a packaged VSIX in VS Code:

```powershell
code --install-extension devforge-language-1.1.0.vsix
```

Use the newest `devforge-language-*.vsix` file available in the repo when installing or updating.

## Development Notes

- `package.json` is the official source for the extension version.
- `.vsix` package files are intentionally committed. This repo is also a backup/install vault for reinstalling DevForge on new devices or fresh VS Code setups.
- Do not ignore or delete existing `.vsix` files unless the project owner explicitly says to.
- `PIX/Pix.dev` and temporary PIX courier files are local-only and should not be committed.
- Do not ignore the whole `PIX/` folder; safe PIX documentation may be tracked if added later.
