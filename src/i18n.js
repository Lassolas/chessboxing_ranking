export const i18n = {
  en: {
    tagline: "Where do you stand in the ring?",
    your_profile: "Your Profile",
    chess: "Chess",
    boxing: "Boxing",
    your_corner: "Your Corner",
    explore_matchups: "Explore Matchups",
    tap_hint: "tap a cell to see that fight",
    probable_fighters: "Highlight Probable Fighters",
    off: "Off",
    even: "50 % (even)",
    fight_card: "Fight Card",
    opponent: "Opponent",
    prob_win: "Probability to win by",
    expected_length: "Expected Length",
    stoppage_odds: "Stoppage odds",
    you_win: "you win",
    opp_wins: "opp wins",
    you: "You",
    opp: "Opp",
    win: "Win",
    dominate: "Dominate",
    even_short: "Even",
    tough: "Tough",
    long_shot: "Long shot",
    early_stoppage: "(High chance of early stoppage)",
    distance: "(Likely to go the distance)",
    decision: "Decision",
    rnds: "Rounds",
    rnds_short: "rnds",
    lvl: "lvl",
    top: "Top",
    color_legend: "Opponent grid — color = your win probability",
    chess_axis: "Chess level  (ELO)",
    box_axis: "Boxing level",
    chess_names: [
      { short: 'Total Beginner', sub: '800 ELO' },
      { short: 'Beginner',       sub: '1028 ELO' },
      { short: 'Casual Player',  sub: '1257 ELO' },
      { short: 'Club Player',    sub: '1485 ELO' },
      { short: 'Strong Club',    sub: '1714 ELO' },
      { short: 'Expert',         sub: '1942 ELO' },
      { short: 'Master',         sub: '2171 ELO' },
      { short: 'Elite / GM',     sub: '2400 ELO' }
    ],
    boxing_names: [
      { short: 'Novice',        sub: 'Never sparred' },
      { short: 'Beginner',      sub: 'Gym < 1 year' },
      { short: 'Amateur',       sub: '1–3 yrs training' },
      { short: 'Regional',      sub: 'First amateur bouts' },
      { short: 'Semi-Pro',      sub: '10+ fights' },
      { short: 'Professional',  sub: '40+ fights or pro' }
    ]
  },
  fr: {
    tagline: "Où vous situez-vous sur le ring ?",
    your_profile: "Votre Profil",
    chess: "Échecs",
    boxing: "Boxe",
    your_corner: "Votre Coin",
    explore_matchups: "Explorer les Matchups",
    tap_hint: "appuyez sur une case pour ce combat",
    probable_fighters: "Afficher les combattants probables",
    off: "Désactivé",
    even: "50 % (égal)",
    fight_card: "Carte de Combat",
    opponent: "Adversaire",
    prob_win: "Probabilité de victoire par",
    expected_length: "Durée Estimée",
    stoppage_odds: "Probabilités d'arrêt",
    you_win: "vous gagnez",
    opp_wins: "adv gagne",
    you: "Vous",
    opp: "Adv",
    win: "Gagnant",
    dominate: "Domine",
    even_short: "Égal",
    tough: "Difficile",
    long_shot: "Peu probable",
    early_stoppage: "(Forte chance d'arrêt précoce)",
    distance: "(Susceptible d'aller à la décision)",
    decision: "Décision",
    rnds: "Rounds",
    rnds_short: "rnds",
    lvl: "niv",
    top: "Top",
    color_legend: "Grille adv. — couleur = votre probabilité de victoire",
    chess_axis: "Niveau d'Échecs  (ELO)",
    box_axis: "Niveau de Boxe",
    chess_names: [
      { short: 'Grand Débutant', sub: '800 ELO' },
      { short: 'Débutant',       sub: '1028 ELO' },
      { short: 'Joueur Occas.',  sub: '1257 ELO' },
      { short: 'Joueur de Club', sub: '1485 ELO' },
      { short: 'Bon Club',       sub: '1714 ELO' },
      { short: 'Expert',         sub: '1942 ELO' },
      { short: 'Maître',         sub: '2171 ELO' },
      { short: 'Élite / GMI',    sub: '2400 ELO' }
    ],
    boxing_names: [
      { short: 'Novice',        sub: 'Jamais sparré' },
      { short: 'Débutant',      sub: 'Salle < 1 an' },
      { short: 'Amateur',       sub: '1–3 ans d\'entraînement' },
      { short: 'Régional',      sub: 'Premiers combats am.' },
      { short: 'Semi-Pro',      sub: '10+ combats' },
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
