# Contributing

Thanks for helping. This project is small; these few rules keep it that way.

## Before you start

1. Read the [specification](docs/specification/README.md). Behaviour is defined there, not in
   the code.
2. If your change alters behaviour, update the specification in the same pull request. New ideas
   that don't fit the current scope go to [parked ideas](docs/specification/parked.md).

## Making a change

1. Branch from `main`.
2. Keep each pull request to one intention: one behaviour change, with its specification
   elements, code and tests.
3. Link tests to the acceptance criteria they verify (`AC-HAND-*`).
4. Don't commit secrets: Wi-Fi credentials, device addresses or meeting details belong in local,
   git-ignored configuration.
5. Describe in the pull request how you tested it, on which Zoom version and in which client
   language (English or Finnish).

## Specification files

- Edit only the element files in `docs/specification/` (one element per file).
- `README.md`, `STATUS.md` and `pages/` there are generated. Don't edit them by hand.
- New elements start as `draft`; they become `agreed` when the pull request is merged.

## Reporting problems

Open an issue with the Zoom version, the client language, what the device showed and what you
expected.
