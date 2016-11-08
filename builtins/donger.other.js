const {Feature} = require('other')

const dongers = getDongers()
module.exports = new Feature({
  name: 'Donger',
  version: '0.0.5',
  dependencies: {
    otherjs: '3.x',
  },
  listeners: [{
    to: {words: ['donger']},
    on({word, rest}) {
      const query = rest.toLowerCase().replace(word, '').trim()
      let shuffledDongers = dongers.sort(() => 0.5 - Math.random())
      if (query.length) {
        const sampleSize = Math.round(dongers.length / Math.pow(query.length, 2))
        shuffledDongers = shuffledDongers.slice(0, sampleSize)
      }
      return {chatCompletions: shuffledDongers.map((donger) => ({text: donger}))}
    },
  }],
})

function getDongers() {
  return [
    '⊂(▀¯▀⊂)',
    'ᕙ(˵ ಠ ਊ ಠ ˵)ᕗ',
    'ԅ( ͒ ۝ ͒ )ᕤ',
    'o͡͡͡╮༼ • ʖ̯ • ༽╭o͡͡͡',
    'ᕙʕ ಥ ▃ ಥ ʔᕗ',
    'ᕙᓄ(☉ਊ☉)ᓄᕗ',
    '╰། ◉ ◯ ◉ །╯',
    'ʕ ᓀ ᴥ ᓂ ʔ',
    'ᕦ༼ ✖ ਊ ✖ ༽ᕤ',
    'ლ(ಥ Д ಥ )ლ',
    '⋌༼ •̀ ⌂ •́ ༽⋋',
    '( ຈ ﹏ ຈ )',
    '¯\\_༽ ಥ Д ಥ ༼_/¯',
    '໒( •̀ ╭ ͟ʖ╮ •́ )७',
    'ԅ[ * ༎ຶ _ ༎ຶ * ]┐',
    '໒( ⇀ ‸ ↼ )७',
    '┏༼ ◉ ╭╮ ◉༽┓',
    'c〳 ݓ ﹏ ݓ 〵੭',
    '༼    ಠ   ͟ʖ  ಠ   ༽',
    'ヽ༼ಢ_ಢ༽ﾉ',
    'o͡͡͡╮⁞ ˵ ᓀ ︿ ᓂ ˵ ⁞╭o͡͡͡',
    '། ˵ ︣ ෴ ︣ ˵ །',
    'ლ( `Д’ ლ)',
    '(ఠ్ఠ ˓̭ ఠ్ఠ)',
    'ᕙ╏✖۝✖╏⊃-(===>',
    '༼▃ Ĺ̯ ▃༽',
    '╭(ʘ̆~◞౪◟~ʘ̆)╮',
    'ᕕ( ཀ ʖ̯ ཀ)ᕗ',
    '║ ಡ ͜ ʖ ಡ ║',
    '٩ʕ◕౪◕ʔو',
    '╚═། ◑ ▃ ◑ །═╝',
    'ԅ། ຈ ◞౪◟ຈ །و',
    '(つ°ヮ°)つ  └⋃┘',
    '└༼ ಥ ᗜ ಥ ༽┘ ',
    '໒( ͡ᵔ ▾ ͡ᵔ )७ ',
    '୧( ಠ┏ل͜┓ಠ )୨ ',
    'ᕙ(◉෴◉)ᕗ ',
    '(╭ರ_⊙) ',
    '( ͡° ͜ʖ ͡°)=ε✄ ',
    '┌། ☯ _ʖ ☯ །┐ ',
    'ԅ། – ‸ – །ᕗ ',
    'ᕦ༼◣_◢༽つ ',
    '╰໒( ි ▾ ි )७╯ ',
    '(   ͡°╭╮ʖ   ͡°) ',
    '╰(ಥдಥ)ノ ',
    '(つ•̀ᴥ•́)つ*:･ﾟ✧ ',
    'ԅ༼ * ◕ ∧ ◕ * ༽ﾉ ',
    '┌། ≖ Ĺ̯ ≖ །┐ ',
    'ᕕ(◉Д◉ )ᕗ ',
    '¯\\_(౦▾౦ ✿)¯\\_ ',
    '໒( ∗ ⊘ ﹏ ⊘ ∗ )७ ',
    'ԅ༼ . º ʖ̯ º . ༽ง ',
    '━╤デ╦︻(▀̿̿Ĺ̯̿̿▀̿ ̿) ',
    '~~~~~~~[]=¤ԅ(ˊᗜˋ* )੭ ',
    'ლ༼ ▀̿ Ĺ̯ ▀̿ ლ༽ ',
    '੧༼ ◕ ∧ ◕ ༽┌∩┐ ',
    'o͡͡͡╮╏ ◕ ◡ ◕ ╏╭o͡͡͡ ',
    'ԅ▒ ˘ ▾ ˘ ▒┘ ',
    '༼つಠ益ಠ༽つ ─=≡ΣO)) ',
    'O–(’̀-’̀Q ) ',
    '( ︶︿︶)_╭∩╮ ',
    '(☞◣д◢)☞ ',
    'ಠ_ರೃ ',
    '₍₍ ◝(•̀ㅂ•́)◟ ⁾⁾ ',
    '(๑ ऀืົཽ₍₍ළ₎₎ ऀืົཽ)✧',
    '(◞≼◎≽◟◞౪◟◞≼◎≽◟)',
    '(◞≼●≽◟◞౪◟◞≼●≽◟)',
    '(◞≼☉≽◟◞౪◟◞≼☉≽◟)',
    '(◞≼థ≽◟◞౪◟◞≼థ≽◟)',
    '(΄◞ิ۝◟ิ‵)',
    'ཀ༼ༀ༽ཫ་✧',
    '(₍ˀ˟͈͈͈᷄ළ˟͈͈͈᷅ˁ₎)',
    '(ּơ̑ළּơ̑)',
    '━꒰ ⁎꒦ິཽ ۝꒦ິཽॢ꒱━',
    'ʅ͡͡͡͡͡͡͡͡͡͡͡(Ɵ۝Ө)ʃ͡͡͡͡͡͡͡͡͡͡',
    'Ⴤ༼༎ত:౧:ত༎༽Ⴤ',
    '(•චළච•)',
    '(( ༎ຶ‿༎ຶ ))',
    '(;´༎ຶ益༎ຶ`)♡',
    '( ༎ຶŎ༎ຶ )',
    '(;´༎ຶٹ༎ຶ`)',
    '⁽⁽(ཀ д ཀ)⁾⁾',
    '༼;´༎ຶ ۝ ༎ຶ༽',
    '☜(:༎ຶ;益;༎ຶ;)☞',
    '૮(༎໊ඏ༎໊)ა',
    '(‿!‿)',
    '(‿!‿) ԅ(´ڡ`ԅ)',
    '(‿!‿) ԅ(≖‿≖ԅ)',
    '(‿ˠ‿)',
    '＿〆(。。)',
    '_〆┤’-‘*├',
    '໒(⊙ᴗ⊙)७✎▤',
    '(‘•̀ ▽ •́ )✎',
    '(=°-°)✎',
    '(๑╹o╹)✎',
    'ʕo•ᴥ•ʔ✎',
    '(ᵒ͈̑ᴗ̂ᵒ͈̑ )',
    '(∞ ❛ั ⊝❛ั )',
    '⊹⋛⋋(◐⊝◑)⋌⋚⊹',
    '（ꉺ▿ꉺ）',
    '(•͈⌔•͈⑅)',
    '乁[ᓀ˵▾˵ᓂ]ㄏ',
    '⋋(◍’◊’◍)⋌',
    '♫ꉂ (๑¯ਊ¯)σ',
    'ʕ •́؈•̀ ₎',
    'ᶘ ᵒᴥᵒᶅ',
    'ʕノ•ᴥ•ʔノ ︵ ┻━┻',
    'ᵔᴥᵔ',
    'ᶘ ͡°ᴥ͡°ᶅ',
    'ᶘ ᵒ㉨ᵒᶅ',
    '٩ʕ•͡×•ʔ۶',
    'v.ʕʘ‿ʘʔ.v',
    'ʔ•̫͡•ʔ',
    'ʕ·͡ˑ·ཻʔ',
    'ʕథ౪థʔ',
    'ʕ•̠͡•ʔ',
    'ʕっ•ᴥ•ʔっ',
    '୧ʕ ⇀ ⌂ ↼ ʔ୨',
    'ʕ￫ᴥ￩　ʔ',
    'ʅʕ•ᴥ•ʔʃ',
    'ʕ； •`ᴥ•´ʔ',
    'ʕ╯• ⊱ •╰ʔ',
    'ʕ≧ᴥ≦ʔ',
    '୧ʕ•̀ᴥ•́ʔ୨',
    'ʕ　·ᴥʔ',
    'ʕ ཀ ⌂ ཀ ʔ',
    'ᕦʕ .  ᴥ  . ʔᕤ',
    'ᕦʕ ⊙ ◡ ⊙ ʔᕤ',
    'ʕ ಡ Ĺ̯ ಡ ʔ',
    'ʕ ” ￣ Ĺ̯ ￣ ” ʔ',
    'ʕ-ᴥ – ʔԅ(`ɛ`ԅ)',
    'ʕ ཀ ⌂ ཀ ʔ',
    'ʕﾉﾉﾉ_ㅎʔ',
    'ʕﾉﾉﾉ_ʖʘʔ',
    'ʕʘʟ_ʘʔ',
    'ʕ╹ヮ╹｡ʔ',
    'ʕ´• ᴥ •`ʔ',
    'ʕ◉ᴥ◉ʔ',
    'ʕ ࿃࿆ _ ࿃࿆ ʔ',
    'ʕ ᏫᎲᏫ ʔ',
    'ʕ ␥_␥ʔ',
    'ʕ ◔ᴥ◔ ʔ',
    'ʕ = •́ .̫ •̀ = ʔ',
    'ʕ ᓀ ᴥ ᓂ ʔ',
    'ʕ•̫͡•ʔʕ-̼͡-ʔ',
    'ʕ•̫͡ʕ•̫͡ʕ•̫͡ʕ•̫͡•ʔ•̫͡•ʔ•̫͡•ʔ•̫͡•ʔ',
    'ˁ˙͠˟˙ˀ',
    'ˁ˙˟˙ˀ',
    'ˁ˙͡˟˙ˀ',
    'ˁ῁̩ˀ',
    'ˁ῁͓ˀ',
    'ˁ῁̼ˀ',
    'ˁ῁̮ˀ',
    'ˁ῁̰ˀ',
    '(੭ ◕㉨◕)੭ =͟͟͞͞=͟͟͞͞三❆',
    '°◦=͟͟͞͞ʕ̡̢̡ु•̫͡•ʔ̡̢̡ु',
    '(͒ˊ(❢)ˋ)',
    'ᑦ(⁎ᐡᆺᐡ)ᐣ',
    'ʕ̡̢̡ʘ̅͟͜͡ʘ̲̅ʔ̢̡̢',
    'ʕ̡̢̡*✪௰✪ૢʔ̢̡̢',
    '⊂((ᵕ.ᵕ))⊃',
    '（⊂((・⊥・))⊃）',
    '(๑• .̫ •๑)',
    '((ᵒꈊᵒ᷅ ू‖))՞',
    '– =͟͟͞͞(●⁰ꈊ⁰● |||)',
    '☾ठ ੁठ☽',
    '└(=^‥^=)┐',
    'ヾ(=ﾟ･ﾟ=)ﾉ',
    '(≚ᄌ≚)ƶƵ',
    'ಠಿ ˑ̫ ಠಿ',
    'ʘ̥ꀾʘ̥',
    'ଲ( ⓛ ω ⓛ *)ଲ',
    '(⌯⊙⍛⊙)',
    '(ꀄꀾꀄ)',
    '(ㅇㅅㅇ❀)',
    'ଲ(⁃̗̀̂❍⃓ˑ̫❍⃓⁃̠́̂)ଲ',
    'ㄱ(ㅇㅅㅇ” )ㄴ',
    '₍ ̂ˑ̫̈̄ ̂₎',
    '(˵¯͒࿄¯͒˵)',
    '( ¤̴̶̷̤́ ‧̫̮ ¤̴̶̷̤̀ )',
    'ʘ̵ ˤ̵̫ ʘ̵',
    '(ꃋิꎴꃋิ)',
    '₍˄·͈༝·͈˄₎◞',
    '₍˄·͈༝·͈˄₎ฅ˒˒',
    '₍ᵔ·͈༝·͈ᵔ₎',
    '♡ॢ₍⸍⸌̣ʷ̣̫⸍̣⸌₎',
    'ฅ⁽͑ ˚̀ ˙̭ ˚́ ⁾̉ฅ',
    'ฅ ̳͒•ˑ̫• ̳͒ฅ',
    '(ฅ•.•ฅ)',
    'ฅ(⌯͒⚭̈́ ˑ̫ ⚭̈́⌯͒)ฅ',
    '(⌯͒▾ ˑ̫ ▾⌯͒)',
    '(❍ᴥ❍ʋ)',
    '(V●ᴥ●V)',
    '(U •́ .̫ •̀ U)',
    '(υ◉ω◉υ)',
    '૮(꒦ິ ˙̫̮ ꒦ິ)ა',
    '૮( ᵒ̌ૢཪᵒ̌ૢ )ა',
    '૮( ᵒ̌ૢᵒ̌ૢ )ა',
    '૮(¹ ˕̫ ¹)ა',
    '૮(•̀ꐧ•́)ა',
    '૮( ꒦ິ࿄꒦ີ)ა',
    '-ᄒᴥᄒ-',
    '◖⚆ᴥ⚆◗',
    'ᕙ༼◕ ᴥ ◕༽ᕗ',
    '[⑇◍ᴥ◍•⑇]',
    '(ノ ̿ ̿ᴥ ̿ ̿)ノ',
    '⊆ↂᴥↂ⊇',
    '(_/¯⊘_ᴥ_⊘)_/¯',
    '●ᴥ●',
    '┏(°ᴥ°)┓',
    '└(°ᴥ°)┘',
    'へ║ ◉ ᴥ ◉ ║〜',
    '໒( ̿ ᴥ ̿ )७',
    '໒( ◉ ᴥ ◉ )७',
    '٩། ಠ ᴥ ಠ །ᕗ',
    '୧╏ ~ ᴥ ~ ╏୨',
    '⋋〳 ￣ ᴥ ￣ 〵⋌',
    '╏ ◯ ᴥ ◯ ╏',
    '੧〳 ˵ ಠ ᴥ ಠ ˵ 〵ノ⌒.',
    '( ͡° ᴥ ͡°)',
    '໒(◉ᴥ◉)७',
    '⁞ ✿ ᵒ̌ ᴥ ᵒ̌ ✿ ⁞',
    'ᘳ´• ᴥ •`ᘰ',
    '(●⌇ຶ ཅ⌇ຶ●)',
    '(๑•ิཬ•ั๑)',
    'Ψ(●°̥̥̥̥̥̥̥̥ ཅ °̥̥̥̥̥̥̥̥●)Ψ',
    '⌒°(❛ᴗ❛)°⌒',
    '(۶ꈨຶꎁꈨຶ )۶ʸᵉᵃʰᵎ',
    '⁽(◍˃̵͈̑ᴗ˂̵͈̑)⁽',
    '( ƅ°ਉ°)ƅ',
    '⤴︎ ε=ε=(ง ˃̶͈̀ᗨ˂̶͈́)۶ ⤴︎',
    '୧༼✿ ͡◕ д ◕͡ ༽୨',
    '˭̡̞(◞⁎˃ᆺ˂)◞*✰',
    '٩(•౪•٩)三',
    'ヽ(´∀｀ヽ)',
    '⌒°(ᴖ◡ᴖ)°⌒',
    '╰| ° ◞౪◟ ° |╯',
    '୧☉□☉୨',
    '(⌬̀⌄⌬́)',
    '(ᗒᗨᗕ)',
    '(๑˃̶͈̀o˂̶͈́๑)',
    '(⊙ꇴ⊙)',
    '୧| ͡ᵔ ﹏ ͡ᵔ |୨',
    '٩(๑❛ᴗ❛๑)۶',
    '୧( ˵ ° ~ ° ˵ )୨',
    '٩(●ᴗ●)۶',
    '٩(º౪º๑)۶',
    '٩(◦`꒳´◦)۶',
    '୧། ☉ ౪ ☉ །୨',
    '٩(๑˃̌ۿ˂̌๑)۶',
    '٩(◦`꒳´◦)۶',
    '٩(θ‿θ)۶',
    '♡〜٩( ˃́▿˂̀ )۶〜♡',
    '٩(๑❛ᴗ❛๑)۶',
    '٩(๑꒦ິȏ꒦ິ๑)۶',
    '(ɲ˃ ˈ̫̮ ˂ɳ)',
    '(༶ૢ˃̵̑◡˂̵̑༶ૢ)',
    '(✺ ౪ ✺)',
    'o͡͡͡͡͡͡͡͡͡͡͡͡͡͡╮(^ ਊ ^)╭o͡͡͡͡͡͡͡͡͡͡͡͡͡͡',
    '(・_・ヾ',
    'く（＾_・）ゝ',
    '(^～^;)ゞ',
    '(-_-)ゞ゛',
    '(・∧‐)ゞ',
    'Σ(-᷅_-᷄๑)',
    'Σ(•’╻’• ۶)۶',
    'Σ(‘◉⌓◉’)',
    'Σ(๛д๛)',
    '(☉_☉)',
    '(゜-゜)',
    '(´･_･`)',
    '(●__●)',
    'ఠ_ఠ',
    '(☉_☉)',
    '(꒪ȏ꒪)ｴｯ?',
    'ɾ◉⊆◉ɹ',
    '(・・？)',
    '੨੨(´･･`)',
    '(❀｣╹□╹)｣*･',
    'ι(´Д`ι)',
    'ƪ(•̃͡•̃͡ ƪ',
    'ლ(ಠ_ಠლ)',
    '(⊙_☉)',
    '(⊙_◎)',
    '| ͠° ▃ °͠ |',
    '( -_・)?',
    '(๑•ૅૄ•๑)',
    '(｡☉︵ ಠ╬)',
    '(๑•̌.•̑๑)ˀ̣ˀ̣',
    '¿(❦﹏❦)?',
    '( ⧉ ⦣ ⧉ )',
    '( ؕؔʘ̥̥̥̥ ه ؔؕʘ̥̥̥̥ )?',
    '( ؔ⚈͟ ◡ ؔ⚈͟)…ﾝ？',
    '(｢๑•₃•)｢ ʷʱʸ?',
    'ɿ(｡･ɜ･)ɾⓌⓗⓨ？',
    'ɿ(｡･ɜ･)ɾⓌⓗⓐⓣ？',
    '(」ﾟﾛﾟ)｣NOOOooooo━',
    'Ⓦⓗⓐⓣ(☉൧ ಠ ꐦ)',
    '(ㆀ˘･з･˘)ωҺaｔ？',
    '¯\\_(⌣̯̀⌣́)_/¯',
    '¯\\_( ͠° ͟ʖ °͠ )_/¯',
    '¯\\_༼ ି ~ ି ༽_/¯',
    '¯\\_(⊙_ʖ⊙)_/¯',
    '¯\\_╏ ՞ ︿ ՞ ╏_/¯',
    '¯\\_ȌᴥȌ_/¯',
    't(ツ)_/¯',
    '┐(‘～`；)┌',
    '(「ఠωఠ)「',
    '┐(･ิL_･ิ)┌',
    '┐(ﾟ～ﾟ)┌',
    '┗[•͡˘◞౪◟•͡˘]┛',
    '┗┐(*´Д｀*)┌┛',
    '└|ﾟ益ﾟ└|',
    '【┛ﾟ,_ゝﾟ】┛',
    '└། ๑ _ ๑ །┘',
    '┗┃・ ■ ・┃┛',
    '╚ |░▤﹏▤░|╝',
    '└║ ՞ ౪ ՞ ║┘',
    '┗|´Д｀*||*´Д｀|┛',
    '┗| ຶӫ ຶ|┛',
    '┗(｀皿´)┛',
    '└(՞▃՞ └)',
    '└( * ᴼ ں ᴼ * )┘',
    'L(ﾟ皿ﾟﾒ)」',
    '└( ͡° ︿ °͡ )┘',
    '└( ՞ ~ ՞ )┘',
    '╮ (. ❛ ᴗ ❛.) ╭',
    '╮( ꒪౪꒪)╭',
    '╰( ͡’◟◯ ͡’)╯',
    '╰╏ ◉ 〜 ◉ ╏╯',
    '╰▐ ◑ ‸ ◑ ▐╯',
    '╰། ﹒ _ ﹒ །╯',
    '╰| ⊡ _ ⊡ |╯',
    'ヽ(。_°)ノ',
    'ヽ（・＿・；)ノ',
    '乁( ◔ ౪◔)ㄏ',
    '乁⁞ ◑ ͜ر ◑ ⁞ㄏ',
    '乁⁞ ි _ʖ ි ⁞ㄏ',
    '乁[ ୖ  ୖ ]ㄏ',
    '乁( ⁰͡ Ĺ̯ ⁰͡ ) ㄏ',
    '乁╏ ಠ ┏ل͜┓ ಠ ╏ㄏ',
    '乁░ ‾́  ‾́ ░ㄏ',
    '乁( . ര ʖ̯ ര . )ㄏ',
    '乁[ ◕ ᴥ ◕ ]ㄏ',
    '乁| ･  ･ |ㄏ',
    'ƪ(Ơ̴̴̴̴̴̴͡.̮Ơ̴̴͡)ʃ',
    'ʅ(｡◔‸◔｡)ʃ',
    'ʅ(´⊙◞⊱◟⊙`)ʃ',
    'ƪƪ(•̃͡ε•̃͡)(•̃͡ε•̃͡)∫ʃ',
    'ʅʕ•ᴥ•ʔʃ',
    'ʅ(*´◡`)ʃ',
    'ʅ(⑅*´◡`)ʃ',
    'ƪ(•̃͡ε•̃͡)∫ʃ',
    'p(´⌒｀｡q)',
    '¶(⁄⁒∖)⁋',
    '༽΄◞ิ౪◟ิ‵༼',
    'ɿ (•᷄દ•᷅)',
    '⋋〳 ᵕ _ʖ ᵕ 〵⋌',
    'ᕕ| ͡■ ﹏ ■͡ |و',
    '( ͡ _ ͡°)ﾉ⚲',
    '⋋| ◉ ͟ʖ ◉ |⋌',
    'ᘛᐡᐤᐡᘚ',
    '( ᵌ ⍨ ᵌ )',
    '╭〳 . ˘ ۝ ˘ . 〵╮',
    '( ´◔ ۝ゝ◔`)',
    '┌[ ʘ̆ ۝ ʘ̆ ]┐',
    '╰(⊹◕۝◕ )╯',
    '╭། ” • ۝ • ” །╮',
    '╰། ❛ ڡ ❛ །╯',
    'ヽ(๑╹ڡ╹๑)ﾉ',
    'ლ(´ڡ`ლ)',
    'ᕙ། – ڡ – །ᕗ',
    '(っ˘ڡ˘ς)',
    '(๑╹ڡ╹)',
    '(⁎⁍̴ڡ⁍̴⁎)',
    '| ⊘ ڡ ⊘ |',
    'ʕ ି ڡ ି ʔ',
    ' ԅ| . ͡° ڡ ͡° . |ᕤ',
    'ʅ ﴾סּ ؂ סּ ʅ ﴿',
    'ԅ|.͡° ڡ ͡°.|ᕤ',
    '(✽´ཫ`✽)',
    '(꒪ټ꒪☚)',
    '_:(´ཀ`」 ∠):_',
    '(๑ ิټ ิ)',
    '(　 ิ౪ ิ )っ─∈',
    '( ⚆ _ ⚆ )',
    '(╬☉д⊙)',
    '工ｴｴｪｪ(;╹⌓╹)ｪｪｴｴ工',
    '– =͟͟͞͞ =͟͟͞͞ ﾍ( ´Д`)ﾉ',
    'ਭ३౽=͟͟͞͞(((ഽʻ⁸ʻ)ഽ',
    'ε=ε=ε=┏(ﾟロﾟ;)┛',
    'ꉂ (๑¯ਊ¯)σ л̵ʱªʱªʱª',
    '(๑ॢ˃̶͈̀ ꇴ ˂̶͈́๑ॢ) л̵ʱªʱªʱª',
    'ꉂ (ᵔ̴̶̤᷄ꇴ ॣᵔ̴̶̤᷅⌯))л̵ʱªʱª⁎*.＊',
    '〈(•ˇ‿ˇ•)-→',
    '(☞ﾟ∀ﾟ)☞',
    '┗(•ˇ_ˇ•)―→',
    '☜(⌒▽⌒)☞',
    '☞￣ᴥ￣☞',
    '( ━☞´◔‿ゝ◔`)━☞',
    '(☞三☞ ఠ ਉ ఠ))☞三☞',
    '＿|￣| ⍤⃝',
    '(。≖ˇｪˇ≖｡)b',
    '•̀.̫•́✧',
    '(˵¯͒¯͒˵)',
    '(๑ˇ ῁̫ ˇ)˒˒',
    '〳 ᓀ ﹏ ᓂ 〵',
    '( ๑‾̀◡‾́)σ»',
    '(♡´◠｀♡)',
    '੧| ⊗ ▾ ⊗ |୨',
    '(⑅∫°ਊ°)∫',
    'へ[ ᴼ ▃ ᴼ ]_/¯',
    '(＊☉౪ ⊙｡)',
    '◖|◔◡◉|◗',
    '(♠_♦)',
    '(⊙﹏⊙✿)',
    '(＊☉౪ ⊙｡)',
    'v(〄_〄)v',
    '( ┐΄✹ਊ✹)┐',
    '⌈ ⚫▂▂⚫ ⌉',
    '(◞‸◟ㆀ)',
    '(υᇂνᇂ)',
    '( ˘ ³˘)♥',
    '(๛ ˘ ³˘)۶',
    '(๑♡3♡๑)',
    '(●❛3❛●)',
    '(๑•з•)))⋆*♡*⋆ฺ=͟͟͞͞=͟͟͞͞',
    '∵ゞ(´ε｀●) ﾌﾞ!!',
    '(ʃƪ˘ﻬ˘)',
    '（￣ε￣ʃƪ）',
    '(´ε｀ ʃƪ)♡',
    'ヾ(￣〓￣ヾ)',
    '(✿ꈍ。 ꈍ✿)',
    'ლ(´◉❥◉｀ლ)',
    'ლ(|||⌒εー|||)ლ',
    'ლ(´ ❥ `ლ)',
    '(~￣³￣)~',
    '(づ￣ ³￣)づ',
    '(Ɔ˘з˘)(ꈍヮꈍ)˘ε˘ C)',
    '༼(*꒪ั❥꒪ั*༽༽',
    '⁽⁽(*꒪ั❥꒪ั*)⁾⁾',
    'Σ (੭ु ຶਊ ຶ)੭ु⁾⁾',
    '⌌⌈╹므╹⌉⌏',
    '↙(ↂ⼼_ↂ)↗',
    '┌(★o☆)┘',
    '♪┌|∵|┘♪',
    '♪└|∵|┐♪',
    '⌎⌈╹우╹⌉⌍',
    '((┌|o^▽^o|┘))♪',
    'ƪ(‾.‾“)┐',
    '(._.) ƪ(‘-‘ ƪ)(ʃ ‘-‘)ʃ (/._.)/',
    '♫͙◟̊₍ꃓ₎◞◟₍ꃔ₎◞̊♫͙',
    'ʅ(◔౪◔ʅ)三(ʃ◔౪◔)ʃ',
    '♪～(◔◡◔ิ)人(╹◡╹๑)～♪',
    '┗( ^o^)┛≡┏( ^o^)┓≡┗( ^o^)┛',
    '╭(°ㅂ°)╮╰(°ㅂ°)╯╭(°ㅂ°)╮╰(°ㅂ°)╯',
    '♪└|ﾟ皿ﾟ |┐♪└| ﾟ皿ﾟ |┘♪┌| ﾟ皿ﾟ|┘♪',
    '“:♡.•♬✧⁽⁽ଘ( ˊᵕˋ )ଓ⁾⁾*+:•*∴',
    '१|˚–˚|५',
    '~(˘▾˘)~',
    '⁽⁽◝( •௰• )◜⁾⁾',
    '₍₍◞( •௰• )◟₎₎',
    '~(‾▿‾)~',
    '~(˘▾˘)~',
    '〜(꒪꒳꒪)〜',
    '⊂（♡⌂♡）⊃',
    '(づ｡◕‿‿◕｡)づ',
    '(づ￣ ³￣)づ',
    '(っ˘̩╭╮˘̩)っ',
    '(⊃ • ʖ̫ • )⊃',
    '(つ ͡° ͜ʖ ͡°)つ',
    'ʕっ•ᴥ•ʔっ',
    '───==≡≡ΣΣ(っ´▽｀)っ',
    '─=≡Σʕっ•ᴥ•ʔっ',
    '(~˘▾˘)~ ~(˘▾˘~)',
    '٩(๑•◡-๑)۶ⒽⓤⒼ❤',
    '٩꒰ ˘ ³˘꒱۶ⒽⓤⒼ♥♡̷♡̷',
    '(´〜｀*) zzz',
    '( ु⁎ᴗ_ᴗ⁎)ु.｡oO',
    '(﹡ꑓ ︿ ꑓ`﹡)',
    '┤*￣Ｏ￣*├ ┤*－.－*├ ┤＿ ＿├',
    '(¦ꃎ[▓▓]',
    '(¦ꒉ[▓▓]',
    'ᕙ(⇀‸↼‶)ᕗ',
  ]
}
