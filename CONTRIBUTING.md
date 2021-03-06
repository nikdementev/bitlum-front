# Commit Guidelines

* [Goals](#goals)
* [Format of the commit message](#commit-message-format)
  * [Subject line](#subject-line)
    * [`<type>`](#type)
    * [`<scope>`](#scope)
    * [`<subject>`](#subject)
    * [`<meta>`](#meta)
  * [Message body](#body)
  * [Message footer](#footer)
    * [Breaking changes](#breaking-changes)
    * [Referencing issues](#referencing-issues)
* [Revert](#revert)
* [Generating CHANGELOG.md](#generating-CHANGELOG.md)


## Goals

* allow generating CHANGELOG.md by script
* allow ignoring commits by git bisect (not important commits like formatting)
* provide better information when browsing the history

## Commit Message Format
Each commit message consists of a **header**, a **body** and a **footer**.  
The header has a special format that includes a **type**, a **scope** and a **subject**:

```
<type>(<scope>): <subject> <meta>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

The **header** is mandatory and the **scope** of the header is optional.

Any line of the commit message cannot be longer 100 characters! This allows the message to be easier
to read on GitHub as well as in various git tools.

The message header is a single line that contains succinct description
of the change containing a type, an optional scope and a subject.

### Type
Must be one of the following:

* **feat**: A new feature
* **fix**: A bug fix
* **refactor**: A code change that neither fixes a bug nor adds a feature
* **docs**: Documentation only changes
* **format**: Changes that do not affect the meaning of the code (white-space, formatting, missing
  semi-colons, etc)
* **perf**: A code change that improves performance
* **test**: Adding missing or correcting existing tests
* **chore**: Changes to the build process or auxiliary tools and libraries such as documentation
  generation

### Scope
The scope could be anything specifying place of the commit change.

You can use `*` when the change affects more than a single scope (or just use empty one - in that case you can omit parentheses).

Many simpler projects will not have scopes and so this portion of the commit message will not be present. [If later the project expands and scopes start making sense, they can be introduced at that time.]

### Subject
The subject contains succinct description of the change:

* use the imperative, present tense: "change" not "changed" nor "changes"
* don't capitalize first letter
* no dot (.) at the end

### Meta
Additionally, the end of subject-line may contain twitter-inspired markup to facilitate changelog generation and bissecting. For example:

* `#wip` - indicate for contributors the feature being implemented is not complete yet. Should not be included in changelogs (just the last commit for a feature goes to the changelog).
* `#irrelevant` - the commit does not add useful information. Used when fixing typos, etc... Should not be included in changelogs.

When bisecting, you can ignore these by:
```
git bisect skip $(git rev-list --grep irrelevant <good place> HEAD)
```

### Body
Just as in the **subject**, use the imperative, present tense: "change" not "changed" nor "changes".
The body should include the motivation for the change and contrast this with previous behavior.

### Footer
The footer should contain any information about **Breaking Changes** and is also the place to
[reference GitHub issues that this commit closes](https://help.github.com/articles/closing-issues-via-commit-messages/).

#### Breaking Changes
All breaking changes should start with the word `BREAKING CHANGE:` with a space or two newlines and have to be mentioned in footer with the description of the change, justification and migration notes.

#### Referencing issues

Closed bugs should be listed on a separate line in the footer prefixed with "Closes" keyword like this:
```
Closes #234
```

## Revert

If the commit reverts a previous commit, it should begin with `revert: `,
followed by the header of the reverted commit.
In the body it should say: `This reverts commit <hash>.`,
where the hash is the SHA of the commit being reverted.
A commit with this format is automatically created by the `git revert` command.

## Generating CHANGELOG.md

Changleos may contain three sections: new features, bug fixes, breaking changes.
This list could be generated by script when doing a release, along with links to related commits.
Of course you can edit this change log before actual release, but it could generate the skeleton.

List of all subjects (first lines in commit message) since last release:
```bash
git log <last tag> HEAD --pretty=format:%s
```

New features in this release
```bash
git log <last release> HEAD --grep feat
```