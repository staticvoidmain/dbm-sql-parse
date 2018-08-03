// disclaimer: I doubt I'm ever going to support the full mssql grammar
// but maybe someone will send me a PR with "for xml" and all that crap
import {
  SyntaxKind
} from './syntax'

import { Token } from './scanner'
import { FeatureFlags } from './features'

// todo: maybe also the char position
export type ErrorCallback = (error: ParserError) => void

export interface ParserError {
  file?: string
  line: number
  col: number
  message: string
}

export interface ParserOptions {
  path?: string
  skipTrivia?: boolean
  skipKeywordTracking?: boolean
  error?: ErrorCallback
  features?: FeatureFlags
}

export interface TextRange {
  start: number
  end: number
}

export interface SyntaxNode extends TextRange {
  kind: SyntaxKind
}

// one two or three part name
// not sure if this needs another type.
export interface Identifier extends SyntaxNode {
  parts: string[]
}

export type ColumnNode = ColumnExpression | IdentifierExpression

// todo: these might not matter... since createNode makes it with the token kind baked in...
export interface PlusOperator extends SyntaxNode { kind: SyntaxKind.plus_token }
export interface MinusOperator extends SyntaxNode { kind: SyntaxKind.minus_token }
export interface MultiplyOperator extends SyntaxNode { kind: SyntaxKind.mul_token }
export interface DivideOperator extends SyntaxNode { kind: SyntaxKind.div_token }
export interface BitwiseOrOperator extends SyntaxNode { kind: SyntaxKind.bitwise_or_token }
export interface BitwiseAndOperator extends SyntaxNode { kind: SyntaxKind.bitwise_and_token }

export interface EqualsOperator extends SyntaxNode { kind: SyntaxKind.equal }
export interface NotEqualsOperator extends SyntaxNode { kind: SyntaxKind.notEqual }
export interface AnsiNotEqualsOperator extends SyntaxNode { kind: SyntaxKind.ltGt }
export interface OrOperator extends SyntaxNode { kind: SyntaxKind.or_keyword }
export interface AndOperator extends SyntaxNode { kind: SyntaxKind.and_keyword }
export interface GreaterThanOperator extends SyntaxNode { kind: SyntaxKind.greaterThan }
export interface LessThanOperator extends SyntaxNode { kind: SyntaxKind.lessThan }
export interface GreaterThanEqualOperator extends SyntaxNode { kind: SyntaxKind.greaterThanEqual }
export interface LessThanEqualOperator extends SyntaxNode { kind: SyntaxKind.lessThanEqual }
export interface LikeOperator extends SyntaxNode { kind: SyntaxKind.like_keyword }
export interface InOperator extends SyntaxNode { kind: SyntaxKind.in_keyword }
export interface NotGreaterThanOperator extends SyntaxNode { kind: SyntaxKind.notGreaterThan }
export interface NotLessThanOperator extends SyntaxNode { kind: SyntaxKind.notLessThan }
// todo: this is likely going to take some kind of special syntax in the parser
// to support exists, in, any, all etc.
export interface ExistsOperator extends SyntaxNode { kind: SyntaxKind.exists_keyword }

export interface NotOperator extends SyntaxNode { kind: SyntaxKind.not_keyword }

export interface DefaultLiteral extends SyntaxNode { kind: SyntaxKind.default_keyword }


// some/any act like unary operators
// but they can only be used as the RHS of a comparison
export interface SomeOperator extends SyntaxNode { kind: SyntaxKind.some_keyword }
export interface AnyOperator extends SyntaxNode { kind: SyntaxKind.any_keyword }

// https://docs.microsoft.com/en-us/sql/t-sql/language-elements/expressions-transact-sql?view=sql-server-2017

export interface LogicalOperator extends SyntaxNode {
  not: boolean
}

export interface ExistsExpression extends LogicalOperator {
  subquery: SelectStatement
}

export interface InExpression extends LogicalOperator {
  kind: SyntaxKind.in_expr
  left: Expr
  expressions?: Expr[]
  subquery: SelectStatement
}

export interface LikeExpression extends LogicalOperator {
  kind: SyntaxKind.like_expr
  left: Expr
  pattern: Token
  escape: Token
}

export interface BetweenExpression extends LogicalOperator {
  kind: SyntaxKind.between_expr
  test_expression: Expr
  begin_expression: Expr
  end_expression: Expr
}

export type BinaryOperator =
  | PlusOperator
  | MinusOperator
  | MultiplyOperator
  | DivideOperator
  | EqualsOperator
  | NotEqualsOperator
  | AnsiNotEqualsOperator
  | OrOperator
  | AndOperator
  | GreaterThanOperator
  | LessThanOperator
  | GreaterThanEqualOperator
  | LessThanEqualOperator
  | LikeOperator
  | NotLessThanOperator
  | NotGreaterThanOperator

export interface PlusEqualsOperator extends SyntaxNode { kind: SyntaxKind.plusEqualsAssignment }
export interface MinusEqualsOperator extends SyntaxNode { kind: SyntaxKind.minusEqualsAssignment }
export interface MultiplyEqualsOperator extends SyntaxNode { kind: SyntaxKind.mulEqualsAssignment }
export interface DivEqualsOperator extends SyntaxNode { kind: SyntaxKind.divEqualsAssignment }
export interface ModEqualsOperator extends SyntaxNode { kind: SyntaxKind.modEqualsAssignment }
export interface AndEqualsOperator extends SyntaxNode { kind: SyntaxKind.bitwiseAndAssignment }
export interface XorEqualsOperator extends SyntaxNode { kind: SyntaxKind.bitwiseXorAssignment }
export interface OrEqualsOperator extends SyntaxNode { kind: SyntaxKind.bitwiseOrAssignment }

export type AssignmentOperator =
  | EqualsOperator
  | PlusEqualsOperator
  | MinusEqualsOperator
  | MultiplyEqualsOperator
  | DivEqualsOperator
  | ModEqualsOperator
  | AndEqualsOperator
  | XorEqualsOperator
  | OrEqualsOperator

export interface IdentifierExpression extends Expr {
  identifier: Identifier
}

export interface SelectExpression extends Expr {
  select: SelectStatement
}

export interface CollateNode extends SyntaxNode {
  collation: Identifier
}

export type CreateTableElement =
  | ColumnDefinition
  | ComputedColumnDefinition
  | ConstraintDefinition
  | IndexDefinition
// todo: ... lots more here

export enum ColumnDefinitionFlags {
  None              = 0,
  NotForReplication = 1 << 0,
  Sparse            = 1 << 1,
  FileStream        = 1 << 2,
  HasNullability    = 1 << 3,
  HasIdentity       = 1 << 4,
  HasCollation      = 1 << 5,
  HasDefault        = 1 << 6,
}

export interface ColumnConstraint extends SyntaxNode {
  // todo...
}

export interface IdentityDefinition extends SyntaxNode {
  seed?: number
  increment?: number
}

// todo: is the declare @x table (<column_def>) a subset of the
// real create table foo ()
export interface ColumnDefinition extends SyntaxNode {
  name: Identifier
  type: DataType
  column_flags: ColumnDefinitionFlags

  nullability?: 'null' | 'not-null'
  identity?: IdentityDefinition
  columnConstraints?: ColumnConstraint[]
  collation?: CollateNode
  default?: Expr
}

export interface ComputedColumnDefinition extends SyntaxNode {
  name: Identifier
  expression: Expr
}

// todo: I forget the syntax here.
export interface ConstraintDefinition extends SyntaxNode {
  name: Identifier
  unique?: boolean
  default?: Expr
  with_checked?: boolean
}

export interface IndexDefinition extends SyntaxNode {
  type: 'clustered' | 'nonclustered'
  columnstore?: boolean
}

/**
 * todo:
 */
export interface ColumnExpression extends Expr {
  expression: Expr
  alias?: Identifier
  style: 'alias_equals_expr' | 'expr_as_alias' | 'expr_only'
}

export type UnaryExpression =
| UnaryMinusExpression
| UnaryPlusExpression
| BitwiseNotExpression
| LogicalNotExpression
| IsNullTestExpression

export interface BinaryExpression extends Expr {
  left: Expr
  op: BinaryOperator
  right: Expr
}

export interface IsNullTestExpression extends Expr {
  expr: Expr
  not_null: boolean
}

export interface CastExpression extends SyntaxNode, Expr {
  expr: Expr
  type: DataType
}

export interface BitwiseNotExpression extends Expr {
  expr: Expr
}

export interface LogicalNotExpression extends SyntaxNode {
  expr: Expr
}

export interface UnaryPlusExpression extends Expr {
  expr: Expr
}

export interface UnaryMinusExpression extends Expr {
  expr: Expr
}

// todo: figure out why value expression sucks
// so far it doesn't work some weird bug in the typesystem
export type ValueExpression =
  | FunctionCallExpression
  | ConstantExpression
  | CaseExpression
  | BinaryExpression
  | BitwiseNotExpression
  | IdentifierExpression
  | UnaryMinusExpression
  | UnaryPlusExpression
// todo: table expression with select-top 1 some_col
// or just select 1

// max 2: precision + scale | length | 'max'
export interface DataType extends SyntaxNode {
  name: string
  args: string[] | 'max'
  null?: boolean
}

// todo: convert to union type?
export interface Expr extends SyntaxNode { }

export interface NullExpression extends SyntaxNode { kind: SyntaxKind.null_keyword }

export type ConstantExpression =
  //   | DefaultLiteral
  | NullExpression
  | LiteralExpression

// todo: make this a type to account for nulls and defaults and all that
// good stuff...
export interface LiteralExpression extends Expr {
  value: any
}

export interface ParenExpression extends Expr {
  expression: Expr
}

export type CaseExpression =
  | SimpleCaseExpression
  | SearchedCaseExpression

export interface SimpleCaseExpression extends Expr, SyntaxNode {
  input_expression: Expr
  cases: Array<WhenExpression>
  else: Expr
}

export interface SearchedCaseExpression extends Expr, SyntaxNode {
  cases: Array<WhenExpression>
  else: Expr
}

export interface WhenExpression extends Expr, SyntaxNode {
  when: Expr
  then: Expr
}

export interface FunctionCallExpression extends Expr {
  name: Identifier
  arguments: Expr[]
  over?: OverClause
}

export interface OverClause {
  partition?: PartitionByClause
  // technically not optional
  // but to ease initialization
  // I'm marking it this way
  order_by?: OrderByClause
}

export interface WhereClause extends SyntaxNode {
  predicate: Expr
}

// TODO: is this everything I want to cover?
// https://docs.microsoft.com/en-us/sql/t-sql/queries/from-transact-sql?view=sql-server-2017
export enum JoinType {
  left,
  right,
  full,
  explicit_inner,
  implicit_inner,
  cross
}

export interface JoinedTable extends SyntaxNode {
  type: JoinType
  source: TableLikeDataSource
  on: Expr
}

export interface GroupByClause extends SyntaxNode {
  grouping: Expr[]
}

export interface PartitionByClause extends SyntaxNode {
  expressions: Expr[]
}

export interface OrderByClause extends SyntaxNode {
  ordering: Expr[]
}

export interface HavingClause extends SyntaxNode {
  predicate: Expr
}

export interface IntoClause extends SyntaxNode {
  target: Identifier
}

export interface Source extends SyntaxNode {
  alias?: string
  with?: string[] // todo: specialized type for table hints
}

// this is lame... factor this out.
export interface TableLikeDataSource extends SyntaxNode {
  expr: IdentifierExpression | FunctionCallExpression | SelectStatement
  alias?: Identifier
}

export type RowValueExpression =
  | DefaultLiteral
  | NullExpression
  | ValueExpression

/**
 * legal in a from clause, apparently.
 * ex: (values (1, 2), (3, 4) ) as Tuple(a, b);
 */
export interface DerivedTable extends SyntaxNode {
  expressions: RowValueExpression[]
}

export interface FromClause extends SyntaxNode {
  sources: TableLikeDataSource[]
  joins?: JoinedTable[]
}

// statements
// ----------
// these represent the top-level declarations of a script
// which are made up of all the other node types.
export type Statement =
  | SelectStatement
  | SetStatement
  | DeclareStatement
  | CreateStatement
  | AlterStatement
  | UseDatabaseStatement
  | GoToStatement
  | DefineLabelStatement
  | WhileStatement
  | IfStatement
  | TruncateTableStatement

// todo: deallocate, open, close, drop,
export interface UseDatabaseStatement extends SyntaxNode {
  name: string
}

export interface StatementBlock extends SyntaxNode {
  statements: Statement[]
  has_begin_end: boolean
}

// can have a table, or variables, but not both
export interface DeclareStatement extends SyntaxNode {
  table?: TableDeclaration
  variables?: VariableDeclaration[]
}

export interface TableDeclaration extends SyntaxNode {
  name: Identifier
  body: CreateTableElement[]
}

// locals can only consist of a single-part identifier
export interface VariableDeclaration extends SyntaxNode {
  name: string
  has_as: boolean
  type: DataType
  expression?: ValueExpression
}

export interface IfStatement extends SyntaxNode {
  predicate: Expr
  then: StatementBlock
  else?: StatementBlock
}

export interface WhileStatement extends SyntaxNode {
  predicate: Expr
  body: StatementBlock
}

export interface SetOptionStatement extends SyntaxNode {
  option: Token
  option_value: Token
}

export interface SetStatement extends SyntaxNode {
  name: string
  op: AssignmentOperator
  expression: ValueExpression
}

export interface SelectStatement extends SyntaxNode {
  top: any
  qualifier: 'all' | 'distinct'
  columns: Array<ColumnNode>
  from?: FromClause
  into?: IntoClause
  where?: WhereClause
  order_by?: OrderByClause
  group_by?: GroupByClause
  having?: HavingClause
  unions?: SelectStatement[]
}

export interface GoStatement extends SyntaxNode {
  count?: number
}

export interface GoToStatement extends SyntaxNode {
  label: string
}

export interface DefineLabelStatement extends SyntaxNode {
  name: string
}

export interface DropStatement extends SyntaxNode {
  objectType: Token
  target: Identifier
}

export enum ExecuteStatementFlags {
  None                = 0,
  NoExecKeyword       = 1 << 0,
  HasArgs             = 1 << 1,
  HasOptions          = 1 << 2,
  HasReturnVariable   = 1 << 3,
}

// somewhat rare and a little convoluted...
// execute ('select * from something') as SomeUser;
export interface ExecuteStringStatement extends SyntaxNode {
  query: string
  format_args?: Expr[]
  linked_server?: string
  as_user?: string
}

export interface ExecuteProcedureStatement extends SyntaxNode {
  procedure: Identifier
  arguments: Expr[]
  flags: ExecuteStatementFlags
}

// union type, values range OR select, never both.
export interface InsertStatement extends SyntaxNode {
  target: Identifier
  columns?: Array<string>
  values?: Expr[]
  select?: SelectStatement
}

export type AlterStatement =
  | AlterTableStatement
  | AlterProcedureStatement
  | AlterFunctionStatement

export type CreateStatement =
  | CreateTableStatement
  | CreateProcedureStatement
  | CreateViewStatement
  // | CreateFunctionStatement
  // | CreateDatabaseStatement

export interface TruncateTableStatement extends SyntaxNode {
  table: Identifier
}

export interface DeleteStatement extends SyntaxNode {
  target: Identifier
  from?: FromClause
  where?: WhereClause
  // optional
  top?: Expr
  top_percent?: boolean
}

export interface CreateTableStatement extends SyntaxNode {
  name: Identifier
  body: CreateTableElement[]
  // file group stuff
  // as FileTable blah
}

// data warehouse extension
export interface CreateTableAsSelectStatement extends SyntaxNode {
  name: Identifier
  definition: SelectStatement
}

// alter table, view
export interface AlterTableStatement extends SyntaxNode {
  object: Identifier
}

export interface AlterFunctionStatement extends SyntaxNode {
  name: Identifier
  arguments: VariableDeclaration[]
  body: StatementBlock
}

export interface CreateViewStatement extends SyntaxNode {
  name: Identifier
  definition: SelectStatement
  // todo: optional with (SCHEMABINDING | ENCRYPTION | VIEWMETADATA)
  // todo: trailing semicolon
}

// create and alter are pretty much the same...
export interface CreateProcedureStatement extends SyntaxNode {
  name: Identifier
  arguments: VariableDeclaration[]
  body: StatementBlock
}

export interface AlterProcedureStatement extends SyntaxNode {
  name: Identifier
  // todo: does this work?
  arguments: VariableDeclaration[]
  body: StatementBlock
}

// throw is weird.
export interface PrintStatement extends SyntaxNode {
  expression: Expr
}

export interface ReturnStatement extends SyntaxNode {
  expression: Expr
}

export interface BlockComment extends SyntaxNode { kind: SyntaxKind.comment_block }
export interface InlineComment extends SyntaxNode { kind: SyntaxKind.comment_inline }

export type Comment =
  | BlockComment
  | InlineComment
