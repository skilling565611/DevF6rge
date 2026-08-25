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
- `.AI`, `.ai`
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
- `.Items`, `.items`, `.ITEMS` — WorldCore and DevForge item definitions

## Use DevForge With Any Text File

DevForge can be applied manually to any text-based file, including Python, Java,
HTML, CSS, and JSON. This keeps each file type's native VS Code tooling
available by default, such as Python debugging, Java language support, and
JSON validation.

To view an individual file with DevForge highlighting:

1. Open the file in VS Code.
2. Select its language name in the bottom-right status bar.
3. Choose **DevForge**.

This changes only the active editor's language mode; it does not rename the
file or replace the native language association for other files.

## Theme Behavior

Installing DevForge does not change VS Code's active color or file icon theme.
The DevForge language grammar works with the current theme, so Python, Java,
HTML, CSS, JSON, and other files keep their existing appearance.

**DevForge Dark** and **DevForge File Icons** remain optional themes. Select
them only when you want to use those themes across VS Code; otherwise leave
your current color and icon themes selected.

## OmniVault Mailman Support

Version 1.2.0 adds highlighting and snippets for readable OmniVault package and transfer files. The core DevForge format remains unchanged; OmniVault categories include `[Mailman]`, `[Package]`, `[Payload]`, `[Manifest]`, `[Hash]`, `[Transfer]`, `[Encryption]`, `[Source]`, `[Destination]`, `[Verify]`, `[Cleanup]`, and `[JacobApproval]`.

Use `examples/mailman.Mail`, `examples/package.Pack`, and `examples/omnivault-route.Route` as starting points. Cleanup examples preserve originals and require explicit Jacob approval.

## File Icons

DevForge v2.1.0 includes the **DevForge File Icons** theme. It provides distinct
icons for DevForge file families and common development formats: XML, HTML,
CSS, JSON, Python, Java, C/C++, C#, JavaScript, TypeScript, Markdown, YAML,
SQL, shell, Go, Rust, and PHP. After installing the extension, select
**DevForge File Icons** from VS Code's File Icon Theme picker.

`TEST/file-icons/` contains isolated preview files for each common development
format supported by the icon theme. They are test fixtures only and do not
change how your own files are interpreted.

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
code --install-extension devforge-language-2.1.1.vsix
```

Use the newest `devforge-language-*.vsix` file available in the repo when installing or updating.

## Development Notes

- `package.json` is the official source for the extension version.
- `.vsix` package files are intentionally committed. This repo is also a backup/install vault for reinstalling DevForge on new devices or fresh VS Code setups.
- Do not ignore or delete existing `.vsix` files unless the project owner explicitly says to.
- `PIX/Pix.dev` and temporary PIX courier files are local-only and should not be committed.
- Do not ignore the whole `PIX/` folder; safe PIX documentation may be tracked if added later.
