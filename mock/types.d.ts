type DateTimeUnit = "year" | "month" | "day" | "hour" | "minute" | "second";

declare module "mockjs" {
  export function mock(template: string | object): Record<string, unknown>;

  export namespace Random {
    /**
     * @return 一个随机的布尔值。
     * @example boolean() // => true
     */
    export function boolean(): boolean;
    /**
     * @param min 指示参数 current 出现的概率。概率计算公式为 min / (min + max)。该参数的默认值为 1，即有 50% 的概率返回参数 current。
     * @param max 指示参数 current 的相反值 !current 出现的概率。概率计算公式为 max / (min + max)。该参数的默认值为 1，即有 50% 的概率返回参数 !current。
     * @param current 可选值为布尔值 true 或 false。如果未传入任何参数，则返回 true 和 false 的概率各为 50%。该参数没有默认值。在该方法的内部，依据原生方法 Math.random() 返回的（浮点）数来计算和返回布尔值，例如在最简单的情况下，返回值是表达式 Math.random() >= 0.5 的执行结果。
     * @return 一个随机的布尔值。
     * @example boolean(1, 9, true) // => false
     * @example boolean(1, 9, false) // => true
     */
    export function boolean(
      min: number,
      max: number,
      current: boolean,
    ): boolean;

    /**
     * @return 一个随机的布尔值。
     * @example bool() // => true
     */
    export function bool(): boolean;
    /**
     * @param min 指示参数 current 出现的概率。概率计算公式为 min / (min + max)。该参数的默认值为 1，即有 50% 的概率返回参数 current。
     * @param max 指示参数 current 的相反值 !current 出现的概率。概率计算公式为 max / (min + max)。该参数的默认值为 1，即有 50% 的概率返回参数 !current。
     * @param current 可选值为布尔值 true 或 false。如果未传入任何参数，则返回 true 和 false 的概率各为 50%。该参数没有默认值。在该方法的内部，依据原生方法 Math.random() 返回的（浮点）数来计算和返回布尔值，例如在最简单的情况下，返回值是表达式 Math.random() >= 0.5 的执行结果。
     * @return 一个随机的布尔值。
     * @example bool(1, 9, true) // => false
     * @example bool(1, 9, false) // => true
     */
    export function bool(min: number, max: number, current: boolean): boolean;

    /**
     * @param min 指示随机自然数的最小值。默认值为 0。
     * @param max 指示随机自然数的最大值。默认值为 9007199254740992。
     * @return 一个随机的自然数。
     * @example natural() // => 1002794054057984
     * @example natural(10000) // => 71529071126209
     * @example natural(60, 100) // => 89
     */
    export function natural(min?: number, max?: number): number;

    /**
     * @param min 指示随机整数的最小值。默认值为 -9007199254740992。
     * @param max 指示随机整数的最大值。默认值为 9007199254740992。
     * @return 一个随机的整数。
     * @example integer() // => -3815311811805184
     * @example integer(10000) // => 4303764511003750
     * @example integer(60, 100) // => 82
     */
    export function integer(min?: number, max?: number): number;

    /**
     * @param min 整数部分的最小值。默认值为 -9007199254740992。
     * @param max 整数部分的最大值。默认值为 9007199254740992。
     * @param dmin 小数部分位数的最小值。默认值为 0。
     * @param dmax 小数部分位数的最大值。默认值为 17。
     * @return 一个随机的浮点数。
     * @example float() // => -1766114241544192.8
     * @example float(0) // => 556530504040448.25
     * @example float(60, 100) // => 82.56779679549358
     * @example float(60, 100, 3) // => 61.718533677927894
     * @example float(60, 100, 3, 5) // => 70.6849
     */
    export function float(
      min?: number,
      max?: number,
      dmin?: number,
      dmax?: number,
    ): number;

    /**
     * @param pool 字符串。表示字符池，将从中选择一个字符返回。如果传入了 'lower' 或 'upper'、'number'、'symbol'，表示从内置的字符池从选取：'lower' 表示从小写字母池中选取字符，'upper' 表示从大写字母池中选取字符，'number' 表示从数字字符池中选取字符，'symbol' 表示从标点符号池中选取字符。如果传入了自定义字符池，则从其中选取字符。如果未传入该参数，则从 lower + upper + number + symbol 中随机选取一个字符返回。
     * @return 一个随机的字符。
     * @example character() // => 'P'
     * @example character('lower') // => 'g'
     * @example character('upper') // => 'Q'
     * @example character('number') // => '7'
     * @example character('symbol') // => '&'
     * @example character('aeiou') // => 'u'
     */
    export function character(pool?: string): string;

    /**
     * @return 一个随机的字符串
     * @example string() // => 'pJjDUe'
     */
    export function string(): string;
    /**
     * @param len 指示字符串长度。
     * @return 一个随机的字符串
     * @example string(5) // => 'GaadY'
     */
    export function string(len: number): string;
    /**
     * @param pool 字符串。表示字符池，将从中选择一个字符返回。如果传入了 'lower' 或 'upper'、'number'、'symbol'，表示从内置的字符池从选取：'lower' 表示从小写字母池中选取字符，'upper' 表示从大写字母池中选取字符，'number' 表示从数字字符池中选取字符，'symbol' 表示从标点符号池中选取字符。如果传入了自定义字符池，则从其中选取字符。如果未传入该参数，则从 lower + upper + number + symbol 中随机选取一个字符返回。
     * @param len 指示字符串长度。
     * @return 一个随机的字符串
     * @example string('lower', 5) // => 'gaaey'
     */
    export function string(pool: string, len: number): string;
    /**
     * @param min 随机字符串的最小长度。默认值为 3。
     * @param max 随机字符串的最大长度。默认值为 7。
     * @return 一个随机的字符串
     * @example string(7, 10) // => 'UuGQgSYk'
     */
    export function string(min: number, max: number): string;
    /**
     * @param pool 字符串。表示字符池，将从中选择一个字符返回。如果传入了 'lower' 或 'upper'、'number'、'symbol'，表示从内置的字符池从选取：'lower' 表示从小写字母池中选取字符，'upper' 表示从大写字母池中选取字符，'number' 表示从数字字符池中选取字符，'symbol' 表示从标点符号池中选取字符。如果传入了自定义字符池，则从其中选取字符。如果未传入该参数，则从 lower + upper + number + symbol 中随机选取一个字符返回。
     * @param min 随机字符串的最小长度。默认值为 3。
     * @param max 随机字符串的最大长度。默认值为 7。
     * @return 一个随机的字符串
     * @example string('lower', 7, 10) // => 'uuqgysyk'
     * @example string('壹贰叁肆伍陆柒捌玖拾', 3, 5) // => '肆捌伍叁'
     */
    export function string(pool: string, min: number, max: number): string;

    /**
     * @param stop 数组中整数的结束值（不包含在返回值中）。
     * @return 一个整型数组
     * @example range(10) // => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
     */
    export function range(stop: number): number[];
    /**
     * @param start 数组中整数的起始值。
     * @param stop 数组中整数的结束值（不包含在返回值中）。
     * @param step 数组中整数之间的步长。默认值为 1。
     * @return 一个整型数组
     * @example range(1, 11, 3) // => [1, 4, 7, 10]
     * @example range(1, 11, 4) // => [1, 5, 9]
     */
    export function range(start: number, stop: number, step?: number): number[];

    /**
     * @param format 指示生成的日期字符串的格式。默认值为 yyyy-MM-dd。
     * @return 一个随机的日期字符串
     * @example date() // => '2002-02-12'
     * @example date('yy-MM-dd') // => '02-02-12'
     */
    export function date(format?: string): string;

    /**
     * @param format 指示生成的时间字符串的格式。默认值为 HH:mm:ss。
     * @return 一个随机的时间字符串
     * @example time() // => '09:24:59'
     * @example time('A HH:mm:ss') // => 'AM 09:24:59'
     */
    export function time(format?: string): string;

    /**
     * @param format 指示生成的日期和时间字符串的格式。默认值为 yyyy-MM-dd HH:mm:ss。
     * @return 一个随机的日期和时间字符串
     * @example datetime() // => '2002-02-12 09:24:59'
     * @example datetime('yyyy-MM-dd A HH:mm:ss') // => '2002-02-12 AM 09:24:59'
     */
    export function datetime(format?: string): string;

    /**
     * @return 当前的日期和时间字符串。
     * @example now() // => '2017-06-12 08:46:23'
     */
    export function now(): string;
    /**
     * @param unit 表示时间单位，用于对当前日期和时间进行格式化。可选值有：year、month、week、day、hour、minute、second、week，默认不会格式化。
     * @return 当前的日期和时间字符串。
     * @example now('year') // => '2017-01-01 00:00:00'
     * @example now('month') // => '2017-06-01 00:00:00'
     */
    export function now(unit: DateTimeUnit): string;
    /**
     * @param format 指示生成的日期和时间字符串的格式。默认值为 yyyy-MM-dd HH:mm:ss。
     * @return 当前的日期和时间字符串。
     * @example now('yyyy-MM-dd HH:mm:ss SS') // => '2017-06-12 08:46:23 535'
     */
    export function now(format: string): string;
    /**
     * @param unit 表示时间单位，用于对当前日期和时间进行格式化。可选值有：year、month、week、day、hour、minute、second、week，默认不会格式化。
     * @param format 指示生成的日期和时间字符串的格式。默认值为 yyyy-MM-dd HH:mm:ss。
     * @return 当前的日期和时间字符串。
     * @example now('year', 'yyyy-MM-dd HH:mm:ss SSS') // => '2017-01-01 00:00:00 000'
     */
    export function now(unit: DateTimeUnit, format: string): string;

    export function image(
      size?: `${number}x${number}`,
      background?: string,
      foreground?: string,
      format?: "png" | "gif" | "jpg",
      text?: string,
    ): string;

    export function dataImage(
      size?: `${number}x${number}`,
      text?: string,
    ): string;

    export function color(): string;

    export function hex(): string;

    export function rgb(): string;

    export function rgba(): string;

    export function hsl(): string;

    export function paragraph(len?: number): string;
    export function paragraph(min: number, max: number): string;

    export function sentence(len?: number): string;
    export function sentence(min: number, max: number): string;

    export function word(len?: number): string;
    export function word(min: number, max: number): string;

    export function title(len?: number): string;
    export function title(min: number, max: number): string;

    export function cparagraph(len?: number): string;
    export function cparagraph(min: number, max: number): string;

    export function csentence(len?: number): string;
    export function csentence(min: number, max: number): string;

    export function cword(): string;
    export function cword(pool: string): string;
    export function cword(len: number): string;
    export function cword(pool: string, len?: number): string;
    export function cword(min: number, max?: number): string;
    export function cword(pool: string, min: number, max: number): string;

    export function ctitle(len?: number): string;
    export function ctitle(min: number, max: number): string;

    export function first(): string;

    export function last(): string;

    export function name(middle?: boolean): string;

    export function cfirst(): string;

    export function clast(): string;

    export function cname(): string;

    export function url(): string;

    export function domain(): string;

    export function protocol(): string;

    /**
     * 随机生成一个顶级域名（Top Level Domain）
     */
    export function tld(): string;

    export function email(domain?: string): string;

    export function ip(): string;

    export function region(): string;

    export function province(): string;

    export function city(prefix?: boolean): string;

    export function county(prefix?: boolean): string;

    /**
     * @return 一个随机的邮政编码（六位数字）
     */
    export function zip(): string;

    export function capitalize(word: string): string;

    export function upper(word: string): string;

    export function lower(word: string): string;

    export function pick<T>(arr: T[]): T;

    export function shuffle<T>(arr: T[]): T[];

    /**
     * @return 一个随机的 GUID 字符串。
     * @example guid() // => '662C63B4-FD43-66F4-3328-C54E3FF0D56E'
     */
    export function guid(): string;

    /**
     * @return 一个随机的 18 位身份证。
     * @example id() // => '420000200710091854'
     */
    export function id(): string;

    /**
     * @param step 整数自增的步长。默认值为 1。
     * @return 一个全局的自增整数。
     * @example increment() // => 1
     * @example increment(100) // => 101
     * @example increment(1000) // => 1101
     */
    export function increment(step?: number): number;
  }
}
