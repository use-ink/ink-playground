import { monaco } from 'react-monaco-editor';
import { Thenable } from 'monaco-editor/esm/vs/editor/editor.api';
import { WorldState } from '../../pkg/rust_analyzer_wasm';

const modeId = 'ra-rust';

export type Token = {
  range: monaco.IRange;
  tag: string;
};

type CodeLensSymbol = {
  range: monaco.IRange;
  command: Command;
};

type Command = {
  id: string;
  title: string;
  positions: Array<monaco.IRange>; // customized
};

type Reference = {
  tag: string;
  range: monaco.IRange;
};

type LocationLink = {
  range: monaco.IRange;
  originSelectionRange?: monaco.IRange;
  targetSelectionRange?: monaco.IRange;
  uri: monaco.Uri;
};

export const configureLanguage = (worldState: WorldState, allTokens: Token[]) => async () => {
  monaco.languages.register({
    // language for editor
    id: modeId,
  });
  monaco.languages.register({
    // language for hover info
    id: 'rust',
  });

  monaco.languages.registerHoverProvider(modeId, {
    provideHover: (_, pos) => {
      const res = worldState.hover(pos.lineNumber, pos.column) as Thenable<monaco.languages.Hover>;
      const mod = res.then(content => {
        if (content.range) {
          return {
            contents: [
              {
                ...content.contents[0],
                value: JSON.parse(
                  JSON.stringify(content.contents[0]?.value)
                    .replaceAll(/```(.*?)```/g, '```rust$1```')
                    .replaceAll('rustrust', 'rust')
                ),
                supportThemeIcons: true,
              },
            ],
            range: content.range,
          } as monaco.languages.Hover;
        }
      });
      return mod;
    },
  });

  monaco.languages.registerCodeLensProvider(modeId, {
    async provideCodeLenses(m) {
      const code_lenses: Array<CodeLensSymbol> = await worldState.code_lenses();
      const lenses = code_lenses.map(({ range, command }) => {
        const position = {
          column: range.startColumn,
          lineNumber: range.startLineNumber,
        };

        const references = command.positions.map(pos => ({
          range: pos,
          uri: m.uri,
        }));
        return {
          range,
          command: {
            id: command.id,
            title: command.title,
            arguments: [m.uri, position, references],
          },
        };
      });
      return {
        lenses,
        dispose() {
          //do nothing
        },
      };
    },
  });
  monaco.languages.registerReferenceProvider(modeId, {
    async provideReferences(m, pos, { includeDeclaration }) {
      const references: Array<Reference> = await worldState.references(
        pos.lineNumber,
        pos.column,
        includeDeclaration
      );
      if (references) {
        return references.map(({ range }) => ({ uri: m.uri, range }));
      }
    },
  });
  monaco.languages.registerDocumentHighlightProvider(modeId, {
    async provideDocumentHighlights(_, pos) {
      return await worldState.references(pos.lineNumber, pos.column, true);
    },
  });

  monaco.languages.registerRenameProvider(modeId, {
    async provideRenameEdits(m, pos, newName) {
      const edit = await worldState.rename(pos.lineNumber, pos.column, newName);
      if (edit) {
        return {
          edits: [
            {
              resource: m.uri,
              edit,
            },
          ],
        };
      }
    },
    async resolveRenameLocation(_, pos) {
      return worldState.prepare_rename(pos.lineNumber, pos.column);
    },
  });

  monaco.languages.registerCompletionItemProvider(modeId, {
    triggerCharacters: ['.', ':', '='],
    async provideCompletionItems(_m, pos) {
      const suggestions = await worldState.completions(pos.lineNumber, pos.column);
      if (suggestions) {
        return { suggestions };
      }
    },
  });
  monaco.languages.registerSignatureHelpProvider(modeId, {
    signatureHelpTriggerCharacters: ['(', ','],
    async provideSignatureHelp(_m, pos) {
      const value = await worldState.signature_help(pos.lineNumber, pos.column);
      if (!value) return null;
      return {
        value,
        dispose() {
          //do nothing
        },
      };
    },
  });
  monaco.languages.registerDefinitionProvider(modeId, {
    async provideDefinition(m, pos) {
      const list: Array<LocationLink> = await worldState.definition(pos.lineNumber, pos.column);
      if (list) {
        return list.map(def => ({ ...def, uri: m.uri }));
      }
    },
  });
  monaco.languages.registerImplementationProvider(modeId, {
    async provideImplementation(m, pos) {
      const list: Array<LocationLink> = await worldState.goto_implementation(
        pos.lineNumber,
        pos.column
      );
      if (list) {
        return list.map(def => ({ ...def, uri: m.uri }));
      }
    },
  });
  monaco.languages.registerDocumentSymbolProvider(modeId, {
    async provideDocumentSymbols() {
      return await worldState.document_symbols();
    },
  });
  monaco.languages.registerOnTypeFormattingEditProvider(modeId, {
    autoFormatTriggerCharacters: ['.', '='],
    async provideOnTypeFormattingEdits(_, pos, ch) {
      return await worldState.type_formatting(pos.lineNumber, pos.column, ch);
    },
  });
  monaco.languages.registerFoldingRangeProvider(modeId, {
    async provideFoldingRanges() {
      return await worldState.folding_ranges();
    },
  });

  setTokens(allTokens);
};

class TokenState {
  line: number;
  equals: (other?: monaco.languages.IState) => boolean;
  constructor(line = 0) {
    this.line = line;
    this.equals = () => true;
  }

  clone() {
    const res = new TokenState(this.line);
    res.line += 1;
    return res;
  }
}

function fixTag(tag: string) {
  switch (tag) {
    case 'builtin':
      return 'variable.predefined';
    case 'attribute':
      return 'key';
    case 'builtin_type':
    case 'self_type':
    case 'bool_literal':
      return 'keyword';
    case 'value_param':
      return 'value';
    case 'string_literal':
      return 'string';
    case 'macro':
      return 'number.hex';
    case 'literal':
      return 'number';
    default:
      return tag;
  }
}

export const setTokens = (allTokens: Token[]) =>
  monaco.languages.setTokensProvider(modeId, {
    getInitialState: () => new TokenState(),
    tokenize(_, st: TokenState) {
      const filteredTokens = allTokens.filter(token => token.range.startLineNumber === st.line);

      const tokens = filteredTokens.map(token => ({
        startIndex: token.range.startColumn - 1,
        scopes: fixTag(token.tag),
      }));
      tokens.sort((a, b) => a.startIndex - b.startIndex);

      return {
        tokens,
        endState: new TokenState(st.line + 1),
      };
    },
  });
