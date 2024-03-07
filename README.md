# Fluent UI theme for VS Code

Inspired by and based on the awesome concept designs by
[u/zeealeidahmad](https://www.reddit.com/r/Windows11/comments/orbgzl/visual_studio_vs_code_and_github_desktop_with/).
Using CSS3 I tried as much as possible to replicate his designs. Some transparency effects are not
possible at the momend due to the current Electron version that VSCode is using.

## Disclaimer

This is a workbench theme. That means that VS Code's UI is being heavily modified for aestethic
purposes only. There's no intention to enhance or compete with the original look. Is merely an
alternative. Also, please bear in mind that this theme is considered an experiment, and therefore
beta software, since there's no official support for this type of modification, **so used it at your
own risk**.

# Install

1. Run VSCode as admin.
   1. This is important, the extension won't work otherwise
2. Install the extension from the
   [Marketplace](https://marketplace.visualstudio.com/items?itemName=leandro-rodrigues.fluent-ui-vscode)
   1. Optiona: Go to settings and adjust the colors (this can be done at any time)
3. Run `> Fluent UI: Enable` and reload when prompted

> VSCode will display a notification saying that the installtion is corrupt. That's normal, VSCode
> sees the installation as corrupt because the HTML (workbench.html) file is now changed.
>
> Just click the lil' cog on the message and select `Don't show again` and you should be good to go.

# Uninstall

1. Run VSCode as admin.
   1. This is important, you'll end up with a messed up `workbench.html` file if you run the
      `Disable` command as regular user.
2. Run `> Fluent: Disable` and reload when prompted
3. Uninstall the extension like your normally would

If you ran the command as regular user, here's how you can fix your installation:

1.  On Windows, go to
    `C:\Users\{username}\AppData\Local\Programs\Microsoft VS Code\resources\app\out\vs\code\electron-sandbox\workbench`.
2.  Open the file `workbench.html` as admin
3.  Remove everything between the comments `<!-- FUI-CSS-START -->` and `<!-- FUI-CSS-END -->`.

    1. Your `workbench.html` file should look like this after removing the patched code:

    ```html
    <!-- Copyright (C) Microsoft Corporation. All rights reserved. -->
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta
          http-equiv="Content-Security-Policy"
          content="default-src 'none'; img-src 'self' https: data: blob: vscode-remote-resource:; media-src 'self'; frame-src 'self' vscode-webview:; object-src 'self'; script-src 'self' 'unsafe-eval' blob:; style-src 'self' 'unsafe-inline'; connect-src 'self' https: ws:; font-src 'self' https: vscode-remote-resource:;"
        />
        <meta
          http-equiv="Content-Security-Policy"
          content="require-trusted-types-for 'script'; trusted-types amdLoader cellRendererEditorText defaultWorkerFactory diffEditorWidget stickyScrollViewLayer editorGhostText domLineBreaksComputer editorViewLayer diffReview dompurify notebookRenderer safeInnerHtml standaloneColorizer tokenizeToString;"
        />
      </head>

      <body aria-label=""></body>

      <!-- Startup (do not modify order of script tags!) -->
      <script src="workbench.js"></script>
    </html>
    ```

    2. If that doesn't work, reinstalling VSCode will fix it.

4.  Save and reload VSCode

## Known issues

- I'm unable to override the terminal, minimap and in some cases, the scrollbar background. So
  depending on the syntax theme you choose, the background colors will be off for those elements.
  You can set the colors for these panels (and others) manually via settings, like so:

```json
"workbench.colorCustomizations": {
  "terminal.background": "#ffffff",
  "minimap.background": "#ffffff"
}
```

## Features

The default installtion (via `> Fluent UI: enable`) has all features enabled by default (provided
you didn't disable some of them via settings before activating). You can disable some features via
settings, just search for `Fluent` there.

> After changing one of the settings, you'll have to run `> Fluent UI: reload` to reapply the
> styles.

### App background

The background feature is intended to mimic, to an extent, the Mica material used by Windows 11
native applications. Your current wallpaper will be sampled once during installation and used as a
background for VSCode.

For example, my current wallpaper is this:

![Wallpaper](./images/wallpaper.png "Wallpaper")

VSCode will look like this after sampling the image:

![Wallpaper](./images/vscode-sample-wp.png "Wallpaper")

![Wallpaper](./images/vscode-sample-wp-content.png "Wallpaper")

Disabling the background in the settings results in VSCode looking like this:

![Wallpaper](./images/vscode-sample-no-wp.png "Wallpaper")

![Wallpaper](./images/vscode-sample-no-wp-content.png "Wallpaper")

If you change your wallpaper and want to refresh your VSCode you'll have to disable and enable the
theme again (as admin):

1. `> Fluent UI: disable`
2. Restart (close and open VSCode)
3. `> Fluent UI: enable`
4. Restart (again :/)

### Please note

> When you install the extension, it will sample the current desktop wallpaper you have set,
> generate a blurred version of it and set VSCode window to use that as background. In some cases
> thay may cause low contrast or make stuff hard to read, depending on what you have for a
> wallpaper, so keep that in mind when running the default installation.

You can disale this feature by unchecking the `Enable background image` in the settings page.

### Compact mode

`Settings -> Fluent UI: Compact`

This will apply the theme using slight less padding around some of the elements. The difference is
subtle but can help those with limited space.

#### Normal mode

![Normal
mode](./images/normal-mode.png "Normal mode")

#### Compact mode

![Compact
mode](./images/compact-mode.png "Normal mode")

### Custom colors

You can set custom colors for the accent, dark and light background colors via settings. Any HEX
value will work, but bear in mind that the extension can't account for contrast issues as a result
of a custom color.

### Dynamic light/dark theme

The UI is dynamic and will apply the light and dark themes based on the current syntax theme type.
For example, if you're using
[One Dark Pro](https://marketplace.visualstudio.com/items?itemName=zhuangtongfa.Material-theme),
when you run `> Fluent UI: Enable`, the extension will identify
[One Dark Pro](https://marketplace.visualstudio.com/items?itemName=zhuangtongfa.Material-theme) as a
`dark` syntax theme and apply the correct UI mode. Same for light themes.

The extension will also do the same on the fly as you preview your syntax theme using
`Ctrl/Cmd + k Ctrl/Cmd + t`

## And to complete the look

Product icon themes:

- [Fluent Icons](https://marketplace.visualstudio.com/items?itemName=miguelsolorio.fluent-icons)
  (the one you see in the screenshots)
- [Carbon](https://marketplace.visualstudio.com/items?itemName=antfu.icons-carbon)

The workbench is set to use Segoe UI Variable (the new standard font for Windows 11). I highly
recommend downloading and installing it. If you don't, the theme will fallback to the default font.

- [Segoe UI variable](https://docs.microsoft.com/en-us/windows/apps/design/downloads/#fonts)

### Screenshots

#### Sidebar

![Sidebar preview](./images/sidebar.png "Sidebar")

#### Activity bar

![Activity bar preview](./images/activitybar.png "Activity bar")

#### Tabs

![Tabs preview](./images/tab-list.png "Tabs")

#### Terminal

![Terminal preview](./images/terminal.png "Terminal")

#### Search widget

![Search widget preview](./images/search-widget.png "Search widget")

#### Command palette

![Command palette preview](./images/command-palette-light.png "Command palette")

Some of the great themes that go along with this UI (in no particular order):

## [Serendipity](https://marketplace.visualstudio.com/items?itemName=wicked-labs.wvsc-serendipity)

![Serendipity Light theme preview](./images/serendipity-light.png "Serendipity Light")
![Serendipity Dark theme preview](./images/serendipity-dark.png "Serendipity Dard")

## [Copilot](https://marketplace.visualstudio.com/items?itemName=BenjaminBenais.copilot-theme)

![Copilot theme preview](./images/copilot.png "Copilot")

## [Mariana Pro](https://marketplace.visualstudio.com/items?itemName=rickynormandeau.mariana-pro)

![Mariana Prot theme preview](./images/mariana-pro.png "Mariana Pro")

## [Night Owl](https://marketplace.visualstudio.com/items?itemName=sdras.night-owl)

![Night Owl Light theme preview](./images/night-owl-light.png "Night Owl Light")
![Night Owl Dark theme preview](./images/night-owl-dark.png "Night Owl Dark")

## [One Dark Pro](https://marketplace.visualstudio.com/items?itemName=zhuangtongfa.Material-theme)

![One Dark Pro theme preview](./images/one-dark-pro.png "One Dark Pro ")

## VSCode default white

![VSCode light theme preview](./images/vscode-default-light.png "VSCode light")

---
