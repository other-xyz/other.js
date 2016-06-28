//
// A Rock Paper Scissors Game
//
// Shows a way of handling server state logic.
//
// Game works like this:
//
// "rock paper scissors @alien"
// > @za has challenged @alien to a game of rock paper scissors
// Both @za and @alien see a message specific to them that includes three buttons (R/P/S)
// > @za has thrown, waiting for @alien... 
// > Rock beats scissors, @alien wins vs @za!
//

var feature = new FeatureSet({
  apiKey: 'cdb6b77b-99c3-454e-8e89-185badc4644e',
  id: 'rockpaperscissors',
  version: '0.1'
})

var otherchat = new Otherchat( feature )

var rpsCommand = feature.command({
  tokens: ['rock paper scissors'],
  version: '0.1',
  name: 'Rock Paper Scissors',
  description: 'Challenge someone to the age-old game, but without hands.',
  action: 'challenge',
  // accepts means shows users as didQuery chat complete
  accepts: {user: otherchat.types.user, query: String}
})

rpsGame = feature.server.state({

  // When the game begins:
  // * Announce who challenged who
  // * Present a choice of rock, paper, scissors as a message only visible to each participant

  init: (info, didInit) => {

    let game = this // info is automatically made available as this.info

    // A message with three buttons: rock, paper, scissors
    let throwPickers = [client.me, selected.user].map( user => ({
      text: 'What will you throw?',
      actions: ['Rock', 'Paper', 'Scissors'],
      whoCanSee: user
    }) )

    throwPickers.on( 'didSelect', (selected, context, didSelect) => {
      game.doPlayerThrow({ by: context.user, throw: selected.action }).ends( didSelect )
    })

    info.channel
      .post({
        type: 'system',
        text: `${info.challenger} has challenged ${info.challengee} to a game of rock paper scissors`
      })
      .post( chooseThrows )
      .ends( didInit )

  },

  // Given two player throws, returns an object with the result of who wins.
  
  whoWins: (throwA, throwB) => {
    // Looks like: { type: 'tie' || 'won', winningThrow: ..., losingThrow: ... }
  },

  // Handle a user throw

  doPlayerThow: (playerThrow, didPlayerThrow) => {

    let game = this,
      channel = game.info.channel

    game.withData( {playerThrows: []}, data => {

      // If first throw, announce who threw and who we are waiting for

      if ( data.playerThrows.length == 0 ) {

        let otherPlayer = [game.info.challenger, game.info.challengee].filter( player => player != playerThrow.by )

        channel
          .post({
            type: 'system',
            text: '${playerThrow.by} has thrown, waiting for ${otherPlayer}...'
          })
          .updateData({ playerThrows: data.playerThrows.append( playerThrow ) })
          .ends( didPlayerThrow )
      }

      // If second throw, announce game results

      else if (data.playerThrows.length == 1 ){

        let firstThrow = data.playerThrows.first(),
          secondThrow = playerThrow,
          result = game.whoWins( firstThrow, secondThrow )

        if ( result.type == 'tie' ) {
          
          channel
            .post({
              type: 'system',
              text: '${game.info.challenger} and ${game.info.challengee} both threw ${firstThrow.throw} for a tie!'
            })
            .ends( didPlayerThrow )

        }

        else {

          channel
            .post({
              type: 'system',
              text: '${result.winningThrow.throw} beats ${result.losingThrow.throw}, ${result.winningThrow.by} wins vs ${result.losingThrow.by}!'
            })
            .then( () => game.deinit() )
            .ends( didPlayerThrow )

        }

      }

    }).ends( didPlayerThrow )

  }
})


rpsCommand.on( 'didAction', (selected, didAction) => {

  rpsGame
    .init({
      channel: otherchat.client.currentChannel,
      challenger: otherchat.client.me,
      challengee: selected.user
    })
    .ends( didAction )

})

// FURTHER THOUGHTS:
//
// More commands that are similar to this one:
// - guess the number between 1-100
// - guess the number that's 1/3 of the average number
// - roll to decide who wins: single-button to roll, pipe through dice roll command?
//
// More discoverable via a parent "play" command?
// play --> chat complete of games
// play: rock paper scissors
// play: rock paper scissors @alien
