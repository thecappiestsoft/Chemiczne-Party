# Chemiczne Party – wersja deweloperska

Planszowa gra edukacyjna z chemii (PL/EN) dla 2–4 graczy przy jednym ekranie, z mini-grami.
Ta wersja ma ten sam kod co wersja jednoplikowa, ale podzielony na osobne pliki, żeby łatwiej było go edytować.

## Uruchomienie

Nie trzeba niczego budować ani instalować. Wystarczy otworzyć `index.html` w przeglądarce.

Można też uruchomić lokalny serwer (wygodniejsze przy pracy z DevTools):

```bash
python3 -m http.server 8000
# potem: http://localhost:8000
```

Jedyna zależność zewnętrzna to czcionki z Google Fonts (Bungee, Lexend, JetBrains Mono). Bez internetu gra działa na czcionkach systemowych.

## Struktura

```
chemiczne-party/
├── index.html                  # szkielet strony + kolejność ładowania plików
├── css/
│   ├── 01-variables.css        # kolory, czcionki, motyw jasny/ciemny
│   ├── 02-base.css             # reset i style bazowe, przyciski, karty
│   ├── 03-topbar.css           # górny pasek: logo, PL/EN, motyw, dźwięk
│   ├── 04-setup.css            # ekran ustawień (gracze, poziom, kategorie)
│   ├── 05-board.css            # plansza, pola, pionki, panel graczy, kostka
│   ├── 06-modal.css            # okna pytań, wyjaśnienia
│   └── 07-minigames.css        # wygląd mini-gier, ranking, finał, toast
└── js/
    ├── data/
    │   ├── pl/quiz.js              # QUIZ – pytania wielokrotnego wyboru (baza)
    │   ├── pl/truefalse.js         # TF – stwierdzenia prawda/fałsz (baza)
    │   ├── pl/quiz-extra.js        # QUIZ.push(...) – rozszerzona baza
    │   ├── pl/truefalse-extra.js   # TF.push(...) – rozszerzona baza
    │   ├── en/quiz-en.js           # EN_Q – tłumaczenia pytań QUIZ
    │   ├── en/truefalse-en.js      # EN_T – tłumaczenia TF + łączenie z PL
    │   └── minigames-data.js       # SORTS, MEMO, EQS, EVENTS, MINIGAMES
    ├── i18n.js                 # język, poziomy (LVLS), kategorie (CATS), teksty UI (STR), t()
    ├── config.js               # stałe gry: kolory graczy, pola planszy, nagrody, koszt kolby
    ├── core/
    │   ├── utils.js            # $, shuffle, formatowanie wzorów chemicznych, bilansowanie
    │   ├── audio.js            # efekty dźwiękowe (Web Audio)
    │   ├── setup.js            # ekran ustawień, pule pytań
    │   ├── game.js             # start gry, plansza, pionki, panel boczny, log
    │   ├── modal.js            # toast i okna modalne
    │   ├── turn.js             # tura: rzut kostką, ruch, pola, zdarzenia, pytania
    │   └── final.js            # ekran końcowy, podium, powtórka błędów
    ├── minigames/
    │   ├── _runner.js          # losowanie mini-gry, wyniki, nagrody
    │   ├── buzz.js             # Wyścig do przycisku
    │   ├── bomb.js             # Reakcja łańcuchowa
    │   ├── memo.js             # Pary chemiczne (memory)
    │   ├── sort.js             # Sortownia
    │   └── eq.js               # Bilansownia
    └── app.js                  # przełączanie języka i motywu, skróty klawiszowe, start aplikacji
```

## Ważne zasady

**Kolejność skryptów ma znaczenie.** Pliki to zwykłe `<script>` (nie moduły ES), dzięki czemu gra działa po otwarciu z dysku (`file://`). Wszystkie stałe są globalne i współdzielone między plikami. Nowy plik dodaj w `index.html` w odpowiednim miejscu – dane przed logiką, `app.js` zawsze na końcu.

**Tłumaczenia EN są dopasowywane po indeksie.** Na końcu `truefalse-en.js`:

```js
QUIZ.forEach((q,i)=>{q.en=EN_Q[i]||null});
TF.forEach((q,i)=>{q.en=EN_T[i]||null});
```

Element `EN_Q[i]` to tłumaczenie `QUIZ[i]` (po wszystkich `push`). Dodając, usuwając lub przestawiając pytanie PL, zrób to samo w tym samym miejscu w pliku EN. Brak tłumaczenia (`null`) oznacza, że w wersji EN pokaże się tekst polski.

## Jak dodać pytanie

Quiz (`js/data/pl/quiz*.js`):

```js
['sp','kwasy','Treść pytania?',['poprawna','błędna 1','błędna 2','błędna 3'],'Wyjaśnienie.'],
```

- poziom: `sp` (podstawówka), `lo` (liceum), `tech` (technikum)
- kategoria: `uklad`, `atom`, `reakcje`, `kwasy`, `organika`, `roztwory`, `lab`, `przemysl` (lista w `i18n.js` → `CATS`)
- **pierwsza odpowiedź jest zawsze poprawna** – gra sama tasuje kolejność

Prawda/fałsz (`js/data/pl/truefalse*.js`):

```js
['lo','atom','Stwierdzenie.',1,'Wyjaśnienie.'],   // 1 = prawda, 0 = fałsz
```

Tłumaczenie EN (`js/data/en/…`):

```js
{"text":"Question?","answers":["correct","wrong 1","wrong 2","wrong 3"],"expl":"Explanation."},  // quiz
{"text":"Statement.","expl":"Explanation."},                                                  // prawda/fałsz
```

## Wzory chemiczne w tekstach

W nawiasach klamrowych `{...}` tekst jest formatowany jako wzór (funkcja `fmt()` w `core/utils.js`):

| Zapis | Wynik |
|---|---|
| `{H2SO4}` | H₂SO₄ |
| `{Na^+}`, `{SO4^2-}` | Na⁺, SO₄²⁻ |
| `{A -> B}` | A → B |
| `{N2 + 3H2 <=> 2NH3}` | N₂ + 3H₂ ⇌ 2NH₃ |

## Gdzie co zmienić

| Chcę zmienić… | Plik |
|---|---|
| kolory, czcionki, motyw ciemny | `css/01-variables.css` |
| teksty interfejsu (PL/EN) | `js/i18n.js` → `STR` |
| układ pól planszy | `js/config.js` → `TILE_TYPES` |
| nagrody za mini-gry, koszt Złotej Kolby | `js/config.js` → `REWARDS`, `FLASK_COST` |
| zdarzenia na polach „!” | `js/data/minigames-data.js` → `EVENTS` + obsługa w `js/core/turn.js` (`eventTile`) |
| zestawy do Sortowni / Memory / Bilansowni | `js/data/minigames-data.js` → `SORTS`, `MEMO`, `EQS` |
| klawisze graczy w Wyścigu do przycisku | `js/config.js` → `BUZZ_KEYS` |

## Nowa mini-gra

1. Dodaj opis w `MINIGAMES` (`js/data/minigames-data.js`) – nazwa, symbol, opis PL/EN.
2. Utwórz plik `js/minigames/twoja-gra.js` z funkcją zwracającą `Promise` z wynikami (wzoruj się na `memo.js`).
3. Podłącz ją w `runMinigame()` w `js/minigames/_runner.js`.
4. Dodaj `<script src="js/minigames/twoja-gra.js"></script>` w `index.html` przed `app.js`.

## Ustawienia w localStorage

- `chem-party-lang` – wybrany język (`pl` / `en`)
- `chem-party-theme` – wybrany motyw (`light` / `dark`)

---
© 2026 CappySoft.pl
