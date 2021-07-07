# MDN Writer Toolbox

Big name points towards ambitions not current feature~s~ which ~are~ is:

- Preview

## How to run it

First, you'll have to install [VSCode](https://code.visualstudio.com/). Then you
can run:

```
git clone git@github.com:Gregoor/mdn-writer-toolbox.git
cd mdn-writer-toolbox
code .
```

This will open the project in VSCode. There you can press <kbd>F5</kbd> which
will compile the extension and open up a new instance of VSCode with the
extension running inside of it. Navigate to
[mdn/content](https://github.com/mdn/content) to see the preview in action.

## What it does

Whenever a file is opened, check if it looks like MDN content, meaning:

- `.html`/`.md` file
- has a root with a `package.json` in one of its parent folders from which a
  `@mdn/yari/content/document.js` can be imported)

If it does, run `npm run start` from the root with a random server port and once
that server is running, open a panel in the second column to show the rendered
page.

## Areas in which it could be improved (some of them design decision)

- **Should it ship with yari instead of reusing what's there?**

  I think not because it allows having multiple content versions, with different
  yari's lying around. And newest yari is not necessarily compatible with older
  content. Plus this means we have to update the extension less often.\
  But it's worth thinking through again with another mind than mine!

- **How should it select which port to run on?**

  Currently it just tries a random port, but there is a chance of collision
  here. Should probably just put rethrow the dice in that case?

- **Where should the Preview open?**

  Right now it just always opens in the second column. Also it will re-open
  again when you close it. I think both of those are wrong, they disrespect user
  choice. The right thing to do is probably something like:

  - auto-open preview, until user closes it. Then only go back into auto-open
    mode when user runs a the _reopenPreview_ command
    - or even better, make it configurable whether it should auto-open
  - open in the second column by default but make it configurable to open
    somewhere else (first column, as tab, etc.)

- **CI**

  It should publish a new version for all changes on main into the VSCode
  Extension Marketplace
