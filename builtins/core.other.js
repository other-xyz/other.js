const {fetch, Feature} = require('other')

const feature = new Feature({
  name: 'Core',
  version: '0.8.1',
  dependencies: {
    otherjs: '^3.2.x',
  },
})

// Message actions
if (feature.provideActions) {  // TODO: Remove this guard when clients support 3.10+.
  feature.provideActions({
    to: 'messages',
    on({messages}) {
      const actions = []
      const features = getFeatures(messages)
      if (features.length) {
        const firstFeature = feature.userAgent.featureMetadata(features[0].url) // TODO: Handle multiple.
        // TODO: Check if it's already installed and display uninstall options.
        const isChannelOwner = feature.chatternet.channel({id: feature.userAgent.channel.id}).isOwner(feature.userAgent.identity.id)
        if (isChannelOwner) {
          actions.push({
            label: `install for this channel`,
            on() {
              const installArgs = firstFeature.isCloudEmbeddable ? {
                entityId: feature.userAgent.channel.id,
                entityType: 'channel',
                featureIdentity: firstFeature.identity,
                featureUrl: firstFeature.url,
              } : {
                entityId: feature.userAgent.channel.id,
                entityType: 'channel',
                featureUrl: firstFeature.url,
              }
              feature.chatternet.installFeature(installArgs)
            },
          })
        }
        if (firstFeature.isUserAgentEmbeddable) {
          const activeIdentity = feature.chatternet.entities[feature.userAgent.identity.id]
          const isInstalled = (activeIdentity.featureUrls || []).includes(firstFeature.url)
          if (isInstalled) {
            actions.push({
              label: `uninstall for @${activeIdentity.name}`,
              on() {
                feature.chatternet.uninstallFeature({
                  entityId: feature.userAgent.identity.id,
                  entityType: 'identity',
                  featureUrl: firstFeature.url,
                })
              },
            })
          } else {
            actions.push({
              label: `install for @${activeIdentity.name}`,
              on() {
                feature.chatternet.installFeature({
                  entityId: feature.userAgent.identity.id,
                  entityType: 'identity',
                  featureUrl: firstFeature.url,
                })
              },
            })
          }
        }
        actions.push({
          label: 'view source',
          on() {
            feature.userAgent.navigate({to: firstFeature.url})
          },
        })
      }
      if (canDeleteMessages(messages)) {
        actions.push({
          label: 'delete',
          on({messages}) {
            messages.forEach((m) => feature.chatternet.channel({id: m.channelId}).delete(m))
          },
        })
      }
      return actions
    },
  })
}

function getFeatures(messages) {
  return messages.reduce((result, message) => {
    if (!message.attachments) return result
    return result.concat(Object.values(message.attachments).filter((attachment) => attachment.type === 'feature'))
  }, [])
}

function canDeleteMessages(messages) {
  const {chatternet, userAgent} = feature
  const activeIdentityId = userAgent.identity.id
  if (!messages.length) return false
  return messages.every((m) => {
    return m.identityId === activeIdentityId ||
           chatternet.channel({id: m.channelId}).isOwner(activeIdentityId)
  })
}

// Format commands
feature.listen({
  to: {commands: ['caption', 'code', 'divider', 'h1', 'h2', 'h3', 'p', 'quote', 'small', 'system']},
  on({command, args}) {
    return {stagedMessage: {format: command}}
  },
})

// Mentions
// TODO:
// - Sort by relevance (e.g. membership in current channel, freshness)
// - Add whisper action to identities.
// - Add completions create channels.
feature.listen({
  to: 'mention',
  on({mention}) {
    const {entities} = feature.chatternet
    const requireOnlyIdentities = mention[0] === '@'
    const queryParts = mention.substring(1).split('/')
    const getByPrefix = (query) => {
      const lowerQuery = query.toLowerCase()
      return Object.keys(entities)
          .filter((id) => {
            const entity = entities[id]
            if (!lowerQuery && !requireOnlyIdentities && entity.isIdentity) return false
            return (!requireOnlyIdentities ||
                    entity.isIdentity ||
                    entity.parentId && (entities[entity.parentId] || {}).isIdentity) &&
                   entity.name.toLowerCase().startsWith(lowerQuery)
          })
          .map((id) => ({
            id,
            name: entities[id].name,
            isIdentity: Boolean(entities[id].isIdentity),
            parentId: entities[id].parentId,
          }))
    }

    if (queryParts.length < 1 || queryParts.length > 2) return null

    const parentQuery = queryParts[0]
    const parentResults = getByPrefix(parentQuery)
    if (queryParts.length === 1) return parentResults

    const subQuery = queryParts[1]
    const subResults = getByPrefix(subQuery)
    return subResults.reduce((total, current) => {
      const parent = parentResults.find((p) => p.id === current.parentId)
      if (parent) {
        total.push({
          id: current.id,
          name: `${parent.name}/${current.name}`,
          isIdentity: parent.isIdentity,
        })
      }
      return total
    }, [])
  },
})

// Giphy search
feature.listen({
  to: {words: ['gif']},
  on({word, rest}) {
    const host = 'https://api.giphy.com'
    const apiKeyParam = 'api_key=dc6zaTOxFJmzC' // TODO: Provide a way for features to access keys from the environment
    const limitParam = 'limit=7'
    const query = encodeURIComponent(rest.replace(word, '').trim())
    const url = query ? `${host}/v1/gifs/search?${apiKeyParam}&q=${query}&${limitParam}` : `${host}/v1/gifs/trending?${apiKeyParam}&${limitParam}`
    return fetch(url).then((response) => response.json()).then((json) => {
      if (!json.data) return null
      const chatCompletions = json.data.map((d) => {
        const {original} = d.images
        return {media: {type: 'image', url: original.url, size: {height: parseInt(original.height, 10), width: parseInt(original.width, 10)}}}
      })
      return {chatCompletions}
    })
  },
})

// Emoji tokens
const emoji = getEmoji()
feature.listen({
  to: {tokens: Object.keys(emoji)},
  on({token}) {
    return {text: emoji[token]}
  },
})

function getEmoji() {
  return {
    '100': '💯',
    '1234': '🔢',
    'smile': '😄',
    'smiley': '😃',
    'grinning': '😀',
    'blush': '😊',
    'relaxed': '☺️',
    'wink': '😉',
    'heart_eyes': '😍',
    'kissing_heart': '😘',
    'kissing_closed_eyes': '😚',
    'kissing': '😗',
    'kissing_smiling_eyes': '😙',
    'stuck_out_tongue_winking_eye': '😜',
    'stuck_out_tongue_closed_eyes': '😝',
    'stuck_out_tongue': '😛',
    'flushed': '😳',
    'grin': '😁',
    'pensive': '😔',
    'relieved': '😌',
    'unamused': '😒',
    'disappointed': '😞',
    'persevere': '😣',
    'cry': '😢',
    'joy': '😂',
    'sob': '😭',
    'sleepy': '😪',
    'disappointed_relieved': '😥',
    'cold_sweat': '😰',
    'sweat_smile': '😅',
    'sweat': '😓',
    'weary': '😩',
    'tired_face': '😫',
    'fearful': '😨',
    'scream': '😱',
    'angry': '😠',
    'rage': '😡',
    'triumph': '😤',
    'confounded': '😖',
    'laughing': '😆',
    'satisfied': '😆',
    'yum': '😋',
    'mask': '😷',
    'sunglasses': '😎',
    'sleeping': '😴',
    'dizzy_face': '😵',
    'astonished': '😲',
    'worried': '😟',
    'frowning': '😦',
    'anguished': '😧',
    'smiling_imp': '😈',
    'imp': '👿',
    'open_mouth': '😮',
    'grimacing': '😬',
    'neutral_face': '😐',
    'confused': '😕',
    'hushed': '😯',
    'no_mouth': '😶',
    'innocent': '😇',
    'smirk': '😏',
    'expressionless': '😑',
    'man_with_gua_pi_mao': '👲',
    'man_with_turban': '👳',
    'cop': '👮',
    'construction_worker': '👷',
    'guardsman': '💂',
    'baby': '👶',
    'boy': '👦',
    'girl': '👧',
    'man': '👨',
    'woman': '👩',
    'older_man': '👴',
    'older_woman': '👵',
    'person_with_blond_hair': '👱',
    'angel': '👼',
    'princess': '👸',
    'smiley_cat': '😺',
    'smile_cat': '😸',
    'heart_eyes_cat': '😻',
    'kissing_cat': '😽',
    'smirk_cat': '😼',
    'scream_cat': '🙀',
    'crying_cat_face': '😿',
    'joy_cat': '😹',
    'pouting_cat': '😾',
    'japanese_ogre': '👹',
    'japanese_goblin': '👺',
    'see_no_evil': '🙈',
    'hear_no_evil': '🙉',
    'speak_no_evil': '🙊',
    'skull': '💀',
    'alien': '👽',
    'hankey': '💩',
    'poop': '💩',
    'shit': '💩',
    'fire': '🔥',
    'sparkles': '✨',
    'star2': '🌟',
    'dizzy': '💫',
    'boom': '💥',
    'collision': '💥',
    'anger': '💢',
    'sweat_drops': '💦',
    'droplet': '💧',
    'zzz': '💤',
    'dash': '💨',
    'ear': '👂',
    'eyes': '👀',
    'nose': '👃',
    'tongue': '👅',
    'lips': '👄',
    '+1': '👍',
    'thumbsup': '👍',
    '-1': '👎',
    'thumbsdown': '👎',
    'ok_hand': '👌',
    'facepunch': '👊',
    'punch': '👊',
    'fist': '✊',
    'v': '✌️',
    'wave': '👋',
    'hand': '✋',
    'raised_hand': '✋',
    'open_hands': '👐',
    'point_up_2': '👆',
    'point_down': '👇',
    'point_right': '👉',
    'point_left': '👈',
    'raised_hands': '🙌',
    'pray': '🙏',
    'point_up': '☝️',
    'clap': '👏',
    'muscle': '💪',
    'walking': '🚶',
    'runner': '🏃',
    'running': '🏃',
    'dancer': '💃',
    'couple': '👫',
    'family': '👪',
    'two_men_holding_hands': '👬',
    'two_women_holding_hands': '👭',
    'couplekiss': '💏',
    'couple_with_heart': '💑',
    'dancers': '👯',
    'ok_woman': '🙆',
    'no_good': '🙅',
    'information_desk_person': '💁',
    'raising_hand': '🙋',
    'massage': '💆',
    'haircut': '💇',
    'nail_care': '💅',
    'bride_with_veil': '👰',
    'person_with_pouting_face': '🙎',
    'person_frowning': '🙍',
    'bow': '🙇',
    'tophat': '🎩',
    'crown': '👑',
    'womans_hat': '👒',
    'athletic_shoe': '👟',
    'mans_shoe': '👞',
    'shoe': '👞',
    'sandal': '👡',
    'high_heel': '👠',
    'boot': '👢',
    'shirt': '👕',
    'tshirt': '👕',
    'necktie': '👔',
    'womans_clothes': '👚',
    'dress': '👗',
    'running_shirt_with_sash': '🎽',
    'jeans': '👖',
    'kimono': '👘',
    'bikini': '👙',
    'briefcase': '💼',
    'handbag': '👜',
    'pouch': '👝',
    'purse': '👛',
    'eyeglasses': '👓',
    'ribbon': '🎀',
    'closed_umbrella': '🌂',
    'lipstick': '💄',
    'yellow_heart': '💛',
    'blue_heart': '💙',
    'purple_heart': '💜',
    'green_heart': '💚',
    'heart': '❤️',
    'broken_heart': '💔',
    'heartpulse': '💗',
    'heartbeat': '💓',
    'two_hearts': '💕',
    'sparkling_heart': '💖',
    'revolving_hearts': '💞',
    'cupid': '💘',
    'love_letter': '💌',
    'kiss': '💋',
    'ring': '💍',
    'gem': '💎',
    'bust_in_silhouette': '👤',
    'busts_in_silhouette': '👥',
    'speech_balloon': '💬',
    'footprints': '👣',
    'thought_balloon': '💭',
    'dog': '🐶',
    'wolf': '🐺',
    'cat': '🐱',
    'mouse': '🐭',
    'hamster': '🐹',
    'rabbit': '🐰',
    'frog': '🐸',
    'tiger': '🐯',
    'koala': '🐨',
    'bear': '🐻',
    'pig': '🐷',
    'pig_nose': '🐽',
    'cow': '🐮',
    'boar': '🐗',
    'monkey_face': '🐵',
    'monkey': '🐒',
    'horse': '🐴',
    'sheep': '🐑',
    'elephant': '🐘',
    'panda_face': '🐼',
    'penguin': '🐧',
    'bird': '🐦',
    'baby_chick': '🐤',
    'hatched_chick': '🐥',
    'hatching_chick': '🐣',
    'chicken': '🐔',
    'snake': '🐍',
    'turtle': '🐢',
    'bug': '🐛',
    'bee': '🐝',
    'honeybee': '🐝',
    'ant': '🐜',
    'beetle': '🐞',
    'snail': '🐌',
    'octopus': '🐙',
    'shell': '🐚',
    'tropical_fish': '🐠',
    'fish': '🐟',
    'dolphin': '🐬',
    'flipper': '🐬',
    'whale': '🐳',
    'whale2': '🐋',
    'cow2': '🐄',
    'ram': '🐏',
    'rat': '🐀',
    'water_buffalo': '🐃',
    'tiger2': '🐅',
    'rabbit2': '🐇',
    'dragon': '🐉',
    'racehorse': '🐎',
    'goat': '🐐',
    'rooster': '🐓',
    'dog2': '🐕',
    'pig2': '🐖',
    'mouse2': '🐁',
    'ox': '🐂',
    'dragon_face': '🐲',
    'blowfish': '🐡',
    'crocodile': '🐊',
    'camel': '🐫',
    'dromedary_camel': '🐪',
    'leopard': '🐆',
    'cat2': '🐈',
    'poodle': '🐩',
    'feet': '🐾',
    'paw_prints': '🐾',
    'bouquet': '💐',
    'cherry_blossom': '🌸',
    'tulip': '🌷',
    'four_leaf_clover': '🍀',
    'rose': '🌹',
    'sunflower': '🌻',
    'hibiscus': '🌺',
    'maple_leaf': '🍁',
    'leaves': '🍃',
    'fallen_leaf': '🍂',
    'herb': '🌿',
    'ear_of_rice': '🌾',
    'mushroom': '🍄',
    'cactus': '🌵',
    'palm_tree': '🌴',
    'evergreen_tree': '🌲',
    'deciduous_tree': '🌳',
    'chestnut': '🌰',
    'seedling': '🌱',
    'blossom': '🌼',
    'globe_with_meridians': '🌐',
    'sun_with_face': '🌞',
    'full_moon_with_face': '🌝',
    'new_moon_with_face': '🌚',
    'new_moon': '🌑',
    'waxing_crescent_moon': '🌒',
    'first_quarter_moon': '🌓',
    'moon': '🌔',
    'waxing_gibbous_moon': '🌔',
    'full_moon': '🌕',
    'waning_gibbous_moon': '🌖',
    'last_quarter_moon': '🌗',
    'waning_crescent_moon': '🌘',
    'last_quarter_moon_with_face': '🌜',
    'first_quarter_moon_with_face': '🌛',
    'crescent_moon': '🌙',
    'earth_africa': '🌍',
    'earth_americas': '🌎',
    'earth_asia': '🌏',
    'volcano': '🌋',
    'milky_way': '🌌',
    'stars': '🌠',
    'star': '⭐',
    'sunny': '☀️',
    'partly_sunny': '⛅',
    'cloud': '☁️',
    'zap': '⚡',
    'umbrella': '☔',
    'snowflake': '❄️',
    'snowman': '⛄',
    'cyclone': '🌀',
    'foggy': '🌁',
    'rainbow': '🌈',
    'ocean': '🌊',
    'bamboo': '🎍',
    'gift_heart': '💝',
    'dolls': '🎎',
    'school_satchel': '🎒',
    'mortar_board': '🎓',
    'flags': '🎏',
    'fireworks': '🎆',
    'sparkler': '🎇',
    'wind_chime': '🎐',
    'rice_scene': '🎑',
    'jack_o_lantern': '🎃',
    'ghost': '👻',
    'santa': '🎅',
    'christmas_tree': '🎄',
    'gift': '🎁',
    'tanabata_tree': '🎋',
    'tada': '🎉',
    'confetti_ball': '🎊',
    'balloon': '🎈',
    'crossed_flags': '🎌',
    'crystal_ball': '🔮',
    'movie_camera': '🎥',
    'camera': '📷',
    'video_camera': '📹',
    'vhs': '📼',
    'cd': '💿',
    'dvd': '📀',
    'minidisc': '💽',
    'floppy_disk': '💾',
    'computer': '💻',
    'iphone': '📱',
    'phone': '☎️',
    'telephone': '☎️',
    'telephone_receiver': '📞',
    'pager': '📟',
    'fax': '📠',
    'satellite': '📡',
    'tv': '📺',
    'radio': '📻',
    'loud_sound': '🔊',
    'sound': '🔉',
    'speaker': '🔈',
    'mute': '🔇',
    'bell': '🔔',
    'no_bell': '🔕',
    'loudspeaker': '📢',
    'mega': '📣',
    'hourglass_flowing_sand': '⏳',
    'hourglass': '⌛',
    'alarm_clock': '⏰',
    'watch': '⌚',
    'unlock': '🔓',
    'lock': '🔒',
    'lock_with_ink_pen': '🔏',
    'closed_lock_with_key': '🔐',
    'key': '🔑',
    'mag_right': '🔎',
    'bulb': '💡',
    'flashlight': '🔦',
    'high_brightness': '🔆',
    'low_brightness': '🔅',
    'electric_plug': '🔌',
    'battery': '🔋',
    'mag': '🔍',
    'bathtub': '🛁',
    'bath': '🛀',
    'shower': '🚿',
    'toilet': '🚽',
    'wrench': '🔧',
    'nut_and_bolt': '🔩',
    'hammer': '🔨',
    'door': '🚪',
    'smoking': '🚬',
    'bomb': '💣',
    'gun': '🔫',
    'hocho': '🔪',
    'knife': '🔪',
    'pill': '💊',
    'syringe': '💉',
    'moneybag': '💰',
    'yen': '💴',
    'dollar': '💵',
    'pound': '💷',
    'euro': '💶',
    'credit_card': '💳',
    'money_with_wings': '💸',
    'calling': '📲',
    'e-mail': '📧',
    'inbox_tray': '📥',
    'outbox_tray': '📤',
    'email': '✉️',
    'envelope': '✉️',
    'envelope_with_arrow': '📩',
    'incoming_envelope': '📨',
    'postal_horn': '📯',
    'mailbox': '📫',
    'mailbox_closed': '📪',
    'mailbox_with_mail': '📬',
    'mailbox_with_no_mail': '📭',
    'postbox': '📮',
    'package': '📦',
    'memo': '📝',
    'pencil': '📝',
    'page_facing_up': '📄',
    'page_with_curl': '📃',
    'bookmark_tabs': '📑',
    'bar_chart': '📊',
    'chart_with_upwards_trend': '📈',
    'chart_with_downwards_trend': '📉',
    'scroll': '📜',
    'clipboard': '📋',
    'date': '📅',
    'calendar': '📆',
    'card_index': '📇',
    'file_folder': '📁',
    'open_file_folder': '📂',
    'scissors': '✂️',
    'pushpin': '📌',
    'paperclip': '📎',
    'black_nib': '✒️',
    'pencil2': '✏️',
    'straight_ruler': '📏',
    'triangular_ruler': '📐',
    'closed_book': '📕',
    'green_book': '📗',
    'blue_book': '📘',
    'orange_book': '📙',
    'notebook': '📓',
    'notebook_with_decorative_cover': '📔',
    'ledger': '📒',
    'books': '📚',
    'book': '📖',
    'open_book': '📖',
    'bookmark': '🔖',
    'name_badge': '📛',
    'microscope': '🔬',
    'telescope': '🔭',
    'newspaper': '📰',
    'art': '🎨',
    'clapper': '🎬',
    'microphone': '🎤',
    'headphones': '🎧',
    'musical_score': '🎼',
    'musical_note': '🎵',
    'notes': '🎶',
    'musical_keyboard': '🎹',
    'violin': '🎻',
    'trumpet': '🎺',
    'saxophone': '🎷',
    'guitar': '🎸',
    'space_invader': '👾',
    'video_game': '🎮',
    'black_joker': '🃏',
    'flower_playing_cards': '🎴',
    'mahjong': '🀄',
    'game_die': '🎲',
    'dart': '🎯',
    'football': '🏈',
    'basketball': '🏀',
    'soccer': '⚽',
    'baseball': '⚾️',
    'tennis': '🎾',
    '8ball': '🎱',
    'rugby_football': '🏉',
    'bowling': '🎳',
    'golf': '⛳',
    'mountain_bicyclist': '🚵',
    'bicyclist': '🚴',
    'checkered_flag': '🏁',
    'horse_racing': '🏇',
    'trophy': '🏆',
    'ski': '🎿',
    'snowboarder': '🏂',
    'swimmer': '🏊',
    'surfer': '🏄',
    'fishing_pole_and_fish': '🎣',
    'coffee': '☕',
    'tea': '🍵',
    'sake': '🍶',
    'baby_bottle': '🍼',
    'beer': '🍺',
    'beers': '🍻',
    'cocktail': '🍸',
    'tropical_drink': '🍹',
    'wine_glass': '🍷',
    'fork_and_knife': '🍴',
    'pizza': '🍕',
    'hamburger': '🍔',
    'fries': '🍟',
    'poultry_leg': '🍗',
    'meat_on_bone': '🍖',
    'spaghetti': '🍝',
    'curry': '🍛',
    'fried_shrimp': '🍤',
    'bento': '🍱',
    'sushi': '🍣',
    'fish_cake': '🍥',
    'rice_ball': '🍙',
    'rice_cracker': '🍘',
    'rice': '🍚',
    'ramen': '🍜',
    'stew': '🍲',
    'oden': '🍢',
    'dango': '🍡',
    'egg': '🍳',
    'bread': '🍞',
    'doughnut': '🍩',
    'custard': '🍮',
    'icecream': '🍦',
    'ice_cream': '🍨',
    'shaved_ice': '🍧',
    'birthday': '🎂',
    'cake': '🍰',
    'cookie': '🍪',
    'chocolate_bar': '🍫',
    'candy': '🍬',
    'lollipop': '🍭',
    'honey_pot': '🍯',
    'apple': '🍎',
    'green_apple': '🍏',
    'tangerine': '🍊',
    'lemon': '🍋',
    'cherries': '🍒',
    'grapes': '🍇',
    'watermelon': '🍉',
    'strawberry': '🍓',
    'peach': '🍑',
    'melon': '🍈',
    'banana': '🍌',
    'pear': '🍐',
    'pineapple': '🍍',
    'sweet_potato': '🍠',
    'eggplant': '🍆',
    'tomato': '🍅',
    'corn': '🌽',
    'house': '🏠',
    'house_with_garden': '🏡',
    'school': '🏫',
    'office': '🏢',
    'post_office': '🏣',
    'hospital': '🏥',
    'bank': '🏦',
    'convenience_store': '🏪',
    'love_hotel': '🏩',
    'hotel': '🏨',
    'wedding': '💒',
    'church': '⛪',
    'department_store': '🏬',
    'european_post_office': '🏤',
    'city_sunrise': '🌇',
    'city_sunset': '🌆',
    'japanese_castle': '🏯',
    'european_castle': '🏰',
    'tent': '⛺',
    'factory': '🏭',
    'tokyo_tower': '🗼',
    'japan': '🗾',
    'mount_fuji': '🗻',
    'sunrise_over_mountains': '🌄',
    'sunrise': '🌅',
    'night_with_stars': '🌃',
    'statue_of_liberty': '🗽',
    'bridge_at_night': '🌉',
    'carousel_horse': '🎠',
    'ferris_wheel': '🎡',
    'fountain': '⛲',
    'roller_coaster': '🎢',
    'ship': '🚢',
    'boat': '⛵',
    'sailboat': '⛵',
    'speedboat': '🚤',
    'rowboat': '🚣',
    'anchor': '⚓',
    'rocket': '🚀',
    'airplane': '✈️',
    'seat': '💺',
    'helicopter': '🚁',
    'steam_locomotive': '🚂',
    'tram': '🚊',
    'station': '🚉',
    'mountain_railway': '🚞',
    'train2': '🚆',
    'bullettrain_side': '🚄',
    'bullettrain_front': '🚅',
    'light_rail': '🚈',
    'metro': '🚇',
    'monorail': '🚝',
    'train': '🚋',
    'railway_car': '🚃',
    'trolleybus': '🚎',
    'bus': '🚌',
    'oncoming_bus': '🚍',
    'blue_car': '🚙',
    'oncoming_automobile': '🚘',
    'car': '🚗',
    'red_car': '🚗',
    'taxi': '🚕',
    'oncoming_taxi': '🚖',
    'articulated_lorry': '🚛',
    'truck': '🚚',
    'rotating_light': '🚨',
    'police_car': '🚓',
    'oncoming_police_car': '🚔',
    'fire_engine': '🚒',
    'ambulance': '🚑',
    'minibus': '🚐',
    'bike': '🚲',
    'aerial_tramway': '🚡',
    'suspension_railway': '🚟',
    'mountain_cableway': '🚠',
    'tractor': '🚜',
    'barber': '💈',
    'busstop': '🚏',
    'ticket': '🎫',
    'vertical_traffic_light': '🚦',
    'traffic_light': '🚥',
    'warning': '⚠️',
    'construction': '🚧',
    'beginner': '🔰',
    'fuelpump': '⛽',
    'izakaya_lantern': '🏮',
    'lantern': '🏮',
    'slot_machine': '🎰',
    'hotsprings': '♨️',
    'moyai': '🗿',
    'circus_tent': '🎪',
    'performing_arts': '🎭',
    'round_pushpin': '📍',
    'triangular_flag_on_post': '🚩',
    'jp': '🇯🇵',
    'kr': '🇰🇷',
    'de': '🇩🇪',
    'cn': '🇨🇳',
    'us': '🇺🇸',
    'fr': '🇫🇷',
    'es': '🇪🇸',
    'it': '🇮🇹',
    'ru': '🇷🇺',
    'gb': '🇬🇧',
    'uk': '🇬🇧',
    'one': '1️⃣',
    'two': '2️⃣',
    'three': '3️⃣',
    'four': '4️⃣',
    'five': '5️⃣',
    'six': '6️⃣',
    'seven': '7️⃣',
    'eight': '8️⃣',
    'nine': '9️⃣',
    'zero': '0️⃣',
    'keycap_ten': '🔟',
    'hash': '#️⃣',
    'symbols': '🔣',
    'arrow_up': '⬆️',
    'arrow_down': '⬇️',
    'arrow_left': '⬅️',
    'arrow_right': '➡️',
    'capital_abcd': '🔠',
    'abcd': '🔡',
    'abc': '🔤',
    'arrow_upper_right': '↗️',
    'arrow_upper_left': '↖️',
    'arrow_lower_right': '↘️',
    'arrow_lower_left': '↙️',
    'left_right_arrow': '↔️',
    'arrow_up_down': '↕️',
    'arrows_counterclockwise': '🔄',
    'arrow_backward': '◀️',
    'arrow_forward': '▶️',
    'arrow_up_small': '🔼',
    'arrow_down_small': '🔽',
    'leftwards_arrow_with_hook': '↩️',
    'arrow_right_hook': '↪️',
    'information_source': 'ℹ️',
    'rewind': '⏪',
    'fast_forward': '⏩',
    'arrow_double_up': '⏫',
    'arrow_double_down': '⏬',
    'arrow_heading_down': '⤵️',
    'arrow_heading_up': '⤴️',
    'ok': '🆗',
    'twisted_rightwards_arrows': '🔀',
    'repeat': '🔁',
    'repeat_one': '🔂',
    'new': '🆕',
    'up': '🆙',
    'cool': '🆒',
    'free': '🆓',
    'ng': '🆖',
    'signal_strength': '📶',
    'cinema': '🎦',
    'koko': '🈁',
    'u6307': '🈯',
    'u7a7a': '🈳',
    'u6e80': '🈵',
    'u5408': '🈴',
    'u7981': '🈲',
    'ideograph_advantage': '🉐',
    'u5272': '🈹',
    'u55b6': '🈺',
    'u6709': '🈶',
    'u7121': '🈚',
    'restroom': '🚻',
    'mens': '🚹',
    'womens': '🚺',
    'baby_symbol': '🚼',
    'wc': '🚾',
    'potable_water': '🚰',
    'put_litter_in_its_place': '🚮',
    'parking': '🅿️',
    'wheelchair': '♿',
    'no_smoking': '🚭',
    'u6708': '🈷️',
    'u7533': '🈸',
    'sa': '🈂️',
    'm': 'Ⓜ️',
    'passport_control': '🛂',
    'baggage_claim': '🛄',
    'left_luggage': '🛅',
    'customs': '🛃',
    'accept': '🉑',
    'secret': '㊙️',
    'congratulations': '㊗️',
    'cl': '🆑',
    'sos': '🆘',
    'id': '🆔',
    'no_entry_sign': '🚫',
    'underage': '🔞',
    'no_mobile_phones': '📵',
    'do_not_litter': '🚯',
    'non-potable_water': '🚱',
    'no_bicycles': '🚳',
    'no_pedestrians': '🚷',
    'children_crossing': '🚸',
    'no_entry': '⛔',
    'eight_spoked_asterisk': '✳️',
    'sparkle': '❇️',
    'negative_squared_cross_mark': '❎',
    'white_check_mark': '✅',
    'eight_pointed_black_star': '✴️',
    'heart_decoration': '💟',
    'vs': '🆚',
    'vibration_mode': '📳',
    'mobile_phone_off': '📴',
    'a': '🅰️',
    'b': '🅱️',
    'ab': '🆎',
    'o2': '🅾️',
    'diamond_shape_with_a_dot_inside': '💠',
    'loop': '➿',
    'recycle': '♻️',
    'aries': '♈',
    'taurus': '♉',
    'gemini': '♊',
    'cancer': '♋',
    'leo': '♌',
    'virgo': '♍',
    'libra': '♎',
    'scorpius': '♏',
    'sagittarius': '♐',
    'capricorn': '♑',
    'aquarius': '♒',
    'pisces': '♓',
    'ophiuchus': '⛎',
    'six_pointed_star': '🔯',
    'atm': '🏧',
    'chart': '💹',
    'heavy_dollar_sign': '💲',
    'currency_exchange': '💱',
    'copyright': '©️',
    'registered': '®️',
    'tm': '™️',
    'x': '❌',
    'bangbang': '‼️',
    'interrobang': '⁉️',
    'exclamation': '❗',
    'heavy_exclamation_mark': '❗',
    'question': '❓',
    'grey_exclamation': '❕',
    'grey_question': '❔',
    'o': '⭕',
    'top': '🔝',
    'end': '🔚',
    'back': '🔙',
    'on': '🔛',
    'soon': '🔜',
    'arrows_clockwise': '🔃',
    'clock12': '🕛',
    'clock1230': '🕧',
    'clock1': '🕐',
    'clock130': '🕜',
    'clock2': '🕑',
    'clock230': '🕝',
    'clock3': '🕒',
    'clock330': '🕞',
    'clock4': '🕓',
    'clock430': '🕟',
    'clock5': '🕔',
    'clock530': '🕠',
    'clock6': '🕕',
    'clock7': '🕖',
    'clock8': '🕗',
    'clock9': '🕘',
    'clock10': '🕙',
    'clock11': '🕚',
    'clock630': '🕡',
    'clock730': '🕢',
    'clock830': '🕣',
    'clock930': '🕤',
    'clock1030': '🕥',
    'clock1130': '🕦',
    'heavy_multiplication_x': '✖️',
    'heavy_plus_sign': '➕',
    'heavy_minus_sign': '➖',
    'heavy_division_sign': '➗',
    'spades': '♠️',
    'hearts': '♥️',
    'clubs': '♣️',
    'diamonds': '♦️',
    'white_flower': '💮',
    'heavy_check_mark': '✔️',
    'ballot_box_with_check': '☑️',
    'radio_button': '🔘',
    'link': '🔗',
    'curly_loop': '➰',
    'wavy_dash': '〰️',
    'part_alternation_mark': '〽️',
    'trident': '🔱',
    'black_medium_square': '◼️',
    'white_medium_square': '◻️',
    'black_medium_small_square': '◾',
    'white_medium_small_square': '◽',
    'black_small_square': '▪️',
    'white_small_square': '▫️',
    'small_red_triangle': '🔺',
    'black_square_button': '🔲',
    'white_square_button': '🔳',
    'black_circle': '⚫',
    'white_circle': '⚪',
    'red_circle': '🔴',
    'large_blue_circle': '🔵',
    'small_red_triangle_down': '🔻',
    'white_large_square': '⬜',
    'black_large_square': '⬛',
    'large_orange_diamond': '🔶',
    'large_blue_diamond': '🔷',
    'small_orange_diamond': '🔸',
    'small_blue_diamond': '🔹',
  }
}

module.exports = feature
