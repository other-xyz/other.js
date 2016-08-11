const {Command, Feature, StagedMessageResult} = require('other')

const feature = new Feature({
  name: 'Core',
  version: '0.0.1',
  dependencies: {
    otherjs: '1.x'
  }
})

feature.commands.push(new Command({
  tokens: ['/blockquote', '/caption', '/h1', '/h2', '/h3', '/p', '/s'],
  onQuery(token, query) {
    const format = token === '/s' ? 'system' : token.substring(1)
    return Promise.resolve(new StagedMessageResult({format}))
  }
}))

module.exports = feature