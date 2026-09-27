// Commentary for the "Simulate fight" button, from your point of view.
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
//        winner, and a decision on points goes to the fighter who won more
//        of those rounds.

const f = (t, how) => ({ t, how });
const c = (t, you = 0, them = 0) => ({ t, you, them });

export const COMMENTARY = {
  en: {
    chess: {
      // First chess round, by who is better after it.
      open: {
        even: [
          'Quiet opening, both keep it solid.',
          'Both players blitz out their preparation.',
          'A symmetrical opening, nobody wants to take risks.',
          'Main-line theory, both know it well.',
          'A calm start, both develop their pieces.',
          'An offbeat opening, both think carefully.',
          'Solid pawn structures on both sides.',
          'Nobody castles yet; a careful first round.'
        ],
        you: [
          'Your opening preparation hits: you get the better position.',
          'You grab space early and your opponent looks passive.',
          'Your opponent spends a lot of time in the opening.',
          'You come out of the opening with the initiative.',
          'Your opponent misplays the opening. Small edge for you.',
          'Better development for you after the opening.'
        ],
        them: [
          'You walk into their preparation.',
          'Your opponent grabs space early; you are a bit passive.',
          'You spend a lot of time in the opening.',
          'Your opponent comes out of the opening with the initiative.',
          'You misplay the opening. Small edge for them.',
          'Better development for your opponent after the opening.'
        ]
      },
      // Later chess rounds, by the advantage after the round (from your side).
      mid: {
        a0: {
          calm: [
            'Pieces come off the board, still level.',
            'A slow manoeuvring game, nothing changes.',
            'Nobody finds a way in; the position stays balanced.',
            'Hands still shaking from the ring, both play it safe.',
            'Equal material, equal chances.',
            'A tidy queen trade keeps it level.',
            'Both sides regroup. Still balanced.',
            'The position is dry and even.'
          ],
          hot: [
            'Both kings are exposed; one slip decides everything.',
            'Wild tactics on both sides, the round ends mid-combination.',
            'Sacrifice and counter-sacrifice: nobody knows who is winning.',
            'A razor-sharp race of pawn storms.',
            'Both players miss a mate in two. The bell saves everyone.',
            'Opposite-side castling, all-out attack from both.',
            'Both flags are getting low.',
            'Mutual time trouble, pieces hanging everywhere.'
          ]
        },
        a1: [
          'You win a pawn and start to squeeze.',
          'Your opponent burns a lot of time.',
          'You get the better structure and a monster knight.',
          'A pawn up with the safer king. Going well.',
          'Clean technique: your advantage grows slowly.',
          'You control the open file.'
        ],
        a2: {
          calm: [
            'You win a piece. Going very well.',
            'A full rook up. It is only a matter of time.',
            'You win the exchange and their king is naked.',
            'You fork king and queen and pick up the queen.',
            'Two pawns up in the endgame. Winning at the board.',
            'You are completely winning at the board.'
          ],
          hot: [
            'A piece up and hunting the king, but the bell rings.',
            'Mate in three on the board. The round ends one move too early.',
            'Your attack crashes through; they barely survive the round.',
            'Checks everywhere: they find the only moves to survive.',
            'Their flag is hanging by a thread.',
            'Your opponent is down to seconds on the clock.'
          ]
        },
        m1: [
          'Your opponent wins a pawn and squeezes.',
          'You burn a lot of time on your clock.',
          'Your position gets cramped.',
          'Passive pieces and a weaker structure.',
          'Your opponent takes the open file.',
          'Slightly worse, but holding.'
        ],
        m2: {
          calm: [
            'You lose a piece. It looks bad at the board.',
            'A full rook down. You need the ring, fast.',
            'You drop the exchange and your king is exposed.',
            'A fork costs you your queen.',
            'Two pawns down in the endgame. Lost at the board.',
            'You are lost at the board. Time to think about knockouts.'
          ],
          hot: [
            'A piece down and your king is under fire. Saved by the bell.',
            'Mate is coming. The bell rings just in time.',
            'Their attack crashes through; you barely survive the round.',
            'Only moves to survive this round.',
            'Your flag is hanging: seconds left on your clock.',
            'You are down to seconds on the clock.'
          ]
        }
      },
      // Last chess round when the game ends drawn (the fight goes to points),
      // by the advantage before it.
      draw: {
        a0: [
          'Draw by repetition. The boxing points will decide.',
          'Bare kings: the chess game is drawn.',
          'Both agree a draw in a dead-level endgame.'
        ],
        a1: [
          'Your extra pawn is not enough: the endgame is drawn.',
          'Opposite-coloured bishops. A draw despite your edge.'
        ],
        a2: [
          'Stalemate! You let a won game slip into a draw.',
          'They build a fortress and hold the draw.'
        ],
        m1: [
          'You hold the slightly worse endgame to a draw.',
          'Opposite-coloured bishops save you: a draw.'
        ],
        m2: [
          'Stalemate trick! You save a lost game with a draw.',
          'You build a fortress and hold the draw.'
        ]
      },
      // Chess finishes. win: you win; loss: your opponent wins.
      // winning: the winner was better; balanced: level; swindle: the winner was worse.
      win: {
        winning: [
          f('You deliver a clean checkmate.', 'mate'),
          f('Your attack ends in checkmate.', 'mate'),
          f('You convert the extra material and mate.', 'mate'),
          f('Mate with a queen and rook battery.', 'mate'),
          f('Your opponent resigns, the position is hopeless.', 'resign'),
          f('Your opponent stops the clock and shakes your hand.', 'resign'),
          f('Your opponent resigns rather than face mate.', 'resign'),
          f('Their flag falls in a lost position: you win on time.', 'time'),
          f('Their clock runs out while they look for a defence.', 'time')
        ],
        balanced: [
          f('A sharp position tips your way: checkmate!', 'mate'),
          f('They miss your tactic and get mated.', 'mate'),
          f('Level on the board, but their flag falls first.', 'time')
        ],
        swindle: [
          f('Swindle! Your opponent blunders into mate from a winning position.', 'mate'),
          f('Out of nowhere: a queen sacrifice and mate!', 'mate'),
          f('A desperate trick works: they walk into mate.', 'mate'),
          f('Their flag falls in a completely winning position!', 'time'),
          f('They lose on time with extra material!', 'time'),
          f('A shocking blunder and your opponent resigns.', 'resign')
        ]
      },
      loss: {
        winning: [
          f('You get checkmated.', 'mate'),
          f('Your king falls to a mating attack.', 'mate'),
          f('They convert the extra material and mate you.', 'mate'),
          f('Their queen and rook mate your king.', 'mate'),
          f('You resign, the position is hopeless.', 'resign'),
          f('You stop the clock and shake hands.', 'resign'),
          f('You resign rather than face mate.', 'resign'),
          f('Your flag falls in a lost position: you lose on time.', 'time'),
          f('Your clock runs out while you look for a defence.', 'time')
        ],
        balanced: [
          f('A sharp position tips their way: checkmate.', 'mate'),
          f('You miss their tactic and get mated.', 'mate'),
          f('Level on the board, but your flag falls first.', 'time')
        ],
        swindle: [
          f('Disaster! You blunder into mate from a winning position.', 'mate'),
          f('Out of nowhere: they sacrifice the queen and mate you.', 'mate'),
          f('Their desperate trick works: you walk into mate.', 'mate'),
          f('Your flag falls in a completely winning position!', 'time'),
          f('You lose on time with extra material!', 'time'),
          f('A shocking blunder and you resign.', 'resign')
        ]
      }
    },
    box: {
      // Rounds that go on, by who won the round on points.
      calm: {
        even: [
          'Both trade jabs, nobody is hurt.',
          'Cautious round, lots of feints.',
          'Scrappy exchanges in the middle of the ring.',
          'Both boxers save energy for the board.',
          'A tactical round: distance, jab, reset.',
          'Plenty of clinching. The referee separates them twice.',
          'Body shots from both sides, nothing decisive.',
          'A tidy, technical round. Hard to score.'
        ],
        you: [
          'You land a clean combination.',
          'You push them to the ropes.',
          'Your jab controls the round.',
          'You win the round clearly on points.',
          'Your body shots slow them down.',
          'You slip their punches and counter.',
          'You dictate the pace. Going well.',
          'Your footwork makes them miss.'
        ],
        them: [
          'They land a heavy right hand.',
          'You get pinned on the ropes.',
          'Their jab keeps snapping your head back.',
          'You lose the round clearly on points.',
          'Their body shots take your breath away.',
          'You struggle to find your range.',
          'They dictate the pace.',
          'You miss a lot and pay for it.'
        ]
      },
      // Close calls: standing counts (you = counts you take, them = counts they take).
      hot: {
        even: [
          c('A knockdown each! Wild round.', 1, 1),
          c('Both boxers take a standing count.', 1, 1),
          c('Toe-to-toe war! Both are wobbled, no count.', 0, 0),
          c('Both land bombs. The crowd is on its feet.', 0, 0),
          c('Slugfest: nobody is defending anymore.', 0, 0)
        ],
        you: [
          c('Big right hand! They take a standing count.', 0, 1),
          c('You floor them, they beat the count.', 0, 1),
          c('Two standing counts against them in the round. The bell saves them.', 0, 2),
          c('A huge uppercut drops them. They get up at eight.', 0, 1),
          c('They are wobbling on the ropes when the bell rings.', 0, 0),
          c('Their legs are gone. Saved by the bell.', 0, 0),
          c('The referee is watching them closely. One more shot would do it.', 0, 0),
          c('Two knockdowns in the round, they survive both.', 0, 2)
        ],
        them: [
          c('Big right hand! You take a standing count.', 1, 0),
          c('You go down, but beat the count.', 1, 0),
          c('Two standing counts against you in the round. Saved by the bell!', 2, 0),
          c('A huge uppercut drops you. You get up at eight.', 1, 0),
          c('Wobbling on the ropes when the bell rings.', 0, 0),
          c('Your legs are gone. The bell rings just in time.', 0, 0),
          c('The referee is watching you closely.', 0, 0),
          c('Two knockdowns in the round, you survive both.', 2, 0)
        ]
      },
      // A cut that the doctor checks (and that can end the fight later).
      cut: {
        you: 'You open a cut over their eye; the doctor takes a look.',
        them: 'A cut opens over your eye; the doctor takes a look.'
      },
      // Boxing finishes. win: you win; loss: your opponent wins.
      win: {
        ko: [
          f('Knockout! The referee waves it off.', 'ko'),
          f('Clean knockout with a right hand.', 'ko'),
          f('A body shot drops them for the count.', 'ko'),
          f('A left hook ends it.', 'ko'),
          f('They cannot beat the count.', 'ko')
        ],
        stop: [
          f('A crushing combination and the referee steps in.', 'tko'),
          f('Their corner throws in the towel.', 'tko'),
          f('Trapped on the ropes and not answering: the referee stops it.', 'tko')
        ],
        doctor: [
          f('The cut over their eye reopens. The doctor stops the fight.', 'tko'),
          f('The doctor looks at the cut again and waves it off.', 'tko')
        ],
        surprise: [
          f('Surprise punch! A counter out of nowhere knocks them out!', 'ko'),
          f('Lucky punch: one hook and they are down and out!', 'ko'),
          f('Losing the round, you land one perfect uppercut. Knockout!', 'ko'),
          f('A desperate overhand right lands flush. Lights out!', 'ko'),
          f('They walk into your counter and cannot get up!', 'ko'),
          f('Against the run of play, a sudden flurry and the referee stops it!', 'tko')
        ],
        // Stoppage on counts; the one to use depends on counts already taken.
        count3: f('Third standing count of the round: the referee stops the fight.', 'tko'),
        count4of2: f('Two more counts in the round make four in the fight: stopped.', 'tko'),
        count4: f('Their fourth standing count of the fight: the referee stops it.', 'tko')
      },
      loss: {
        ko: [
          f('You are knocked out. The referee waves it off.', 'ko'),
          f('A right hand knocks you out cold.', 'ko'),
          f('A body shot drops you for the count.', 'ko'),
          f('A left hook ends your night.', 'ko'),
          f('You cannot beat the count.', 'ko')
        ],
        stop: [
          f('A crushing combination and the referee steps in.', 'tko'),
          f('Your corner throws in the towel.', 'tko'),
          f('Trapped on the ropes and not answering: the referee stops it.', 'tko')
        ],
        doctor: [
          f('The cut over your eye reopens. The doctor stops the fight.', 'tko'),
          f('The doctor looks at your cut again and waves it off.', 'tko')
        ],
        surprise: [
          f('Surprise punch! A counter out of nowhere knocks you out!', 'ko'),
          f('Lucky punch: one hook and you are down and out!', 'ko'),
          f('Winning the round, you walk into one perfect uppercut. Knockout!', 'ko'),
          f('A wild overhand right lands flush. Lights out!', 'ko'),
          f('You walk into their counter and cannot get up!', 'ko'),
          f('Against the run of play, a sudden flurry and the referee stops it!', 'tko')
        ],
        count3: f('Third standing count of the round: the referee stops the fight.', 'tko'),
        count4of2: f('Two more counts in the round make four in the fight: stopped.', 'tko'),
        count4: f('Your fourth standing count of the fight: the referee stops it.', 'tko')
      },
      decision: {
        win: (won, total) => `The judges score the boxing: you won ${won} of ${total} boxing rounds. Victory on points!`,
        loss: (won, total) => `The judges score the boxing: your opponent won ${won} of ${total} boxing rounds. Defeat on points.`
      }
    }
  },

  fr: {
    chess: {
      open: {
        even: [
          'Ouverture calme, chacun reste solide.',
          'Les deux joueurs récitent leur préparation.',
          'Ouverture symétrique, personne ne veut prendre de risque.',
          'Grande ligne théorique, les deux la connaissent bien.',
          'Début tranquille, chacun développe ses pièces.',
          'Ouverture originale, les deux réfléchissent longuement.',
          'Structures de pions solides des deux côtés.',
          'Personne n\'a encore roqué, premier round prudent.'
        ],
        you: [
          'Votre préparation fait mouche : vous obtenez la meilleure position.',
          'Vous prenez de l\'espace tôt, votre adversaire semble passif.',
          'Votre adversaire consomme beaucoup de temps dans l\'ouverture.',
          'Vous sortez de l\'ouverture avec l\'initiative.',
          'Votre adversaire rate son ouverture. Léger avantage pour vous.',
          'Meilleur développement pour vous après l\'ouverture.'
        ],
        them: [
          'Vous tombez dans sa préparation.',
          'Votre adversaire prend de l\'espace tôt, vous êtes un peu passif.',
          'Vous consommez beaucoup de temps dans l\'ouverture.',
          'Votre adversaire sort de l\'ouverture avec l\'initiative.',
          'Vous ratez votre ouverture. Léger avantage pour lui.',
          'Meilleur développement pour votre adversaire après l\'ouverture.'
        ]
      },
      mid: {
        a0: {
          calm: [
            'Les pièces s\'échangent, toujours égal.',
            'Partie de manœuvres lente, rien ne change.',
            'Personne ne trouve de faille, la position reste équilibrée.',
            'Les mains tremblent encore du ring, chacun joue prudemment.',
            'Matériel égal, chances égales.',
            'Un échange de dames propre garde l\'équilibre.',
            'Les deux camps se regroupent. Toujours équilibré.',
            'Position sèche et égale.'
          ],
          hot: [
            'Les deux rois sont exposés, une erreur décidera de tout.',
            'Tactiques folles des deux côtés, le round s\'arrête en pleine combinaison.',
            'Sacrifice et contre-sacrifice : personne ne sait qui gagne.',
            'Course effrénée de poussées de pions.',
            'Les deux ratent un mat en deux. Le gong sauve tout le monde.',
            'Roques opposés, attaque totale des deux côtés.',
            'Les deux drapeaux sont bas.',
            'Zeitnot mutuel, des pièces en prise partout.'
          ]
        },
        a1: [
          'Vous gagnez un pion et serrez la vis.',
          'Votre adversaire consomme beaucoup de temps.',
          'Vous obtenez la meilleure structure et un cavalier monstrueux.',
          'Un pion de plus et le roi le plus sûr. Ça se passe bien.',
          'Technique propre : votre avantage grandit lentement.',
          'Vous contrôlez la colonne ouverte.'
        ],
        a2: {
          calm: [
            'Vous gagnez une pièce. Ça se passe très bien.',
            'Une tour de plus. Ce n\'est qu\'une question de temps.',
            'Vous gagnez la qualité et son roi est à nu.',
            'Fourchette roi-dame : vous ramassez la dame.',
            'Deux pions de plus en finale. Gagnant sur l\'échiquier.',
            'Vous êtes totalement gagnant sur l\'échiquier.'
          ],
          hot: [
            'Une pièce de plus et vous traquez le roi, mais le gong sonne.',
            'Mat en trois sur l\'échiquier. Le round finit un coup trop tôt.',
            'Votre attaque passe ; il survit de justesse au round.',
            'Échecs de partout : il trouve les seuls coups pour survivre.',
            'Son drapeau ne tient qu\'à un fil.',
            'Votre adversaire n\'a plus que quelques secondes.'
          ]
        },
        m1: [
          'Votre adversaire gagne un pion et serre la vis.',
          'Vous consommez beaucoup de temps.',
          'Votre position devient étriquée.',
          'Pièces passives et structure plus faible.',
          'Votre adversaire prend la colonne ouverte.',
          'Légèrement moins bien, mais vous tenez.'
        ],
        m2: {
          calm: [
            'Vous perdez une pièce. Ça sent mauvais sur l\'échiquier.',
            'Une tour de moins. Il vous faut le ring, et vite.',
            'Vous perdez la qualité et votre roi est exposé.',
            'Une fourchette vous coûte la dame.',
            'Deux pions de moins en finale. Perdu sur l\'échiquier.',
            'Perdu sur l\'échiquier. Il est temps de penser au K.-O.'
          ],
          hot: [
            'Une pièce de moins et votre roi sous le feu. Sauvé par le gong.',
            'Le mat arrive. Le gong sonne juste à temps.',
            'Son attaque passe ; vous survivez de justesse au round.',
            'Seuls coups pour survivre à ce round.',
            'Votre drapeau vacille : quelques secondes à la pendule.',
            'Vous n\'avez plus que quelques secondes.'
          ]
        }
      },
      draw: {
        a0: [
          'Nulle par répétition. Les points de boxe décideront.',
          'Rois dépouillés : la partie est nulle.',
          'Nulle d\'un commun accord dans une finale morte.'
        ],
        a1: [
          'Votre pion de plus ne suffit pas : la finale est nulle.',
          'Fous de couleurs opposées. Nulle malgré votre avantage.'
        ],
        a2: [
          'Pat ! Vous laissez filer une partie gagnée.',
          'Il construit une forteresse et tient la nulle.'
        ],
        m1: [
          'Vous tenez la nulle dans une finale un peu moins bonne.',
          'Les fous de couleurs opposées vous sauvent : nulle.'
        ],
        m2: [
          'Piège du pat ! Vous sauvez une partie perdue.',
          'Vous construisez une forteresse et tenez la nulle.'
        ]
      },
      win: {
        winning: [
          f('Vous donnez un mat propre.', 'mate'),
          f('Votre attaque se termine par un mat.', 'mate'),
          f('Vous convertissez le matériel de plus et matez.', 'mate'),
          f('Mat avec la batterie dame-tour.', 'mate'),
          f('Votre adversaire abandonne, la position est désespérée.', 'resign'),
          f('Votre adversaire arrête la pendule et vous serre la main.', 'resign'),
          f('Votre adversaire abandonne plutôt que de subir le mat.', 'resign'),
          f('Son drapeau tombe dans une position perdue : victoire au temps.', 'time'),
          f('Sa pendule tombe pendant qu\'il cherche une défense.', 'time')
        ],
        balanced: [
          f('La position tendue bascule de votre côté : mat !', 'mate'),
          f('Il rate votre tactique et se fait mater.', 'mate'),
          f('Égal sur l\'échiquier, mais son drapeau tombe en premier.', 'time')
        ],
        swindle: [
          f('Arnaque ! Votre adversaire gaffe et se fait mater en position gagnante.', 'mate'),
          f('Surgi de nulle part : un sacrifice de dame et mat !', 'mate'),
          f('Un piège désespéré fonctionne : il tombe dans le mat.', 'mate'),
          f('Son drapeau tombe dans une position totalement gagnante !', 'time'),
          f('Il perd au temps avec du matériel en plus !', 'time'),
          f('Une gaffe incroyable et votre adversaire abandonne.', 'resign')
        ]
      },
      loss: {
        winning: [
          f('Vous êtes mat.', 'mate'),
          f('Votre roi tombe sous une attaque de mat.', 'mate'),
          f('Il convertit le matériel de plus et vous mate.', 'mate'),
          f('Sa dame et sa tour matent votre roi.', 'mate'),
          f('Vous abandonnez, la position est désespérée.', 'resign'),
          f('Vous arrêtez la pendule et serrez la main.', 'resign'),
          f('Vous abandonnez plutôt que de subir le mat.', 'resign'),
          f('Votre drapeau tombe dans une position perdue : défaite au temps.', 'time'),
          f('Votre pendule tombe pendant que vous cherchez une défense.', 'time')
        ],
        balanced: [
          f('La position tendue bascule de son côté : mat.', 'mate'),
          f('Vous ratez sa tactique et vous faites mater.', 'mate'),
          f('Égal sur l\'échiquier, mais votre drapeau tombe en premier.', 'time')
        ],
        swindle: [
          f('Catastrophe ! Vous gaffez et vous faites mater en position gagnante.', 'mate'),
          f('Surgi de nulle part : il sacrifie la dame et vous mate.', 'mate'),
          f('Son piège désespéré fonctionne : vous tombez dans le mat.', 'mate'),
          f('Votre drapeau tombe dans une position totalement gagnante !', 'time'),
          f('Vous perdez au temps avec du matériel en plus !', 'time'),
          f('Une gaffe incroyable et vous abandonnez.', 'resign')
        ]
      }
    },
    box: {
      calm: {
        even: [
          'Échange de jabs, personne n\'est touché.',
          'Round prudent, beaucoup de feintes.',
          'Échanges brouillons au centre du ring.',
          'Les deux boxeurs gardent des forces pour l\'échiquier.',
          'Round tactique : distance, jab, on recommence.',
          'Beaucoup d\'accrochages. L\'arbitre les sépare deux fois.',
          'Coups au corps des deux côtés, rien de décisif.',
          'Round propre et technique. Difficile à départager.'
        ],
        you: [
          'Vous placez un enchaînement propre.',
          'Vous le poussez dans les cordes.',
          'Votre jab contrôle le round.',
          'Vous gagnez nettement le round aux points.',
          'Vos coups au corps le ralentissent.',
          'Vous esquivez et contrez.',
          'Vous imposez le rythme. Ça se passe bien.',
          'Votre jeu de jambes le fait rater.'
        ],
        them: [
          'Il place un gros direct du droit.',
          'Vous êtes bloqué dans les cordes.',
          'Son jab vous renvoie la tête en arrière.',
          'Vous perdez nettement le round aux points.',
          'Ses coups au corps vous coupent le souffle.',
          'Vous peinez à trouver la distance.',
          'Il impose le rythme.',
          'Vous ratez beaucoup et vous le payez.'
        ]
      },
      hot: {
        even: [
          c('Un knockdown chacun ! Round fou.', 1, 1),
          c('Les deux boxeurs prennent un compte debout.', 1, 1),
          c('Guerre de tranchées ! Les deux vacillent, sans compte.', 0, 0),
          c('Les deux placent des bombes. La salle est debout.', 0, 0),
          c('Pugilat : plus personne ne défend.', 0, 0)
        ],
        you: [
          c('Gros direct du droit ! Il prend un compte debout.', 0, 1),
          c('Vous l\'envoyez au tapis, il se relève avant dix.', 0, 1),
          c('Deux comptes debout contre lui dans le round. Sauvé par le gong.', 0, 2),
          c('Un énorme uppercut l\'envoie au tapis. Il se relève à huit.', 0, 1),
          c('Il vacille dans les cordes quand le gong sonne.', 0, 0),
          c('Ses jambes ne suivent plus. Sauvé par le gong.', 0, 0),
          c('L\'arbitre le surveille de près. Un coup de plus suffirait.', 0, 0),
          c('Deux knockdowns dans le round, il survit aux deux.', 0, 2)
        ],
        them: [
          c('Gros direct du droit ! Vous prenez un compte debout.', 1, 0),
          c('Vous allez au tapis, mais vous vous relevez à temps.', 1, 0),
          c('Deux comptes debout contre vous dans le round. Sauvé par le gong !', 2, 0),
          c('Un énorme uppercut vous envoie au tapis. Vous vous relevez à huit.', 1, 0),
          c('Vous vacillez dans les cordes quand le gong sonne.', 0, 0),
          c('Vos jambes ne suivent plus. Le gong sonne juste à temps.', 0, 0),
          c('L\'arbitre vous surveille de près.', 0, 0),
          c('Deux knockdowns dans le round, vous survivez aux deux.', 2, 0)
        ]
      },
      cut: {
        you: 'Vous lui ouvrez l\'arcade ; le médecin jette un œil.',
        them: 'Votre arcade s\'ouvre ; le médecin jette un œil.'
      },
      win: {
        ko: [
          f('K.-O. ! L\'arbitre arrête tout.', 'ko'),
          f('K.-O. net sur un direct du droit.', 'ko'),
          f('Un coup au corps le laisse au tapis pour le compte.', 'ko'),
          f('Un crochet du gauche met fin au combat.', 'ko'),
          f('Il ne se relève pas avant dix.', 'ko')
        ],
        stop: [
          f('Un enchaînement écrasant et l\'arbitre intervient.', 'tko'),
          f('Son coin jette l\'éponge.', 'tko'),
          f('Bloqué dans les cordes sans répondre : l\'arbitre arrête tout.', 'tko')
        ],
        doctor: [
          f('Son arcade se rouvre. Le médecin arrête le combat.', 'tko'),
          f('Le médecin revoit la coupure et arrête tout.', 'tko')
        ],
        surprise: [
          f('Coup surprise ! Un contre sorti de nulle part le met K.-O. !', 'ko'),
          f('Coup de chance : un crochet et il est au tapis pour de bon !', 'ko'),
          f('Alors que vous perdiez le round, un uppercut parfait. K.-O. !', 'ko'),
          f('Un droit désespéré par-dessus arrive plein pot. Rideau !', 'ko'),
          f('Il s\'avance dans votre contre et ne se relève pas !', 'ko'),
          f('Contre le cours du combat, une rafale soudaine et l\'arbitre arrête tout !', 'tko')
        ],
        count3: f('Troisième compte debout du round : l\'arbitre arrête le combat.', 'tko'),
        count4of2: f('Deux comptes de plus dans le round, quatre dans le combat : arrêt.', 'tko'),
        count4: f('Son quatrième compte debout du combat : l\'arbitre arrête tout.', 'tko')
      },
      loss: {
        ko: [
          f('Vous êtes mis K.-O. L\'arbitre arrête tout.', 'ko'),
          f('Un direct du droit vous éteint.', 'ko'),
          f('Un coup au corps vous laisse au tapis pour le compte.', 'ko'),
          f('Un crochet du gauche met fin à votre soirée.', 'ko'),
          f('Vous ne vous relevez pas avant dix.', 'ko')
        ],
        stop: [
          f('Un enchaînement écrasant et l\'arbitre intervient.', 'tko'),
          f('Votre coin jette l\'éponge.', 'tko'),
          f('Bloqué dans les cordes sans répondre : l\'arbitre arrête tout.', 'tko')
        ],
        doctor: [
          f('Votre arcade se rouvre. Le médecin arrête le combat.', 'tko'),
          f('Le médecin revoit votre coupure et arrête tout.', 'tko')
        ],
        surprise: [
          f('Coup surprise ! Un contre sorti de nulle part vous met K.-O. !', 'ko'),
          f('Coup de chance : un crochet et vous êtes au tapis pour de bon !', 'ko'),
          f('Alors que vous gagniez le round, un uppercut parfait. K.-O. !', 'ko'),
          f('Un droit fou par-dessus arrive plein pot. Rideau !', 'ko'),
          f('Vous vous avancez dans son contre et ne vous relevez pas !', 'ko'),
          f('Contre le cours du combat, une rafale soudaine et l\'arbitre arrête tout !', 'tko')
        ],
        count3: f('Troisième compte debout du round : l\'arbitre arrête le combat.', 'tko'),
        count4of2: f('Deux comptes de plus dans le round, quatre dans le combat : arrêt.', 'tko'),
        count4: f('Votre quatrième compte debout du combat : l\'arbitre arrête tout.', 'tko')
      },
      decision: {
        win: (won, total) => `Les juges notent la boxe : vous avez gagné ${won} des ${total} rounds de boxe. Victoire aux points !`,
        loss: (won, total) => `Les juges notent la boxe : votre adversaire a gagné ${won} des ${total} rounds de boxe. Défaite aux points.`
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
  // the fighter who won more of them, so redraw until it does.
  const boxOn = rounds.filter(r => r.type === 'box' && !r.result);
  let leans = boxOn.map(r => drawLean(r.pA, r.pB));
  if (last.decision && boxOn.length) {
    const other = winner === 'you' ? 'them' : 'you';
    const ok = ls => ls.filter(l => l === winner).length > ls.filter(l => l === other).length;
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
      const won = tally[winner];
      const total = boxOn.length;
      rows.push({ text: L.box.decision[winner === 'you' ? 'win' : 'loss'](won, total), result: winner });
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
