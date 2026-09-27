import { MATCHMAKING_CONSTRAINTS } from './model.js';

const C = MATCHMAKING_CONSTRAINTS.strict;
const frNum = v => String(v).replace('.', ',');

export const i18n = {
  en: {
    tagline: "Where do you stand in the ring?",
    rounds: "Rounds",

    // You
    you_title: "You",
    chess: "Chess",
    boxing: "Boxing",
    rating_title: "Your chessboxing rating",
    top: "Top",
    of_fighters: "of all fighter profiles",
    type_tactician: "Tactician",
    type_brawler: "Brawler",
    type_balanced: "Balanced fighter",
    type_complete: "Complete fighter",
    type_tactician_desc: "Wins at the board",
    type_brawler_desc: "Wins in the ring",
    type_balanced_desc: "No clear weak spot",
    type_complete_desc: "Strong everywhere",
    more_stars: "Fastest way to more stars",
    plus_box: "+1 boxing level",
    plus_chess: "+230 ELO",
    maxed: "max",
    more_stars_box: (d) => `Boxing is your biggest lever: one level up is worth +${d} stars.`,
    more_stars_chess: (d) => `Chess is your biggest lever: +230 ELO is worth +${d} stars.`,
    more_stars_even: "Chess and boxing are worth about the same to you right now.",
    more_stars_max: "You are at the top of the scale.",

    // Opponent
    opp_title: "Opponent",
    known_fighters: "Pick a known fighter",

    // Matchup
    matchup_title: "The fight",
    your_pieces: "Your pieces",
    white: "White",
    black: "Black",
    not_drawn: "Not drawn",
    color_compare: (w, b) => `With white ${w} · with black ${b}`,
    chance_win: "chance you win",
    v_fav_clear: "Clear favourite",
    v_fav: "Favourite",
    v_even: "Even fight",
    v_under: "Underdog",
    v_long: "Long shot",
    how_ends: "How the fight ends",
    win_ring: "You win in the ring",
    win_board: "You win at the board",
    lose_board: "You lose at the board",
    lose_ring: "You lose in the ring",
    expected_len: "Expected length",
    of_rounds: (e, n) => `${e} of ${n} rounds`,
    early_hint: "likely early stoppage",
    distance_hint: "likely goes the distance",
    game_plan: "Game plan",
    edge_you: "Your edge is",
    edge_opp: "Theirs is",
    edge_same: (d) => `You both win mostly by ${d}.`,
    best_rounds: "Your best rounds",
    danger_rounds: "Danger rounds",
    train_title: "To beat this opponent, train",
    simulate: "Simulate fight",
    simulate_again: "Simulate again",
    sim_title: "Simulated fight",
    sim_note: "One random fight drawn from the chances above. Just for fun.",
    sim_colors: (you) => `Coin toss: you play ${you}.`,
    sim_white: "white",
    sim_black: "black",
    sim_round: (n) => `Round ${n}`,
    sim_decision: "Judges' decision",
    sim_chess_on: ["Quiet opening, both keep it solid.", "Sharp position, nobody blinks.", "Pieces traded, the clocks keep ticking.", "A tense middlegame, still level-ish."],
    sim_chess_you_better: ["You grab the initiative on the board.", "Your opponent burns a lot of time.", "You win a pawn and squeeze."],
    sim_chess_they_better: ["You are under pressure on the board.", "You burn a lot of time on your clock.", "Your opponent wins a pawn and squeezes."],
    sim_box_on: ["Both trade jabs, nobody is hurt.", "Cautious round, lots of feints.", "Scrappy exchanges in the middle of the ring."],
    sim_box_you_better: ["You land a clean combination.", "You push them to the ropes.", "Your opponent is breathing hard."],
    sim_box_they_better: ["They land a heavy right hand.", "You get pinned on the ropes.", "You take a few big shots."],
    sim_win_mate: "You deliver checkmate!",
    sim_win_time: "Your opponent's flag falls: you win on time!",
    sim_win_ko: "Knockout! The referee stops the fight.",
    sim_win_points: "The judges give you the fight on points.",
    sim_loss_mate: "You get checkmated.",
    sim_loss_time: "Your flag falls: you lose on time.",
    sim_loss_ko: "You are knocked out. The referee stops the fight.",
    sim_loss_points: "The judges give the fight to your opponent.",
    sim_final_win: (how, r) => `You win ${how}, round ${r}.`,
    sim_final_loss: (how, r) => `You lose ${how}, round ${r}.`,
    sim_final_win_points: "You win on points.",
    sim_final_loss_points: "You lose on points.",
    sim_by_mate: "by checkmate",
    sim_by_time: "on time",
    sim_by_ko: "by knockout",
    board_word: "chess",
    ring_word: "boxing",

    // Details
    details_rounds: "Round by round",
    details_rounds_hint: "Chance the fight ends in each round, and who wins it. The last row is the boxing decision if nobody has won yet.",
    col_round: "Round",
    col_you_they: "You win · They win",
    col_still: "Still on",
    decision: "Dec.",
    details_map: "Chances map",
    details_map_hint: "Every possible opponent. Colour is your win chance. Tap a square to fight that opponent.",
    strict_matchmaking: "Good Matchmaking",
    early_stoppage_zone: "Early Stoppage Zone",
    rule_strict: (minRnds) => `<b>Good matchmaking:</b> Boxing diff ≤ ${C.boxDiffMax} lvl. Win prob ${C.minWinProb * 100}%–${C.maxWinProb * 100}%. Expected rounds ≥ ${minRnds}.`,
    rule_early_stoppage: (minRnds) => `<b>Early Stoppage:</b> Expected rounds < ${minRnds}.`,
    early_win: "Early win",
    early_loss: "Early loss",
    you: "You",
    even: "50 % (even)",
    details_method: "How the numbers work",
    method_html: (v) => `
<h3>1. Two ratings on an even scale</h3>
<p>Chess uses ELO: one chess level is 229 ELO (800 to 2400). Boxing uses levels 0 to 5 (Novice to Professional). Both scales are even: each step multiplies your odds by the same amount, whatever level you start from.</p>
<h3>2. Every round has three outcomes</h3>
<p>You win the round (at the board: mate, time or resignation; in the ring: stoppage), your opponent wins it, or the fight goes on. Their chances are in the ratio:</p>
<span class="formula">you win : they win : fight goes on = e^(+s) : e^(−s) : k
s = a × (your level − their level)
    chess levels in chess rounds, boxing levels in boxing rounds</span>
<p><b>a</b> is how much the level gap matters in that round. <b>k</b> is how hard it is to finish the fight in that round: early chess rounds have a large k because games rarely end there. The final boxing decision has k = 0, so someone always wins it on points.</p>
<h3>3. Rounds are chained</h3>
<span class="formula">P(you win round r)   = P(still on before r) × e^s / (e^s + e^−s + k)
P(still on after r)  = P(still on before r) × k / (e^s + e^−s + k)
P(you win the fight) = sum over all rounds</span>
<h3>4. Where the round values come from</h3>
<p>7 rounds: fitted on a table of per-round probabilities. 11 rounds: set by hand. 9 and 5 rounds: derived from those two. Some chess rounds carry an extra bias, such as round 3 in 5-round fights and round 5 in 7-round fights, where a stronger chess player can force a win on time. More rounds give the better boxer more chances in the ring and the weaker chess player more time to stall.</p>
<h3>5. Adjusted to the fighters' level</h3>
<p>The fitted values describe a club-level fight (about 1486 ELO, Amateur boxers). Other levels use the two fighters' average chess level <b>m</b> (0–7) and boxing level <b>n</b> (0–5):</p>
<span class="formula">chess rounds:  k × e^(0.2 × (m − 3))    longer games between strong players
               × e^(−0.5 × |chess gap|) from round 3: a big mismatch collapses fast
                                        (not round 1: players stall in the opening)
boxing rounds: k × e^(−0.4 × (n − 2))  more stoppages between strong boxers
               × 4 × e^(−0.9 × |boxing gap|)  close boxers go long,
                                        a big mismatch is a quick knockout
boxing below level 1: counts as b − 1.5 × (1 − b) in the ring
               (never really sparred: very easy to knock out)
white edge:    s + w for white, s − w for black
               w = 0.1 × min(1, 0.2 + 0.8 × m / 5)</span>
<p>In this fight: m = <b>${v.m}</b>, chess gap <b>${v.gap}</b> levels, n = <b>${v.n}</b>, boxing gap <b>${v.bgap}</b>, so chess k × <b>${v.kc}</b> from round 3, boxing k × <b>${v.kb}</b> and white edge w = <b>${v.w}</b>.</p>
<h3>6. Colours</h3>
<p>With White or Black selected, the white edge goes to you or to your opponent. "Not drawn" averages both cases.</p>
<h3>7. Stars</h3>
<p>Every possible profile (36 chess × 26 boxing steps) fights every other one with colours not drawn. Profiles are ranked by how many others they beat with more than 50 %, and that rank becomes 0 to 5 stars. "More stars always wins" cannot hold for every pair because the model has rock-paper-scissors cycles, but being about 1.2 stars ahead or more always makes you the favourite.</p>
<h3>8. This fight, round by round</h3>`,
    mt_round: "Round",
    mt_type: "Type",
    mt_a: "a",
    mt_k: "k fitted",
    mt_k_fight: "k here",
    mt_win: "You win",
    mt_loss: "They win",
    mt_cont: "Still on",
    mt_chess: "Chess",
    mt_box: "Boxing",
    mt_note: (fmt, side) => `${fmt} rounds, ${side}. "You win" and "They win" are the chances that the fight ends in that round with that winner.`,
    side_white: "you play white",
    side_black: "you play black",
    side_none: "colours not drawn",

    // Fighters
    fighters_title: "Fighters",
    fighters_hint: "Tap a fighter to set them as your opponent.",
    col_fighter: "Fighter",
    col_rating: "Rating",
    col_you_win: "You win",

    lvl: "lvl",
    color_legend: "Opponent grid — color = your win probability",
    chess_axis: "Chess level  (ELO)",
    box_axis: "Boxing level",
    chess_names: [
      { short: 'Total Beginner', sub: '800 ELO' },
      { short: 'Beginner', sub: '1028 ELO' },
      { short: 'Casual Player', sub: '1257 ELO' },
      { short: 'Club Player', sub: '1485 ELO' },
      { short: 'Strong Club', sub: '1714 ELO' },
      { short: 'Expert', sub: '1942 ELO' },
      { short: 'Master', sub: '2171 ELO' },
      { short: 'Elite / GM', sub: '2400 ELO' }
    ],
    boxing_names: [
      { short: 'Novice', sub: 'Never sparred' },
      { short: 'Beginner', sub: 'Gym < 1 year' },
      { short: 'Amateur', sub: '1–3 yrs training' },
      { short: 'Regional', sub: 'First amateur bouts' },
      { short: 'Semi-Pro', sub: '10+ fights' },
      { short: 'Professional', sub: '40+ fights or pro' }
    ]
  },
  fr: {
    tagline: "Où vous situez-vous sur le ring ?",
    rounds: "Rounds",

    you_title: "Vous",
    chess: "Échecs",
    boxing: "Boxe",
    rating_title: "Votre note de chessboxing",
    top: "Top",
    of_fighters: "de tous les profils",
    type_tactician: "Tacticien",
    type_brawler: "Cogneur",
    type_balanced: "Combattant équilibré",
    type_complete: "Combattant complet",
    type_tactician_desc: "Gagne sur l'échiquier",
    type_brawler_desc: "Gagne sur le ring",
    type_balanced_desc: "Pas de point faible net",
    type_complete_desc: "Fort partout",
    more_stars: "Le plus court chemin vers plus d'étoiles",
    plus_box: "+1 niveau de boxe",
    plus_chess: "+230 ELO",
    maxed: "max",
    more_stars_box: (d) => `La boxe est votre meilleur levier : un niveau de plus vaut +${frNum(d)} étoile(s).`,
    more_stars_chess: (d) => `Les échecs sont votre meilleur levier : +230 ELO valent +${frNum(d)} étoile(s).`,
    more_stars_even: "Échecs et boxe vous rapportent à peu près autant en ce moment.",
    more_stars_max: "Vous êtes en haut de l'échelle.",

    opp_title: "Adversaire",
    known_fighters: "Choisir un combattant connu",

    matchup_title: "Le combat",
    your_pieces: "Vos pièces",
    white: "Blancs",
    black: "Noirs",
    not_drawn: "Pas tiré",
    color_compare: (w, b) => `Avec les blancs ${w} · avec les noirs ${b}`,
    chance_win: "de chances de gagner",
    v_fav_clear: "Grand favori",
    v_fav: "Favori",
    v_even: "Combat équilibré",
    v_under: "Outsider",
    v_long: "Peu probable",
    how_ends: "Comment finit le combat",
    win_ring: "Vous gagnez sur le ring",
    win_board: "Vous gagnez sur l'échiquier",
    lose_board: "Vous perdez sur l'échiquier",
    lose_ring: "Vous perdez sur le ring",
    expected_len: "Durée estimée",
    of_rounds: (e, n) => `${frNum(e)} rounds sur ${n}`,
    early_hint: "arrêt précoce probable",
    distance_hint: "va probablement à la décision",
    game_plan: "Plan de combat",
    edge_you: "Votre avantage :",
    edge_opp: "Le sien :",
    edge_same: (d) => `Vous gagnez tous les deux surtout en ${d}.`,
    best_rounds: "Vos meilleurs rounds",
    danger_rounds: "Rounds dangereux",
    train_title: "Pour battre cet adversaire, travaillez",
    simulate: "Simuler le combat",
    simulate_again: "Simuler à nouveau",
    sim_title: "Combat simulé",
    sim_note: "Un combat tiré au hasard selon les chances ci-dessus. Pour le plaisir.",
    sim_colors: (you) => `Tirage au sort : vous avez les ${you}.`,
    sim_white: "blancs",
    sim_black: "noirs",
    sim_round: (n) => `Round ${n}`,
    sim_decision: "Décision des juges",
    sim_chess_on: ["Ouverture calme, chacun reste solide.", "Position tendue, personne ne cède.", "Échanges de pièces, les pendules tournent.", "Milieu de partie tendu, à peu près égal."],
    sim_chess_you_better: ["Vous prenez l'initiative sur l'échiquier.", "Votre adversaire consomme beaucoup de temps.", "Vous gagnez un pion et vous serrez la vis."],
    sim_chess_they_better: ["Vous êtes sous pression sur l'échiquier.", "Vous consommez beaucoup de temps.", "Votre adversaire gagne un pion et serre la vis."],
    sim_box_on: ["Échange de jabs, personne n'est touché.", "Round prudent, beaucoup de feintes.", "Échanges brouillons au centre du ring."],
    sim_box_you_better: ["Vous placez un enchaînement propre.", "Vous le poussez dans les cordes.", "Votre adversaire est essoufflé."],
    sim_box_they_better: ["Il place un gros direct du droit.", "Vous êtes bloqué dans les cordes.", "Vous encaissez quelques gros coups."],
    sim_win_mate: "Échec et mat !",
    sim_win_time: "Le drapeau de votre adversaire tombe : victoire au temps !",
    sim_win_ko: "K.-O. ! L'arbitre arrête le combat.",
    sim_win_points: "Les juges vous donnent la victoire aux points.",
    sim_loss_mate: "Vous êtes mat.",
    sim_loss_time: "Votre drapeau tombe : défaite au temps.",
    sim_loss_ko: "Vous êtes mis K.-O. L'arbitre arrête le combat.",
    sim_loss_points: "Les juges donnent la victoire à votre adversaire.",
    sim_final_win: (how, r) => `Vous gagnez ${how}, round ${r}.`,
    sim_final_loss: (how, r) => `Vous perdez ${how}, round ${r}.`,
    sim_final_win_points: "Vous gagnez aux points.",
    sim_final_loss_points: "Vous perdez aux points.",
    sim_by_mate: "par mat",
    sim_by_time: "au temps",
    sim_by_ko: "par K.-O.",
    board_word: "échecs",
    ring_word: "boxe",

    details_rounds: "Round par round",
    details_rounds_hint: "Chance que le combat se termine à chaque round, et qui le gagne. La dernière ligne est la décision aux points de boxe.",
    col_round: "Round",
    col_you_they: "Vous · Adversaire",
    col_still: "En cours",
    decision: "Déc.",
    details_map: "Carte des chances",
    details_map_hint: "Tous les adversaires possibles. La couleur est votre chance de victoire. Touchez une case pour affronter cet adversaire.",
    strict_matchmaking: "Bon matchmaking",
    early_stoppage_zone: "Zone d'arrêt précoce",
    rule_strict: (minRnds) => `<b>Bon matchmaking :</b> Diff. boxe ≤ ${C.boxDiffMax} niv. Victoire ${C.minWinProb * 100}%–${C.maxWinProb * 100}%. Rounds attendus ≥ ${minRnds}.`,
    rule_early_stoppage: (minRnds) => `<b>Arrêt Précoce :</b> Rounds attendus < ${minRnds}.`,
    early_win: "Victoire rapide",
    early_loss: "Défaite rapide",
    you: "Vous",
    even: "50 % (égal)",
    details_method: "Comment sont calculés les chiffres",
    method_html: (v) => `
<h3>1. Deux classements sur une échelle régulière</h3>
<p>Les échecs utilisent l'ELO : un niveau d'échecs vaut 229 ELO (800 à 2400). La boxe utilise des niveaux de 0 à 5 (Novice à Professionnel). Les deux échelles sont régulières : chaque palier multiplie vos chances par le même facteur, quel que soit votre niveau de départ.</p>
<h3>2. Chaque round a trois issues</h3>
<p>Vous gagnez le round (sur l'échiquier : mat, temps ou abandon ; sur le ring : arrêt), votre adversaire le gagne, ou le combat continue. Leurs chances sont dans le rapport :</p>
<span class="formula">vous gagnez : il gagne : le combat continue = e^(+s) : e^(−s) : k
s = a × (votre niveau − son niveau)
    niveau d'échecs aux rounds d'échecs, de boxe aux rounds de boxe</span>
<p><b>a</b> mesure l'importance de l'écart de niveau dans ce round. <b>k</b> mesure la difficulté de finir le combat dans ce round : les premiers rounds d'échecs ont un k élevé car les parties s'y terminent rarement. La décision finale de boxe a k = 0 : quelqu'un la gagne toujours aux points.</p>
<h3>3. Les rounds s'enchaînent</h3>
<span class="formula">P(vous gagnez au round r) = P(en cours avant r) × e^s / (e^s + e^−s + k)
P(en cours après r)       = P(en cours avant r) × k / (e^s + e^−s + k)
P(vous gagnez le combat)  = somme sur tous les rounds</span>
<h3>4. D'où viennent les valeurs des rounds</h3>
<p>7 rounds : ajustés sur une table de probabilités par round. 11 rounds : fixés à la main. 9 et 5 rounds : dérivés des deux. Certains rounds d'échecs ont un biais en plus, comme le round 3 en 5 rounds et le round 5 en 7 rounds, où un meilleur joueur d'échecs peut forcer la victoire au temps. Plus de rounds donnent plus d'occasions au meilleur boxeur et plus de temps au joueur d'échecs plus faible pour gagner du temps.</p>
<h3>5. Ajusté au niveau des combattants</h3>
<p>Les valeurs ajustées décrivent un combat de niveau club (environ 1486 ELO, boxeurs Amateur). Pour les autres niveaux, on utilise le niveau moyen d'échecs <b>m</b> (0–7) et de boxe <b>n</b> (0–5) des deux combattants :</p>
<span class="formula">rounds d'échecs : k × e^(0,2 × (m − 3))    parties plus longues entre forts joueurs
                  × e^(−0,5 × |écart échecs|) dès le round 3 : un gros écart finit vite
                                             (pas au round 1 : on temporise dans l'ouverture)
rounds de boxe :  k × e^(−0,4 × (n − 2))   plus d'arrêts entre forts boxeurs
                  × 4 × e^(−0,9 × |écart boxe|)  boxeurs proches : combat long,
                                             gros écart : K.-O. rapide
boxe sous le niveau 1 : compte comme b − 1,5 × (1 − b) sur le ring
                  (jamais vraiment sparré : très facile à mettre K.-O.)
avantage blancs : s + w pour les blancs, s − w pour les noirs
                  w = 0,1 × min(1 ; 0,2 + 0,8 × m / 5)</span>
<p>Dans ce combat : m = <b>${v.m}</b>, écart d'échecs <b>${v.gap}</b> niveaux, n = <b>${v.n}</b>, écart de boxe <b>${v.bgap}</b>, donc k échecs × <b>${v.kc}</b> dès le round 3, k boxe × <b>${v.kb}</b> et avantage blancs w = <b>${v.w}</b>.</p>
<h3>6. Couleurs</h3>
<p>Avec Blancs ou Noirs sélectionné, l'avantage des blancs va à vous ou à votre adversaire. « Pas tiré » fait la moyenne des deux cas.</p>
<h3>7. Étoiles</h3>
<p>Chaque profil possible (36 paliers d'échecs × 26 de boxe) affronte tous les autres, couleurs non tirées. Les profils sont classés selon le nombre d'autres profils qu'ils battent à plus de 50 %, et ce rang donne 0 à 5 étoiles. « Plus d'étoiles gagne toujours » ne peut pas être vrai pour chaque paire car le modèle a des cycles pierre-feuille-ciseaux, mais avec environ 1,2 étoile d'avance ou plus, vous êtes toujours favori.</p>
<h3>8. Ce combat, round par round</h3>`,
    mt_round: "Round",
    mt_type: "Type",
    mt_a: "a",
    mt_k: "k ajusté",
    mt_k_fight: "k ici",
    mt_win: "Vous",
    mt_loss: "Adv.",
    mt_cont: "En cours",
    mt_chess: "Échecs",
    mt_box: "Boxe",
    mt_note: (fmt, side) => `${fmt} rounds, ${side}. « Vous » et « Adv. » sont les chances que le combat se termine à ce round avec ce vainqueur.`,
    side_white: "vous avez les blancs",
    side_black: "vous avez les noirs",
    side_none: "couleurs non tirées",

    fighters_title: "Combattants",
    fighters_hint: "Touchez un combattant pour l'affronter.",
    col_fighter: "Combattant",
    col_rating: "Note",
    col_you_win: "Vous gagnez",

    lvl: "niv",
    color_legend: "Grille adv. — couleur = votre probabilité de victoire",
    chess_axis: "Niveau d'Échecs  (ELO)",
    box_axis: "Niveau de Boxe",
    chess_names: [
      { short: 'Grand Débutant', sub: '800 ELO' },
      { short: 'Débutant', sub: '1028 ELO' },
      { short: 'Joueur Occas.', sub: '1257 ELO' },
      { short: 'Joueur de Club', sub: '1485 ELO' },
      { short: 'Bon Club', sub: '1714 ELO' },
      { short: 'Expert', sub: '1942 ELO' },
      { short: 'Maître', sub: '2171 ELO' },
      { short: 'Élite / GMI', sub: '2400 ELO' }
    ],
    boxing_names: [
      { short: 'Novice', sub: 'Jamais sparré' },
      { short: 'Débutant', sub: 'Salle < 1 an' },
      { short: 'Amateur', sub: '1–3 ans d\'entraînement' },
      { short: 'Régional', sub: 'Premiers combats am.' },
      { short: 'Semi-Pro', sub: '10+ combats' },
      { short: 'Professionnel', sub: '40+ combats ou pro' }
    ]
  }
};

export let currentLang = 'en';

export function getChessNamed() { return i18n[currentLang].chess_names.map((n, i) => ({ value: i, ...n })); }
export function getBoxingNamed() { return i18n[currentLang].boxing_names.map((n, i) => ({ value: i, ...n })); }

export function setLangState(lang) {
  currentLang = lang;
}
