// Commentary lines for the "Simulate fight" button, from your point of view.
//
// Rounds that go on are grouped by who had the upper hand (you / even / them)
// and by how close the round came to a finish (calm / hot). Finishes are
// grouped by winner and by whether the finish was expected or a surprise
// (the winner had a low chance to finish in that round). Each finish line
// carries how it ended: mate, time, resign, ko or tko.
//
// 100 chess lines and 100 boxing lines per language.

const f = (t, how) => ({ t, how });

// Lines about a flag falling or seconds left: only possible once a player's
// clock can actually have run out (see earliestTimeRound in main.js).
export const CLOCK_LINE = {
  en: /flag|seconds|time trouble/i,
  fr: /drapeau|secondes|zeitnot/i
};

export const COMMENTARY = {
  en: {
    chess: {
      on: {
        even_calm: [
          'Quiet opening, both keep it solid.',
          'Symmetrical structure, nobody wants to take risks.',
          'Pieces come off the board, still level.',
          'Both players blitz out their preparation.',
          'A slow manoeuvring game, the clocks tick evenly.',
          'Nobody finds a way in; the position stays balanced.',
          'A cautious round at the board, hands still shaking from the ring.',
          'Theory ends and both sides think hard.',
          'Equal material, equal time. Nothing to report.',
          'A tidy queen trade keeps it level.'
        ],
        even_hot: [
          'Both kings are exposed; one slip decides everything.',
          'Wild tactics on both sides, the round ends mid-combination.',
          'Both flags are getting low.',
          'Sacrifice and counter-sacrifice: nobody knows who is winning.',
          'Mutual time trouble, pieces hanging everywhere.',
          'A razor-sharp race of pawn storms.',
          'Both players miss a mate in two. The bell saves everyone.',
          'Opposite-side castling, all-out attack from both.',
          'A queen looks trapped, then escapes at the last second.',
          'The position explodes, but the bell rings first.'
        ],
        you_calm: [
          'You grab the initiative on the board.',
          'You win a pawn and start to squeeze.',
          'Your opponent burns a lot of time.',
          'You get the better structure and a monster knight.',
          'Your preparation hits: you are comfortably better.',
          'You gain space and your opponent runs out of good moves.',
          'A pawn up with the safer king. Going well.',
          'Your opponent looks uncomfortable at the board.',
          'Clean technique: your advantage grows slowly.',
          'You control the open file and the clock.'
        ],
        you_hot: [
          'You are a piece up and hunting the king, but the bell rings.',
          'Mate in three on the board. The round ends one move too early.',
          'Your opponent is down to seconds on the clock.',
          'You win the exchange and their king is naked.',
          'Your attack crashes through; they barely survive the round.',
          'A full rook up. It is only a matter of time.',
          'Their flag is hanging by a thread.',
          'Checks everywhere: they find the only moves to survive.',
          'You fork king and queen. They play on, hoping for the ring.',
          'You are completely winning at the board. Just finish it.'
        ],
        them_calm: [
          'You are under pressure at the board.',
          'You burn a lot of time on your clock.',
          'Your opponent wins a pawn and squeezes.',
          'Your position gets cramped.',
          'You walk straight into their preparation.',
          'Passive pieces and less time on your clock.',
          'Your opponent takes the open file.',
          'Slightly worse, but holding.',
          'Their knight dominates your bishop.',
          'A pawn down with a weaker structure.'
        ],
        them_hot: [
          'A piece down and your king is under fire. Saved by the bell.',
          'Your flag is hanging: seconds left on your clock.',
          'Mate is coming. The bell rings just in time.',
          'You drop the exchange and your king is exposed.',
          'Your opponent misses a mate in two. Lucky you.',
          'A rook down. You need the ring, fast.',
          'Only moves to survive this round.',
          'Your queen is trapped. You play on, praying for the gong.',
          'Their attack is crashing through your kingside.',
          'You are lost at the board. Time to think about knockouts.'
        ]
      },
      win: {
        expected: [
          f('You deliver a clean checkmate.', 'mate'),
          f('Your attack ends in checkmate.', 'mate'),
          f('Your opponent resigns, the position is hopeless.', 'resign'),
          f('Their flag falls: you win on time.', 'time'),
          f('You convert the extra piece and mate.', 'mate'),
          f('Mate with a queen and rook battery.', 'mate'),
          f('Their clock runs out while they look for a defence.', 'time'),
          f('Your opponent stops the clock and shakes your hand.', 'resign'),
          f('A textbook back-rank mate.', 'mate'),
          f('You flag them in a won position.', 'time')
        ],
        surprise: [
          f('Out of nowhere: a stunning queen sacrifice and mate!', 'mate'),
          f('Swindle! Your opponent blunders into mate from a winning position.', 'mate'),
          f('Their flag falls in a completely winning position!', 'time'),
          f('Your opponent resigns after a sudden blunder.', 'resign'),
          f('Smothered mate out of nowhere!', 'mate'),
          f('A desperate trick works: they walk into mate.', 'mate'),
          f('Their clock runs out while they were winning!', 'time'),
          f('You find a hidden mating net nobody saw coming.', 'mate'),
          f('They lose on time with a piece up!', 'time'),
          f('A shock: they overlook mate in one.', 'mate')
        ]
      },
      loss: {
        expected: [
          f('You get checkmated.', 'mate'),
          f('Your king falls to a mating attack.', 'mate'),
          f('You resign, the position is lost.', 'resign'),
          f('Your flag falls: you lose on time.', 'time'),
          f('They convert their extra piece and mate you.', 'mate'),
          f('A clean back-rank mate against you.', 'mate'),
          f('Your clock runs out while you look for a defence.', 'time'),
          f('You stop the clock and shake hands.', 'resign'),
          f('Their queen and rook mate your king.', 'mate'),
          f('You lose on time in a lost position.', 'time')
        ],
        surprise: [
          f('Disaster! You blunder into mate from a winning position.', 'mate'),
          f('A brilliant sacrifice from your opponent ends in mate.', 'mate'),
          f('Your flag falls in a completely winning position!', 'time'),
          f('You resign after a shocking blunder.', 'resign'),
          f('Smothered mate. You did not see it coming.', 'mate'),
          f('They swindle you with a desperate trick.', 'mate'),
          f('Your clock runs out while you were winning!', 'time'),
          f('A hidden mating net closes around your king.', 'mate'),
          f('You lose on time with a piece up!', 'time'),
          f('You overlook mate in one. Ouch.', 'mate')
        ]
      }
    },
    box: {
      on: {
        even_calm: [
          'Both trade jabs, nobody is hurt.',
          'Cautious round, lots of feints.',
          'Scrappy exchanges in the middle of the ring.',
          'Both boxers save energy for the board.',
          'A tactical round: distance, jab, reset.',
          'Even exchanges, neither lands a clean shot.',
          'Plenty of clinching. The referee separates them twice.',
          'Both test the range. Quiet round.',
          'Body shots from both sides, nothing decisive.',
          'A tidy, technical round. The scorecards are close.'
        ],
        even_hot: [
          'Toe-to-toe war! Both are wobbled.',
          'Both land bombs. The crowd is on its feet.',
          'A knockdown each! Wild round.',
          'Both noses bleeding, nobody backs down.',
          'A brawl in the corner, both hurt.',
          'Heavy hooks from both sides, somehow both stay up.',
          'Both boxers take a standing count.',
          'The referee looks close to stopping it, for either of them.',
          'Slugfest: nobody is defending anymore.',
          'Both survive big shots at the bell.'
        ],
        you_calm: [
          'You land a clean combination.',
          'You push them to the ropes.',
          'Your opponent is breathing hard.',
          'Your jab controls the round.',
          'You win the round clearly on points.',
          'Your body shots slow them down.',
          'You slip their punches and counter.',
          'They look tired already.',
          'You dictate the pace. Going well.',
          'Your footwork makes them miss.'
        ],
        you_hot: [
          'Big right hand! They survive a standing count.',
          'Two standing counts against them. The bell saves them.',
          'You floor them, they beat the count.',
          'They are wobbling on the ropes when the bell rings.',
          'Three standing counts... they somehow survive the round.',
          'Their legs are gone. Saved by the bell.',
          'You bust their nose, the doctor takes a look.',
          'A huge uppercut lifts them off their feet. They get up at eight.',
          'The referee is watching closely. One more shot would do it.',
          'They hold on for dear life until the bell.'
        ],
        them_calm: [
          'They land a heavy right hand.',
          'You get pinned on the ropes.',
          'You take a few big shots.',
          'Their jab keeps snapping your head back.',
          'You lose the round clearly on points.',
          'Their body shots take your breath away.',
          'You struggle to find your range.',
          'You are breathing hard already.',
          'They dictate the pace.',
          'You miss a lot and pay for it.'
        ],
        them_hot: [
          'You take a standing count but survive.',
          'Two standing counts against you. Saved by the bell!',
          'You go down, but beat the count.',
          'Wobbling on the ropes when the bell rings.',
          'Three standing counts... you somehow survive the round.',
          'Your legs are gone. The bell rings just in time.',
          'Your nose is bleeding; the doctor takes a look.',
          'A huge uppercut floors you. You get up at eight.',
          'The referee is watching you closely.',
          'You hold on for dear life until the bell.'
        ]
      },
      win: {
        expected: [
          f('Knockout! The referee waves it off.', 'ko'),
          f('Third standing count: the referee stops the fight.', 'tko'),
          f('A crushing combination and they cannot continue.', 'tko'),
          f('Clean knockout with a right hand.', 'ko'),
          f('Their corner throws in the towel.', 'tko'),
          f('A body shot drops them for the count.', 'ko'),
          f('The referee steps in to save them.', 'tko'),
          f('A left hook ends it.', 'ko'),
          f('They cannot beat the count.', 'ko'),
          f('The doctor stops the fight.', 'tko')
        ],
        surprise: [
          f('Surprise punch! A counter out of nowhere knocks them out!', 'ko'),
          f('Lucky punch: one hook and they are down and out!', 'ko'),
          f('Losing the round, you land one perfect uppercut. Knockout!', 'ko'),
          f('A cut opens over their eye. The doctor stops it!', 'tko'),
          f('Out of nowhere, they fold from a body shot!', 'ko'),
          f('Against the run of play, the referee stops it for you!', 'tko'),
          f('A desperate overhand right lands flush. Lights out!', 'ko'),
          f('They slip, walk into your jab and cannot get up!', 'ko'),
          f('The underdog punch: a knockout nobody saw coming!', 'ko'),
          f('Their corner stops it after a sudden flurry!', 'tko')
        ]
      },
      loss: {
        expected: [
          f('You are knocked out. The referee waves it off.', 'ko'),
          f('Third standing count: the referee stops the fight.', 'tko'),
          f('A crushing combination and you cannot continue.', 'tko'),
          f('A right hand knocks you out cold.', 'ko'),
          f('Your corner throws in the towel.', 'tko'),
          f('A body shot drops you for the count.', 'ko'),
          f('The referee steps in to save you.', 'tko'),
          f('A left hook ends your night.', 'ko'),
          f('You cannot beat the count.', 'ko'),
          f('The doctor stops the fight.', 'tko')
        ],
        surprise: [
          f('Surprise punch! A counter out of nowhere knocks you out!', 'ko'),
          f('Lucky punch: one hook and you are down and out!', 'ko'),
          f('Winning the round, you walk into one perfect uppercut. Knockout!', 'ko'),
          f('A cut opens over your eye. The doctor stops it!', 'tko'),
          f('Out of nowhere, a body shot folds you!', 'ko'),
          f('Against the run of play, the referee stops it!', 'tko'),
          f('A wild overhand right lands flush. Lights out!', 'ko'),
          f('You slip, walk into their jab and cannot get up!', 'ko'),
          f('The underdog punch: a knockout nobody saw coming!', 'ko'),
          f('Your corner stops it after a sudden flurry!', 'tko')
        ]
      }
    },
    draw: {
      win: [
        'The chess game ends in a draw. The boxing points decide: you win!',
        'Draw by repetition at the board. Your work in the ring wins it on points.',
        'Bare kings, a draw. The judges score the boxing for you.'
      ],
      loss: [
        'The chess game ends in a draw. The boxing points go to your opponent.',
        'Draw by repetition at the board. Their work in the ring wins it on points.',
        'Bare kings, a draw. The judges score the boxing for them.'
      ]
    }
  },

  fr: {
    chess: {
      on: {
        even_calm: [
          'Ouverture calme, chacun reste solide.',
          'Structure symétrique, personne ne veut prendre de risque.',
          'Les pièces s\'échangent, toujours égal.',
          'Les deux joueurs récitent leur préparation.',
          'Partie de manœuvres lente, les pendules tournent au même rythme.',
          'Personne ne trouve de faille, la position reste équilibrée.',
          'Round prudent sur l\'échiquier, les mains tremblent encore du ring.',
          'Fin de la théorie, les deux réfléchissent longuement.',
          'Matériel égal, temps égal. Rien à signaler.',
          'Un échange de dames propre garde l\'équilibre.'
        ],
        even_hot: [
          'Les deux rois sont exposés, une erreur décidera de tout.',
          'Tactiques folles des deux côtés, le round s\'arrête en pleine combinaison.',
          'Les deux drapeaux sont bas.',
          'Sacrifice et contre-sacrifice : personne ne sait qui gagne.',
          'Zeitnot mutuel, des pièces en prise partout.',
          'Course effrénée de poussées de pions.',
          'Les deux ratent un mat en deux. Le gong sauve tout le monde.',
          'Roques opposés, attaque totale des deux côtés.',
          'Une dame semble enfermée, puis s\'échappe au dernier moment.',
          'La position explose, mais le gong sonne avant.'
        ],
        you_calm: [
          'Vous prenez l\'initiative sur l\'échiquier.',
          'Vous gagnez un pion et serrez la vis.',
          'Votre adversaire consomme beaucoup de temps.',
          'Vous obtenez la meilleure structure et un cavalier monstrueux.',
          'Votre préparation fait mouche : vous êtes nettement mieux.',
          'Vous gagnez de l\'espace, votre adversaire manque de bons coups.',
          'Un pion de plus et le roi le plus sûr. Ça se passe bien.',
          'Votre adversaire a l\'air mal à l\'aise sur l\'échiquier.',
          'Technique propre : votre avantage grandit lentement.',
          'Vous contrôlez la colonne ouverte et la pendule.'
        ],
        you_hot: [
          'Une pièce de plus et vous traquez le roi, mais le gong sonne.',
          'Mat en trois sur l\'échiquier. Le round finit un coup trop tôt.',
          'Votre adversaire n\'a plus que quelques secondes.',
          'Vous gagnez la qualité et son roi est à nu.',
          'Votre attaque passe ; il survit de justesse au round.',
          'Une tour de plus. Ce n\'est qu\'une question de temps.',
          'Son drapeau ne tient qu\'à un fil.',
          'Échecs de partout : il trouve les seuls coups pour survivre.',
          'Fourchette roi-dame. Il continue en espérant le ring.',
          'Vous êtes totalement gagnant sur l\'échiquier. Il faut conclure.'
        ],
        them_calm: [
          'Vous êtes sous pression sur l\'échiquier.',
          'Vous consommez beaucoup de temps.',
          'Votre adversaire gagne un pion et serre la vis.',
          'Votre position devient étriquée.',
          'Vous tombez en plein dans sa préparation.',
          'Pièces passives et moins de temps à la pendule.',
          'Votre adversaire prend la colonne ouverte.',
          'Légèrement moins bien, mais vous tenez.',
          'Son cavalier domine votre fou.',
          'Un pion de moins et une structure plus faible.'
        ],
        them_hot: [
          'Une pièce de moins et votre roi sous le feu. Sauvé par le gong.',
          'Votre drapeau vacille : quelques secondes à la pendule.',
          'Le mat arrive. Le gong sonne juste à temps.',
          'Vous perdez la qualité et votre roi est exposé.',
          'Votre adversaire rate un mat en deux. Quelle chance.',
          'Une tour de moins. Il vous faut le ring, et vite.',
          'Seuls coups pour survivre à ce round.',
          'Votre dame est enfermée. Vous jouez en priant pour le gong.',
          'Son attaque enfonce votre aile roi.',
          'Perdu sur l\'échiquier. Il est temps de penser au K.-O.'
        ]
      },
      win: {
        expected: [
          f('Vous donnez un mat propre.', 'mate'),
          f('Votre attaque se termine par un mat.', 'mate'),
          f('Votre adversaire abandonne, la position est désespérée.', 'resign'),
          f('Son drapeau tombe : victoire au temps.', 'time'),
          f('Vous convertissez la pièce de plus et matez.', 'mate'),
          f('Mat avec la batterie dame-tour.', 'mate'),
          f('Sa pendule tombe pendant qu\'il cherche une défense.', 'time'),
          f('Votre adversaire arrête la pendule et vous serre la main.', 'resign'),
          f('Un mat du couloir de manuel.', 'mate'),
          f('Vous le faites tomber au temps dans une position gagnée.', 'time')
        ],
        surprise: [
          f('Surgi de nulle part : un sacrifice de dame et mat !', 'mate'),
          f('Arnaque ! Votre adversaire gaffe et se fait mater en position gagnante.', 'mate'),
          f('Son drapeau tombe dans une position totalement gagnante !', 'time'),
          f('Votre adversaire abandonne après une gaffe soudaine.', 'resign'),
          f('Mat de l\'étouffé sorti de nulle part !', 'mate'),
          f('Un piège désespéré fonctionne : il tombe dans le mat.', 'mate'),
          f('Sa pendule tombe alors qu\'il gagnait !', 'time'),
          f('Vous trouvez un filet de mat que personne n\'avait vu.', 'mate'),
          f('Il perd au temps avec une pièce de plus !', 'time'),
          f('Coup de théâtre : il rate un mat en un.', 'mate')
        ]
      },
      loss: {
        expected: [
          f('Vous êtes mat.', 'mate'),
          f('Votre roi tombe sous une attaque de mat.', 'mate'),
          f('Vous abandonnez, la position est perdue.', 'resign'),
          f('Votre drapeau tombe : défaite au temps.', 'time'),
          f('Il convertit sa pièce de plus et vous mate.', 'mate'),
          f('Un mat du couloir propre contre vous.', 'mate'),
          f('Votre pendule tombe pendant que vous cherchez une défense.', 'time'),
          f('Vous arrêtez la pendule et serrez la main.', 'resign'),
          f('Sa dame et sa tour matent votre roi.', 'mate'),
          f('Vous perdez au temps dans une position perdue.', 'time')
        ],
        surprise: [
          f('Catastrophe ! Vous gaffez et vous faites mater en position gagnante.', 'mate'),
          f('Un sacrifice brillant de votre adversaire finit en mat.', 'mate'),
          f('Votre drapeau tombe dans une position totalement gagnante !', 'time'),
          f('Vous abandonnez après une gaffe incroyable.', 'resign'),
          f('Mat de l\'étouffé. Vous ne l\'avez pas vu venir.', 'mate'),
          f('Il vous arnaque avec un piège désespéré.', 'mate'),
          f('Votre pendule tombe alors que vous gagniez !', 'time'),
          f('Un filet de mat caché se referme sur votre roi.', 'mate'),
          f('Vous perdez au temps avec une pièce de plus !', 'time'),
          f('Vous ratez un mat en un contre vous. Aïe.', 'mate')
        ]
      }
    },
    box: {
      on: {
        even_calm: [
          'Échange de jabs, personne n\'est touché.',
          'Round prudent, beaucoup de feintes.',
          'Échanges brouillons au centre du ring.',
          'Les deux boxeurs gardent des forces pour l\'échiquier.',
          'Round tactique : distance, jab, on recommence.',
          'Échanges équilibrés, aucun coup net.',
          'Beaucoup d\'accrochages. L\'arbitre les sépare deux fois.',
          'Les deux testent la distance. Round calme.',
          'Coups au corps des deux côtés, rien de décisif.',
          'Round propre et technique. Les cartes sont serrées.'
        ],
        even_hot: [
          'Guerre de tranchées ! Les deux vacillent.',
          'Les deux placent des bombes. La salle est debout.',
          'Un knockdown chacun ! Round fou.',
          'Les deux saignent du nez, personne ne recule.',
          'Bagarre dans le coin, les deux sont touchés.',
          'Gros crochets des deux côtés, par miracle les deux tiennent.',
          'Les deux boxeurs prennent un compte debout.',
          'L\'arbitre semble prêt à arrêter, pour l\'un comme pour l\'autre.',
          'Pugilat : plus personne ne défend.',
          'Les deux encaissent de gros coups au gong.'
        ],
        you_calm: [
          'Vous placez un enchaînement propre.',
          'Vous le poussez dans les cordes.',
          'Votre adversaire est essoufflé.',
          'Votre jab contrôle le round.',
          'Vous gagnez nettement le round aux points.',
          'Vos coups au corps le ralentissent.',
          'Vous esquivez et contrez.',
          'Il a déjà l\'air fatigué.',
          'Vous imposez le rythme. Ça se passe bien.',
          'Votre jeu de jambes le fait rater.'
        ],
        you_hot: [
          'Gros direct du droit ! Il survit à un compte debout.',
          'Deux comptes debout contre lui. Sauvé par le gong.',
          'Vous l\'envoyez au tapis, il se relève avant dix.',
          'Il vacille dans les cordes quand le gong sonne.',
          'Trois comptes debout... il survit au round on ne sait comment.',
          'Ses jambes ne suivent plus. Sauvé par le gong.',
          'Vous lui cassez le nez, le médecin jette un œil.',
          'Un énorme uppercut le soulève. Il se relève à huit.',
          'L\'arbitre surveille de près. Un coup de plus suffirait.',
          'Il s\'accroche désespérément jusqu\'au gong.'
        ],
        them_calm: [
          'Il place un gros direct du droit.',
          'Vous êtes bloqué dans les cordes.',
          'Vous encaissez quelques gros coups.',
          'Son jab vous renvoie la tête en arrière.',
          'Vous perdez nettement le round aux points.',
          'Ses coups au corps vous coupent le souffle.',
          'Vous peinez à trouver la distance.',
          'Vous êtes déjà essoufflé.',
          'Il impose le rythme.',
          'Vous ratez beaucoup et vous le payez.'
        ],
        them_hot: [
          'Vous prenez un compte debout mais tenez.',
          'Deux comptes debout contre vous. Sauvé par le gong !',
          'Vous allez au tapis, mais vous vous relevez à temps.',
          'Vous vacillez dans les cordes quand le gong sonne.',
          'Trois comptes debout... vous survivez au round on ne sait comment.',
          'Vos jambes ne suivent plus. Le gong sonne juste à temps.',
          'Votre nez saigne, le médecin jette un œil.',
          'Un énorme uppercut vous envoie au tapis. Vous vous relevez à huit.',
          'L\'arbitre vous surveille de près.',
          'Vous vous accrochez désespérément jusqu\'au gong.'
        ]
      },
      win: {
        expected: [
          f('K.-O. ! L\'arbitre arrête tout.', 'ko'),
          f('Troisième compte debout : l\'arbitre arrête le combat.', 'tko'),
          f('Un enchaînement écrasant, il ne peut pas continuer.', 'tko'),
          f('K.-O. net sur un direct du droit.', 'ko'),
          f('Son coin jette l\'éponge.', 'tko'),
          f('Un coup au corps le laisse au tapis pour le compte.', 'ko'),
          f('L\'arbitre intervient pour le protéger.', 'tko'),
          f('Un crochet du gauche met fin au combat.', 'ko'),
          f('Il ne se relève pas avant dix.', 'ko'),
          f('Le médecin arrête le combat.', 'tko')
        ],
        surprise: [
          f('Coup surprise ! Un contre sorti de nulle part le met K.-O. !', 'ko'),
          f('Coup de chance : un crochet et il est au tapis pour de bon !', 'ko'),
          f('Alors que vous perdiez le round, un uppercut parfait. K.-O. !', 'ko'),
          f('Une coupure au-dessus de son œil. Le médecin arrête tout !', 'tko'),
          f('Sorti de nulle part, un coup au corps le plie en deux !', 'ko'),
          f('Contre le cours du combat, l\'arbitre arrête en votre faveur !', 'tko'),
          f('Un droit désespéré par-dessus arrive plein pot. Rideau !', 'ko'),
          f('Il glisse, prend votre jab et ne se relève pas !', 'ko'),
          f('Le coup de l\'outsider : un K.-O. que personne n\'attendait !', 'ko'),
          f('Son coin arrête tout après une rafale soudaine !', 'tko')
        ]
      },
      loss: {
        expected: [
          f('Vous êtes mis K.-O. L\'arbitre arrête tout.', 'ko'),
          f('Troisième compte debout : l\'arbitre arrête le combat.', 'tko'),
          f('Un enchaînement écrasant, vous ne pouvez pas continuer.', 'tko'),
          f('Un direct du droit vous éteint.', 'ko'),
          f('Votre coin jette l\'éponge.', 'tko'),
          f('Un coup au corps vous laisse au tapis pour le compte.', 'ko'),
          f('L\'arbitre intervient pour vous protéger.', 'tko'),
          f('Un crochet du gauche met fin à votre soirée.', 'ko'),
          f('Vous ne vous relevez pas avant dix.', 'ko'),
          f('Le médecin arrête le combat.', 'tko')
        ],
        surprise: [
          f('Coup surprise ! Un contre sorti de nulle part vous met K.-O. !', 'ko'),
          f('Coup de chance : un crochet et vous êtes au tapis pour de bon !', 'ko'),
          f('Alors que vous gagniez le round, un uppercut parfait. K.-O. !', 'ko'),
          f('Une coupure au-dessus de votre œil. Le médecin arrête tout !', 'tko'),
          f('Sorti de nulle part, un coup au corps vous plie en deux !', 'ko'),
          f('Contre le cours du combat, l\'arbitre arrête tout !', 'tko'),
          f('Un droit fou par-dessus arrive plein pot. Rideau !', 'ko'),
          f('Vous glissez, prenez son jab et ne vous relevez pas !', 'ko'),
          f('Le coup de l\'outsider : un K.-O. que personne n\'attendait !', 'ko'),
          f('Votre coin arrête tout après une rafale soudaine !', 'tko')
        ]
      }
    },
    draw: {
      win: [
        'La partie d\'échecs est nulle. Les points de boxe décident : vous gagnez !',
        'Nulle par répétition sur l\'échiquier. Votre travail sur le ring l\'emporte aux points.',
        'Rois dépouillés, nulle. Les juges donnent la boxe pour vous.'
      ],
      loss: [
        'La partie d\'échecs est nulle. Les points de boxe vont à votre adversaire.',
        'Nulle par répétition sur l\'échiquier. Son travail sur le ring l\'emporte aux points.',
        'Rois dépouillés, nulle. Les juges donnent la boxe pour lui.'
      ]
    }
  }
};
