// Commentary for the "Simulate fight" button, spoken to you, the fighter:
// every line says what you do or what happens to you.
//
// The fight's outcome is drawn first from the model (see simulateFight in
// main.js). This module then tells a story that stays consistent with it:
//
// Chess  An advantage level carries over from one chess round to the next
//        (−2 lost … 0 equal … +2 winning). Opening lines only appear in the
//        first chess round. A fight that reaches the decision had a drawn
//        chess game, described in the last chess round. How a game is won
//        (mate, resignation, time, swindle) follows the advantage, and time
//        losses only happen once a clock can have run out.
// Boxing Standing counts follow the amateur rule: three in a round or four
//        in the fight end it, so a round that goes on never reaches that. A
//        stoppage names the count that ended it. The doctor only stops a
//        fight after a cut. Each boxing round that goes on has a points
//        winner, and a decision on points goes to the fighter who won the
//        majority of those rounds.

const f = (t, how) => ({ t, how });
const c = (t, you = 0, them = 0) => ({ t, you, them });

export const COMMENTARY = {
  en: {
    chess: {
      open: {
        even: [
          'You keep the opening quiet and solid.',
          'You blitz out your preparation, and so does your opponent.',
          'You play a symmetrical opening and take no risks.',
          'You follow main-line theory. Nothing new yet.',
          'You develop your pieces calmly. Level.',
          'You face an offbeat opening and think carefully.',
          'You set up a solid pawn structure. Level.',
          'You keep your king in the centre for now. A careful first round.'
        ],
        you: [
          'Your preparation hits: you get the better position.',
          'You grab space early; your opponent looks passive.',
          'You play fast while your opponent spends time in the opening.',
          'You come out of the opening with the initiative.',
          'You punish a weak opening move. Small edge for you.',
          'You finish your development first. Small edge.'
        ],
        them: [
          'You walk into your opponent\'s preparation.',
          'You let your opponent grab space; you feel passive.',
          'You spend a lot of time in the opening.',
          'You come out of the opening on the back foot.',
          'You misplay the opening. Small edge for your opponent.',
          'You fall behind in development.'
        ]
      },
      mid: {
        a0: {
          calm: [
            'You trade pieces. Still level.',
            'You manoeuvre slowly. Nothing changes.',
            'You find no way in. The position stays balanced.',
            'Your hands are still shaking from the ring; you play it safe.',
            'You keep material and chances equal.',
            'You trade queens. Still level.',
            'You regroup your pieces. Still balanced.',
            'You reach a dry, even position.'
          ],
          hot: [
            'Your king is exposed, and so is theirs. One slip decides everything.',
            'You trade blows at the board; the round ends mid-combination.',
            'You sacrifice, they sacrifice back. Nobody knows who is winning.',
            'You race your pawn storm against theirs.',
            'You miss a mate in two, and so does your opponent. The bell saves you both.',
            'You castle on opposite sides and attack all-out.',
            'Your flag is getting low, and so is theirs.',
            'You are both in time trouble, pieces hanging everywhere.'
          ]
        },
        a1: [
          'You win a pawn and start to squeeze.',
          'You make your opponent burn a lot of time.',
          'You get the better structure and a monster knight.',
          'You are a pawn up with the safer king. Going well.',
          'You grow your advantage with clean technique.',
          'You take control of the open file.'
        ],
        a2: {
          calm: [
            'You win a piece. Going very well.',
            'You are a full rook up. It is only a matter of time.',
            'You win the exchange and strip their king.',
            'You fork king and queen and pick up the queen.',
            'You are two pawns up in the endgame. Winning at the board.',
            'You are completely winning at the board.'
          ],
          hot: [
            'You are a piece up and hunting the king, but the bell rings.',
            'You have mate in three on the board. The round ends one move too early.',
            'You crash through; your opponent barely survives the round.',
            'You give check after check; your opponent finds the only moves.',
            'You watch their flag hang by a thread.',
            'You have your opponent down to seconds on the clock.'
          ]
        },
        m1: [
          'You lose a pawn and feel the squeeze.',
          'You burn a lot of time on your clock.',
          'You get cramped.',
          'You end up with passive pieces and a weaker structure.',
          'You give up the open file.',
          'You are slightly worse, but holding.'
        ],
        m2: {
          calm: [
            'You lose a piece. It looks bad at the board.',
            'You are a full rook down. You need the ring, fast.',
            'You drop the exchange and your king is exposed.',
            'You walk into a fork and lose your queen.',
            'You are two pawns down in the endgame. Lost at the board.',
            'You are lost at the board. Time to think about knockouts.'
          ],
          hot: [
            'You are a piece down with your king under fire. Saved by the bell.',
            'You see mate coming. The bell rings just in time.',
            'You barely survive the attack on your king.',
            'You find only moves to survive this round.',
            'Your flag is hanging: seconds left on your clock.',
            'You are down to seconds on the clock.'
          ]
        }
      },
      draw: {
        a0: [
          'You repeat moves: a draw. The boxing points will decide.',
          'You trade down to bare kings: the chess game is drawn.',
          'You agree a draw in a dead-level endgame.'
        ],
        a1: [
          'You cannot convert the extra pawn: the endgame is drawn.',
          'You reach opposite-coloured bishops. A draw despite your edge.'
        ],
        a2: [
          'You allow stalemate! A won game slips into a draw.',
          'You cannot break their fortress. A draw.'
        ],
        m1: [
          'You hold the slightly worse endgame to a draw.',
          'You reach opposite-coloured bishops and save the draw.'
        ],
        m2: [
          'You set up a stalemate trick and save a lost game!',
          'You build a fortress and hold the draw.'
        ]
      },
      win: {
        winning: [
          f('You deliver a clean checkmate.', 'mate'),
          f('You finish your attack with checkmate.', 'mate'),
          f('You convert the extra material and mate.', 'mate'),
          f('You mate with a queen and rook battery.', 'mate'),
          f('You leave your opponent no hope: they resign.', 'resign'),
          f('You see your opponent stop the clock and offer a handshake.', 'resign'),
          f('You threaten mate and your opponent resigns.', 'resign'),
          f('You watch their flag fall in a lost position: you win on time.', 'time'),
          f('You keep up the pressure until their clock runs out.', 'time')
        ],
        balanced: [
          f('You tip a sharp position your way: checkmate!', 'mate'),
          f('You spring a tactic your opponent misses: mate.', 'mate'),
          f('You are level on the board, but their flag falls first.', 'time')
        ],
        swindle: [
          f('You swindle a winning opponent into a blunder and mate!', 'mate'),
          f('You find a queen sacrifice out of nowhere and mate!', 'mate'),
          f('You set a desperate trap and they walk into mate.', 'mate'),
          f('You are lost, but their flag falls first!', 'time'),
          f('You are down material, but they lose on time!', 'time'),
          f('You provoke a shocking blunder and your opponent resigns.', 'resign')
        ]
      },
      loss: {
        winning: [
          f('You get checkmated.', 'mate'),
          f('You cannot stop the mating attack.', 'mate'),
          f('You cannot hold the extra material: you get mated.', 'mate'),
          f('You get mated by queen and rook.', 'mate'),
          f('You resign, the position is hopeless.', 'resign'),
          f('You stop the clock and shake hands.', 'resign'),
          f('You resign rather than face mate.', 'resign'),
          f('Your flag falls in a lost position: you lose on time.', 'time'),
          f('Your clock runs out while you look for a defence.', 'time')
        ],
        balanced: [
          f('You lose the thread in a sharp position: checkmate.', 'mate'),
          f('You miss a tactic and get mated.', 'mate'),
          f('You are level on the board, but your flag falls first.', 'time')
        ],
        swindle: [
          f('Disaster! You blunder into mate from a winning position.', 'mate'),
          f('You miss a queen sacrifice and get mated.', 'mate'),
          f('You fall for a desperate trap and get mated.', 'mate'),
          f('You are winning, but your flag falls first!', 'time'),
          f('You are up material, but you lose on time!', 'time'),
          f('You make a shocking blunder and resign.', 'resign')
        ]
      }
    },
    box: {
      calm: {
        even: [
          'You trade jabs; nobody gets hurt.',
          'You feint a lot in a cautious round.',
          'You get into scrappy exchanges in the middle of the ring.',
          'You save your energy for the board.',
          'You work the distance: jab, reset, jab.',
          'You clinch a lot; the referee separates you twice.',
          'You trade body shots. Nothing decisive.',
          'You box a tidy, technical round. Hard to score.'
        ],
        you: [
          'You land a clean combination.',
          'You push your opponent to the ropes.',
          'You control the round with your jab.',
          'You win the round clearly on points.',
          'You slow your opponent down with body shots.',
          'You slip the punches and counter.',
          'You set the pace. Going well.',
          'You make your opponent miss with your footwork.'
        ],
        them: [
          'You eat a heavy right hand.',
          'You get pinned on the ropes.',
          'You keep getting snapped back by the jab.',
          'You lose the round clearly on points.',
          'You take body shots that steal your breath.',
          'You struggle to find your range.',
          'You cannot set the pace; you are always a step behind.',
          'You miss a lot and pay for it.'
        ]
      },
      hot: {
        even: [
          c('You go down and so does your opponent! Wild round.', 1, 1),
          c('You both take a standing count.', 1, 1),
          c('You stand toe-to-toe; you both wobble, no count.', 0, 0),
          c('You trade bombs. The crowd is on its feet.', 0, 0),
          c('You stop defending and slug it out.', 0, 0)
        ],
        you: [
          c('You land a big right hand: standing count for your opponent.', 0, 1),
          c('You floor your opponent; they beat the count.', 0, 1),
          c('You force two standing counts in the round. The bell saves them.', 0, 2),
          c('You drop them with a huge uppercut. They get up at eight.', 0, 1),
          c('You have them wobbling on the ropes when the bell rings.', 0, 0),
          c('You take their legs away. They are saved by the bell.', 0, 0),
          c('You are one shot away; the referee is watching them closely.', 0, 0),
          c('You score two knockdowns in the round; they survive both.', 0, 2)
        ],
        them: [
          c('You eat a big right hand and take a standing count.', 1, 0),
          c('You go down, but beat the count.', 1, 0),
          c('You take two standing counts in the round. Saved by the bell!', 2, 0),
          c('You get dropped by a huge uppercut. You get up at eight.', 1, 0),
          c('You are wobbling on the ropes when the bell rings.', 0, 0),
          c('Your legs are gone. The bell rings just in time.', 0, 0),
          c('You feel the referee watching you closely.', 0, 0),
          c('You go down twice in the round and survive both.', 2, 0)
        ]
      },
      cut: {
        you: 'You open a cut over their eye; the doctor takes a look.',
        them: 'You get cut over the eye; the doctor takes a look.'
      },
      win: {
        ko: [
          f('You knock them out. The referee waves it off.', 'ko'),
          f('You land a clean right hand: knockout.', 'ko'),
          f('You drop them with a body shot for the count.', 'ko'),
          f('You end it with a left hook.', 'ko'),
          f('You watch them fail to beat the count.', 'ko')
        ],
        stop: [
          f('You unload a crushing combination and the referee steps in.', 'tko'),
          f('You batter them until their corner throws in the towel.', 'tko'),
          f('You trap them on the ropes; they stop answering and the referee stops it.', 'tko')
        ],
        doctor: [
          f('You reopen the cut over their eye. The doctor stops the fight.', 'tko'),
          f('You keep hitting the cut; the doctor waves it off.', 'tko')
        ],
        surprise: [
          f('You land a surprise counter out of nowhere. Knockout!', 'ko'),
          f('You throw one lucky hook and they are down and out!', 'ko'),
          f('You are losing the round, then one perfect uppercut. Knockout!', 'ko'),
          f('You throw a desperate overhand right and it lands flush. Lights out!', 'ko'),
          f('You catch them walking in with your counter. They cannot get up!', 'ko'),
          f('You explode with a sudden flurry against the run of play: stopped!', 'tko')
        ],
        count3: f('You force a third standing count in the round: the referee stops the fight.', 'tko'),
        count4of2: f('You force two more counts in the round, four in the fight: stopped.', 'tko'),
        count4: f('You force their fourth standing count of the fight: the referee stops it.', 'tko')
      },
      loss: {
        ko: [
          f('You are knocked out. The referee waves it off.', 'ko'),
          f('You get knocked out cold by a right hand.', 'ko'),
          f('You go down from a body shot and cannot beat the count.', 'ko'),
          f('You walk into a left hook that ends your night.', 'ko'),
          f('You cannot beat the count.', 'ko')
        ],
        stop: [
          f('You get caught by a crushing combination and the referee steps in.', 'tko'),
          f('You take too much; your corner throws in the towel.', 'tko'),
          f('You are trapped on the ropes and stop answering: the referee stops it.', 'tko')
        ],
        doctor: [
          f('Your cut reopens. The doctor stops the fight.', 'tko'),
          f('You bleed from the cut again; the doctor waves it off.', 'tko')
        ],
        surprise: [
          f('You get caught by a counter out of nowhere. Knockout!', 'ko'),
          f('You eat one lucky hook and you are down and out!', 'ko'),
          f('You are winning the round, then walk into one perfect uppercut. Knockout!', 'ko'),
          f('You get tagged by a wild overhand right. Lights out!', 'ko'),
          f('You walk into a counter and cannot get up!', 'ko'),
          f('You get overwhelmed by a sudden flurry against the run of play: stopped!', 'tko')
        ],
        count3: f('You take a third standing count in the round: the referee stops the fight.', 'tko'),
        count4of2: f('You take two more counts in the round, four in the fight: stopped.', 'tko'),
        count4: f('You take your fourth standing count of the fight: the referee stops it.', 'tko')
      },
      decision: {
        win: (w, o, e) => `On the judges' cards you won ${w} boxing rounds to ${o}${e ? ` (${e} even)` : ''}. Victory on points!`,
        loss: (w, o, e) => `On the judges' cards you lost ${w} boxing rounds to ${o}${e ? ` (${e} even)` : ''}. Defeat on points.`
      }
    }
  },

  fr: {
    chess: {
      open: {
        even: [
          'Vous jouez une ouverture calme et solide.',
          'Vous récitez votre préparation, votre adversaire aussi.',
          'Vous jouez une ouverture symétrique, sans prendre de risque.',
          'Vous suivez la grande ligne théorique. Rien de nouveau.',
          'Vous développez vos pièces tranquillement. Égalité.',
          'Vous affrontez une ouverture originale et réfléchissez longuement.',
          'Vous installez une structure de pions solide. Égalité.',
          'Vous gardez votre roi au centre pour l\'instant. Premier round prudent.'
        ],
        you: [
          'Votre préparation fait mouche : vous obtenez la meilleure position.',
          'Vous prenez de l\'espace tôt ; votre adversaire semble passif.',
          'Vous jouez vite pendant que votre adversaire réfléchit dans l\'ouverture.',
          'Vous sortez de l\'ouverture avec l\'initiative.',
          'Vous punissez un coup faible dans l\'ouverture. Léger avantage.',
          'Vous finissez votre développement le premier. Léger avantage.'
        ],
        them: [
          'Vous tombez dans la préparation de votre adversaire.',
          'Vous laissez votre adversaire prendre de l\'espace ; vous êtes passif.',
          'Vous consommez beaucoup de temps dans l\'ouverture.',
          'Vous sortez de l\'ouverture sur la défensive.',
          'Vous ratez votre ouverture. Léger avantage pour votre adversaire.',
          'Vous prenez du retard de développement.'
        ]
      },
      mid: {
        a0: {
          calm: [
            'Vous échangez des pièces. Toujours égal.',
            'Vous manœuvrez lentement. Rien ne change.',
            'Vous ne trouvez pas de faille. La position reste équilibrée.',
            'Vos mains tremblent encore du ring ; vous jouez prudemment.',
            'Vous gardez matériel et chances égaux.',
            'Vous échangez les dames. Toujours égal.',
            'Vous regroupez vos pièces. Toujours équilibré.',
            'Vous arrivez dans une position sèche et égale.'
          ],
          hot: [
            'Votre roi est exposé, le sien aussi. Une erreur décidera de tout.',
            'Vous vous rendez coup pour coup ; le round s\'arrête en pleine combinaison.',
            'Vous sacrifiez, il sacrifie en retour. Personne ne sait qui gagne.',
            'Vous lancez votre attaque de pions contre la sienne.',
            'Vous ratez un mat en deux, lui aussi. Le gong vous sauve tous les deux.',
            'Vous roquez du côté opposé et attaquez à outrance.',
            'Votre drapeau est bas, le sien aussi.',
            'Vous êtes tous les deux en zeitnot, des pièces en prise partout.'
          ]
        },
        a1: [
          'Vous gagnez un pion et serrez la vis.',
          'Vous faites consommer beaucoup de temps à votre adversaire.',
          'Vous obtenez la meilleure structure et un cavalier monstrueux.',
          'Vous avez un pion de plus et le roi le plus sûr. Ça se passe bien.',
          'Vous faites grandir votre avantage avec une technique propre.',
          'Vous prenez le contrôle de la colonne ouverte.'
        ],
        a2: {
          calm: [
            'Vous gagnez une pièce. Ça se passe très bien.',
            'Vous avez une tour de plus. Ce n\'est qu\'une question de temps.',
            'Vous gagnez la qualité et mettez son roi à nu.',
            'Vous faites une fourchette roi-dame et ramassez la dame.',
            'Vous avez deux pions de plus en finale. Gagnant sur l\'échiquier.',
            'Vous êtes totalement gagnant sur l\'échiquier.'
          ],
          hot: [
            'Vous avez une pièce de plus et traquez le roi, mais le gong sonne.',
            'Vous avez un mat en trois. Le round finit un coup trop tôt.',
            'Vous enfoncez sa défense ; votre adversaire survit de justesse.',
            'Vous donnez échec sur échec ; il trouve les seuls coups.',
            'Vous voyez son drapeau ne tenir qu\'à un fil.',
            'Vous laissez votre adversaire à quelques secondes.'
          ]
        },
        m1: [
          'Vous perdez un pion et subissez la pression.',
          'Vous consommez beaucoup de temps.',
          'Vous êtes à l\'étroit.',
          'Vous vous retrouvez avec des pièces passives et une structure faible.',
          'Vous cédez la colonne ouverte.',
          'Vous êtes légèrement moins bien, mais vous tenez.'
        ],
        m2: {
          calm: [
            'Vous perdez une pièce. Ça sent mauvais sur l\'échiquier.',
            'Vous avez une tour de moins. Il vous faut le ring, et vite.',
            'Vous perdez la qualité et votre roi est exposé.',
            'Vous tombez dans une fourchette et perdez la dame.',
            'Vous avez deux pions de moins en finale. Perdu sur l\'échiquier.',
            'Vous êtes perdu sur l\'échiquier. Pensez au K.-O.'
          ],
          hot: [
            'Vous avez une pièce de moins et votre roi sous le feu. Sauvé par le gong.',
            'Vous voyez le mat arriver. Le gong sonne juste à temps.',
            'Vous survivez de justesse à l\'attaque sur votre roi.',
            'Vous trouvez les seuls coups pour survivre à ce round.',
            'Votre drapeau vacille : quelques secondes à la pendule.',
            'Vous n\'avez plus que quelques secondes.'
          ]
        }
      },
      draw: {
        a0: [
          'Vous répétez les coups : nulle. Les points de boxe décideront.',
          'Vous échangez jusqu\'aux rois seuls : la partie est nulle.',
          'Vous acceptez la nulle dans une finale morte.'
        ],
        a1: [
          'Vous n\'arrivez pas à convertir le pion de plus : finale nulle.',
          'Vous arrivez à des fous de couleurs opposées. Nulle malgré votre avantage.'
        ],
        a2: [
          'Vous laissez un pat ! Une partie gagnée s\'envole.',
          'Vous ne percez pas sa forteresse. Nulle.'
        ],
        m1: [
          'Vous tenez la nulle dans une finale un peu moins bonne.',
          'Vous arrivez à des fous de couleurs opposées et sauvez la nulle.'
        ],
        m2: [
          'Vous tendez un piège de pat et sauvez une partie perdue !',
          'Vous construisez une forteresse et tenez la nulle.'
        ]
      },
      win: {
        winning: [
          f('Vous donnez un mat propre.', 'mate'),
          f('Vous concluez votre attaque par un mat.', 'mate'),
          f('Vous convertissez le matériel de plus et matez.', 'mate'),
          f('Vous matez avec la batterie dame-tour.', 'mate'),
          f('Vous ne laissez aucun espoir : votre adversaire abandonne.', 'resign'),
          f('Vous voyez votre adversaire arrêter la pendule et tendre la main.', 'resign'),
          f('Vous menacez mat et votre adversaire abandonne.', 'resign'),
          f('Vous voyez son drapeau tomber en position perdue : victoire au temps.', 'time'),
          f('Vous maintenez la pression jusqu\'à ce que sa pendule tombe.', 'time')
        ],
        balanced: [
          f('Vous faites basculer une position tendue : mat !', 'mate'),
          f('Vous trouvez une tactique qu\'il ne voit pas : mat.', 'mate'),
          f('Vous êtes à égalité, mais son drapeau tombe en premier.', 'time')
        ],
        swindle: [
          f('Vous arnaquez un adversaire gagnant : gaffe et mat !', 'mate'),
          f('Vous trouvez un sacrifice de dame surgi de nulle part : mat !', 'mate'),
          f('Vous tendez un piège désespéré et il tombe dans le mat.', 'mate'),
          f('Vous êtes perdu, mais son drapeau tombe en premier !', 'time'),
          f('Vous avez moins de matériel, mais il perd au temps !', 'time'),
          f('Vous provoquez une gaffe incroyable et votre adversaire abandonne.', 'resign')
        ]
      },
      loss: {
        winning: [
          f('Vous êtes mat.', 'mate'),
          f('Vous ne pouvez pas arrêter l\'attaque de mat.', 'mate'),
          f('Vous ne tenez pas face au matériel en moins : mat.', 'mate'),
          f('Vous êtes maté par la dame et la tour.', 'mate'),
          f('Vous abandonnez, la position est désespérée.', 'resign'),
          f('Vous arrêtez la pendule et serrez la main.', 'resign'),
          f('Vous abandonnez plutôt que de subir le mat.', 'resign'),
          f('Votre drapeau tombe dans une position perdue : défaite au temps.', 'time'),
          f('Votre pendule tombe pendant que vous cherchez une défense.', 'time')
        ],
        balanced: [
          f('Vous perdez le fil dans une position tendue : mat.', 'mate'),
          f('Vous ratez une tactique et êtes maté.', 'mate'),
          f('Vous êtes à égalité, mais votre drapeau tombe en premier.', 'time')
        ],
        swindle: [
          f('Catastrophe ! Vous gaffez et êtes maté en position gagnante.', 'mate'),
          f('Vous ratez un sacrifice de dame et êtes maté.', 'mate'),
          f('Vous tombez dans un piège désespéré et êtes maté.', 'mate'),
          f('Vous êtes gagnant, mais votre drapeau tombe en premier !', 'time'),
          f('Vous avez plus de matériel, mais vous perdez au temps !', 'time'),
          f('Vous faites une gaffe incroyable et abandonnez.', 'resign')
        ]
      }
    },
    box: {
      calm: {
        even: [
          'Vous échangez des jabs ; personne n\'est touché.',
          'Vous feintez beaucoup dans un round prudent.',
          'Vous vous lancez dans des échanges brouillons au centre du ring.',
          'Vous gardez des forces pour l\'échiquier.',
          'Vous travaillez la distance : jab, on recommence.',
          'Vous accrochez beaucoup ; l\'arbitre vous sépare deux fois.',
          'Vous échangez des coups au corps. Rien de décisif.',
          'Vous boxez un round propre et technique. Difficile à départager.'
        ],
        you: [
          'Vous placez un enchaînement propre.',
          'Vous poussez votre adversaire dans les cordes.',
          'Vous contrôlez le round avec votre jab.',
          'Vous gagnez nettement le round aux points.',
          'Vous le ralentissez avec vos coups au corps.',
          'Vous esquivez et contrez.',
          'Vous imposez le rythme. Ça se passe bien.',
          'Vous le faites rater grâce à votre jeu de jambes.'
        ],
        them: [
          'Vous encaissez un gros direct du droit.',
          'Vous êtes bloqué dans les cordes.',
          'Vous prenez son jab encore et encore.',
          'Vous perdez nettement le round aux points.',
          'Vous encaissez des coups au corps qui vous coupent le souffle.',
          'Vous peinez à trouver la distance.',
          'Vous n\'arrivez pas à imposer votre rythme ; toujours un temps de retard.',
          'Vous ratez beaucoup et vous le payez.'
        ]
      },
      hot: {
        even: [
          c('Vous allez au tapis, votre adversaire aussi ! Round fou.', 1, 1),
          c('Vous prenez tous les deux un compte debout.', 1, 1),
          c('Vous restez pied à pied ; vous vacillez tous les deux, sans compte.', 0, 0),
          c('Vous échangez des bombes. La salle est debout.', 0, 0),
          c('Vous arrêtez de défendre et cognez.', 0, 0)
        ],
        you: [
          c('Vous placez un gros droit : compte debout pour votre adversaire.', 0, 1),
          c('Vous l\'envoyez au tapis ; il se relève avant dix.', 0, 1),
          c('Vous lui infligez deux comptes debout dans le round. Le gong le sauve.', 0, 2),
          c('Vous l\'envoyez au tapis d\'un énorme uppercut. Il se relève à huit.', 0, 1),
          c('Vous le faites vaciller dans les cordes quand le gong sonne.', 0, 0),
          c('Vous lui coupez les jambes. Il est sauvé par le gong.', 0, 0),
          c('Vous êtes à un coup de finir ; l\'arbitre le surveille de près.', 0, 0),
          c('Vous le mettez deux fois au tapis dans le round ; il survit aux deux.', 0, 2)
        ],
        them: [
          c('Vous encaissez un gros droit et prenez un compte debout.', 1, 0),
          c('Vous allez au tapis, mais vous vous relevez à temps.', 1, 0),
          c('Vous prenez deux comptes debout dans le round. Sauvé par le gong !', 2, 0),
          c('Vous allez au tapis sur un énorme uppercut. Vous vous relevez à huit.', 1, 0),
          c('Vous vacillez dans les cordes quand le gong sonne.', 0, 0),
          c('Vos jambes ne suivent plus. Le gong sonne juste à temps.', 0, 0),
          c('Vous sentez l\'arbitre vous surveiller de près.', 0, 0),
          c('Vous allez deux fois au tapis dans le round et survivez aux deux.', 2, 0)
        ]
      },
      cut: {
        you: 'Vous lui ouvrez l\'arcade ; le médecin jette un œil.',
        them: 'Vous êtes ouvert à l\'arcade ; le médecin jette un œil.'
      },
      win: {
        ko: [
          f('Vous le mettez K.-O. L\'arbitre arrête tout.', 'ko'),
          f('Vous placez un direct du droit propre : K.-O.', 'ko'),
          f('Vous l\'envoyez au tapis d\'un coup au corps pour le compte.', 'ko'),
          f('Vous finissez le combat d\'un crochet du gauche.', 'ko'),
          f('Vous le regardez ne pas se relever avant dix.', 'ko')
        ],
        stop: [
          f('Vous lâchez un enchaînement écrasant et l\'arbitre intervient.', 'tko'),
          f('Vous le martelez jusqu\'à ce que son coin jette l\'éponge.', 'tko'),
          f('Vous le bloquez dans les cordes ; il ne répond plus et l\'arbitre arrête.', 'tko')
        ],
        doctor: [
          f('Vous rouvrez son arcade. Le médecin arrête le combat.', 'tko'),
          f('Vous frappez encore la coupure ; le médecin arrête tout.', 'tko')
        ],
        surprise: [
          f('Vous placez un contre surprise sorti de nulle part. K.-O. !', 'ko'),
          f('Vous lancez un crochet chanceux et il est au tapis pour de bon !', 'ko'),
          f('Vous perdez le round, puis un uppercut parfait. K.-O. !', 'ko'),
          f('Vous lancez un droit désespéré par-dessus, plein pot. Rideau !', 'ko'),
          f('Vous le cueillez en contre. Il ne se relève pas !', 'ko'),
          f('Vous explosez avec une rafale soudaine contre le cours du combat : arrêt !', 'tko')
        ],
        count3: f('Vous lui infligez un troisième compte debout dans le round : l\'arbitre arrête le combat.', 'tko'),
        count4of2: f('Vous lui infligez deux comptes de plus dans le round, quatre dans le combat : arrêt.', 'tko'),
        count4: f('Vous lui infligez son quatrième compte debout du combat : l\'arbitre arrête tout.', 'tko')
      },
      loss: {
        ko: [
          f('Vous êtes mis K.-O. L\'arbitre arrête tout.', 'ko'),
          f('Vous êtes éteint par un direct du droit.', 'ko'),
          f('Vous allez au tapis sur un coup au corps et ne vous relevez pas à temps.', 'ko'),
          f('Vous prenez un crochet du gauche qui met fin à votre soirée.', 'ko'),
          f('Vous ne vous relevez pas avant dix.', 'ko')
        ],
        stop: [
          f('Vous encaissez un enchaînement écrasant et l\'arbitre intervient.', 'tko'),
          f('Vous encaissez trop ; votre coin jette l\'éponge.', 'tko'),
          f('Vous êtes bloqué dans les cordes sans répondre : l\'arbitre arrête tout.', 'tko')
        ],
        doctor: [
          f('Votre arcade se rouvre. Le médecin arrête le combat.', 'tko'),
          f('Vous saignez à nouveau ; le médecin arrête tout.', 'tko')
        ],
        surprise: [
          f('Vous êtes cueilli par un contre sorti de nulle part. K.-O. !', 'ko'),
          f('Vous prenez un crochet chanceux et vous êtes au tapis pour de bon !', 'ko'),
          f('Vous gagnez le round, puis vous prenez un uppercut parfait. K.-O. !', 'ko'),
          f('Vous êtes touché par un droit fou par-dessus. Rideau !', 'ko'),
          f('Vous vous avancez dans un contre et ne vous relevez pas !', 'ko'),
          f('Vous êtes submergé par une rafale soudaine contre le cours du combat : arrêt !', 'tko')
        ],
        count3: f('Vous prenez un troisième compte debout dans le round : l\'arbitre arrête le combat.', 'tko'),
        count4of2: f('Vous prenez deux comptes de plus dans le round, quatre dans le combat : arrêt.', 'tko'),
        count4: f('Vous prenez votre quatrième compte debout du combat : l\'arbitre arrête tout.', 'tko')
      },
      decision: {
        win: (w, o, e) => `Sur les cartes des juges, vous gagnez ${w} rounds de boxe à ${o}${e ? ` (${e} nul${e > 1 ? 's' : ''})` : ''}. Victoire aux points !`,
        loss: (w, o, e) => `Sur les cartes des juges, vous perdez ${w} rounds de boxe à ${o}${e ? ` (${e} nul${e > 1 ? 's' : ''})` : ''}. Défaite aux points.`
      }
    }
  }
};

// Picks a line not used yet in this fight when possible.
function pick(arr, used) {
  const fresh = arr.filter(x => !used.has(x));
  const pool = fresh.length ? fresh : arr;
  const x = pool[Math.floor(Math.random() * pool.length)];
  used.add(x);
  return x;
}

const CLOCK_LINE = /flag|seconds|time trouble|drapeau|secondes|zeitnot/i;
const lineText = x => (typeof x === 'string' ? x : x.t);

// Who had the upper hand in a round that went on, drawn around your share of
// that round's finishing chance.
function drawLean(pA, pB) {
  const share = pA + pB > 1e-6 ? pA / (pA + pB) : 0.5;
  const u = Math.random();
  return u < share - 0.15 ? 'you' : u > share + 0.15 ? 'them' : 'even';
}

/**
 * Builds the commentary for a simulated fight.
 * rounds: [{ type: 'chess'|'box', decision, pA, pB, clockOk, result: 'you'|'them'|null }]
 *   (conditional chances for that round; result is set on the last round only)
 * Returns { rows: [{ text, result }], how, winner, boxing: { won, total } }.
 */
export function narrate(lang, rounds) {
  const L = COMMENTARY[lang] || COMMENTARY.en;
  const used = new Set();
  const last = rounds[rounds.length - 1];
  const winner = last.result;
  const rows = [];

  // Points winner of each boxing round that went on. A decision must go to
  // the fighter who won the majority of them, so redraw until it does.
  const boxOn = rounds.filter(r => r.type === 'box' && !r.result);
  let leans = boxOn.map(r => drawLean(r.pA, r.pB));
  if (last.decision && boxOn.length) {
    const other = winner === 'you' ? 'them' : 'you';
    const ok = ls => ls.filter(l => l === winner).length * 2 > ls.length;
    for (let i = 0; i < 200 && !ok(leans); i++) leans = boxOn.map(r => drawLean(r.pA, r.pB));
    for (let i = leans.length - 1; i >= 0 && !ok(leans); i--) leans[i] = winner;
  }

  let adv = 0, chessSeen = 0, boxSeen = 0;
  const counts = { you: 0, them: 0 };
  const cut = { you: false, them: false };
  const tally = { you: 0, them: 0 };
  let how = null;
  const lastChess = rounds.reduce((k, r, i) => (r.type === 'chess' && !r.decision ? i : k), -1);

  rounds.forEach((r, i) => {
    const hotChance = Math.min(0.9, (r.pA + r.pB) * 1.5);

    if (r.decision) {
      const other = winner === 'you' ? 'them' : 'you';
      const even = boxOn.length - tally.you - tally.them;
      rows.push({ text: L.box.decision[winner === 'you' ? 'win' : 'loss'](tally[winner], tally[other], even), result: winner });
      how = 'points';
      return;
    }

    if (r.type === 'chess') {
      chessSeen++;
      const noClock = arr => (r.clockOk ? arr : arr.filter(x => !CLOCK_LINE.test(lineText(x)) && x.how !== 'time'));
      if (r.result) {
        const w = r.result;
        const wAdv = w === 'you' ? adv : -adv;
        const kind = wAdv >= 1 ? 'winning' : wAdv === 0 ? 'balanced' : 'swindle';
        const pool = noClock((w === 'you' ? L.chess.win : L.chess.loss)[kind]);
        const line = pick(pool.length ? pool : (w === 'you' ? L.chess.win : L.chess.loss).winning.filter(x => x.how === 'mate'), used);
        rows.push({ text: line.t, result: w });
        how = line.how;
        return;
      }
      // The fight reaches the decision: the last chess game is a draw.
      if (last.decision && i === lastChess) {
        const key = adv === 0 ? 'a0' : adv > 0 ? `a${adv}` : `m${-adv}`;
        rows.push({ text: pick(L.chess.draw[key], used), result: null });
        return;
      }
      const lean = drawLean(r.pA, r.pB);
      if (chessSeen === 1) {
        adv = lean === 'you' ? 1 : lean === 'them' ? -1 : 0;
        rows.push({ text: pick(L.chess.open[lean], used), result: null });
        return;
      }
      adv = Math.max(-2, Math.min(2, adv + (lean === 'you' ? 1 : lean === 'them' ? -1 : 0)));
      const hot = Math.random() < hotChance;
      let pool;
      if (adv === 0) pool = L.chess.mid.a0[hot ? 'hot' : 'calm'];
      else if (adv === 1) pool = L.chess.mid.a1;
      else if (adv === -1) pool = L.chess.mid.m1;
      else pool = L.chess.mid[adv > 0 ? 'a2' : 'm2'][hot ? 'hot' : 'calm'];
      const filtered = noClock(pool);
      rows.push({ text: pick(filtered.length ? filtered : noClock(L.chess.mid.a0.calm), used), result: null });
      return;
    }

    // Boxing round.
    if (r.result) {
      const w = r.result, l = w === 'you' ? 'them' : 'you';
      const lines = w === 'you' ? L.box.win : L.box.loss;
      const options = [];
      // Stoppage on counts, named by the counts the loser already took.
      if (counts[l] >= 3) options.push(lines.count4, lines.count4);
      else if (counts[l] === 2) options.push(lines.count4of2);
      else options.push(lines.count3);
      if (cut[l]) options.push(...lines.doctor, ...lines.doctor);
      const surprise = (w === 'you' ? r.pA : r.pB) < 0.2 || tally[w] < tally[l];
      options.push(...(surprise ? lines.surprise : [...lines.ko, ...lines.stop]));
      const line = pick(options, used);
      rows.push({ text: line.t, result: w });
      how = line.how;
      return;
    }
    const lean = leans[boxSeen++];
    if (lean !== 'even') tally[lean]++;
    const hot = Math.random() < hotChance;
    if (hot) {
      // A cut now and then, at most once per fighter.
      const victim = lean === 'you' ? 'them' : lean === 'them' ? 'you' : null;
      if (victim && !cut[victim] && Math.random() < 0.2) {
        cut[victim] = true;
        rows.push({ text: L.box.cut[lean], result: null });
        return;
      }
      // Counts that keep the round under 3 and the fight under 4 for both.
      const ok = x => x.you < 3 && x.them < 3 && counts.you + x.you < 4 && counts.them + x.them < 4;
      const pool = L.box.hot[lean].filter(ok);
      if (pool.length) {
        const line = pick(pool, used);
        counts.you += line.you; counts.them += line.them;
        rows.push({ text: line.t, result: null });
        return;
      }
    }
    rows.push({ text: pick(L.box.calm[lean], used), result: null });
  });

  return { rows, how, winner, boxing: { won: tally[winner], total: boxOn.length } };
}
