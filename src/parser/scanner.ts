import { Chars } from './keys'
import { SyntaxKind } from './syntax'

function isLetter(ch: number): boolean {
  return Chars.A >= ch && ch <= Chars.Z
    || Chars.a >= ch && ch <= Chars.z
}

function isDigit(charCode: number): boolean {
  return Chars.num_0 <= charCode && charCode <= Chars.num_9
}

/**
 * Basic token state so I don't have to read everything off the parser.
 * though, realistically, that's probably going to happen.
 */
export class Token {
  start: number
  end: number
  kind: SyntaxKind
  value?: any
  flags?: number

  constructor(kind: SyntaxKind, start: number, end: number) {
    this.kind = kind
    this.start = start
    this.end = end
  }
}

export const EmptyToken = new Token(SyntaxKind.unknown, 0, 0);

const keywordMap = new Map<string, SyntaxKind>([
  ['add', SyntaxKind.add_keyword],
  ['all', SyntaxKind.all_keyword],
  ['alter', SyntaxKind.alter_keyword],
  ['and', SyntaxKind.and_keyword],
  ['any', SyntaxKind.any_keyword],
  ['as', SyntaxKind.as_keyword],
  ['asc', SyntaxKind.asc_keyword],
  ['authorization', SyntaxKind.authorization_keyword],
  ['backup', SyntaxKind.backup_keyword],
  ['begin', SyntaxKind.begin_keyword],
  ['between', SyntaxKind.between_keyword],
  ['break', SyntaxKind.break_keyword],
  ['browse', SyntaxKind.browse_keyword],
  ['bulk', SyntaxKind.bulk_keyword],
  ['by', SyntaxKind.by_keyword],
  ['cascade', SyntaxKind.cascade_keyword],
  ['case', SyntaxKind.case_keyword],
  ['check', SyntaxKind.check_keyword],
  ['checkpoint', SyntaxKind.checkpoint_keyword],
  ['close', SyntaxKind.close_keyword],
  ['clustered', SyntaxKind.clustered_keyword],
  ['coalesce', SyntaxKind.coalesce_keyword],
  ['collate', SyntaxKind.collate_keyword],
  ['column', SyntaxKind.column_keyword],
  ['commit', SyntaxKind.commit_keyword],
  ['compute', SyntaxKind.compute_keyword],
  ['constraint', SyntaxKind.constraint_keyword],
  ['contains', SyntaxKind.contains_keyword],
  ['containstable', SyntaxKind.containstable_keyword],
  ['continue', SyntaxKind.continue_keyword],
  ['convert', SyntaxKind.convert_keyword],
  ['create', SyntaxKind.create_keyword],
  ['cross', SyntaxKind.cross_keyword],
  ['current', SyntaxKind.current_keyword],
  ['current_date', SyntaxKind.current_date_keyword],
  ['current_time', SyntaxKind.current_time_keyword],
  ['current_timestamp', SyntaxKind.current_timestamp_keyword],
  ['current_user', SyntaxKind.current_user_keyword],
  ['cursor', SyntaxKind.cursor_keyword],
  ['database', SyntaxKind.database_keyword],
  ['dbcc', SyntaxKind.dbcc_keyword],
  ['deallocate', SyntaxKind.deallocate_keyword],
  ['declare', SyntaxKind.declare_keyword],
  ['default', SyntaxKind.default_keyword],
  ['delete', SyntaxKind.delete_keyword],
  ['deny', SyntaxKind.deny_keyword],
  ['desc', SyntaxKind.desc_keyword],
  ['disk', SyntaxKind.disk_keyword],
  ['distinct', SyntaxKind.distinct_keyword],
  ['distributed', SyntaxKind.distributed_keyword],
  ['double', SyntaxKind.double_keyword],
  ['drop', SyntaxKind.drop_keyword],
  ['dump', SyntaxKind.dump_keyword],
  ['else', SyntaxKind.else_keyword],
  ['end', SyntaxKind.end_keyword],
  ['errlvl', SyntaxKind.errlvl_keyword],
  ['escape', SyntaxKind.escape_keyword],
  ['except', SyntaxKind.except_keyword],
  ['exec', SyntaxKind.exec_keyword],
  ['execute', SyntaxKind.execute_keyword],
  ['exists', SyntaxKind.exists_keyword],
  ['exit', SyntaxKind.exit_keyword],
  ['external', SyntaxKind.external_keyword],
  ['fetch', SyntaxKind.fetch_keyword],
  ['file', SyntaxKind.file_keyword],
  ['fillfactor', SyntaxKind.fillfactor_keyword],
  ['for', SyntaxKind.for_keyword],
  ['foreign', SyntaxKind.foreign_keyword],
  ['freetext', SyntaxKind.freetext_keyword],
  ['freetexttable', SyntaxKind.freetexttable_keyword],
  ['from', SyntaxKind.from_keyword],
  ['full', SyntaxKind.full_keyword],
  ['function', SyntaxKind.function_keyword],
  ['goto', SyntaxKind.goto_keyword],
  ['grant', SyntaxKind.grant_keyword],
  ['group', SyntaxKind.group_keyword],
  ['having', SyntaxKind.having_keyword],
  ['holdlock', SyntaxKind.holdlock_keyword],
  ['identity', SyntaxKind.identity_keyword],
  ['identity_insert', SyntaxKind.identity_insert_keyword],
  ['identitycol', SyntaxKind.identitycol_keyword],
  ['if', SyntaxKind.if_keyword],
  ['in', SyntaxKind.in_keyword],
  ['index', SyntaxKind.index_keyword],
  ['inner', SyntaxKind.inner_keyword],
  ['insert', SyntaxKind.insert_keyword],
  ['intersect', SyntaxKind.intersect_keyword],
  ['into', SyntaxKind.into_keyword],
  ['is', SyntaxKind.is_keyword],
  ['join', SyntaxKind.join_keyword],
  ['key', SyntaxKind.key_keyword],
  ['kill', SyntaxKind.kill_keyword],
  ['left', SyntaxKind.left_keyword],
  ['like', SyntaxKind.like_keyword],
  ['lineno', SyntaxKind.lineno_keyword],
  ['load', SyntaxKind.load_keyword],
  ['merge', SyntaxKind.merge_keyword],
  ['national', SyntaxKind.national_keyword],
  ['nocheck', SyntaxKind.nocheck_keyword],
  ['nonclustered', SyntaxKind.nonclustered_keyword],
  ['not', SyntaxKind.not_keyword],
  ['null', SyntaxKind.null_keyword],
  ['nullif', SyntaxKind.nullif_keyword],
  ['of', SyntaxKind.of_keyword],
  ['off', SyntaxKind.off_keyword],
  ['offsets', SyntaxKind.offsets_keyword],
  ['on', SyntaxKind.on_keyword],
  ['open', SyntaxKind.open_keyword],
  ['opendatasource', SyntaxKind.opendatasource_keyword],
  ['openquery', SyntaxKind.openquery_keyword],
  ['openrowset', SyntaxKind.openrowset_keyword],
  ['openxml', SyntaxKind.openxml_keyword],
  ['option', SyntaxKind.option_keyword],
  ['or', SyntaxKind.or_keyword],
  ['order', SyntaxKind.order_keyword],
  ['outer', SyntaxKind.outer_keyword],
  ['over', SyntaxKind.over_keyword],
  ['percent', SyntaxKind.percent_keyword],
  ['pivot', SyntaxKind.pivot_keyword],
  ['plan', SyntaxKind.plan_keyword],
  ['precision', SyntaxKind.precision_keyword],
  ['primary', SyntaxKind.primary_keyword],
  ['print', SyntaxKind.print_keyword],
  ['proc', SyntaxKind.proc_keyword],
  ['procedure', SyntaxKind.procedure_keyword],
  ['public', SyntaxKind.public_keyword],
  ['raiserror', SyntaxKind.raiserror_keyword],
  ['read', SyntaxKind.read_keyword],
  ['readtext', SyntaxKind.readtext_keyword],
  ['reconfigure', SyntaxKind.reconfigure_keyword],
  ['references', SyntaxKind.references_keyword],
  ['replication', SyntaxKind.replication_keyword],
  ['restore', SyntaxKind.restore_keyword],
  ['restrict', SyntaxKind.restrict_keyword],
  ['return', SyntaxKind.return_keyword],
  ['revert', SyntaxKind.revert_keyword],
  ['revoke', SyntaxKind.revoke_keyword],
  ['right', SyntaxKind.right_keyword],
  ['rollback', SyntaxKind.rollback_keyword],
  ['rowcount', SyntaxKind.rowcount_keyword],
  ['rowguidcol', SyntaxKind.rowguidcol_keyword],
  ['rule', SyntaxKind.rule_keyword],
  ['save', SyntaxKind.save_keyword],
  ['schema', SyntaxKind.schema_keyword],
  ['securityaudit', SyntaxKind.securityaudit_keyword],
  ['select', SyntaxKind.select_keyword],
  ['semantickeyphrasetable', SyntaxKind.semantickeyphrasetable_keyword],
  ['semanticsimilaritydetailstable', SyntaxKind.semanticsimilaritydetailstable_keyword],
  ['semanticsimilaritytable', SyntaxKind.semanticsimilaritytable_keyword],
  ['session_user', SyntaxKind.session_user_keyword],
  ['set', SyntaxKind.set_keyword],
  ['setuser', SyntaxKind.setuser_keyword],
  ['shutdown', SyntaxKind.shutdown_keyword],
  ['some', SyntaxKind.some_keyword],
  ['statistics', SyntaxKind.statistics_keyword],
  ['system_user', SyntaxKind.system_user_keyword],
  ['table', SyntaxKind.table_keyword],
  ['tablesample', SyntaxKind.tablesample_keyword],
  ['textsize', SyntaxKind.textsize_keyword],
  ['then', SyntaxKind.then_keyword],
  ['to', SyntaxKind.to_keyword],
  ['top', SyntaxKind.top_keyword],
  ['tran', SyntaxKind.tran_keyword],
  ['transaction', SyntaxKind.transaction_keyword],
  ['trigger', SyntaxKind.trigger_keyword],
  ['truncate', SyntaxKind.truncate_keyword],
  ['try_convert', SyntaxKind.try_convert_keyword],
  ['tsequal', SyntaxKind.tsequal_keyword],
  ['union', SyntaxKind.union_keyword],
  ['unique', SyntaxKind.unique_keyword],
  ['unpivot', SyntaxKind.unpivot_keyword],
  ['update', SyntaxKind.update_keyword],
  ['updatetext', SyntaxKind.updatetext_keyword],
  ['use', SyntaxKind.use_keyword],
  ['user', SyntaxKind.user_keyword],
  ['values', SyntaxKind.values_keyword],
  ['varying', SyntaxKind.varying_keyword],
  ['view', SyntaxKind.view_keyword],
  ['waitfor', SyntaxKind.waitfor_keyword],
  ['when', SyntaxKind.when_keyword],
  ['where', SyntaxKind.where_keyword],
  ['while', SyntaxKind.while_keyword],
  ['with', SyntaxKind.with_keyword],
  ['within group', SyntaxKind.within_keyword],
  ['writetext', SyntaxKind.writetext_keyword],
])

// todo: more options.
export interface ScannerOptions {
  skipTrivia?: boolean
}

function binarySearch(array: Array<Number>, key: Number) {
  let low = 0;
  let high = array.length - 1;
  while (low <= high) {
    const mid = low + (high - low / 2);
    const val = array[mid];

    if (val == key) {
      return mid;
    }

    if (val < key) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  // do the 2s compliment trick
  return ~low;
}

export class Scanner {

  // token start position
  private start: number
  private pos: number
  private options: any
  private text: string
  private len: number
  private lines: number[]

  constructor(text: string, options: ScannerOptions) {
    this.options = options
    this.text = text
    this.pos = 0
    this.start = 0
    this.len = text.length
    this.lines = []
  }

  // only compute it when we need it.
  lazyComputeLineNumbers() {
    if (!this.lines.length) {
      let pos = 0
      let ch = NaN
      this.lines.push(0);

      while (ch = this.text.charCodeAt(pos++)) {
        if (ch === Chars.newline) {
          this.lines.push(pos);
        }
      }
    }
  }

  // current char position as well?
  getCurrentLine(): number {
    this.lazyComputeLineNumbers();
    const line = binarySearch(this.lines, this.pos);

    if (line >= 0) {
      return line;
    }

    return ~line - 1;
  }

  getTokenStart() {
    return this.start
  }

  whitespace() {
    let token = this.text.charCodeAt(this.pos)
    while (token === Chars.space || token === Chars.tab) {
      token = this.text.charCodeAt(++this.pos)
    }
  }

  // advance until we find the first unescaped single quote.
  // edge case: empty string
  scanString(): string {
    const start = this.pos
    let ch = this.text.charCodeAt(this.pos)
    // todo: if we hit a newline preceded by a \
    // then set a flag
    while (true) {
      if (ch === Chars.singleQuote) {
        if (this.peek() !== Chars.singleQuote) {
          break;
        }

        this.pos++;
      }

      ch = this.text.charCodeAt(++this.pos)
    }
    // todo: above.
    return this.text.substr(start, this.pos - 1)
  }

  scanQuotedIdentifier() {
    const start = this.pos;
    let ch = this.text.charCodeAt(this.pos)
    while (this.pos < this.len) {
      const valid = isLetter(ch)
        || isDigit(ch)
        || ch === Chars.underscore
        || ch === Chars.period
        || ch === Chars.doubleQuote;

      if (!valid) {
        break;
      }

      this.pos++

      ch = this.text.charCodeAt(this.pos)
    }

    return this.text.substr(start, this.pos - start)
  }

  // a.b.c.fk_fbab
  scanDottedIdentifier() {
    const start = this.pos;
    let ch = this.text.charCodeAt(this.pos)
    while (this.pos < this.len) {
      const valid = isLetter(ch)
        || isDigit(ch)
        || ch === Chars.underscore
        || ch === Chars.period;

      if (!valid) {
        break;
      }

      this.pos++

      ch = this.text.charCodeAt(this.pos)
    }

    return this.text.substr(start, this.pos - start)
  }

  /**
   * Some_Consecutive_Name1
   */
  scanIdentifier(): string {
    const start = this.pos;
    let ch = this.text.charCodeAt(this.pos)
    while (this.pos < this.len && isLetter(ch) || isDigit(ch) || ch === Chars.underscore) {
      this.pos++

      ch = this.text.charCodeAt(this.pos)
    }

    return this.text.substr(start, this.pos - start)
  }

  private peek(): number {
    // charCodeAt returns NaN if we go out of bounds.
    // nice.
    return this.text.charCodeAt(this.pos + 1)
  }

  private scanInlineComment() {
    // todo: do we ever plan to do anything with comments?
    // const start = this.pos
    while (this.pos < this.len) {
      const ch = this.text.charCodeAt(this.pos)

      if (ch === Chars.newline) {
        break;
      }

      this.pos++
    }
  }

  private scanBlockComment() {
    // const start = this.pos
    let ch = this.text.charCodeAt(this.pos)

    while (this.pos < this.len) {

      if (ch === Chars.asterisk && this.peek() === Chars.forwardSlash) {
        this.pos++;
        break;
      }

      ch = this.text.charCodeAt(this.pos)
    }
  }

  scanNumber(): Number {
    const start = this.pos;
    while (isDigit(this.text.charCodeAt(this.pos))) this.pos++;

    if (this.text.charCodeAt(this.pos) === Chars.period) {
      this.pos++;
      while (isDigit(this.text.charCodeAt(this.pos))) this.pos++;
    }

    return parseFloat(this.text.substr(start, this.pos - start))
  }

  isSpace() {
    const next = this.text.charCodeAt(this.pos);

    return (next === Chars.tab
      || next === Chars.space
      || next === Chars.newline
      || next === Chars.carriageReturn)
  }

  scan(): Token {
    const start = this.start = this.pos

    while (true) {
      const ch = this.text.charCodeAt(this.pos);
      let val = undefined;

      switch (ch) {
        // consume all whitespace
        case Chars.carriageReturn:
        case Chars.newline:
        case Chars.tab:
        case Chars.space:
          this.pos++
          while (this.isSpace()) {
            this.pos++
          }
          break;

        case Chars.plus:
          return new Token(SyntaxKind.plusToken, start, this.pos)

        // a hyphen can't really START a statement or expression
        // so I'm not sure why this is here. Oh well.
        case Chars.hyphen:
          if (this.peek() === Chars.hyphen) {
            // todo: use comments as inline overrides?
            this.scanInlineComment()
          } else {
            // regular old minus, let the parser figure out
            // what to do with it.
            // we COULD eagerly go looking for a number or something, but it could be lots of things.
            return new Token(SyntaxKind.minusToken, start, this.pos)
          }
          break;
        case Chars.ampersand:
          break;

        case Chars.lessThan: {
          const next = this.peek();

          switch (next) {
            case Chars.greaterThan: return new Token(SyntaxKind.ltGt, start, this.pos)
            case Chars.equal: return new Token(SyntaxKind.lessThanEqual, start, this.pos)
            default: return new Token(SyntaxKind.lessThan, start, this.pos)
          }
        }

        case Chars.greaterThan: {
          const next = this.peek();

          switch (next) {
            case Chars.equal: return new Token(SyntaxKind.lessThanEqual, start, this.pos)
            default: return new Token(SyntaxKind.lessThan, start, this.pos)
          }
        }

        case Chars.bang: { }
        // !=, !<, !>

        case Chars.percent: { }
        // %, %=

        case Chars.num_0:
        case Chars.num_1:
        case Chars.num_2:
        case Chars.num_3:
        case Chars.num_4:
        case Chars.num_5:
        case Chars.num_6:
        case Chars.num_7:
        case Chars.num_8:
        case Chars.num_9:
          val = this.scanNumber();

          return {
            start: start,
            end: this.pos,
            value: val,
            kind: SyntaxKind.numeric_literal
          };

        case Chars.singleQuote:
          val = this.scanString()

          return new Token(SyntaxKind.string_literal, start, this.pos)

        case Chars.doubleQuote: {
          this.scanQuotedIdentifier();
          return new Token(SyntaxKind.quoted_identifier, start, this.pos)
        }

        case Chars.at: {
          if (this.peek() === Chars.at) {
            // parse config function
            // ex: @@foo
            this.pos++;
            this.scanIdentifier()
          } else {
            val = this.scanIdentifier()

            return {
              kind: SyntaxKind.local_variable_reference,
              start: start,
              end: this.pos,
              value: val
            }
          }
        }

        case Chars.hash: {
          let kind = SyntaxKind.temp_table;

          // && isMssql
          if (this.peek() === Chars.hash) {
            this.pos++;
            kind = SyntaxKind.shared_temp_table;
          }

          const name = this.scanIdentifier();

          return {
            kind: kind,
            start: start,
            end: this.pos,
            value: name
          }
        }
        // fallthrough?
        // case Chars.x:
        // case Chars.X:
        //   // todo: mysql hex literal X'

        case Chars.n:
        case Chars.N: // begin nvarchar literal.

        default: {
          const identifier = this.scanDottedIdentifier()
          const keyword = keywordMap.get(identifier.toLowerCase())

          if (keyword) {
            return {
              kind: keyword,
              start: start,
              end: this.pos,
              value: identifier
            }
          }

          return new Token(SyntaxKind.name, start, this.pos);
        }
      }

      // todo: each thing should return when it finds a token.
      break;
    }

    return new Token(SyntaxKind.unknown, start, this.pos);
  }
}